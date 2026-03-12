# WERP X Enterprise OS: Panduan Lengkap Instalasi & Deployment

Selamat datang tim IT / SysAdmin! Dokumen ini dirancang **sangat ramah pemula**. Anda akan dibimbing selangkah demi selangkah tentang cara menghidupkan ekosistem perangkat lunak tingkat *Enterprise* (WERP X), yang menjadi fondasi krusial bagi pencapaian implemententasi Visi Fase 1 hingga Fase 10+ (`STRATEGIC_MASTERPLAN.md`).

Karena WERP X ini canggih dan menggunakan 3 mesin yang berbeda (Python, React, dan Rust), pahami dulu konsep di bawah ini sebelum kita mulai instalasi:

### Konsep Singkat (Wajib Baca)
1.  **Backend (Inti ERP):** Dibuat menggunakan kerangka kerja *Frappe Framework* (Python) dan *Database MariaDB*. Di sinilah seluruh data tersimpan.
2.  **Audit Engine (Keamanan):** Dibuat menggunakan *Rust*. Bertugas mencatat secara permanen (tidak bisa dihapus/diubah) jurnal keuangan dari Backend. (Menghindari penipuan).
3.  **Frontend (Executive Dashboard / SIMAPROX):** Dibuat dengan *React* (JavaScript). Antarmuka web modern dengan gaya *Glassmorphism* yang hanya diakses oleh para Bos/CEO untuk memantau performa.

---

## TAHAP 1: Menyiapkan Mesin ERP Utama (Frappe Python)

Inti operasi bisnis kita ada di Frappe. Pastikan sistem operasi Anda adalah **Linux (Ubuntu disarankan)** atau Mac (WSL jika Anda di Windows).

### Langkah-langkah:
1.  **Install Frappe Bench:** (Ini adalah manajer aplikasi dari kerangka kerja perpustakaan kita).  
    Ikuti instruksi resmi di: `https://frappeframework.com/docs/user/en/installation`. Intinya, Anda butuh Python 3.10+, Node.js 18+, Redis, dan MariaDB.
    
2.  **Buat Situs (Site) Baru:**
    Setelah *Bench* terpasang, jalankan perintah ini di Terminal:
    ```bash
    bench new-site werpx.local
    ```
    *(Sistem akan meminta Anda membuat kata sandi Administrator. SIMPAN BAIK-BAIK!)*

3.  **Tarik Repositori WERP X Indonesia ke Server Anda:**
    ```bash
    bench get-app https://github.com/HaKaTo99/werpx.git
    ```
    
4.  **Pasang Aplikasi WERP X ke Situs Anda:**
    ```bash
    bench --site werpx.local install-app werpx_indonesia
    ```
    *(Tunggu prosesnya. Pada tahap ini, Script `setup_master.py` otomatis berlari dan membangun fondasi gudang, role CEO, hingga cuti karyawan!)*

5.  **Jalankan Mesin!**
    ```bash
    bench start
    ```
    Selamat! Buka peramban (browser) di `http://werpx.local:8000`. Coba login dengan *username* `Administrator`.

---

## TAHAP 2: Menghidupkan Rust Forge Engine (Keamanan Audit)

Kita harus menghidupkan "gembok digital" aplikasi ini. Folder ini ada di `03_werpx_engine_rust`.

1.  Pastikan Anda sudah menginstal alat bahasa Rust (`cargo` dan `rustup`). Anda bisa mengikuti petunjuk di `rustup.rs`.
2.  Buka terminal baru, dan masuk ke folder proyek Rust:
    ```bash
    cd 03_werpx_engine_rust
    ```
3.  Jalankan server Node API Rust:
    ```bash
    cargo run --release
    ```
    *Logika Fail-Safe: Jika server Rust ini mati secara tidak sengaja, jangan panik! Frappe (ERP kita) sudah dibekali sistem antrian pintar. Ia akan menyimpan transaksi sementara, dan otomatis mengirimnya ulang saat server Rust hidup kembali esok hari.*

---

## TAHAP EKSKLUSIF: MENGAKSES BISNIS INTELIJEN / METABASE (Fase 4)
BizView atau lapisan analitik WERP X menggunakan *Metabase/Streamlit* dan terletak pada modul `05_werpx_bizview`. 
Alat analitik data tingkat lanjut *Big Data* ini **dikunci/dinonaktifkan** demi berhemat Memory (RAM) Cloud Server.
Jika perusahaan siap memproses Data Prediktif dan Arus Kas, harap ikuti instruksi pengaktifannya di [Panduan Aktivasi Metabase BizView](../05_werpx_bizview/README.md).

---

## TAHAP 3: Menjalankan Dashboard Eksekutif (React)

Ini adalah antarmuka indah yang khusus disajikan bagi level VIP perusahaan (Dashboard SIMAPROX).

1.  Pastikan `Node.js` sudah terinstal di komputer.
2.  Buka terminal baru, dan masuk ke folder frontend kita:
    ```bash
    cd 04_werpx_exec_mobile
    ```
3.  Instal seluruh modul/alat-alat yang dibutuhkan web:
    ```bash
    npm install
    ```
4.  **SANGAT PENTING: Konfigurasi Hubungan Database!**
    Untuk menghubungkan frontend dengan database asli, aplikasi Frontend kita menggunakan `Supabase` API. Buat file bernama `.env` di folder ini, lalu isi kredensial *Supabase* Anda sesuai instruksi akun Anda:
    ```env
    VITE_SUPABASE_URL="https://xxx.supabase.co"
    VITE_SUPABASE_ANON_KEY="eyJhbG..."
    ```
5.  Nyalakan layarnya!
    ```bash
    npm run dev
    ```
    Buka *browser* di alamat yang diberikan (biasanya `http://localhost:5173`). Jika tulisan hijau `Status Sinyal: Bebas Hambatan (Online)` muncul di kanan atas layar Executive, Anda telah sukses!

---
**Catatan Penting Deploy Produksi (Skala Besar):**
Untuk instalasi langsung ke Publik/Internet (Produksi), sangat disarankan Anda mengombinasikan ketiga mesin tersebut menggunakan konfigurasi *Docker Compose* atau menyewa layanan hosting ERPNext untuk bagian Frappe-nya (lalu mengaitkannya (Webhook) ke Rust).
