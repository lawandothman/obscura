use std::sync::Arc;

use axum::{Router, routing::get};

use crate::services::submission_service::SubmissionService;

pub fn create_router(submission_service: Arc<SubmissionService>) -> Router {
    Router::new().route("/", get(|| async { "👾" }))
}
