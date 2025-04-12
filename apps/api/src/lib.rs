use crate::error::AppError;
use axum::{Router, routing::get};

pub mod config;
pub mod db;
pub mod error;

pub async fn run_app() -> Result<Router, AppError> {
    let connection = db::connect().await?;

    let app = Router::new().route("/", get(|| async { "Hello from fly.io!" }));

    Ok(app)
}
