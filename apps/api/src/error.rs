use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
};
use thiserror::Error;
use zip::result::ZipError;

#[derive(Error, Debug)]
pub enum AppError {
    #[error("Database Error: {0}")]
    DatabaseError(#[from] sea_orm::DbErr),

    #[error("Confiugration Error: {0}")]
    ConfigError(String),

    #[error("Not Found: {0}")]
    NotFound(String),

    #[error("Server Error: {0}")]
    ServerError(#[from] std::io::Error),

    #[error("HTTP Error: {0}")]
    HttpError(#[from] axum::http::Error),

    #[error("Bad Request: {0}")]
    BadRequest(String),

    #[error("JWT Error: {0}")]
    JwtError(#[from] jsonwebtoken::errors::Error),

    #[error("Zip Error: {0}")]
    ZipError(#[from] ZipError),

    #[error("Lock Error")]
    LockError,
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, error_message) = match self {
            AppError::DatabaseError(_) => (StatusCode::INTERNAL_SERVER_ERROR, "Database Error"),
            AppError::ConfigError(_) => (StatusCode::INTERNAL_SERVER_ERROR, "Configuration Error"),
            AppError::NotFound(_) => (StatusCode::NOT_FOUND, "Not Found"),
            AppError::ServerError(_) => (StatusCode::INTERNAL_SERVER_ERROR, "Server Error"),
            AppError::LockError => (StatusCode::INTERNAL_SERVER_ERROR, "Lock Error"),
            AppError::BadRequest(_) => (StatusCode::BAD_REQUEST, "Bad Request"),
            AppError::JwtError(_) => (StatusCode::INTERNAL_SERVER_ERROR, "JWT Error"),
            AppError::ZipError(_) => (StatusCode::INTERNAL_SERVER_ERROR, "Zip Error"),
            AppError::HttpError(_) => (StatusCode::INTERNAL_SERVER_ERROR, "HTTP Error"),
        };

        (status, error_message).into_response()
    }
}
