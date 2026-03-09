# SIMAPROX → ERPNext (WERP X) Connector

## 1. Instalasi & Persiapan

### a. Prasyarat
- Python 3.8+
- Library requests (`pip install requests`)
- Akses ke server ERPNext (dengan endpoint `sync_project_expense` aktif)
- API Key & API Secret ERPNext (lihat instruksi di bawah)

### b. Mendapatkan API Key & Secret
1. Login ke ERPNext sebagai user yang punya akses ke modul Akuntansi & Proyek
2. Buka **Settings > My Settings > API Access**
3. Klik **Generate Keys**
4. Simpan **API Key** dan **API Secret**

## 2. Struktur Folder

```
simaprox_connector/
  ├── erpnext_connector.py
  └── README.md
```

## 3. Konfigurasi Koneksi
Edit bagian berikut di `erpnext_connector.py`:

```
connector = ERPNextConnector(
    base_url="https://your-erpnext.frappe.cloud",  # Ganti dengan URL ERPNext Anda
    api_key="your_api_key",                        # Ganti dengan API Key
    api_secret="your_api_secret"                   # Ganti dengan API Secret
)
```

## 4. Cara Mengirim Pengeluaran Proyek

Panggil fungsi berikut di script Anda:

```
result = connector.sync_project_expense(
    project_id='PRO-2025-001',
    amount=5000000,
    account_debit='5210 - Biaya Material - YC',
    account_credit='1110 - Kas Kecil - YC',
    remark='Pembelian Semen 50 sak'
)
print(result)
```

## 5. Penanganan Error & Logging
- Jika terjadi error (misal: project/account tidak ditemukan), response akan berisi status "error" dan pesan detail.
- Untuk produksi, tambahkan logging ke file/log server SIMAPROX Anda.

## 6. Pengujian Mandiri
- Ubah data test pada script utama, jalankan: `python erpnext_connector.py`
- Cek hasil di ERPNext (modul Journal Entry, filter berdasarkan project/remark)

## 7. Ekstensi & Kustomisasi
- Untuk endpoint lain (misal: tagihan, material request), duplikasi dan modifikasi fungsi di `erpnext_connector.py`.
- Dokumentasikan setiap endpoint dan payload agar tim lain mudah mengembangkan.

## 8. Troubleshooting
- Pastikan API Key/Secret benar dan user punya hak akses.
- Cek log error di ERPNext jika response error tidak jelas.
- Gunakan tools seperti Postman untuk debug manual jika perlu.

---

**Konektor ini dapat dikembangkan lebih lanjut untuk kebutuhan integrasi lain (misal: otomatisasi tagihan, pengadaan, dsb).**
