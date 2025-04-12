use crate::error::AppError;
use dotenv::dotenv;

pub struct Config {
    pub database_url: String,
}

impl Config {
    pub fn from_env() -> Result<Self, AppError> {
        dotenv().ok();

        let database_url = std::env::var("DATABASE_URL")
            .map_err(|_| AppError::ConfigError("DATABASE_URL not set".to_string()))?;

        Ok(Config { database_url })
    }
}
