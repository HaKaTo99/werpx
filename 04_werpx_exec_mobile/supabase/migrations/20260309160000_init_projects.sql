-- WERP X Enterprise OS
-- Migration untuk Supabase Self-Hosted SIMAPROX Executive View
-- Berjalan di Database PostgreSQL `06_werpx_infra_data/postgres_supabase`

-- 1. Tabel Utama Proyek (Push dari WERP X Core ERPNext)
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'aktif',
    budget NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Mengaktifkan Fitur Realtime Supabase
-- Memastikan tabel ini menyiarkan perubahan data ke websocket Executive React App
begin;
  -- remove the supabase_realtime publication
  drop publication if exists supabase_realtime;

  -- re-create the supabase_realtime publication with no tables
  create publication supabase_realtime;
commit;

-- Tambahkan tabel projects ke publikasi realtime
alter publication supabase_realtime add table public.projects;

-- Opsional: Data Dummy Awal
INSERT INTO public.projects (name, status, budget) 
VALUES 
    ('Pembangunan Tower Aether', 'aktif', 15000000000),
    ('Infrastruktur Antigrafity Jabar', 'aktif', 8500000000),
    ('Renovasi Gudang Cikarang', 'tertunda', 1200000000)
ON CONFLICT DO NOTHING;
