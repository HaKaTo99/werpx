# WERP X Enterprise OS: Production Cloud Deployment Runbook

Dokumen ini adalah **SOP Resmi (Standard Operating Procedure)** bagi tim DevOps atau IT Administrator untuk mengawal peluncuran (Go-Live) WERP X menuju **Production Server (Internet Publik)**. Penerapan panduan ini merupakan syarat mutlak agar arsitektur berjalan prima sesuai peta jalan *Masterplan 10-Fase* (`STRATEGIC_MASTERPLAN.md`).

---

## FASE 1: Belanja Jangka Panjang & Persiapan Infrastruktur

Sebelum memutar kode, siapkan aset-aset ini:
1. **Cloud Server (VPS):** Sewa mesin virtual (Misal: AWS EC2, DigitalOcean, Linode, atau Alibaba Cloud).
   *   **Sistem Operasi Wajib:** Ubuntu 22.04 LTS atau Ubuntu 24.04 LTS (64-bit).
   *   **Spesifikasi Minimal:** 4 Core CPU, 8 GB RAM, 100 GB SSD/NVMe (Mengingat beban Frappe, Rust, dan MariaDB).
2. **Domain Publik:** Beli atau siapkan nama domain resmi perusahaan (Misal: `os.perusahaananda.com` & `ceo.perusahaananda.com`).
3. **Akses Root:** Pastikan Anda memiliki kredensial SSH untuk masuk ke server tersebut (Misal: `ssh root@103.xxx.xxx.xx`).

---

## FASE 2: Hardening Server (Pengaman OS Dasar)

Begitu server baru Anda menyala, buka terminal Anda, masuk SSH, dan amankan mesin dari serangan *botnet* publik.

### 1. Update Respositori
```bash
sudo apt-get update -y && sudo apt-get upgrade -y
```

### 2. Konfigurasi UFW (Uncomplicated Firewall)
Tutup semua jalur, sisakan pintu utama:
```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp  # Pintu HTTP Biasa
sudo ufw allow 443/tcp # Pintu HTTPS (Secure)
# 8000 dan 8080 ditutup dari publik, hanya boleh diakses melalui Nginx Internal!
sudo ufw enable
```

---

## FASE 3: Instalasi Mesin Kontainer (Docker)

WERP X dipaketkan dalam `docker-compose.yml`. Anda wajib memasang *Docker Engine* versi mutakhir di Linux Ubuntu.

```bash
# Hapus versi usang jika ada
sudo apt-get remove docker docker.io containerd runc

# Instal ketergantungan
sudo apt-get install ca-certificates curl gnupg lsb-release

# Tambahkan GPG Key resmi Docker
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Setup Repo
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Instal Docker
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin docker-compose -y
```

---

## FASE 4: Penarikan Repositori WERP X & Eksekusi

Kini server Anda siap menerima kode berlian yang telah kita ciptakan.

### 1. Mengkloning (*Clone*) Sistem
```bash
cd /opt
sudo git clone https://github.com/HaKaTo99/werpx.git werpx-production
cd werpx-production
```

### 2. Mengatur Kata Sandi Rahasia (.env file)
Buat file dinding rahasia (*Environment Variables*) di server. **Jangan lewatkan ini!**
```bash
nano .env
```
Isikan nilai-nilai berikut dengan sandi terkuat milik Anda:
```env
DB_PASSWORD=GantiDenganSandiMariaDBYangSangatRumit2026!
SUPABASE_DB_PASSWORD=GantiDenganSandiSupabase123!
JWT_SECRET=W3rPxEksekutifS3cr3t#2026
```
Keluar dan simpan teks (Ctrl+X, Y, Enter).

### 3. Eksekusi Pembakaran (Ignition)
Tarik napas, ini adalah detik di mana ekosistem WERP X menyala secara riil:
```bash
# Menyalakan seluruh sasis secara otomatis
sudo bash setup_env.sh
```
*(Tunggu 5-10 menit. Docker akan mengunduh inti Frappe, MariaDB, Node, dan Rust dari pusat).*

---

## FASE 5: Melahirkan Rumah Perusahaan (Site Initialization)

Sistem sudah menyala, namun ia masih kosong (Seperti layar `Not Found` di Windows). Kini kita cetak "Site-nya" (Pabriknya).

Masuk ke dalam urat nadi Frappe dari terminal Host (Ubuntu):
```bash
sudo docker exec -it werpx_core_python bash
```
*(Sekarang Anda berada di dalam kontainer sistem operasi Frappe Linux).*

Jalankan serangkaian perintah magis pembuatan perusahaan ini:
```bash
# 1. Pindah ke direktori utama bench
cd frappe-bench

# 2. Buat "Pabrik/Site" baru (Misal erp.perusahaananda.com)
bench new-site erp.perusahaananda.com --admin-password "SandiAdminSuperKuat123!"

# 3. Pasang Aplikasi Utama Frappe (ERPNext) ke site tersebut
bench --site erp.perusahaananda.com install-app erpnext

# 4. Pasang Aplikasi Kustom Hak Cipta WERP X (Indonesia) ke site tersebut
bench --site erp.perusahaananda.com install-app werpx_indonesia

# 5. Atur site kita sebagai situs utama bawaan
bench use erp.perusahaananda.com
```

Keluar dari kontainer dengan mengetik `exit`.

---

## FASE 6: Penggembokan Keamanan Internasional (SSL / HTTPS)

Sebuah ERP tanpa embok hijau SSL (Gembok di kiri alamat Web URL) adalah ERP ilegal secara keamanan (RAW HTTP). Kita gunakan Nginx dan Certbot Let's Encrypt (Gratis selamanya).

### 1. Ubah Rute Gateway (Nginx di Docker kita)
Sebagai *Reverse Proxy*, kita akan menembak trafik domain masuk, ke port 8000 (Frappe) dan port 3000 (SIMAPROX).

```bash
sudo apt install certbot -y
```

*(Karena ada Nginx di dalam Docker, cara standar Enterprise adalah menempatkan Nginx Proxy Manager / Traefik di port 80/443 luar docker, namun skrip WERP X kita sudah membekali Anda `01_werpx_gateway/`)*.

Agar Let's encrypt bisa dikunci dari luar server induk:
```bash
sudo ufw disable # Matikan sejenak UFW
```
Mintalah sertifikat SSL untuk domain tersebut:
```bash
sudo certbot certonly --standalone -d erp.perusahaananda.com -d ceo.perusahaananda.com
```

Setelah lolos verifikasi DNS, konfigurasi sertifikat ini (`fullchain.pem` dan `privkey.pem`) dipasangkan pada modul konfigurasi (`01_werpx_gateway/conf.d/default.conf`) repositori Anda.

**Selesai!** 

Kini seluruh staf di perusahaan Anda (Cabang Sabang sampai Merauke) dapat mengakses:
*   **Aplikasi Staf:** `https://erp.perusahaananda.com`
*   **Dasbor C-Level:** `https://ceo.perusahaananda.com` (Ditujukan ke IP Port 3000 Node React kita)

**Catatan Akhir untuk SysAdmin:**
Lakukan operasi *Backup Data* seminggu sekali. Cukup dengan menekan `docker exec -it werpx_core_python bench --site all backup`. Semua nyawa perusahaan akan selamat sentosa!
