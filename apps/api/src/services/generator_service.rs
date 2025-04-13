use std::io::Write;

use jsonwebtoken::{EncodingKey, Header, encode};
use rand::{Rng, SeedableRng};
use rand_chacha::ChaCha8Rng;
use serde::{Deserialize, Serialize};
use zip::{ZipWriter, write::SimpleFileOptions};

use crate::error::AppError;

const CHALLENGE_README: &str = include_str!("../assets/README.md");
const CHARS: &[u8] = b"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub payload: i64,
    pub exp: i64,
}

#[derive(Debug)]
struct SeedValues {
    solution: i32,
    num_directories: i32,
    num_dotfiles: i32,
    num_files: i32,
    num_lottie_files: i32,
}

pub struct GeneratorService;

impl Default for GeneratorService {
    fn default() -> Self {
        Self::new()
    }
}

impl GeneratorService {
    pub fn new() -> Self {
        GeneratorService
    }

    fn get_seed_values(&self, seed: i64) -> SeedValues {
        let mut rng = ChaCha8Rng::seed_from_u64(seed as u64);

        SeedValues {
            solution: rng.random_range(0..10_000_000),
            num_directories: rng.random_range(60..90),
            num_dotfiles: rng.random_range(10..20),
            num_files: rng.random_range(400..450),
            num_lottie_files: rng.random_range(30..60),
        }
    }

    pub fn generate_jwt_key(&self, seed_value: i64) -> i32 {
        let values = self.get_seed_values(seed_value);
        values.num_directories + values.num_dotfiles + values.num_files + values.num_lottie_files
    }

    pub fn generate_solution_value(&self, seed_value: i64) -> i32 {
        self.get_seed_values(seed_value).solution
    }

    pub fn generate_jwt(&self, seed_value: i64) -> Result<String, AppError> {
        let expiration = seed_value / 1000 + 300; // 5 minutes from seed_value
        let claims = Claims {
            payload: seed_value,
            exp: expiration,
        };

        let key = self.generate_jwt_key(seed_value).to_string();

        encode(
            &Header::default(),
            &claims,
            &EncodingKey::from_secret(key.as_bytes()),
        )
        .map_err(AppError::JwtError)
    }

    fn seeded_random_id(&self, rng: &mut ChaCha8Rng, length: usize) -> String {
        (0..length)
            .map(|_| {
                let idx = rng.random_range(0..CHARS.len());
                CHARS[idx] as char
            })
            .collect()
    }

    fn seeded_random_element<T: Clone>(&self, rng: &mut ChaCha8Rng, array: &[T]) -> T {
        array[rng.random_range(0..array.len())].clone()
    }

    pub fn generate_challenge_file(&self, seed_value: i64) -> Result<Vec<u8>, AppError> {
        let mut rng = ChaCha8Rng::seed_from_u64(seed_value as u64);
        let seed = self.get_seed_values(seed_value);

        let mut buffer = Vec::new();
        let mut zip = ZipWriter::new(std::io::Cursor::new(&mut buffer));
        let options =
            SimpleFileOptions::default().compression_method(zip::CompressionMethod::Stored);

        zip.start_file("README.md", options)?;
        zip.write_all(CHALLENGE_README.as_bytes())?;

        let mut directories = vec!["challenge/".to_string()];
        for _ in 0..seed.num_directories {
            let parent = self.seeded_random_element(&mut rng, &directories);
            let dir_name_length = rng.random_range(3..8);
            let dir_name = format!(
                "{}/{}",
                parent,
                self.seeded_random_id(&mut rng, dir_name_length)
            );
            directories.push(dir_name);
        }

        let mut filenames = Vec::new();

        for i in 0..seed.num_files {
            let file_name_length = rng.random_range(3..7);
            let ext_length = rng.random_range(2..4);
            let mut filename = self.seeded_random_id(&mut rng, file_name_length);
            filename.push('.');
            filename.push_str(&self.seeded_random_id(&mut rng, ext_length));

            if i < seed.num_dotfiles {
                filename = format!(".{}", filename);
            }
            filenames.push(filename);
        }

        for (i, filename) in filenames.iter().enumerate() {
            let parent = self.seeded_random_element(&mut rng, &directories);
            let path = format!("{}{}", parent, filename);

            zip.start_file(&path, options)?;

            let mut contents = String::new();

            match i.cmp(&(seed.num_lottie_files as usize)) {
                std::cmp::Ordering::Less => {
                    let num_lines = rng.random_range(30..50);
                    for _ in 0..num_lines {
                        contents.push_str(&self.seeded_random_id(&mut rng, 80));
                        contents.push('\n');
                    }
                    contents.push_str("\nlottie\n");
                }
                std::cmp::Ordering::Equal => {
                    contents = self.generate_jwt(seed_value)?;
                }
                std::cmp::Ordering::Greater => {
                    let num_lines = rng.random_range(30..50);
                    for _ in 0..num_lines {
                        contents.push_str(&self.seeded_random_id(&mut rng, 80));
                        contents.push('\n');
                    }
                }
            }

            zip.write_all(contents.as_bytes())?;
        }
        zip.finish()?;
        Ok(buffer)
    }
}
