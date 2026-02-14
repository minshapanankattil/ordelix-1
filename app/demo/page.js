'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function InteractiveDemo() {
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [selectedCustomerId, setSelectedCustomerId] = useState('');
    const [healthData, setHealthData] = useState(null);
    const [pricing, setPricing] = useState(null);
    const [discount, setDiscount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const refreshAll = async () => {
        try {
            const [prodRes, custRes, healthRes] = await Promise.all([
                fetch('/api/products'),
                fetch('/api/discounts', { method: 'POST' }),
                fetch('/api/analytics')
            ]);
            const prodData = await prodRes.json();
            const custData = await custRes.json();
            const healthData = await healthRes.json();

            setProducts(prodData.products || []);
            setCustomers(custData.customers || []);
            setHealthData(healthData);

            if (prodData.products?.length > 0 && !selectedProductId) setSelectedProductId(prodData.products[0].id);
            if (custData.customers?.length > 0 && !selectedCustomerId) setSelectedCustomerId(custData.customers[0].id);
        } catch (err) {
            console.error('Failed to load demo data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshAll();
    }, []);

    // Update strategy when selection changes
    useEffect(() => {
        const fetchStrategy = async () => {
            if (!selectedProductId || !selectedCustomerId) return;
            try {
                const [pRes, dRes] = await Promise.all([
                    fetch(`/api/pricing?productId=${selectedProductId}`),
                    fetch(`/api/discounts?productId=${selectedProductId}&customerId=${selectedCustomerId}`)
                ]);
                const pData = await pRes.json();
                const dData = await dRes.json();
                setPricing(pData.recommendations);
                setDiscount(dData.recommendations);
            } catch (err) {
                console.error('Failed to fetch strategy');
            }
        };
        fetchStrategy();
    }, [selectedProductId, selectedCustomerId]);

    const confirmOrder = async () => {
        if (!selectedProductId || !selectedCustomerId || !pricing || !discount) return;
        setActionLoading(true);
        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: selectedProductId,
                    customerId: selectedCustomerId,
                    quantity: 1,
                    priceType: 'recommended',
                    originalPrice: discount.originalPrice,
                    discount: discount.discountPercentage,
                    finalPrice: discount.optimizedPrice
                })
            });
            if (res.ok) {
                // Success! Now refresh health data in real-time
                const healthRes = await fetch('/api/analytics');
                const newHealth = await healthRes.json();
                setHealthData(newHealth);
                alert('🎉 Order placed! Notice how your Business Health metrics updated below.');
            }
        } catch (err) {
            alert('Order failed');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Initializing Demo...</div>;

    return (
        <div style={{ padding: '40px', maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h1 style={{ margin: 0 }}>Interactive Experience Demo</h1>
                    <p style={{ color: '#666', marginTop: '5px' }}>See AI Pricing, Discounts, and Real-time Analytics in action.</p>
                </div>
                <Link href="/" style={btnSecondary}>← Back Home</Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>

                {/* Step 1: Integrated Checkout Card */}
                <div style={sectionCard}>
                    <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>1. Configure a Sample Gift Order</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
                        <div>
                            <label style={labelStyle}>Select Product:</label>
                            <select value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)} style={selectStyle}>
                                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                {products.length === 0 && <option>No Products Available</option>}
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Select Customer Profile:</label>
                            <select value={selectedCustomerId} onChange={(e) => setSelectedCustomerId(e.target.value)} style={selectStyle}>
                                {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.loyaltyLevel})</option>)}
                            </select>
                        </div>
                    </div>

                    {pricing && discount ? (
                        <div style={strategyPanel}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>AI Recommended Strategy</div>
                                    <div style={{ fontSize: '28px', fontWeight: 'bold', margin: '5px 0' }}>${discount.optimizedPrice}</div>
                                    <div style={{ fontSize: '13px', color: '#27ae60', fontWeight: 'bold' }}>
                                        Applied {discount.discountPercentage}% Discount
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '12px', color: '#666' }}>Profit Margin</div>
                                    <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{discount.marginAfterDiscount}</div>
                                </div>
                            </div>
                            <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #d4e3ff' }}>
                                <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#3f51b5' }}>Logic Breakdown:</div>
                                <ul style={{ margin: '5px 0', fontSize: '12px', color: '#555' }}>
                                    {discount.reasons.map((r, i) => <li key={i}>{r}</li>)}
                                </ul>
                                {discount.alternatives.length > 0 && (
                                    <div style={{ fontSize: '11px', color: '#e67e22', display: 'flex', gap: '5px', marginTop: '5px' }}>
                                        <strong>Gift Suggestion:</strong> {discount.alternatives.join(', ')}
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={confirmOrder}
                                disabled={actionLoading}
                                style={{ ...btnPrimary, marginTop: '20px', width: '100%', opacity: actionLoading ? 0.7 : 1 }}
                            >
                                {actionLoading ? 'Processing...' : 'Place Order & Update Health Score'}
                            </button>
                        </div>
                    ) : (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>Loading AI Strategies...</div>
                    )}
                </div>

                {/* Step 2: Real-time Health Snapshot */}
                {healthData && (
                    <div style={{ ...sectionCard, backgroundColor: '#f4f7ff' }}>
                        <h2 style={{ borderBottom: '1px solid #d0daff', paddingBottom: '10px' }}>2. Real-time Impact</h2>
                        <div style={{ textAlign: 'center', padding: '20px 0' }}>
                            <div style={{ fontSize: '14px', color: '#666' }}>Current Business Health Score</div>
                            <div style={{ fontSize: '64px', fontWeight: 'bold', color: '#3f51b5' }}>{healthData.score}</div>
                            <div style={{ fontSize: '12px', color: '#3f51b5', fontWeight: 'bold' }}>Live Data Aggregated</div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '10px' }}>
                            <div style={smallMetric}>
                                <div style={{ fontSize: '11px', color: '#666' }}>Total Profit</div>
                                <div style={{ fontSize: '16px', fontWeight: 'bold' }}>${healthData.metrics.profit}</div>
                            </div>
                            <div style={smallMetric}>
                                <div style={{ fontSize: '11px', color: '#666' }}>Avg. Margin</div>
                                <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{healthData.metrics.avgMarginPct}%</div>
                            </div>
                            <div style={smallMetric}>
                                <div style={{ fontSize: '11px', color: '#666' }}>Total Orders</div>
                                <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{healthData.metrics.orderCount}</div>
                            </div>
                            <div style={smallMetric}>
                                <div style={{ fontSize: '11px', color: '#666' }}>Low Stock</div>
                                <div style={{ fontSize: '16px', fontWeight: 'bold', color: healthData.metrics.lowStockCount > 0 ? '#e74c3c' : '#2ecc71' }}>
                                    {healthData.metrics.lowStockCount} items
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '20px' }}>
                            <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>Active AI Suggestion:</div>
                            <div style={{ fontSize: '12px', padding: '10px', backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #d0daff' }}>
                                {healthData.suggestions[0]?.text || 'Everything is running smoothly!'}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div style={{ marginTop: '30px', padding: '20px', border: '1px dashed #ccc', borderRadius: '8px', textAlign: 'center', backgroundColor: '#fafafa' }}>
                <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                    <strong>Demo Tip:</strong> To see the "Pre-order" system trigger in the dashboard, place multiple orders until a material's stock runs out.
                </p>
            </div>
        </div>
    );
}

const sectionCard = {
    padding: '24px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
};

const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: 'bold',
    marginBottom: '8px',
    color: '#333'
};

const selectStyle = {
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px'
};

const strategyPanel = {
    marginTop: '30px',
    padding: '20px',
    backgroundColor: '#f8faff',
    borderRadius: '8px',
    border: '1px solid #e1e9ff'
};

const smallMetric = {
    padding: '12px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    border: '1px solid #eee',
    textAlign: 'center'
};

const btnPrimary = {
    padding: '14px 20px',
    backgroundColor: '#000',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold'
};

const btnSecondary = {
    padding: '10px 20px',
    backgroundColor: '#fff',
    color: '#000',
    border: '1px solid #000',
    borderRadius: '4px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 'bold'
};
