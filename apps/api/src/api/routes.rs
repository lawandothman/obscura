use std::sync::Arc;

use axum::{
    Router,
    routing::{get, post},
};

use crate::services::{generator_service::GeneratorService, submission_service::SubmissionService};

use super::{
    handlers::{
        download::download_challenge,
        hack::hack,
        submissions::{create_submission, get_submission, submit_answer},
    },
    state::AppState,
};

pub fn create_router(submission_service: Arc<SubmissionService>) -> Router {
    let state = Arc::new(AppState {
        submission_service,
        generator_service: Arc::new(GeneratorService::new()),
    });

    Router::new()
        .route("/", get(|| async { "👾" }))
        .route("/submissions", post(create_submission))
        .route("/submissions/{id}", get(get_submission))
        .route("/submissions/{id}/answer", post(submit_answer))
        .route("/download/{id}", get(download_challenge))
        .route("/hack", post(hack))
        .with_state(state)
}
