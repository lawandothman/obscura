use std::time::{SystemTime, UNIX_EPOCH};

use sea_orm::ActiveValue::Set;
use sea_orm::sea_query::Expr;
use sea_orm::{
    ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, Order, QueryFilter, QueryOrder,
};
use uuid::Uuid;

use crate::error::AppError;
use crate::models::submission::{
    ActiveModel as ActiveSubmission, Column, Entity as Submissions, Model as Submission,
};

pub struct SubmissionService {
    db: DatabaseConnection,
}

impl SubmissionService {
    pub fn new(db: DatabaseConnection) -> Self {
        SubmissionService { db }
    }

    pub async fn create(&self, name: String) -> Result<Submission, AppError> {
        let active_submission = ActiveSubmission {
            id: Set(Uuid::new_v4()),
            name: Set(name),
            start_time: Set(SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .unwrap()
                .as_millis() as i64),
            end_time: Set(None),
        };

        active_submission
            .insert(&self.db)
            .await
            .map_err(AppError::DatabaseError)
    }

    pub async fn get(&self, id: Uuid) -> Result<Submission, AppError> {
        Submissions::find_by_id(id)
            .one(&self.db)
            .await
            .map_err(AppError::DatabaseError)?
            .ok_or_else(|| AppError::NotFound(format!("Submission with id '{}' not found ", id)))
    }

    pub async fn complete(&self, id: Uuid) -> Result<Submission, AppError> {
        let submission = self.get(id).await?;

        if submission.end_time.is_some() {
            return Ok(submission);
        }

        let mut active_submission: ActiveSubmission = submission.into();

        active_submission.end_time = Set(Some(
            SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .unwrap()
                .as_millis() as i64,
        ));

        active_submission
            .update(&self.db)
            .await
            .map_err(AppError::DatabaseError)
    }

    pub async fn get_leaderboard(&self) -> Result<Vec<Submission>, AppError> {
        Submissions::find()
            .filter(Column::EndTime.is_not_null())
            .order_by(
                Expr::col(Column::EndTime).sub(Expr::col(Column::StartTime)),
                Order::Asc,
            )
            .all(&self.db)
            .await
            .map_err(AppError::DatabaseError)
    }
}
