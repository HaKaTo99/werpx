import frappe
from frappe.custom.doctype.custom_field.custom_field import create_custom_fields

def after_install():
    """Hook function yang dijalankan setelah aplikasi werpx_indonesia di-install."""
    frappe.logger("werpx_indonesia").info("Memulai instalasi Master Data WERP X Indonesia...")
    
    setup_company_defaults()
    create_custom_role_profiles()
    
    frappe.logger("werpx_indonesia").info("Instalasi Master Data WERP X Selesai.")

def setup_company_defaults():
    """Setup standar perusahaan saat pertama kali install (Fase 1)."""
    # Pastikan mata uang IDR tersedia
    if not frappe.db.exists("Currency", "IDR"):
        frappe.get_doc({
            "doctype": "Currency",
            "currency_name": "IDR",
            "symbol": "Rp",
            "fraction": "Sen",
            "fraction_units": 100
        }).insert(ignore_permissions=True)

    # Contoh setup standar: jika belum ada perusahaan, beri notifikasi
    # Biasanya perusahaan di-set lewat wizard awal, namun kita bisa menambahkan 
    # field default ke sistem.
    frappe.db.set_default("currency", "IDR")
    frappe.db.set_default("language", "id")

def create_custom_role_profiles():
    """Memastikan Custom Role dari Fase 5 dibuat jika Fixtures gagal."""
    roles = ["WERPX CEO", "WERPX Project Manager", "WERPX Finance Staff"]
    for role in roles:
        if not frappe.db.exists("Role", role):
            frappe.get_doc({
                "doctype": "Role",
                "role_name": role,
                "desk": 1
            }).insert(ignore_permissions=True)
