import frappe
from frappe import _

@frappe.whitelist()
def sync_project_expense(project_id, amount, account_debit, account_credit, remark):
    """
    Endpoint khusus untuk SIMAPROX mencatat biaya proyek ke WERP X
    """
    try:
        # 1. Validasi Proyek
        if not frappe.db.exists("Project", project_id):
            return {"status": "error", "message": _("Proyek {0} tidak ditemukan").format(project_id)}

        # 2. Buat Journal Entry (Draft)
        je = frappe.get_doc({
            "doctype": "Journal Entry",
            "posting_date": frappe.utils.nowdate(),
            "company": frappe.defaults.get_user_default("company"),
            "user_remark": f"[SIMAPROX-SYNC] {remark}",
            "accounts": [
                {
                    "account": account_debit,
                    "debit_in_account_currency": amount,
                    "project": project_id
                },
                {
                    "account": account_credit,
                    "credit_in_account_currency": amount,
                    "project": project_id
                }
            ]
        })
        je.insert()
        je.submit() # Otomatis Posting ke GL

        # 3. Trigger ke Forge Engine (Rust) untuk Audit via Background Job
        # This guarantees non-blocking, highly stable transaction creation.
        frappe.enqueue(
            'werpx_indonesia.tasks.send_to_forge',
            queue='default',
            transaction_id=je.name,
            amount=amount,
            remark=remark,
            user=frappe.session.user
        )

        return {"status": "success", "message": f"Biaya tercatat di WERP X: {je.name}. Menunggu sinkronisasi Forge di antrean latar belakang."}

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "SIMAPROX Integration Error")
        return {"status": "error", "message": str(e)}

@frappe.whitelist()
def approve_document(doctype, docname, action="Approve"):
    """
    Endpoint untuk mengeksekusi Workflow Action dari Web/Aplikasi Luar.
    action: bisa 'Approve', 'Reject', 'Request Approval', dll sesuai nama Transisi.
    """
    try:
        doc = frappe.get_doc(doctype, docname)
        
        # Mengecek apakah user memiliki akses
        frappe.has_permission(doc=doc, throw=True)
        
        # Memerintahkan modul Workflow ERPNext secara programatik
        from frappe.model.workflow import apply_workflow
        apply_workflow(doc, action)
        
        return {"status": "success", "message": f"{doctype} {docname} berhasil di-{action}"}
        
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Workflow Approval API Error")
        return {"status": "error", "message": str(e)}
