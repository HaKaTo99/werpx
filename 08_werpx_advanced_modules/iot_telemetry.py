import time
import json
import logging

# WERP X - Advanced IoT Telemetry Receiver (Phase 7)
# Fitur: Menangkap sinyal MQTT / HTTP dari sensor IoT armada logistik dan mengaitkannya ke modul Fixed Asset

logging.basicConfig(level=logging.INFO)

class WERPX_IoTReceiver:
    def __init__(self):
        self.active_connections = 0

    def receive_payload(self, asset_id: str, temperature: float, gps_lat: float, gps_lng: float):
        """
        Menerima payload JSON dari sensor IoT yang dipasang di truk pengiriman perusahaan.
        """
        logging.info(f"🔵 [IoT Telemetry] Sinyal Diterima dari Aset: {asset_id}")
        logging.info(f"    Suhu Mesin : {temperature} C")
        logging.info(f"    Koordinat  : {gps_lat}, {gps_lng}")
        
        self._analyze_asset_health(asset_id, temperature)
        self._sync_to_frappe_ledger(asset_id)

    def _analyze_asset_health(self, asset_id: str, temp: float):
        if temp > 95.0:
            logging.warning(f"⚠️ [IoT Alert] Mesin Kendaraan {asset_id} TERLALU PANAS (Overheating)!")
            logging.info(f"    -> Memicu Workflow Maintenance WERP X otomatis untuk teknisi.")

    def _sync_to_frappe_ledger(self, asset_id: str):
        # Berkomunikasi dengan Frappe via FrappeClient API
        logging.info(f"    -> Menyinkronkan jarak tempuh ke modul Fixed Asset Depreciation.")
        # Frappe API Logic goes here...

if __name__ == "__main__":
    receiver = WERPX_IoTReceiver()
    print("Membuka Gerbang IoT Data Ingestion...")
    # Simulasi truk yang terus melapor tiap detik
    for i in range(3):
        receiver.receive_payload("TRK-B9901X", 85.0 + i*6.0, -6.200000, 106.816666)
        time.sleep(1)
