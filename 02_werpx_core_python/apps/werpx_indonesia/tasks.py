import frappe
import requests
import json

def send_to_forge(transaction_id, amount, remark, user):
    """
    Background job queue (Redis Queue) to send Audit Log to Rust Forge Engine.
    This ensures High-Availability and no blocking on the main ERPNext thread.
    """
    try:
        forge_payload = {
            "transaction_id": transaction_id,
            "source_module": "WERPX_SIMAPROX",
            "amount": amount,
            "description": f"SIMAPROX Expense: {remark}",
            "user": user
        }
        
        # Rust Engine runs on werpx_engine_rust:8080 inside docker network
        rust_url = frappe.conf.get("forge_engine_url", "http://werpx_engine_rust:8080/api/audit/log")
        
        rust_response = requests.post(
            rust_url, 
            json=forge_payload,
            timeout=10 # Higher timeout for background job
        )
        
        if rust_response.status_code == 200:
            frappe.logger().info(f"[FORGE SYNC SUCCESS] {transaction_id} -> {rust_response.text}")
        else:
            frappe.logger().error(f"[FORGE SYNC FAILED] {transaction_id} -> HTTP {rust_response.status_code}: {rust_response.text}")
            
    except Exception as forge_err:
        frappe.log_error(f"Failed to reach Forge Engine (Rust) for {transaction_id}:\n{str(forge_err)}", "Forge Sync Error")
