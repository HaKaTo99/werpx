# TEMPLATE WORKFLOW APPROVAL (ERPNext)

## Contoh: Approval Purchase Order (PO)

1. Masuk ke **Settings > Workflow** di ERPNext.
2. Buat Workflow baru:
   - **Document Type**: Purchase Order
   - **States**: Draft → Waiting Approval → Approved → Rejected
   - **Transitions**:
     - Draft → Waiting Approval (oleh User)
     - Waiting Approval → Approved (oleh Manager)
     - Waiting Approval → Rejected (oleh Manager)
   - **Permissions**:
     - User: Submit PO
     - Manager: Approve/Reject
   - **Notifikasi**: Aktifkan email/in-app notification pada setiap transisi.

## Contoh: Approval Pengeluaran Proyek
- Ulangi langkah di atas untuk Document Type: Journal Entry atau Expense Claim.

---

## Catatan
- Workflow bisa dikustomisasi untuk SO, pengeluaran, cuti, dsb.
- Simpan dokumentasi workflow di folder ini untuk referensi tim.
