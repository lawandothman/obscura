use std::sync::Arc;

use axum::{
    body::Body,
    extract::{Path, State},
    http::{Response, StatusCode, header},
};
use uuid::Uuid;

use crate::{error::AppError, services::services_provider::ServicesProvider};

pub async fn download_challenge(
    Path(id): Path<Uuid>,
    State(provider): State<Arc<ServicesProvider>>,
) -> Result<Response<Body>, AppError> {
    let submission = provider.submission_service.get(id).await?;

    println!("Requesting download for {}", submission.name);

    let challenge_file = provider
        .generator_service
        .generate_challenge_file(submission.start_time)?;

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
