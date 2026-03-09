# 🚀 Roadmap Implementasi WERP X (Setara Oracle EBS/NAV)

## Komparasi Strategis: WERP X vs Raksasa ERP
Berikut adalah perbandingan arsitektur *Hybrid* (Frappe + Rust + React) WERP X dengan Oracle EBS dan Microsoft Dynamics NAV.

| Area | Oracle EBS | Microsoft Dynamics NAV | WERP X (Enterprise OS) |
|------|------------|------------------------|-------------------------|
| **Finance & Accounting** | General Ledger (GL), Accounts Payable (AP), Accounts Receivable (AR), Cash Management (CM), Fixed Assets (FA) | General Ledger, AP, AR, Fixed Assets, Cash Management | **GL, AP, AR, FA, Cash** didukung *Frappe Core* + **Immutable Ledger** dari **Rust Forge Engine** (keamanan antifraud sekelas Enterprise). |
| **Human Resources & Payroll** | HR Core, Payroll, Talent Management | Tidak selengkap EBS, hanya fungsi dasar (lebih fokus ke keuangan & operasi) | **Frappe HR** terintegrasi penuh. Siap dikustomisasi untuk kepatuhan **Pajak Indonesia (PPh 21) & BPJS** secara *native*. |
| **Supply Chain & Operations** | Purchasing, Inventory, Order Management (OM), Procurement, Production | Inventory, Purchasing, Sales & Order Management, Warehouse Management | **Inventory & Procurement** terpusat, dengan dukungan persetujuan multi-level (Workflow RBAC) dan notifikasi *real-time*. |
| **Manufacturing** | Production, Work in Process, BOM, Capacity Planning | Production planning, capacity management, Bill of Materials (BOM) | **ERPNext Manufacturing Module** dengan fitur *Multi-level BOM*, *Job Cards*, dan *Capacity Planning* interaktif. |
| **Customer Relationship Management (CRM)** | Sales, Marketing, Service modules | Basic CRM: customer/vendor tracking, sales pipeline, service management | **Frappe CRM** terpasang secara *native* dengan manajemen *Pipeline* penjualan, penawaran harga, hingga portal B2B mandiri. |
| **Project Management** | Project Costing, Project Billing, Project Contracts | Job costing, resource management, project tracking | **Project Costing & Resource Management** dengan visibilitas data langsung didorong via *WebSockets* ke **SIMAPROX Executive Dashboard (React)**. |
| **Technology Foundation** | Built on Oracle Database, integrasi kuat dengan ekosistem Oracle, mendukung on-premises & hybrid cloud | Built on Microsoft SQL Server, integrasi dengan Office 365, Power BI, ekosistem Microsoft | **Hybrid Powerhouse**: Python (Frappe/MariaDB) untuk logika bisnis cepat + Rust (PostgreSQL) untuk inti keamanan tinggi + React (SPA/Supabase). Fokus teguh pada **Data Sovereignty**. |
| **Deployment & Status** | Versi terbaru 12.2.15 (2025), support hingga 2036 | NAV sudah digantikan oleh Dynamics 365 Business Central (cloud-first ERP) | **Modern Dockerized Microservices**. 100% *Open Source*, bebas hambatan *Vendor Lock-in*, dan antarmuka *Mobile-First/Glassmorphism* kekinian. |

---


## Fase 1: Aktivasi & Setup Modul Inti
- [x] Setup Akuntansi (GL, AP, AR, Cash, Fixed Asset) - *Via setup_master.py*
- [x] Setup Multi-company, multi-currency - *Via setup_master.py*
- [x] Setup Inventory & Purchasing - *Warehouse Group via setup_master.py*
- [x] Setup Sales & CRM - *Territory Induk via setup_master.py*
- [x] Setup Project Management - *Project Dashboard*
- [x] Setup Manufacturing - *BOM Master Data Ready*
- [x] Setup HR & Payroll (basic) - *Leave Type via setup_master.py*

## Fase 2: Kustomisasi Workflow & Approval
- [x] Konfigurasi Approval PO (Purchase Order) - *Via fixtures JSON*
- [x] Konfigurasi Approval Pengeluaran (Expense Claim) - *Dirancang di setup_master.py*
- [x] Konfigurasi Approval SO (Sales Order) - *Via workflows_so.json*
- [x] Konfigurasi Approval Cuti - *Via workflows_leave.json*
- [x] Setup Notifikasi otomatis (email, in-app) - *Via notifications.json*

## Fase 3: Integrasi & Otomatisasi
- [x] Integrasi SIMAPROX (Dashboard Executive)
- [x] Pembuatan API untuk sistem eksternal (Payroll provider, Power BI, e-Faktur)
- [x] Setup Otomatisasi posting jurnal, penjadwalan (Scheduler), dan Webhooks - *Via scheduler.py & hooks.py CRON*

## Fase 4: Pelaporan & Dashboard
- [x] Desain Laporan Operasional (Inventory, Proyek, Produksi) - *Laporan Laba Proyek Core*
- [x] Desain Laporan Keuangan (Neraca, Laba Rugi, AR/AP Aging, Cashflow) - *Format Dasar Base Query Selesai*
- [x] Kustomisasi Dashboard Eksekutif (Custom KPI, Chart Recharts) - *Antusiasme Glassmorphism React & Supabase*

## Fase 5: Kustomisasi UI/UX
- [x] Mapping Permission & Role (RBAC) - *WERPX CEO, dsb via custom_roles.json*
- [x] Kustomisasi Menu dan Tema (Glassmorphism siap) - *CSS Modifikasi Global Frappe Selesai*
- [x] Penyiapan User Training & Dokumentasi Penggunaan - *Via user_training_manual.md*

## Fase 6: Ekstensi Fitur
- [x] Pengembangan Custom Module untuk HR tingkat lanjut - *Kalkulasi PPh21 & BPJS di hr_extension.py*
- [x] Pengembangan Project Portfolio Management - *API Ekstensi di ppm_extension.py*
- [x] Penyesuaian Compliance & Audit Trail (Integrasi Forge Engine Rust) - *Robust Error Handling Diterapkan*
