# WERP X Advanced Modules (Fase 7)

Direktori ini (`08_werpx_advanced_modules`) mengisolasi fitur eksperimental tingkat tinggi (Advanced) agar fondasi ERP Frappe di `02_werpx_core_python` tetap 100% steril dan aman dari `Crash`. Fitur-fitur ini merupakan implementasi nyata dari [Strategic Masterplan Fase 7](../simaprox_connector/STRATEGIC_MASTERPLAN.md).

## Arsitektur Pilar Lanjutan (Fase 7)
1. **`ai_copilot.py`**: Ujung tombak Frappe yang bertugas sebagai _Machine Learning Inference_. Jika di-_deploy_, ganti `DEMO_KEY` dengan kunci lisensi LLM (OpenAI API / Claude) Anda. Berfungsi untuk merangkum dan membuat draf kategori COA secara prediktif.
2. **`iot_telemetry.py`**: Jembatan Komunikasi (M2M) antara perangkat nirkabel (Internet of Things) dengan *Backend Ledger*. Skrip ini memotong proses input depresiasi *(Asset Management)* manual.
3. **`Hyper-Modern BI (React)`**: Diimplementasikan pada repositori `/04_werpx_exec_mobile`.
4. **`Blockchain Ledger`**: Diimplementasikan pada jantung `Rust Forge`.

> **PERINGATAN SIS-ADMIN:** Jangan mencampurkan berkas di folder ini langsung ke folder `frappe-bench` tanpa pengikatan *Docker Container* yang jelas!
