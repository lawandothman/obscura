use std::sync::Arc;

use axum::{
    Router,
    routing::{get, post},
};

use crate::services::submission_service::SubmissionService;

use super::handlers::{download::download_challenge, submissions::create_submission};

pub fn create_router(submission_service: Arc<SubmissionService>) -> Router {
    Router::new()
        .route("/", get(|| async { "👾" }))
        .route("/submissions", post(create_submission))
        .route("/download/{id}", get(download_challenge))
        .with_state(submission_service)
}
