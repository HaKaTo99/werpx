#!/bin/bash
# ==============================================================================
# WERP X Enterprise OS - One-Click Infrastructure Setup Script
# ==============================================================================

echo "============================================="
echo "  🚀 Starting WERP X Environment Setup...  "
echo "============================================="

# 1. Pastikan Docker dan Docker Compose tersedia
if ! command -v docker &> /dev/null
then
    echo "❌ Docker tidak ditemukan. Silakan pasang Docker terlebih dahulu."
    exit 1
fi

echo "✅ Docker terdeteksi."

# 2. Setup Environment Variables
if [ ! -f .env ]; then
    echo "⚠️ File .env tidak ditemukan. Menyalin dari draf..."
    echo 'DB_PASSWORD=WerpxSecurePass2026!' > .env
    echo 'SUPABASE_DB_PASSWORD=SuperSecretSupabasePassw0rd' >> .env
    echo 'JWT_SECRET=AcakDanSangatRahasiaWERPX!@#' >> .env
    echo "✅ File .env berhasil dibuat."
fi

# 3. Setup Jaringan Antar-Layanan
docker network create werpx_network 2>/dev/null || true
echo "✅ Docker Network 'werpx_network' disiapkan."

# 4. Meluncurkan Seluruh Kontainer
echo "⏳ Memutar mesin WERP X (Nginx, ERPNext Core, MariaDB, Supabase, Redis)..."
docker-compose up -d

echo "============================================="
echo "  ✨ WERP X Infrastructure is now LIVE! ✨ "
echo "============================================="
echo " Akses Dashboard WERP X Core : http://localhost:8000"
echo " Akses Executive SIMAPROX    : http://localhost:3000 (Jalankan 'npm run dev' di 04_werpx_exec_mobile)"
echo " API Audit Trail Forge Engine: http://localhost:8080 (Jalankan 'cargo run' di 03_werpx_engine_rust)"
echo "============================================="
