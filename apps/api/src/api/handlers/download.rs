use std::sync::Arc;

use axum::{
    body::Body,
    extract::{Path, State},
    http::{Response, StatusCode, header},
};
use uuid::Uuid;

use crate::{
    error::AppError,
    services::{generator_service::GeneratorService, submission_service::SubmissionService},
};

pub async fn download_challenge(
    Path(id): Path<Uuid>,
    submission_service: State<Arc<SubmissionService>>,
) -> Result<Response<Body>, AppError> {
    let submission = submission_service.get(id).await?;

    println!("Requesting download for {}", submission.name);

    let generator = GeneratorService::new();

    let challenge_file = generator.generate_challenge_file(submission.start_time)?;

    let response = Response::builder()
        .status(StatusCode::OK)
        .header(header::CONTENT_TYPE, "application/zip")
        .header(
            header::CONTENT_DISPOSITION,
            format!("attachment; filename=\"{}.zip\"", submission.name),
        )
        .body(Body::from(challenge_file))
        .map_err(AppError::HttpError)?;

    Ok(response)
}
