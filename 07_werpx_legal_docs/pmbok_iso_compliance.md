# WERP X Enterprise OS: Pedoman Kepatuhan PMBOK & ISO

Dokumen ini mendefinisikan dan memetakan arsitektur fungsional perangkat lunak **WERP X Enterprise OS** terhadap standar pengelolaan proyek global (*Project Management Body of Knowledge* / PMBOK) dan standar kepatuhan organisasi internasional (ISO 9001 untuk Manajemen Mutu dan ISO/IEC 27001 untuk Keamanan Informasi). Hal ini penting sebelum inisiasi fase *deployment* produksi di perusahaan.

---

## 1. Keselarasan dengan Kerangka Kerja PMBOK (Edisi Ke-7)
Sebagai sebuah ekosistem ERP, WERP X secara *native* mendukung kelancaran *Project Management* melalui tata kelola area pengetahuan (Knowledge Areas) berikut:

### A. Project Integration & Scope Management (Integrasi & Ruang Lingkup)
- **Fungsionalitas WERP X:** Seluruh batas implementasi perangkat lunak (Scope) dari Fase 1 hingga Fase 10+ dideklarasikan mutlak pada file `ROADMAP_WERPX.md` dan Rencana Induk Makro di `STRATEGIC_MASTERPLAN.md`. Perubahan ruang lingkup (*Change Control*) dikelola secara terpusat melalui Git Versioning (Commits).
- **Bagi Pengguna:** Modul *Project* terintegrasi langsung dengan Pembelian (Purchasing) dan Penjualan (Sales) memastikan seluruh sumber daya terkait proyek terpusat.

### B. Project Schedule & Cost Management (Jadwal & Biaya)
- **Fungsionalitas WERP X:** Ekstensi *Project Portfolio Management* (PPM) via `ppm_extension.py` memampukan pelacakan biaya proyek otomatis berskala waktu-nyata (*Real-time Budget vs Actual*) melalui integrasi API ke SIMAPROX Executive Dashboard.
- C-Level tidak lagi menunggu akhir bulan untuk mengetahui apakah sebuah proyek memakan biaya melebihi *Baseline Cost* atau *Schedule Variance* meleset.

### C. Project Quality & Resource Management (Mutu & Sumber Daya)
- **Pemisahan Konteks (Separation of Concerns):** Arsitektur WERP X terbagi atas 3 mesin independen: Frappe (Bisnis), React (Eksekutif UI), dan Rust (Keamanan Ledger), di mana jika satu sisi kelebihan beban (Oversubscription), tidak mengorbankan kualitas sisi lainnya.
- **HR Module (`hr_extension.py`):** Otomatisasi komponen asuransi kesehatan (BPJS) dan perhitungan perpajakan (PPh 21) bagi Sumber Daya Manusia berjalan presisi secara internal lewat `doc_events` (Hooks).

### D. Project Risk & Procurement Management (Risiko & Pengadaan Barang/Jasa)
- **Mitigasi Risiko:** Otomatisasi CRON Job (`scheduler.py`) mendeteksi dan melakukan mekanisme *Auto-Retry Queueing* untuk memastikan *sinkronisasi database* tidak putus di tengah jalan demi menjaga validitas data transaksi.
- **Pengadaan Cerdas:** Pengadaan material berskala besar dikunci di `workflows_po.json`, memitigasi kolusi di mana hanya wewenang tertentu (misal Pejabat PM atau CEO) yang bisa melegalkan transaksi material di atas angka standar (Risk Threshold).

---

## 2. Kepatuhan Sistem Manajemen Mutu (ISO 9001:2015)
Prinsip utama Standardisasi Mutu Perangkat Lunak WERP X diletakkan pada fondasi otomatisasi yang bisa diulang di berbagai level korporasi:
- **Pendekatan Proses (Process Approach):** Standarisasi operasional melalui `setup_master.py` memastikan setiap *multi-company* atau kantor cabang baru pada ekosistem akan segera memiliki bagan *Inventory Warehouse Group*, *Territory CRM*, dan *Leave Types* yang identik dan terkontrol.
- **Peningkatan Berkelanjutan (Continuous Improvement):** Analisis laba deviasi (`custom_reports.sql`) memberikan sinyal langsung bagi pimpinan manajemen guna mengevaluasi ketidakefisienan operasional (Efisiensi Cost Center).
- **Fokus Pelanggan (Customer Focus):** Eksekutif mendapatkan pengalaman *Mobile-First/Glassmorphism Dashboard* mewah tanpa perlu memelajari kode-kode *backend* akuntansi (*B2C Feel in B2B App*).

---

## 3. Kepatuhan Sistem Manajemen Keamanan Informasi (ISO/IEC 27001:2022)
WERP X secara khusus diciptakan bagi instansi yang peduli pada asas keamanan kedaulatan data (Data Sovereignty).
- **Kerahasiaan (Confidentiality):** Hak Akses (Role-Based Access Control / RBAC) direstriksi di file `custom_roles.json`. Profil *WERPX Finance Staff* hingga *WERPX CEO* memiliki akses _doctype_ spesifik yang tidak tumpang-tindih (Prinsip *Least Privilege*).
- **Integritas (Integrity - Immutable Ledger):** Ini adalah jantung inovasi WERP X. Komunikasi *Asynchronous Redis Background Job* (`tasks.py`) mereplikasi *Log Transaksi/Audit* Frappe langsung ke **Rust Forge Engine**. Setelah log sampai di Rust, hash kriptografi dikunci. Jurnal ERP tidak dapat diamankan oleh pelaku internal/Hacker untuk dipalsukan diam-diam tanpa merusak *ledger hash* Rust (Anti-Fraud).
- **Ketersediaan (Availability):** Desain kode `try-except` di `tasks.py` menjamin *Fail-Safe Fallback*. Jika server Audit Rust mati terkena serangan DDoS, server ERP Frappe tetap dapat beroperasi (transaksi bisa di-*entry*) dan log disimpan sementara (Queue), mencegah sistem perusahaan mogok beroperasi (Zero Work-Stoppage).

---
*Properti legal pengembangan dan desain dari WERP X Enterprise OS - Antigrafity.*
