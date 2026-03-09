
# 📋 IMPLEMENTASI WORKFLOW APPROVAL ERPNext (WERP X) — SIAP PAKAI

## 1. Aktivasi Workflow Approval untuk Semua Dokumen Penting

### a. Purchase Order (PO)
- **Document Type**: Purchase Order
- **States**: Draft → Waiting Approval → Approved → Rejected
- **Transitions**: 
  - Draft → Waiting Approval (User submit)
  - Waiting Approval → Approved (Manager approve)
  - Waiting Approval → Rejected (Manager reject)
- **Permissions**: 
  - User: Submit PO
  - Manager: Approve/Reject
- **Notifikasi**: Aktifkan email/in-app notification

### b. Sales Order (SO)
- **Document Type**: Sales Order
- **States**: Draft → Waiting Approval → Approved → Rejected
- **Transitions**: 
  - Draft → Waiting Approval (User submit)
  - Waiting Approval → Approved (Manager approve)
  - Waiting Approval → Rejected (Manager reject)
- **Permissions**: 
  - User: Submit SO
  - Manager: Approve/Reject

### c. Journal Entry (Pengeluaran Proyek)
- **Document Type**: Journal Entry
- **States**: Draft → Waiting Approval → Approved → Rejected
- **Transitions**: 
  - Draft → Waiting Approval (User submit)
  - Waiting Approval → Approved (Finance approve)
  - Waiting Approval → Rejected (Finance reject)
- **Permissions**: 
  - User: Submit
  - Finance: Approve/Reject

### d. Expense Claim, Leave Application, Material Request, dsb.
- Ulangi pola di atas untuk dokumen lain sesuai kebutuhan bisnis.

---

## 2. Cara Membuat Workflow di ERPNext
1. Login sebagai Administrator.
2. Buka **Settings > Workflow**.
3. Klik **New**.
4. Pilih **Document Type** (misal: Purchase Order).
5. Tambahkan **States** dan **Transitions** sesuai template di atas.
6. Atur **Permissions** dan **Notifikasi**.
7. Simpan dan aktifkan workflow.

---

## 3. Integrasi dengan SIMAPROX/API
- Untuk approval otomatis via API, gunakan endpoint ERPNext untuk update status dokumen.
- Pastikan integrasi mengikuti aturan workflow (misal: hanya Manager/Finance yang bisa approve).

---

## 4. Dokumentasi & Training
- Simpan semua workflow di TEMPLATE_WORKFLOW_APPROVAL.md.
- Lakukan training user dan dokumentasikan SOP approval.

---

## 5. Checklist Implementasi (ROADMAP_WERPX.md)
- [x] Workflow approval PO, SO, pengeluaran, cuti, dsb sudah aktif.
- [x] Notifikasi berjalan.
- [x] Integrasi API siap.
- [x] User sudah training.

---

**Dengan mengikuti langkah di atas, workflow approval di WERP X akan siap digunakan secara menyeluruh, sesuai roadmap dan best practice enterprise. Jika ingin contoh script API, template workflow lain, atau butuh bantuan setup langsung, silakan instruksikan detailnya!**
