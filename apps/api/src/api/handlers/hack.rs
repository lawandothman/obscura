use std::sync::Arc;

use axum::{extract::State, http::HeaderMap};
use jsonwebtoken::{DecodingKey, Validation, decode};
use text_to_ascii_art::{Alignment, align, to_art};

use crate::{
    error::AppError,
    services::{generator_service::Claims, services_provider::ServicesProvider},
};

fn response_ascii(num: i32) -> String {
    let ascii_art = match to_art(num.to_string(), "standard", 0, 0, 0) {
        Ok(art) => art,
        Err(_) => return format!("Error generating ASCII art for {}", num),
    };

    align(&ascii_art, Alignment::Center, 60)
}

pub async fn hack(
    headers: HeaderMap,
    State(provider): State<Arc<ServicesProvider>>,
) -> Result<String, AppError> {
    let auth_header = headers
        .get("authorization")
        .ok_or_else(|| AppError::BadRequest("No Authorization header provided".to_string()))?
        .to_str()
        .map_err(|_| AppError::BadRequest("Invalid Authorization header".to_string()))?;

    if !auth_header.starts_with("Bearer ") {
        return Err(AppError::BadRequest("Wrong format on header".to_string()));
    }

    let token = auth_header.trim_start_matches("Bearer ").trim();

    let mut validation = Validation::default();
    validation.insecure_disable_signature_validation();

    let decoded_header = decode::<Claims>(token, &DecodingKey::from_secret(&[]), &validation)
        .map_err(|e| {
            println!("Error decoding token: {:?}", e);
            AppError::BadRequest("Missing or wrong payload".to_string())
        })?;

    let jwt_key = provider
        .generator_service
        .generate_jwt_key(decoded_header.claims.payload)
        .to_string();

    decode::<Claims>(
        token,
        &DecodingKey::from_secret(jwt_key.as_bytes()),
        &validation,
    )
    .map_err(|_| AppError::BadRequest(format!("{} attempts left", rand::random::<u8>())))?;

    let solution = provider
        .generator_service
        .generate_solution_value(decoded_header.claims.payload);

    Ok(response_ascii(solution))
}
