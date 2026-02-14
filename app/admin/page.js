'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// --- Icons & Constants ---
const Icons = {
    Dashboard: '📊', Users: '👤', Businesses: '🏢', Products: '📦',
    Orders: '💰', Settings: '⚙️', Logout: '🚪', Check: '✅', Cross: '❌'
};

export default function AdminSuite() {
    const router = useRouter();
    const [activeModule, setActiveModule] = useState('overview');
    const [stats, setStats] = useState({ totalUsers: 0, pendingUsers: 0, approvedUsers: 0, totalProducts: 0, totalRevenue: 0 });
    const [users, setUsers] = useState([]);
    const [logs, setLogs] = useState([]);
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        const user = localStorage.getItem('ordelix_user');
        if (!user || JSON.parse(user).role !== 'admin') { router.push('/'); return; }
        loadData();
    }, [router]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [s, u, l, st] = await Promise.all([
                fetch('/api/admin/stats').then(r => r.json()),
                fetch('/api/admin/users').then(r => r.json()),
                fetch('/api/admin/logs').then(r => r.json()),
                fetch('/api/admin/settings').then(r => r.json())
            ]);
            if (s.success) setStats(s.stats);
            if (u.success) setUsers(u.users);
            if (l.success) setLogs(l.logs);
            if (st.success) setSettings(st.settings);
        } catch (e) { addToast('Error syncing data', 'error'); }
        finally { setLoading(false); }
    };

    const addToast = (msg, type = 'success') => {
        const id = Date.now();
        setToasts(p => [...p, { id, msg, type }]);
        setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
    };

    const handleAction = async (userId, status) => {
        if (!confirm(`Confirm ${status}?`)) return;
        const res = await fetch('/api/admin/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, status })
        });
        const data = await res.json();
        if (data.success) {
            setUsers(users.map(u => u.id === userId ? { ...u, status } : u));
            addToast(`Account ${status}`);
            loadData();
        }
    };

    const ModuleShell = ({ children, title }) => (
        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <div style={headerRow}>
                <h2>{title}</h2>
                <div style={searchBox}>
                    <input
                        style={searchInput}
                        placeholder="Search registry..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            {children}
        </div>
    );

    return (
        <div style={layout}>
            {/* Sidebar */}
            <aside style={sidebar}>
                <div style={sideHeader}><h3>ORDELIX ADMIN</h3></div>
                <nav style={sideNav}>
                    {['overview', 'approals', 'businesses', 'products', 'settings'].map(m => (
                        <div key={m} onClick={() => setActiveModule(m)} style={{
                            ...navItem,
                            background: activeModule === m ? '#F9F1EB' : 'transparent',
                            color: activeModule === m ? 'black' : '#777'
                        }}>
                            {m.toUpperCase()}
                        </div>
                    ))}
                    <div onClick={() => { localStorage.removeItem('ordelix_user'); router.push('/'); }} style={{ ...navItem, color: 'red', marginTop: 'auto' }}>LOGOUT</div>
                </nav>
            </aside>

            {/* Main Area */}
            <main style={mainArea}>
                {loading ? <div style={loader}>Synchronizing...</div> : (
                    <div style={content}>
                        {activeModule === 'overview' && (
                            <div style={statsGrid}>
                                <div style={statsCard}><h4>Users</h4><p>{stats.totalUsers}</p></div>
                                <div style={statsCard}><h4>Pending</h4><p>{stats.pendingUsers}</p></div>
                                <div style={statsCard}><h4>Products</h4><p>{stats.totalProducts}</p></div>
                                <div style={statsCard}><h4>Revenue</h4><p>₹{stats.totalRevenue}</p></div>
                            </div>
                        )}
                        {(activeModule === 'approals' || activeModule === 'businesses') && (
                            <ModuleShell title={activeModule === 'approals' ? 'New Applications' : 'Business Archive'}>
                                <div style={table}>
                                    {users.filter(u => activeModule === 'approals' ? u.status === 'pending' : u.status !== 'pending').map(u => (
                                        <div key={u.id} style={row}>
                                            <div style={{ flex: 1 }}><b>{u.businessName}</b><br /><small>{u.email}</small></div>
                                            <div style={{ flex: 1 }}>{u.ownerName}</div>
                                            <div style={{ ...statusPill, background: u.status === 'approved' ? '#E1F5FE' : '#FFEBEE' }}>{u.status}</div>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                {u.status === 'pending' && <button onClick={() => handleAction(u.id, 'approved')} style={actionBtn}>Approve</button>}
                                                <button onClick={() => handleAction(u.id, u.status === 'pending' ? 'rejected' : 'pending')} style={actionBtn}>
                                                    {u.status === 'pending' ? 'Reject' : 'Reset'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ModuleShell>
                        )}
                        {activeModule === 'settings' && (
                            <div style={statsCard}>
                                <h3>Platform Banner</h3>
                                <input style={searchInput} value={settings.bannerText} onChange={e => setSettings({ ...settings, bannerText: e.target.value })} />
                                <button style={actionBtn} onClick={async () => {
                                    await fetch('/api/admin/settings', { method: 'POST', body: JSON.stringify(settings) });
                                    addToast('Settings updated');
                                }}>Save</button>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Toasts */}
            <div style={toastStack}>
                {toasts.map(t => <div key={t.id} style={toast}>{t.msg}</div>)}
            </div>
        </div>
    );
}

// Styles
const layout = { display: 'flex', minHeight: '100vh', background: '#FFFDF9', fontFamily: 'sans-serif' };
const sidebar = { width: '250px', background: '#FFF', borderRight: '1px solid #EEE', display: 'flex', flexDirection: 'column' };
const sideHeader = { padding: '40px 20px', textAlign: 'center' };
const sideNav = { flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' };
const navItem = { padding: '15px 25px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' };
const mainArea = { flex: 1, padding: '50px' };
const content = { maxWidth: '1000px', margin: '0 auto' };
const statsGrid = { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' };
const statsCard = { background: '#FFF', padding: '30px', borderRadius: '20px', border: '1px solid #EEE', textAlign: 'center' };
const row = { display: 'flex', alignItems: 'center', padding: '20px', background: '#FFF', borderRadius: '15px', marginBottom: '10px', border: '1px solid #EEE' };
const statusPill = { padding: '5px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' };
const actionBtn = { padding: '8px 15px', borderRadius: '8px', border: '1px solid #DDD', cursor: 'pointer', background: '#FFF' };
const toastStack = { position: 'fixed', bottom: '20px', right: '20px' };
const toast = { padding: '15px 25px', background: '#333', color: '#FFF', borderRadius: '10px', marginBottom: '10px' };
const searchInput = { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #DDD', marginBottom: '20px' };
const loader = { textAlign: 'center', padding: '100px', opacity: 0.5 };
const headerRow = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' };
const searchBox = { width: '300px' };
const table = { display: 'flex', flexDirection: 'column' };
