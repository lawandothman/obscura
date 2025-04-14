use std::sync::Arc;

use axum::{
    Router,
    routing::{get, post},
};

use crate::services::services_provider::ServicesProvider;

use super::handlers::{
    download::download_challenge,
    hack::hack,
    submissions::{create_submission, get_leaderboard, get_submission, submit_answer},
};

pub fn create_router(provider: ServicesProvider) -> Router {
    Router::new()
        .route("/", get(|| async { "👾" }))
        .route("/submissions", post(create_submission))
        .route("/submissions/{id}", get(get_submission))
        .route("/submissions/{id}/answer", post(submit_answer))
        .route("/download/{id}", get(download_challenge))
        .route("/hack", post(hack))
        .route("/leaderboard", get(get_leaderboard))
        .with_state(Arc::new(provider))
}
