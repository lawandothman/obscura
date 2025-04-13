use std::sync::Arc;

use axum::{
    Form, Json,
    extract::{Path, State},
    http::StatusCode,
};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::{error::AppError, services::submission_service::SubmissionService};

#[derive(Deserialize)]
pub struct SubmissionForm {
    name: String,
}

#[derive(Serialize)]
pub struct SubmissionResponse {
    id: Uuid,
    name: String,
    start_time: i64,
    end_time: Option<i64>,
}

pub async fn create_submission(
    State(submission_service): State<Arc<SubmissionService>>,
    Form(form): Form<SubmissionForm>,
) -> Result<(StatusCode, Json<SubmissionResponse>), AppError> {
    println!("Creating submission for {}", form.name);

    let submission = submission_service.create(form.name).await?;

    Ok((
        StatusCode::CREATED,
        Json(SubmissionResponse {
            id: submission.id,
            name: submission.name,
            start_time: submission.start_time,
            end_time: None,
        }),
    ))
}

pub async fn get_submission(
    State(submission_service): State<Arc<SubmissionService>>,
    Path(id): Path<Uuid>,
) -> Result<Json<SubmissionResponse>, AppError> {
    println!("Getting submission with ID {}", id);

    let submission = submission_service.get(id).await?;

    Ok(Json(SubmissionResponse {
        id: submission.id,
        name: submission.name,
        start_time: submission.start_time,
        end_time: submission.end_time,
    }))
}
