-- =========================================================================
-- CUSTOM REPORT: Analisis Laba Proyek By Region
-- MENGACU PADA: TEMPLATE_CUSTOM_REPORT.md
-- =========================================================================
-- Query ini dirancang untuk diunggah sebagai format 'Report Builder' atau
-- digunakan di dalam Script Report ERPNext (Python: frappe.db.sql).
-- Fokus utama: Membandingkan Budget vs Realisasi aktual pengeluaran
-- berdasarkan Cost Center dan Status Proyek.

SELECT 
    name AS `Project:Link/Project:200`,
    project_name AS `Nama Proyek:Data:150`,
    status AS `Status:Select:100`,
    
    -- Estimasi Biaya/BoQ Costing
    estimated_costing AS `Budget (IDR):Currency:150`,
    
    -- Aktual Costing (Bisa digabung dengan Jurnal Entri terintegrasi)
    total_costing_amount AS `Realisasi (IDR):Currency:150`,
    
    -- Variance (Hitung Budget vs Aktual)
    (estimated_costing - total_costing_amount) AS `Variance:Currency:150`,
    
    -- % Margin atau Efisiensi Biaya (Mencegah Div by Zero)
    CASE 
        WHEN estimated_costing > 0 THEN ((estimated_costing - total_costing_amount) / estimated_costing) * 100 
        ELSE 0 
    END AS `Margin (%):Percent:100`

FROM 
    `tabProject`
WHERE 
    company = %(company)s 
    AND status IN ('Open', 'Completed')
    -- Filter Tanggal, opsional berdasarkan input user
    -- AND expected_start_date >= %(from_date)s
    -- AND expected_end_date <= %(to_date)s

ORDER BY 
    estimated_costing DESC;

-- =========================================================================
-- CUSTOM REPORT: Dasar Laba Rugi & Neraca WERP X (Fase 4)
-- =========================================================================
-- Kueri di bawah ini digunakan untuk men-generate ringkasan Saldo Akun.
-- Sebagai Enterprise OS, ini akan dipanggil oleh SIMAPROX Executive.

/* --- CONTOH QUERY LABA RUGI ---
SELECT 
    account_type AS `Tipe Akun:Data:150`,
    account_name AS `Nama Akun:Link/Account:200`,
    SUM(debit) - SUM(credit) AS `Saldo (IDR):Currency:150`
FROM 
    `tabGL Entry`
WHERE 
    company = %(company)s 
    AND is_cancelled = 0
    AND account_type IN ('Income', 'Expense', 'Cost of Goods Sold')
    -- AND posting_date BETWEEN %(from_date)s AND %(to_date)s
GROUP BY 
    account_name
ORDER BY 
    account_type DESC, 
    account_name;
*/
