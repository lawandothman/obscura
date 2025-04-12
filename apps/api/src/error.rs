use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
};
use thiserror::Error;

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

    #[error("Bad Request: {0}")]
    BadRequest(String),

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
        };

        (status, error_message).into_response()
    }
}
