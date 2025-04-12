mod config;
mod db;
mod error;

use api::run_app;

#[tokio::main]
async fn main() {
    match run_app().await {
        Ok(app) => {
            let listener = tokio::net::TcpListener::bind("[::]:8080").await.unwrap();
            axum::serve(listener, app.into_make_service())
                .await
                .unwrap();
        }
        Err(e) => {
            eprintln!("Application error: {}", e);
            std::process::exit(1);
        }
    }
}
