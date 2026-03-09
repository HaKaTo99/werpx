# Template: Workflow Approval WERP X

Gunakan template ini sebagai panduan untuk merancang alur persetujuan (Workflow) pada dokumen di ERPNext (WERP X Core).

## 1. Identifikasi Dokumen (DocType)
- **Nama Dokumen:** (Misal: Purchase Order, Expense Claim)
- **Kondisi Aktif (Active):** Yes / No

## 2. Status Dokumen (Workflow States)
Tentukan status-status yang dilalui dokumen dari awal sampai akhir. Pilihan yang baik biasanya melibatkan "Draft", "Pending", "Approved", dan "Rejected".

| State Name | Doc Status | Update Field | Is Optional |
|---|---|---|---|
| Draft | 0 (Saved) | - | No |
| Pending Approval | 0 (Saved) | - | No |
| Approved | 1 (Submitted) | approved_by | No |
| Rejected | 2 (Cancelled) | rejected_by | No |

## 3. Alur Transisi (Workflow Transition Rules)
Tentukan siapa yang berhak mengubah status, dan dari status apa ke status apa. Anda bisa membuat Custom Role di ERPNext.

| State | Action | Next State | Allowed Role | Condition |
|---|---|---|---|---|
| Draft | Request Approval | Pending Approval | Employee / Project Manager | `doc.grand_total > 0` |
| Pending Approval | Approve | Approved | General Manager / CEO | - |
| Pending Approval | Reject | Rejected | General Manager / CEO | - |
| Rejected | Revise | Draft | Employee / Project Manager | - |

## 4. Instruksi Implementasi di ERPNext
1. Cari di menu (Awesome Bar): **Workflow List** -> Klik *Add Workflow*.
2. Masukkan **DocType** yang dituju.
3. Centang **Is Active**.
4. Isi tabel **States** sesuai panduan pada poin 2 di atas.
5. Isi tabel **Transitions** sesuai panduan pada poin 3 di atas.
6. Simpan (Save). Workflow akan langsung aktif digunakan tanpa perlu me-restart server.

## 5. Script API Integrasi (Auto-Approve via React/SIMAPROX)
Jika persetujuan ingin dilakukan dari sistem eksternal (misalnya tombol "Setujui" di web React SIMAPROX CEO), gunakan *endpoint* bawaan ERPNext ini atau buat _custom whitelist method_ seperti ini di `api.py`:

```python
import frappe

@frappe.whitelist()
def approve_document(doctype, docname, action="Approve"):
    """
    Endpoint untuk mengeksekusi Workflow Action dari Web/Aplikasi Luar.
    action: bisa 'Approve', 'Reject', 'Request Approval', dll sesuai nama Transisi (Tabel 3).
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
```
*Contoh Pemanggilan dari React (SIMAPROX):*
```javascript
// POST /api/method/werpx_indonesia.api.approve_document
const response = await fetch("https://api.werpx.id/api/method/werpx_indonesia.api.approve_document", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Authorization": "token <API_KEY>:<API_SECRET>"
    },
    body: JSON.stringify({
        doctype: "Purchase Order",
        docname: "PUR-ORD-2026-0001",
        action: "Approve"
    })
});
```
