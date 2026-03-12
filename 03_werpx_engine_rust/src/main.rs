use actix_web::{web, App, HttpServer, HttpResponse, Responder, middleware::Logger};
use actix_cors::Cors;
use std::sync::Mutex;

mod audit_ledger;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("========================================");
    println!(" WERP X Forge Engine (Rust) Starting... ");
    println!(" Oracle-style Immutable Audit Logger ");
    println!("========================================");
    // Inisialisasi State Blockchain (P2P Ledger Genesis Block)
    let app_state = web::Data::new(audit_ledger::AppState {
        last_block_hash: Mutex::new(String::from("GENESIS_BLOCK_WERPX")),
    });

    // Konfigurasi server HTTP dengan Actix
    HttpServer::new(move || {
        let cors = Cors::permissive(); // In Production, specify exact Origins

        App::new()
            .app_data(app_state.clone())
            .wrap(cors)
            .wrap(Logger::default())
            .route("/health", web::get().to(health_check))
            .route("/api/audit/log", web::post().to(audit_ledger::log_transaction))
    })
    .bind(("0.0.0.0", 8080))?
    .run()
    .await
}

async fn health_check() -> impl Responder {
    HttpResponse::Ok().json(serde_json::json!({
        "status": "online",
        "service": "WERP X Forge Engine",
        "version": "1.0.0"
    }))
}
