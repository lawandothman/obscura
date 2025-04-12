use std::sync::Arc;

use crate::error::AppError;
use api::routes::create_router;
use axum::Router;
use migration::{Migrator, MigratorTrait};
use services::submission_service::SubmissionService;

pub mod api;
pub mod config;
pub mod db;
pub mod error;
pub mod models;
pub mod services;

pub async fn run_app() -> Result<Router, AppError> {
    let connection = db::connect().await?;

    Migrator::up(&connection, None).await?;

    let submission_service = Arc::new(SubmissionService::new(connection));
    let app = create_router(submission_service);

    Ok(app)
}
