pub mod generator_service;
pub mod submission_service;

pub mod services_provider {
    use std::sync::Arc;

    use sea_orm::DatabaseConnection;

    use super::{generator_service::GeneratorService, submission_service::SubmissionService};

    #[derive(Clone)]
    pub struct ServicesProvider {
        pub submission_service: Arc<SubmissionService>,
        pub generator_service: Arc<GeneratorService>,
    }

    impl ServicesProvider {
        pub fn new(connection: DatabaseConnection) -> Self {
            Self {
                submission_service: Arc::new(SubmissionService::new(connection)),
                generator_service: Arc::new(GeneratorService::new()),
            }
        }
    }
}
