import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Project {
    id: string;
    name: string;
    status: string;
    budget: number;
    created_at: string;
}

function Dashboard() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [connectionStatus, setConnectionStatus] = useState<string>('Connecting...');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Ambil data dari tabel Supabase jika sudah ada real backend.
        const fetchProjects = async () => {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error(error);
                setError('Failed to fetch data from Antigrafity Cloud (Supabase). Using dummy values for demonstration.');
                setConnectionStatus('Disconnected');
            } else {
                setProjects(data || []);
                setConnectionStatus('Online - Realtime Active');
                setError(null);
            }
            setIsLoading(false);
        };

        fetchProjects();

        const subscription = supabase
            .channel('public:projects')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, payload => {
                console.log('Perubahan Data dari Antigrafity ERPNext/Rust!', payload);
                fetchProjects();
            })
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    setConnectionStatus('Online - Realtime Active');
                } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
                    setConnectionStatus('Reconnecting...');
                }
            });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    // Data Dummy Untuk Demonstrasi jika DB Kosong
    const chartData = projects.length > 0 ? projects.map(p => ({
        name: p.name,
        budget: p.budget,
    })) : [
        { name: 'PRJ-24-X1', budget: 500000000 },
        { name: 'PRJ-24-X2', budget: 300000000 },
        { name: 'PRJ-24-X3', budget: 750000000 },
        { name: 'PRJ-24-Y1', budget: 200000000 },
    ];

    return (
        <div style={{ padding: '2rem', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                    <h1 style={{ color: '#1a252f', margin: 0, fontWeight: 800 }}>WERP X Executive</h1>
                    <p style={{ color: '#34495e', marginTop: '5px', fontWeight: 500 }}>Global Enterprise Command Center (SIMAPROX)</p>
                </div>
                <div style={{ padding: '0.6rem 1.2rem', borderRadius: '30px', backgroundColor: connectionStatus.includes('Online') ? 'rgba(46, 204, 113, 0.2)' : 'rgba(231, 76, 60, 0.2)', color: connectionStatus.includes('Online') ? '#27ae60' : '#c0392b', backdropFilter: 'blur(5px)', fontWeight: 'bold', fontSize: '0.9rem', border: connectionStatus.includes('Online') ? '1px solid #2ecc71' : '1px solid #e74c3c' }}>
                    <span style={{ marginRight: '8px' }}>●</span>{connectionStatus}
                </div>
            </div>

            {error && (
                <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#fff3cd', color: '#856404', borderRadius: '12px', borderLeft: '4px solid #ffeeba', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    ⚠️ {error}
                </div>
            )}

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.25)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.5)', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)' }}>
                    <h3 style={{ margin: 0, color: '#2c3e50', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Kas & Bank</h3>
                    <p style={{ margin: '10px 0 0 0', fontSize: '2rem', fontWeight: 800, color: '#2980b9' }}>Rp 12,4 B</p>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.25)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.5)', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)' }}>
                    <h3 style={{ margin: 0, color: '#2c3e50', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Nilai Portofolio Proyek</h3>
                    <p style={{ margin: '10px 0 0 0', fontSize: '2rem', fontWeight: 800, color: '#27ae60' }}>Rp {projects.length > 0 ? (projects.reduce((acc, curr) => acc + curr.budget, 0) / 1000000000).toFixed(1) : '1.7'} B</p>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.25)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.5)', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)' }}>
                    <h3 style={{ margin: 0, color: '#2c3e50', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Proyek Aktif</h3>
                    <p style={{ margin: '10px 0 0 0', fontSize: '2rem', fontWeight: 800, color: '#f39c12' }}>{projects.length > 0 ? projects.length : 4}</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(400px, 2fr)', gap: '2rem', marginTop: '2rem' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(12px)', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)', border: '1px solid rgba(255,255,255,0.4)' }}>
                    <h2 style={{ fontSize: '1.2rem', color: '#2c3e50', borderBottom: '2px solid rgba(0,0,0,0.05)', paddingBottom: '0.8rem' }}>Daftar Proyek WERP X</h2>
                    {isLoading ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#7f8c8d' }}>Mensinkronisasi dengan Node Frappe/Rust...</div>
                    ) : (
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                            {projects.length > 0 ? projects.map(p => (
                                <li key={p.id} style={{ padding: '1rem 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                    <strong style={{ fontSize: '1.1rem', color: '#34495e' }}>{p.name}</strong> <br />
                                    <span style={{ fontSize: '0.85rem', padding: '3px 8px', borderRadius: '12px', backgroundColor: p.status === 'aktif' ? 'rgba(39, 174, 96, 0.2)' : 'rgba(231, 76, 60, 0.2)', color: p.status === 'aktif' ? '#27ae60' : '#c0392b', display: 'inline-block', marginTop: '5px' }}>
                                        {p.status.toUpperCase()}
                                    </span>
                                    <span style={{ float: 'right', fontWeight: 'bold', color: '#2c3e50', marginTop: '5px' }}>Rp {p.budget.toLocaleString('id-ID')}</span>
                                </li>
                            )) : (
                                <li style={{ color: '#7f8c8d', fontStyle: 'italic', padding: '1rem 0', lineHeight: 1.5 }}>Database Supabase siap. Silakan kirim Jurnal Entri WERP X dari Frappe Backend untuk melihat data realtime.</li>
                            )}
                        </ul>
                    )}
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(12px)', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)', border: '1px solid rgba(255,255,255,0.4)', height: '450px', display: 'flex', flexDirection: 'column' }}>
                    <h2 style={{ fontSize: '1.2rem', color: '#2c3e50', borderBottom: '2px solid rgba(0,0,0,0.05)', paddingBottom: '0.8rem', marginBottom: '1.5rem' }}>Visualisasi Alokasi Anggaran Produksi</h2>
                    <div style={{ flex: 1, minHeight: 0 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <XAxis dataKey="name" stroke="#7f8c8d" />
                                <YAxis tickFormatter={(value) => `${value / 1000000}M`} stroke="#7f8c8d" />
                                <CartesianGrid stroke="rgba(0,0,0,0.05)" vertical={false} />
                                <Line type="monotone" dataKey="budget" name="Anggaran Proyek" stroke="#8e44ad" strokeWidth={4} dot={{ r: 6, fill: '#8e44ad', strokeWidth: 2, stroke: 'white' }} activeDot={{ r: 8, fill: '#2980b9' }} />
                                <Tooltip formatter={(value: number) => `Rp ${value.toLocaleString('id-ID')}`} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
