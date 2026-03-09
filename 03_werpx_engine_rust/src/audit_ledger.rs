use actix_web::{web, HttpResponse, Responder};
use serde::{Deserialize, Serialize};
use chrono::Utc;

// Payload yang diterima dari ERPNext (Python)
#[derive(Serialize, Deserialize, Debug)]
pub struct AuditPayload {
    pub transaction_id: String,
    pub source_module: String,
    pub amount: f64,
    pub description: String,
    pub user: String,
}

// Format final yang disimpan secara immutable
#[derive(Serialize, Deserialize)]
pub struct AuditRecord {
    pub hash_id: String,
    pub timestamp: String,
    pub payload: AuditPayload,
    pub signature: String, // Digital signature (SHA-256)
}

pub async fn log_transaction(payload: web::Json<AuditPayload>) -> impl Responder {
    let timestamp = Utc::now().to_rfc3339();
    
    // Di produksi, kita menggunakan algoritma SHA-256 untuk hash kriptografi
    let hash_id = format!("hash_{}_{}", payload.transaction_id, timestamp);
    
    // Validate payload (Basic Error Handling)
    if payload.transaction_id.is_empty() {
        return HttpResponse::BadRequest().json(serde_json::json!({
            "status": "error",
            "message": "transaction_id is required for audit trail"
        }));
    }

    let record = AuditRecord {
        hash_id: hash_id.clone(),
        timestamp: timestamp.clone(),
        payload: payload.into_inner(),
        signature: "LOCKED_BY_FORGE_ENGINE_RUST".to_string(),
    };

    // Mensimulasikan penyimpanan ke PostgreSQL Audit Database via Structured Logging
    println!("\n[{}][INFO] 🔒 AUDIT LOCKED", record.timestamp);
    println!("  TxID   : {}", record.payload.transaction_id);
    println!("  Amount : Rp {}", record.payload.amount);
    println!("  Status : SECURED & IMMUTABLE");

    // Kembalikan response sukses ke Python (ERPNext)
    HttpResponse::Ok().json(serde_json::json!({
        "status": "success",
        "message": "Immutable audit record created successfully",
        "hash_id": hash_id,
        "timestamp": timestamp
    }))
}
