app_name = "werpx_indonesia"
app_title = "WERP X Indonesia"
app_publisher = "Antigrafity"
app_description = "Modul lokalisasi, workflow, dan persetujuan khusus wilayah Indonesia untuk WERP X Enterprise OS."
app_email = "support@werpx.id"
app_license = "mit"

# Hooks Setup
# ------------------
# Skrip yang dijalankan secara otomatis setelah app WERP X ini terinstall.
after_install = "werpx_indonesia.setup_master.after_install"

# Hooking UI Assets
# ------------------
# Menginjeksi CSS Glassmorphism ke seluruh antarmuka admin WERP X
app_include_css = "/assets/werpx_indonesia/css/werpx_glass_workspace.css"

# CRON Scheduler (Fase 3)
# ------------------
scheduler_events = {
    "daily": [
        "werpx_indonesia.scheduler.daily_audit_reconciliation"
    ],
    "hourly": [
        "werpx_indonesia.scheduler.hourly_leave_processor"
    ]
}

# Fixtures
# ------------------
# Frappe akan secara otomatis me-load data (JSON) dari direktori `fixtures/`
# saat perintah `bench migrate` atau `bench install` dijalankan.
fixtures = [
    {"dt": "Role"},
    {"dt": "Workflow"},
    {"dt": "Workflow State"},
    {"dt": "Workflow Transition"},
    {"dt": "Notification"}
]

# Document Events (Hooks Custom Script Ekstensi HR/PPM Fase 6)
# ------------------
doc_events = {
    "Salary Slip": {
        "on_submit": "werpx_indonesia.hr_extension.WERPXHumanResources.calculate_pph21_and_bpjs"
    }
}
