import requests
import json
from datetime import datetime

class ERPNextConnector:
    """Konektor untuk mengirim data dari SIMAPROX ke ERPNext"""
    
    def __init__(self, base_url, api_key, api_secret):
        self.base_url = base_url.rstrip('/')
        self.headers = {
            "Authorization": f"token {api_key}:{api_secret}",
            "Content-Type": "application/json"
        }
    
    def sync_project_expense(self, project_id, amount, account_debit, account_credit, remark):
        """
        Kirim data pengeluaran proyek ke endpoint WERP X/ERPNext
        """
        payload = {
            "project_id": project_id,
            "amount": amount,
            "account_debit": account_debit,
            "account_credit": account_credit,
            "remark": remark
        }
        url = f"{self.base_url}/api/method/werpx_indonesia.api.sync_project_expense"
        response = requests.post(url, json=payload, headers=self.headers)
        try:
            return response.json()
        except Exception:
            return {"status": "error", "message": response.text}

if __name__ == "__main__":
    # Contoh penggunaan
    connector = ERPNextConnector(
        base_url="https://your-erpnext.frappe.cloud",
        api_key="your_api_key",
        api_secret="your_api_secret"
    )
    test_data = {
        'project_id': 'PRO-2025-001',
        'amount': 5000000,
        'account_debit': '5210 - Biaya Material - YC',
        'account_credit': '1110 - Kas Kecil - YC',
        'remark': 'Pembelian Semen 50 sak'
    }
    result = connector.sync_project_expense(**test_data)
    print(result)
