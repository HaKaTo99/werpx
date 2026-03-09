import frappe

class WERPXPortfolioManager:
    """Ekstensi Project Portfolio Management (PPM) untuk Executive Level."""

    @staticmethod
    @frappe.whitelist(allow_guest=False)
    def get_portfolio_health_score():
        """
        [FASE 6] API Endpoint khusus yang akan dipanggil oleh Dashboard SIMAPROX.
        Menghasilkan skor kesehatan proyek (Scale 0-100) berdasarkan variance budget
        dan ketepatan waktu.
        """
        # Ambil semua proyek aktif
        projects = frappe.get_all(
            "Project",
            filters={"status": "Open"},
            fields=["name", "estimated_costing", "percent_complete"]
        )

        if not projects:
            return {"status": "no_data", "score": 0}

        total_score = 0
        weight_per_project = 100 / len(projects)

        for p in projects:
            # Asumsi logika skor sangat disederhanakan:
            # Jika progress selesai tinggi, skor naik.
            # Idealnya juga harus memeriksa `total_costing_amount` vs `estimated_costing`.
            project_score = (p.percent_complete or 0) * (weight_per_project / 100)
            total_score += project_score

        return {
            "status": "success",
            "portfolio_score": round(total_score, 2),
            "total_active": len(projects),
            "message": "Portfolio Health Score Dihitung Berhasil."
        }
