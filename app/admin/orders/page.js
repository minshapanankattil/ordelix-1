'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('ordelix_user');
        if (!storedUser) {
            router.push('/');
            return;
        }

        const user = JSON.parse(storedUser);
        if (user.role !== 'admin' && user.status !== 'approved') {
            router.push('/pending');
            return;
        }
    }, [router]);

    const fetchOrders = async () => {
        try {
            const [ordRes, custRes, prodRes] = await Promise.all([
                fetch('/api/orders'),
                fetch('/api/discounts', { method: 'POST' }),
                fetch('/api/products')
            ]);
            const ordData = await ordRes.json();
            const custData = await custRes.json();
            const prodData = await prodRes.json();

            setOrders(ordData.orders || []);
            setCustomers(custData.customers || []);
            setProducts(prodData.products || []);
        } catch (err) {
            console.error('Failed to fetch admin data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleStatusUpdate = async (id, status) => {
        try {
            const res = await fetch('/api/orders', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status })
            });
            if (res.ok) fetchData();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '18px', color: '#636e72' }}>Loading orders...</div>;

    const getCustomerName = (id) => customers.find(c => c.id === id)?.name || 'Unknown';
    const getProductName = (id) => products.find(p => p.id === id)?.name || 'Unknown';

    const statusColors = {
        pending: { bg: '#FDE2E4', text: '#e74c3c' },
        processing: { bg: '#fffbe6', text: '#d48806' },
        shipped: { bg: '#E2ECE9', text: '#2ecc71' },
        completed: { bg: '#f1f2f6', text: '#2D3436' },
        cancelled: { bg: '#ffe5e5', text: '#c0392b' }
    };

    return (
        <div className="fade-in">
            <div style={header}>
                <div>
                    <h1 style={{ fontSize: '32px' }}>Order Management</h1>
                    <p style={{ color: '#636e72' }}>Track transactions and identify fulfillment needs.</p>
                </div>
                <div style={badgeCount}>{orders.length} TOTAL</div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={tableStyle}>
                    <thead style={tableHead}>
                        <tr>
                            <th style={thStyle}>ORDER ID</th>
                            <th style={thStyle}>PRODUCT</th>
                            <th style={thStyle}>CUSTOMER</th>
                            <th style={thStyle}>TOTAL</th>
                            <th style={thStyle}>STATUS</th>
                            <th style={thStyle}>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(o => (
                            <tr key={o.id} style={trStyle}>
                                <td style={tdStyle}>
                                    <div style={{ fontWeight: '700' }}>#{o.id.slice(0, 8)}</div>
                                    <div style={{ fontSize: '10px', color: '#b2bec3' }}>{new Date(o.createdAt).toLocaleDateString()}</div>
                                </td>
                                <td style={tdStyle}>{getProductName(o.productId)}</td>
                                <td style={tdStyle}>{getCustomerName(o.customerId)}</td>
                                <td style={tdStyle}>
                                    <div style={{ fontWeight: '800' }}>${o.finalPrice}</div>
                                    <div style={{ fontSize: '10px', color: '#636e72' }}>Qty: {o.quantity}</div>
                                </td>
                                <td style={tdStyle}>
                                    <div style={{
                                        ...statusBadge,
                                        backgroundColor: statusColors[o.status].bg,
                                        color: statusColors[o.status].text
                                    }}>
                                        {o.status.toUpperCase()}
                                    </div>
                                    {o.isPreOrder && <div style={preOrderAlert}>⚠️ PRE-ORDER</div>}
                                </td>
                                <td style={tdStyle}>
                                    <select
                                        value={o.status}
                                        onChange={(e) => handleStatusUpdate(o.id, e.target.value)}
                                        style={miniSelect}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {orders.length === 0 && <div style={{ padding: '40px', textAlign: 'center', color: '#636e72' }}>No orders placed yet.</div>}
            </div>

            <div style={reminderSection}>
                <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>Admin Action Items</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {orders.filter(o => o.status === 'pending').map(o => (
                        <div key={o.id} style={alertItem}>
                            <span>Review <strong>Order #{o.id.slice(0, 8)}</strong> for {getCustomerName(o.customerId)}</span>
                            <button onClick={() => handleStatusUpdate(o.id, 'processing')} style={btnAlert}>Approve Now</button>
                        </div>
                    ))}
                    {orders.length === 0 && <p style={{ color: '#b2bec3' }}>Clean slate! All orders are up to date.</p>}
                </div>
            </div>
        </div>
    );
}

const header = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' };

const badgeCount = {
    padding: '8px 16px',
    backgroundColor: '#2D3436',
    color: '#fff',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '800'
};

const tableStyle = { width: '100%', borderCollapse: 'collapse', textAlign: 'left' };
const tableHead = { backgroundColor: '#FAF9F6' };
const thStyle = { padding: '16px 24px', fontSize: '11px', color: '#b2bec3', letterSpacing: '1px', fontWeight: '800' };
const trStyle = { borderBottom: '1px solid #f9f9f9' };
const tdStyle = { padding: '20px 24px', fontSize: '14px' };

const statusBadge = {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '10px',
    fontWeight: '800'
};

const preOrderAlert = { fontSize: '9px', fontWeight: '800', color: '#e67e22', marginTop: '4px' };

const miniSelect = {
    padding: '6px',
    borderRadius: '4px',
    border: '1px solid #eee',
    fontSize: '12px'
};

const reminderSection = { marginTop: '40px' };

const alertItem = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    backgroundColor: '#fff',
    border: '1px solid #f0f0f0',
    borderRadius: '12px',
    fontSize: '14px'
};

const btnAlert = {
    backgroundColor: '#2D3436',
    color: '#fff',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '12px'
};
