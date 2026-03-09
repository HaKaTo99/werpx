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

## 3. SKENARIO PRAKTIK 1: Cara Membuat dan Menyetujui Cuti (Leave Application)

**Skenario:** *Karyawan ingin cuti 2 hari, dan Manajer Proyek harus memeriksa lalu menyetujuinya di sistem.*

### Tahap A: Pengajuan Cuti (Oleh Karyawan/Staf HR)
1. Buka WERP X, masuk ke kotak pencarian (bilah atas), lalu ketik **"Leave Application"** (Pengajuan Cuti). Klik hasil pencarian.
2. Di pojok kanan atas, tekan tombol biru besar **"Add Leave Application"**.
3. Isi kolom yang diminta:
   - **Karyawan:** Pilih nama Anda/Karyawan yang cuti.
   - **Tipe Cuti:** (Pilih *Cuti Tahunan* atau *Cuti Sakit*, yang otomatis dibuat oleh sistem kita saat instalasi awal).
   - **Dari Tanggal** hingga **Ke Tanggal:** Masukkan 12 Oktober s/d 13 Oktober (misalnya).
   - **Alasan:** "Istirahat pemulihan."
4. Tekan ikon Disket (Save) di kanan atas. 
   *(Status dokumen sekarang berwarna merah: **Draft**)*

### Tahap B: Pengiriman Workflow
Agar Manajer bisa melihatnya, status harus diubah dari *Draft* menjadi menunggu persetujuan.
1. Masih di halaman cuti yang sama, lihat tombol hijau di pojok kanan atas bertuliskan **"Submit untuk Persetujuan"** (*Submit for Approval*).
2. Klik tombol tersebut. 
   *(Status dokumen akan berubah kuning: **Pending Approval**)*.
   *(Sistem akan otomatis mengirim notifikasi "In-App" kepada siapapun yang menjabat sebagai WERPX Project Manager!).*

### Tahap C: Persetujuan (Oleh Manajer Proyek)
1. Manajer Proyek *Login* ke WERP X. Beliau akan melihat lambang lonceng 🔔 menyala merah.
2. Ketika ditekan, muncul pesan: *"Pengajuan Cuti dari Budi... Harap Tinjau"*. 
3. Manajer mengklik notifikasi itu dan masuk ke form cuti tadi.
4. Di pojok kanan, sekarang akan ada menu tarik-turun (Dropdown) *Action*. Manajer bisa memilih:
   - **"Approved"** (Disetujui) -> Dokumen jadi hijau Sah. Selesai!
   - **"Rejected"** (Ditolak) -> Kembali ke pengaju dengan catatannya.


---

## 4. SKENARIO PRAKTIK 2: Pengadaan Barang Besar (Purchase Order)

**Skenario:** *Perusahaan ingin membeli Besi Konstruksi seharga Rp 100 Juta. Workflow mengharuskan CEO yang menekan "Setuju".*

### Tahap A: Staff Membuat (Purchase Order)
1. Ketik **"Purchase Order"** di pencarian WERP X. Klik hasil pencariannya.
2. Klik tombol biru **"Add Purchase Order"**.
3. Isi data pemasok dengan memilih satu **Pemasok (Supplier)**.
4. Di bagian *Item Tabel* (Daftar barang), ketik "Besi Konstruksi", isi Jumlah: 100 unit. Harga per unit: Rp 1.000.000,- (Total Rp 100 Juta).
5. Klik (Save/Simpan). Status sekarang **Draft**.
6. Klik tombol aksi **Submit untuk CFO/CEO Approval**. 
   *(Status menjadi **Pending Approval**, notifikasi In-App masuk ke meja WERPX CEO).*

### Tahap B: CEO Mengeksekusi via Desktop/SIMAPROX
1. CEO akan menerima notifikasi di ikon Lonceng: "*Perhatian CEO: Dokumen PO XXX senilai Rp 100.000.000 memerlukan persetujuan.*"
2. CEO membukanya, memeriksa rincian tabel barang.
3. Karena semuanya logis, CEO akan menekan tombol **"Approve"**.
   *(Dokumen resmi Sah/Submit. Sisa bagian ini akan dilanjutkan ke Tagihan (Purchase Invoice) dan Pembayaran untuk dihisap log-nya oleh server Rust Anti-Korupsi kita).*

---

Demikian Panduan Skenario Praktis dasar ini dibuat. Selamat mengelola kemajuan Perusahaan Anda melalui *WERP X Enterprise OS*!
