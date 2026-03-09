import frappe
from frappe.custom.doctype.custom_field.custom_field import create_custom_fields

def after_install():
    """Hook function yang dijalankan setelah aplikasi werpx_indonesia di-install."""
    frappe.logger("werpx_indonesia").info("Memulai instalasi Master Data WERP X Indonesia...")
    
    setup_company_defaults()
    create_custom_role_profiles()
    setup_inventory_and_crm()
    setup_hr_leave_types()
    
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

    frappe.db.set_default("currency", "IDR")
    frappe.db.set_default("language", "id")

def setup_inventory_and_crm():
    """Setup Hierarki Warehouse dan CRM Territory Dasar (Fase 1)."""
    # 1. Pastikan Territory Utama Indonesia Ada
    if not frappe.db.exists("Territory", "Indonesia"):
        frappe.get_doc({
            "doctype": "Territory",
            "territory_name": "Indonesia",
            "is_group": 1,
            "parent_territory": "All Territories"
        }).insert(ignore_permissions=True)
    
    # 2. Setup Warehouse Group Dasar (Pusat & Proyek) jika Perusahaan Pertama sudah ada
    # Asumsi: Perusahaan default WERP X ditarik (atau system fallback ke setup user)

def setup_hr_leave_types():
    """Master Data Tipe Cuti Karyawan (Fase 1 HR)."""
    leave_types = [
        {"leave_type_name": "Cuti Tahunan", "is_lwp": 0, "max_leaves_allowed": 12},
        {"leave_type_name": "Cuti Sakit", "is_lwp": 0, "max_leaves_allowed": 14},
        {"leave_type_name": "Cuti Tanpa Tanggungan (Unpaid)", "is_lwp": 1, "max_leaves_allowed": 30}
    ]
    
    for lt in leave_types:
        if not frappe.db.exists("Leave Type", lt["leave_type_name"]):
            frappe.get_doc({
                "doctype": "Leave Type",
                "leave_type_name": lt["leave_type_name"],
                "is_lwp": lt["is_lwp"],
                "max_leaves_allowed": lt["max_leaves_allowed"]
            }).insert(ignore_permissions=True)

def create_custom_role_profiles():
    """Memastikan Custom Role dari Fase 5 dibuat jika Fixtures gagal."""
    roles = ["WERPX CEO", "WERPX Project Manager", "WERPX Finance Staff"]
    for role in roles:
        if not frappe.db.exists("Role", role):
            frappe.get_doc({
                "doctype": "Role",
                "role_name": role,
                "desk_access": 1
            }).insert(ignore_permissions=True)
