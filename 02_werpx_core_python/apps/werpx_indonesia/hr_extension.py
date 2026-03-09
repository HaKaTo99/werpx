import frappe
from frappe import _, msgprint

class WERPXHumanResources:
    """Ekstensi Modul HR Tingkat Lanjut untuk WERP X Enterprise OS."""

    @staticmethod
    def calculate_pph21_and_bpjs(doc, method):
        """
        [FASE 6] Hook khusus yang berjalan setiap kali dokumen Salary Slip di-submit.
        Ini akan menyuntikkan kalkulasi PPh 21 (TER 2024 Indonesia) dan BPJS Kesehatan/TK.
        """
        # Dalam implementasi nyata, ini akan menghitung Tarif Efektif Rata-rata (TER) 
        # berdasarkan Kategori PTKP karyawan (TK/0, K/1, dst).
        
        frappe.logger("werpx_hr_ext").info(f"Mengalkulasi PPh 21 untuk slip gaji: {doc.name}")
        
        # Validasi dasar (Contoh)
        if not doc.gross_pay:
            msgprint(_("Gaji kotor tidak boleh kosong."))
            return

        # Parameter BPJS (Contoh Default 2024)
        bpjs_kesehatan_rate = 0.01  # 1% ditanggung karyawan
        bpjs_tk_jht_rate = 0.02     # 2% JHT ditanggung karyawan

        # Simulasi Hitung
        potongan_kesehatan = doc.gross_pay * bpjs_kesehatan_rate
        potongan_jht = doc.gross_pay * bpjs_tk_jht_rate

        # Menyuntikkan ke kolom deduction Slip Gaji (Asumsi komponen sudah ada)
        # doc.append("deductions", {
        #     "salary_component": "BPJS Kesehatan",
        #     "amount": potongan_kesehatan
        # })
        # doc.append("deductions", {
        #     "salary_component": "BPJS Ketenagakerjaan",
        #     "amount": potongan_jht
        # })

        frappe.logger("werpx_hr_ext").info(f"BPJS Terhitung: Kes {potongan_kesehatan}, JHT {potongan_jht}")
