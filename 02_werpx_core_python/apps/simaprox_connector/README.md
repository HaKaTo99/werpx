# Contoh file README untuk konektor SIMAPROX ke ERPNext

## Deskripsi
Konektor ini digunakan untuk mengirim data pengeluaran proyek dari SIMAPROX ke ERPNext (WERP X) melalui endpoint API yang sudah disediakan di server ERPNext.

## Cara Pakai
1. Pastikan endpoint `sync_project_expense` sudah aktif di server ERPNext (modul werpx_indonesia).
2. Isi `base_url`, `api_key`, dan `api_secret` sesuai kredensial ERPNext Anda.
3. Jalankan script `erpnext_connector.py` untuk mengirim data pengeluaran proyek.

## Contoh Penggunaan
```
python erpnext_connector.py
```

## Struktur Data
- `project_id`: ID proyek di ERPNext
- `amount`: Jumlah pengeluaran
- `account_debit`: Akun debit (misal: "5210 - Biaya Material - YC")
- `account_credit`: Akun kredit (misal: "1110 - Kas Kecil - YC")
- `remark`: Keterangan transaksi

## Catatan
- Pastikan project, akun debit, dan akun kredit sudah ada di ERPNext.
- Response akan berupa status sukses/gagal dan pesan dari server ERPNext.
