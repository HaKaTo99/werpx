/**
 * ERPNext API Client untuk SIMAPROX
 * Mengurus integrasi dari SIMAPROX (React Native/Web) ke backend ERPNext WERP X.
 */

const ERPNEXT_BASE_URL = import.meta.env.VITE_ERPNEXT_URL || "https://api.werpx.id";
// Perhatian: Dalam produksi, API Keys sebaiknya dikelola oleh Supabase Edge Functions atau Backend Node.js
// Untuk keperluan demonstrasi/prototype SIMAPROX langsung, kita gunakan token di frontend.
const ERPNEXT_API_KEY = import.meta.env.VITE_ERPNEXT_API_KEY || "";
const ERPNEXT_API_SECRET = import.meta.env.VITE_ERPNEXT_API_SECRET || "";

export interface ApprovalResponse {
    status: 'success' | 'error';
    message: string;
}

/**
 * Approve, Reject, atau alihkan Dokumen ERPNext via Workflow.
 * Endpoint ini terhubung ke `werpx_indonesia.api.approve_document`
 * sesuai panduan di TEMPLATE_WORKFLOW_APPROVAL.md
 * 
 * @param doctype Nama DocType (Misal: "Purchase Order")
 * @param docname ID Dokumen (Misal: "PUR-ORD-2026-0001")
 * @param action Aksi transisi Workflow ("Approve", "Reject", dll)
 */
export const approveDocument = async (doctype: string, docname: string, action: string = "Approve"): Promise<ApprovalResponse> => {
    try {
        const response = await fetch(`${ERPNEXT_BASE_URL}/api/method/werpx_indonesia.api.approve_document`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `token ${ERPNEXT_API_KEY}:${ERPNEXT_API_SECRET}`
            },
            body: JSON.stringify({
                doctype,
                docname,
                action
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data: { message: ApprovalResponse } = await response.json();
        return data.message;

    } catch (error: any) {
        console.error("Failed to approve document:", error.message);
        return {
            status: 'error',
            message: error.message || "Terjadi kesalahan jaringan."
        };
    }
};
