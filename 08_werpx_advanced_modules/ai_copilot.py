import requests
import json
import logging

# WERP X - Advanced AI Copilot Module (Phase 7)
# Fitur: Mengambil deskripsi mentah (misal: nota bon) dan menerjemahkannya ke dalam kategori COA via LLM

logging.basicConfig(level=logging.INFO)

class WERPX_AICopilot:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.endpoint = "https://api.openai.com/v1/chat/completions"
        self.model = "gpt-4"

    def categorize_expense(self, raw_description: str) -> str:
        """
        AI akan membaca raw_description (contoh: 'Beli semen 10 sak untuk Gudang BDC')
        dan mengembalikannya sebagai JSON kategori akuntansi WERP X.
        """
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        prompt = f"""
        Anda adalah WERP X AI Copilot, seorang Asisten Akuntan Ahli.
        Saya memiliki deskripsi pengeluaran/bon: "{raw_description}"
        Tentukan kategori Chart of Account (COA) yang paling tepat dari daftar ini: 
        [Material Cost, Travel Expense, Office Supplies, IT Infrastructure, Marketing].
        Kembalikan hanya nama COA-nya tanpa basa-basi.
        """
        
        payload = {
            "model": self.model,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.3
        }
        
        try:
            logging.info(f"[AI Copilot] Memproses analisis deskripsi...")
            # Simulasi pengiriman jika tanpa API key asli
            if self.api_key == "DEMO_KEY":
                return "Material Cost" # Mock Return 
                
            response = requests.post(self.endpoint, headers=headers, json=payload)
            response.raise_for_status()
            ai_reply = response.json()
            coa_category = ai_reply['choices'][0]['message']['content'].strip()
            return coa_category
            
        except Exception as e:
            logging.error(f"[AI Copilot] Gagal menghubungi LLM: {str(e)}")
            return "Uncategorized Expense"

if __name__ == "__main__":
    copilot = WERPX_AICopilot("DEMO_KEY")
    result = copilot.categorize_expense("Pembelian Baja H-Beam 5 Ton dari Krakatau Steel")
    print(f"Hasil Analisis AI: {result}")
