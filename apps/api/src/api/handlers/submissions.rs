use std::{collections::HashMap, sync::Arc};

use crate::models::submission::Model as Submission;

use axum::{
    Form, Json,
    extract::{Path, State},
    http::StatusCode,
};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::{error::AppError, services::services_provider::ServicesProvider};

#[derive(Deserialize)]
pub struct NewSubmissionForm {
    name: String,
}

#[derive(Serialize)]
pub struct SubmissionResponse {
    id: Uuid,
    name: String,
    start_time: i64,
    end_time: Option<i64>,
}

#[derive(Deserialize)]
pub struct SubmissionAnswerForm {
    answer: String,
}

#[derive(Serialize)]
pub struct LeaderboardResponse {
    id: Uuid,
    name: String,
    start_time: i64,
    end_time: i64,
    score: String,
}

pub async fn create_submission(
    State(provider): State<Arc<ServicesProvider>>,
    Form(form): Form<NewSubmissionForm>,
) -> Result<(StatusCode, Json<SubmissionResponse>), AppError> {
    println!("Creating submission for {}", form.name);

    let submission = provider.submission_service.create(form.name).await?;

    println!("Submission created with ID {}", submission.id);

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
    State(provider): State<Arc<ServicesProvider>>,
    Path(id): Path<Uuid>,
) -> Result<Json<SubmissionResponse>, AppError> {
    println!("Getting submission with ID {}", id);

    let submission = provider.submission_service.get(id).await?;

    Ok(Json(SubmissionResponse {
        id: submission.id,
        name: submission.name,
        start_time: submission.start_time,
        end_time: submission.end_time,
    }))
}

pub async fn submit_answer(
    State(provider): State<Arc<ServicesProvider>>,
    Path(id): Path<Uuid>,
    Form(form): Form<SubmissionAnswerForm>,
) -> Result<(StatusCode, Json<SubmissionResponse>), AppError> {
    println!("Submitting answer for submission ID {}", id);

    let submission = provider.submission_service.get(id).await?;

    let submitted_answer = form
        .answer
        .parse::<i32>()
        .map_err(|_| AppError::BadRequest("Answer must be a valid integer".to_string()))?;

    let correct_answer = provider
        .generator_service
        .generate_solution_value(submission.start_time);

    if submitted_answer != correct_answer {
        println!(
            "Incorrect answer submitted: {} != {}",
            submitted_answer, correct_answer
        );
        return Err(AppError::BadRequest("Incorrect answer".to_string()));
    }

    let completed_submission = provider.submission_service.complete(id).await?;

    Ok((
        StatusCode::OK,
        Json(SubmissionResponse {
            id: completed_submission.id,
            name: completed_submission.name,
            start_time: completed_submission.start_time,
            end_time: completed_submission.end_time,
        }),
    ))
}

pub async fn get_leaderboard(
    State(provider): State<Arc<ServicesProvider>>,
) -> Result<Json<Vec<LeaderboardResponse>>, AppError> {
    let submissions = provider.submission_service.get_leaderboard().await?;

    let mut best_by_name: HashMap<String, Submission> = HashMap::new();

    for submission in submissions {
        if let Some(end_time) = submission.end_time {
            let duration = end_time - submission.start_time;

            if let Some(existing) = best_by_name.get(&submission.name) {
                if let Some(existing_end) = existing.end_time {
                    let existing_duration = existing_end - existing.start_time;
                    if duration < existing_duration {
                        best_by_name.insert(submission.name.clone(), submission);
                    }
                }
            } else {
                best_by_name.insert(submission.name.clone(), submission);
            }
        }
    }

    let response = best_by_name
        .into_values()
        .map(|submission| {
            let end_time = submission.end_time.unwrap();
            let duration_ms = end_time - submission.start_time;

            let total_seconds = duration_ms / 1000;
            let hours = total_seconds / 3600;
            let minutes = (total_seconds % 3600) / 60;
            let seconds = total_seconds % 60;
            let ms = duration_ms % 1000;

            let score = if hours > 0 {
                format!("{}:{:02}:{:02}.{:03}", hours, minutes, seconds, ms)
            } else if minutes > 0 {
                format!("{}:{:02}.{:03}", minutes, seconds, ms)
            } else {
                format!("{}.{:03}", seconds, ms)
            };

            LeaderboardResponse {
                id: submission.id,
                name: submission.name,
                start_time: submission.start_time,
                end_time,
                score,
            }
        })
        .collect::<Vec<LeaderboardResponse>>();

    let mut response = response;
    response.sort_by_key(|item| item.end_time - item.start_time);

    Ok(Json(response))
}
