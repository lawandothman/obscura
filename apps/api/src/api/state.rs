use std::sync::Arc;

use crate::services::{generator_service::GeneratorService, submission_service::SubmissionService};

#[derive(Clone)]
pub struct AppState {
    pub submission_service: Arc<SubmissionService>,
    pub generator_service: Arc<GeneratorService>,
}
