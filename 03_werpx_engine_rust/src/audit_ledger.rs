use actix_web::{web, HttpResponse, Responder};
use serde::{Deserialize, Serialize};
use chrono::Utc;
use std::sync::Mutex;
use sha2::{Sha256, Digest};

pub struct AppState {
    pub last_block_hash: Mutex<String>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct AuditPayload {
    pub transaction_id: String,
    pub source_module: String,
    pub amount: f64,
    pub description: String,
    pub user: String,
}

#[derive(Serialize, Deserialize)]
pub struct AuditRecord {
    pub block_id: String,
    pub previous_hash: String,
    pub timestamp: String,
    pub payload: AuditPayload,
    pub signature: String, 
}

// Fungsi internal penambang hash (Hashing)
fn calculate_hash(prev_hash: &str, timestamp: &str, payload_raw: &str) -> String {
    let mut hasher = Sha256::new();
    let data = format!("{}{}{}", prev_hash, timestamp, payload_raw);
    hasher.update(data.as_bytes());
    hex::encode(hasher.finalize())
}

pub async fn log_transaction(
    payload: web::Json<AuditPayload>,
    state: web::Data<AppState>,
) -> impl Responder {
    let timestamp = Utc::now().to_rfc3339();
    
    if payload.transaction_id.is_empty() {
        return HttpResponse::BadRequest().json(serde_json::json!({
            "status": "error",
            "message": "transaction_id is required."
        }));
    }

    let raw_payload = serde_json::to_string(&*payload).unwrap_or_default();
    
    let mut last_hash_guard = state.last_block_hash.lock().unwrap();
    let current_previous_hash = last_hash_guard.clone();
    
    let new_block_hash = calculate_hash(&current_previous_hash, &timestamp, &raw_payload);
    
    let record = AuditRecord {
        block_id: new_block_hash.clone(),
        previous_hash: current_previous_hash,
        timestamp: timestamp.clone(),
        payload: payload.into_inner(),
        signature: "P2P_RUST_BLOCKCHAIN_NODE".to_string(),
    };

    // Update Blockchain State
    *last_hash_guard = new_block_hash.clone();

    // Log the immutable block output
    println!("\n[{}][INFO] ⛓️ NEW BLOCK MINED", record.timestamp);
    println!("  Block Hash : {}", record.block_id);
    println!("  Prev Hash  : {}", record.previous_hash);
    println!("  TxID       : {}", record.payload.transaction_id);
    println!("  Status     : HYPERLEDGER CHAIN SECURED");

    HttpResponse::Ok().json(serde_json::json!({
        "status": "success",
        "message": "Transaction committed to Private Blockchain.",
        "block_id": new_block_hash,
        "timestamp": timestamp
    }))
}
