# WERP X Enterprise OS: User Training Manual

Dokumen ini disusun sebagai wujud kepatuhan terhadap standar implementasi ERP kelas-Enterprise (Setara ISO/Oracle EBS) pada Fase 5.

## 1. Pengenalan Ekosistem WERP X
WERP X berbeda dari ERP biasa karena menerapkan konsep **Hybrid Data Sovereignty**.
- **Backend Operasional:** Ditenagai oleh Frappe Framework (Python/MariaDB) di `02_werpx_core_python`. Di sinilah Staf Akuntan, HR, dan Gudang bekerja.
- **Executive Command Center (SIMAPROX):** Ditenagai oleh React & Supabase (`04_werpx_exec_mobile`). Aplikasi *mobile-first* dengan tema *Glassmorphism* ini khusus untuk C-Level (CEO, Direktur) agar bisa melihat performa *real-time* tanpa masuk ke backend yang rumit.
- **Audit Engine (Forge):** Ditenagai oleh Rust (`03_werpx_engine_rust`). Setiap transaksi finansial kritis di-*hash* menjadi buku besar yang diubah (*Immutable Ledger*) untuk mencegah kecurangan.

## 2. Siklus Kerja Pengguna (Role-Based Access)

### A. WERPX CEO
- **Akses:** SIMAPROX Mobile Dashboard, Backend (Terbatas untuk persetujuan).
- **Tugas Utama:** 
  - Melihat Nilai Portofolio Proyek.
  - Menyetujui *Purchase Order* (PO) bernilai tinggi (> Rp 50 Juta).
  - Menyetujui *Sales Order* (SO) dari tim penjualan.

### B. WERPX Project Manager
- **Akses:** Backend Frappe.
- **Tugas Utama:**
  - Membuat *Project* baru.
  - Memasukkan estimasi *Budget* (Estimasi Costing).
  - Menerima In-App Notification untuk menyetujui Cuti (Leave Application) staf-nya.

### C. WERPX Finance Staff
- **Akses:** Modul Akuntansi Backend Frappe.
- **Tugas Utama:**
  - Membuat Jurnal Entri (Otomatis tercatat/dikirim ke Rust Forge).
  - Melihat *Custom Report* (Laba Proyek, Neraca, dsb).

## 3. Cara Mengakses Sistem
1. Admin sistem akan memberikan Anda alamat domain (misal: `os.werpx.id`).
2. Masukkan kredensial Anda.
3. Begitu masuk, Anda akan disambut oleh UI WERP X *Glassmorphism* (Jika Anda staf) atau aplikasi tablet SIMAPROX (Jika Anda Eksekutif).
4. Perhatikan ikon lonceng untuk mengecek notifikasi **Persetujuan (Approval)** Anda.
