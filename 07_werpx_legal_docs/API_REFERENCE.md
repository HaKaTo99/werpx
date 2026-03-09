# Referensi Eksternal API WERP X (Developer Guide)

Panduan ini dibuat bagi **Software Developer dari Pihak Ketiga** (misalnya pengembang Web Toko Online, Aplikasi Absensi Sidik Jari Karyawan, dsb) yang ingin menyuntikkan, meminta, atau menyinkronisasi data dengan jantung WERP X.

Frappe Framework (Inti WERP X) sudah secara ajaib (*Native*) membuatkan API REST untuk setiap dokumen yang Anda ciptakan. Anda tidak perlu repot membuat routing.

Semua alamat API diawali dengan tautan website ERP Anda, ditambah `/api/method/`.

---

## 1. Otorisasi (Cara Masuk)

WERP X tidak mengizinkan akses tanpa kunci rahasia (*Token*).
1.  Masuk ke Pengaturan Akun di WERP X.
2.  Gulir ke bawah pada opsi **API Access**, ketuk tulisan "Generate Keys".
3.  Anda akan mendapatkan **API Key** dan **API Secret**. Jangan berikan ini kepada siapa pun!

Di dalam skrip atau alat pihak ketiga Anda (misalnya *Postman*), taruh pengaturan keamanan (*Headers*) ini:
```text
Authorization: token API_KEY_ANDA:API_SECRET_ANDA
Content-Type: application/json
```

---

## 2. API Khusus Kustom WERP X 

Selain API bawaan, kita (tim Antigrafity) telah merancang kodesumber API kustom secara manual untuk kebutuhan khusus:

### A. Membaca "Skor Kesehatan Proyek" (*Project Portfolio Health*)
**Kegunaan:** Mengirimkan ringkasan kemajuan dan metrik anggaran dari seluruh proyek yang *Aktif* di dalam perusahaan. Dirancang untuk Dashboard Eksekutif.

*   **Endpoint:** `/api/method/werpx_indonesia.ppm_extension.WERPXPortfolioManager.get_portfolio_health_score`
*   **Metode:** `GET`
*   **Balasan Sukses (JSON):**
    ```json
    {
        "message": {
            "status": "success",
            "portfolio_score": 85.50,
            "total_active": 4,
            "message": "Portfolio Health Score Dihitung Berhasil."
        }
    }
    ```

### B. Mendorong Transaksi ke Sistem Keamanan Anti-Korupsi (Rust Engine)
**Kegunaan:** Jika Anda membuat modul finansial eksternal dan ingin mencatat log keamanannya ke *Rust Forge Engine* secara instan. Ini bukan Endpoints Frappe, melainkan jalur mandiri ke server mesin Rust.

*   **Endpoint:** `http://[IP_RUST_SERVER]:8080/api/audit/log`
*   **Metode:** `POST`
*   **Persyaratan Isi Data (Body/JSON):**
    ```json
    {
        "transaction_id": "POS-2024-00192",
        "source_module": "KASIR-CABANG",
        "amount": 2500000.00,
        "description": "Pembayaran Tunai Barang X",
        "user": "joni.kasir@werpx.id"
    }
    ```

---

## 3. Modul Umum (Contoh Mengundang ERPNext Native)

API sangat berguna kalau HR ingin mengaitkan laporan sistem jam pasir (*fingerprint absensi*) eksternal ke WERP X.

### Membuat Cuti Baru (*Leave Application*)
*   **Endpoint:** `/api/resource/Leave Application`
*   **Metode:** `POST`
*   **Body (JSON):**
    ```json
    {
        "employee": "HR-EMP-0001",
        "leave_type": "Cuti Tahunan",
        "from_date": "2024-10-15",
        "to_date": "2024-10-17",
        "reason": "Acara Keluarga"
    }
    ```
*Catatan: Dokumen yang berhasil diciptakan via API masih harus mengikuti **Persetujuan Workflow** (Harus disetujui Manajer Proyek menurut skema `workflows_leave.json` kita) sebelum berstatus Sah (Approved).*
