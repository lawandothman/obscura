use api::run_app;

#[tokio::main]
async fn main() {
    match run_app().await {
        Ok(app) => {
            let listener = tokio::net::TcpListener::bind("[::]:8080").await.unwrap();
            println!("🚀 Listening on [::]:8080");
            axum::serve(listener, app).await.unwrap();

            println!("🚀 Server running [::]:8080");
        }
        Err(e) => {
            eprintln!("Application error: {}", e);
            std::process::exit(1);
        }
    }
}
