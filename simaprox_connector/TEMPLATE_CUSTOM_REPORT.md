# Template: Custom Report & Executive Dashboard WERP X

Panduan untuk membuat laporan khusus dan widget dashboard yang diproyeksikan ke SIMAPROX atau Workspace ERPNext. Gunakan referensi ini untuk membuat Standard Operating Procedure (SOP) pengerjaan laporan.

## 1. Konsep Laporan
- **Nama Laporan:** (Misal: Analisis Laba Proyek By Region)
- **Tipe Laporan:** Query Report / Script Report / Report Builder
- **Modul:** Project / Accounts
- **Target Pembaca:** CEO / General Manager

## 2. Filter Laporan (Filters)
Parameter yang bisa diubah oleh pengguna saat melihat laporan (interaktif).

| Label | Fieldname | Fieldtype | Mandatory | Default |
|---|---|---|---|---|
| Company | company | Link (Company) | Yes | (User default) |
| Project | project | Link (Project) | No | - |
| From Date | from_date | Date | Yes | First day of month |
| To Date | to_date | Date | Yes | Today |

## 3. Struktur Kolom (Columns)
Output data yang ditampilkan kepada Eksekutif (harus efisien dan _insightful_).

| Kolom | Tipe Data | Lebar (px) | Keterangan |
|---|---|---|---|
| Nama Proyek | Link (Project) | 200 | Identifier Utama |
| Budget (IDR) | Currency | 150 | Alokasi dari BoQ |
| Realisasi (IDR) | Currency | 150 | Pengeluaran Aktual |
| Variance | Currency | 150 | (Budget - Realisasi) |
| Margin (%) | Percent | 100 | ROI Proyek |

## 4. SQL Query (Jika menggunakan Query Report)
```sql
-- Contoh Script Dasar yang diinjeksi melalui antarmuka
SELECT 
    name as "Project:Link/Project:200",
    estimated_costing as "Budget:Currency:150",
    total_costing_amount as "Realisasi:Currency:150",
    (estimated_costing - total_costing_amount) as "Variance:Currency:150"
FROM 
    `tabProject`
WHERE 
    company = %(company)s 
    AND status = 'Open';
```

## 5. Menampilkan di Executive Dashboard
1. **Untuk Internal WERP X (Core ERP):** Simpan Report di dalam WERP X, lalu masuk ke **Workspace** yang dituju dan tambahkan tipe **Dashboard Chart** atau **Report**.
2. **Untuk Eksternal CEO View (React / SIMAPROX):** Buat API endpoint khusus di `api.py` untuk membungkus hasil Query ini sehingga dapat di-konsumsi (fetch) oleh antarmuka SIMAPROX (di dalam `04_werpx_exec_mobile`).
