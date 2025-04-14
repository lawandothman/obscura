pub mod api;
pub mod config;
pub mod db;
pub mod error;
pub mod models;
pub mod services;

use crate::error::AppError;
use api::routes::create_router;
use axum::Router;
use migration::{Migrator, MigratorTrait};
use services::services_provider;

pub async fn run_app() -> Result<Router, AppError> {
    let connection = db::connect().await?;
    println!("✅ Database connection established");

    let before = Migrator::get_applied_migrations(&connection).await?;

    Migrator::up(&connection, None).await?;

    let after = Migrator::get_applied_migrations(&connection).await?;

    println!(
        "✅ Database migrations applied: {} new, {} total",
        after.len() - before.len(),
        after.len()
    );

    let services_provider = services_provider::ServicesProvider::new(connection);
    let app = create_router(services_provider);

    Ok(app)
}
