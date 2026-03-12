# WERP X BizView (Fase 4: Business Intelligence Layer)

Direktori `05_werpx_bizview` merupakan wadah bagi **Lapisan Intelijen Bisnis (Business Intelligence)** dari ekosistem WERP X Enterprise OS. Sesuai dengan Visi 10-Fase pada `STRATEGIC_MASTERPLAN.md`, lapisan ini menargetkan manajer menengah ke atas untuk melakukan *Forecasting*, Analisis Tren Laba, dan pelaporan mandiri kelas lanjut (Advanced Ad-hoc Reporting).

## Arsitektur BizView
Alih-alih membebani MariaDB milik *Frappe* (Server Operasional/OLTP), modul ini menambang data (*Data Mining*) dari Pangkalan Data Analitik sekunder (*Replica/Read-Only*) atau dari Data Warehouse WERP X.

Terdapat **dua pilar utama** alat penunjang *Business Intelligence* yang kita operasikan:

### 1. Metabase (Eksekutif & Manajerial)
*   **Fungsi Utama:** Dasbor *Drag-and-Drop*, eksplorasi data grafis, S-Curve Otomatis, dan pengiriman Laporan PDF via *Email/Slack* secara terjadwal.
*   **Keunggulan Utama:** Ramah pengguna non-teknis (Akuntan/Manajer tidak perlu paham SQL).
*   **Status Implementasi:** Menunggu Injeksi Kontainer pada Mode *Production* (Lihat petunjuk instalasi).

### 2. Streamlit / Python Pandas (Data Scientist)
*   **Fungsi Utama:** Prediksi Arus Kas (*Cashflow Forecasting*), Regresi Linear, dan pemrosesan algoritma statistik mendalam.
*   **Keunggulan Utama:** Tak terbatas pada *Query Statement*. Mengizinkan *Machine Learning Model* untuk memprediksi probabilitas gagal bayar Piutang.
*   **Status Implementasi:** Skrip analitik Python disiapkan paralel bersama integrasi *Machine Learning* di Fase 7.

---

## Cara Menghidupkan (Enable) Metabase (Mode Produksi)

Secara bawaan (*Default*), Engine Metabase tidak dinyalakan di `docker-compose.yml` karena Metabase mengonsumsi memori (RAM) sangat masif (Min. 2GB alokasi khusus Java). 

Bila Server Infrastruktur siap (Fase 4 Aktif), silakan ikuti petunjuk SysAdmin ini:

1. Buka file `docker-compose.yml` di akar (root) repositori proyek.
2. Pada bagian bawah berkas, tambahkan *Service* Metabase berikut:

```yaml
  werpx-metabase:
    image: metabase/metabase:latest
    container_name: werpx_bizview_metabase
    ports:
      - "3000:3000"  # Ubah port eksternal jika bentrok dengan SIMAPROX
    environment:
      MB_DB_TYPE: postgres
      MB_DB_DBNAME: ${SUPABASE_DB_NAME:-postgres}
      MB_DB_PORT: 5432
      MB_DB_USER: ${SUPABASE_DB_USER:-postgres}
      MB_DB_PASS: ${SUPABASE_DB_PASSWORD}
      MB_DB_HOST: werpx-audit-db
    depends_on:
      - werpx-audit-db
    networks:
      - werpx-network
    restart: unless-stopped
```
3.  Jalankan ulang perintah eksekusi *Docker*:
    ```bash
    sudo docker-compose up -d werpx-metabase
    ```
4.  Buka Panel Antarmuka (Browser) di `http://[IP-SERVER]:3000`. Setel koneksi (*Add Database*) ke *MariaDB (Frappe)* atau *PostgreSQL (Supabase/Rust Ledger)* untuk mulai meracik dasbor Anda.

*Dokumen diotorisasi oleh Blueprint Strategis WERP X Antigrafity.*
