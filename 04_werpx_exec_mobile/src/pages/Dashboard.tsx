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
            const { data, err } = await supabase
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false });

            if (err) {
                console.error(err);
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
        <div style={{ padding: '2rem', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ color: '#2c3e50', margin: 0 }}>WERP X Executive</h1>
                    <p style={{ color: '#7f8c8d', marginTop: '5px' }}>SIMAPROX Real-Time Dashboard - Antigrafity Ecosystem</p>
                </div>
                <div style={{ padding: '0.5rem 1rem', borderRadius: '20px', backgroundColor: connectionStatus.includes('Online') ? '#e8f8f5' : '#fdedec', color: connectionStatus.includes('Online') ? '#1abc9c' : '#e74c3c', fontWeight: 'bold', fontSize: '0.9rem' }}>
                    ● {connectionStatus}
                </div>
            </div>

            {error && (
                <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#fff3cd', color: '#856404', borderRadius: '8px', borderLeft: '4px solid #ffeeba' }}>
                    ⚠️ {error}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(400px, 2fr)', gap: '2rem', marginTop: '2rem' }}>
                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    <h2 style={{ fontSize: '1.2rem', color: '#34495e', borderBottom: '2px solid #ecf0f1', paddingBottom: '0.5rem' }}>Portofolio Proyek (Push dari ERP)</h2>
                    {isLoading ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#bdc3c7' }}>Memuat data dari Antigrafity Cloud...</div>
                    ) : (
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                            {projects.length > 0 ? projects.map(p => (
                                <li key={p.id} style={{ padding: '0.8rem 0', borderBottom: '1px solid #f1f2f6' }}>
                                    <strong style={{ fontSize: '1.1rem' }}>{p.name}</strong> <br />
                                    <span style={{ fontSize: '0.85rem', color: p.status === 'aktif' ? '#27ae60' : '#e74c3c' }}>
                                        {p.status.toUpperCase()}
                                    </span>
                                    <span style={{ float: 'right', fontWeight: 'bold', color: '#2c3e50' }}>Rp {p.budget.toLocaleString('id-ID')}</span>
                                </li>
                            )) : (
                                <li style={{ color: '#95a5a6', fontStyle: 'italic', padding: '1rem 0' }}>Data realtime ke Supabase sedang kosong. Menampilkan data dummy di grafik. Silakan masukan Journal Entry dari WERP X Core.</li>
                            )}
                        </ul>
                    )}
                </div>
                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', height: '400px' }}>
                    <h2 style={{ fontSize: '1.2rem', color: '#34495e', borderBottom: '2px solid #ecf0f1', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Burn-down & Anggaran</h2>
                    <ResponsiveContainer width="100%" height="80%">
                        <LineChart data={chartData}>
                            <XAxis dataKey="name" />
                            <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                            <CartesianGrid stroke="#eee" />
                            <Line type="monotone" dataKey="budget" stroke="#3498db" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
                            <Tooltip formatter={(value: number) => `Rp ${value.toLocaleString('id-ID')}`} />
                            <Legend />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
