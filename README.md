# WERP X Enterprise OS

Blueprint arsitektur, filosofi, dan dokumentasi setup ekosistem WERP X (ERPNext, Rust Engine, Supabase, BizView, dsb).

## Struktur Utama

- 01_werpx_gateway: Reverse proxy, SSL, dan audit log
- 02_werpx_core_python: ERPNext v16, modul Indonesia, custom UI
- 03_werpx_engine_rust: Engine audit trail, performa tinggi
- 04_werpx_exec_mobile: Dashboard eksekutif, Supabase, branding
- 05_werpx_bizview: Business Intelligence, reporting
- 06_werpx_infra_data: Database, cache, storage
- 07_werpx_legal_docs: Kepatuhan hukum, API docs, SOP ISO
- 08_werpx_advanced_modules: Modul AI Copilot, IoT Telemetry (Fase 7)

## Dokumentasi Masterplan Strategis
Strategi implementasi, arsitektur, dan evolusi bisnis WERP X hingga Fase 10+ didokumentasikan di sini:
- 🗺️ **[Roadmap Integrasi & Operasional (Fase 1-10+)](./simaprox_connector/ROADMAP_WERPX.md)**
- 📊 **[Rencana Induk Strategis WERP X (Fase 1-10+)](./simaprox_connector/STRATEGIC_MASTERPLAN.md)**

## Cara Memulai

1. Pastikan Docker & Docker Compose sudah terinstall
2. Copy file .env.example ke .env dan isi variabel penting
3. Jalankan: `docker-compose up -d`
4. Baca dokumentasi di masing-masing folder untuk setup detail

---

> WERP X: The Exponential Enterprise OS
