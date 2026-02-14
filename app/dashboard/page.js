'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function BusinessHealthDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewMore, setViewMore] = useState(false);
    const router = useRouter();

    const fetchHealth = async () => {
        try {
            const res = await fetch('/api/analytics');
            const json = await res.json();
            setData(json);
        } catch (err) {
            console.error('Failed to fetch health analytics');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('ordelix_user');
        if (!storedUser) {
            router.push('/');
            return;
        }

        const user = JSON.parse(storedUser);
        // Removed status check to allow immediate access
    }, [router]);

    useEffect(() => {
        fetchHealth();
    }, []);

    if (loading) return <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '18px', color: '#636e72' }}>Analyzing your growth...</div>;
    if (!data) return <div style={{ textAlign: 'center', marginTop: '100px' }}>Error loading insights.</div>;

    const scoreColor = data.score >= 80 ? '#2ecc71' : data.score >= 60 ? '#f1c40f' : '#e74c3c';

    return (
        <div className="fade-in">
            <div className="flex-between mb-40">
                <div>
                    <h1 style={{ fontSize: '32px' }}>Business Intelligence</h1>
                    <p style={{ color: '#636e72' }}>Strategic overview of your handmade gift brand.</p>
                </div>
                <button onClick={fetchHealth} style={btnRefresh}>↻ Sync Records</button>
            </div>

            <div style={topGrid}>
                {/* Animated Health Gauge */}
                <div className="card" style={healthCard}>
                    <h3 style={cardTitle}>Premium Health Score</h3>
                    <div style={gaugeWrapper}>
                        <svg width="180" height="180" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="#f0f0f0" strokeWidth="8" />
                            <circle
                                cx="50" cy="50" r="45"
                                fill="none"
                                stroke={scoreColor}
                                strokeWidth="8"
                                strokeDasharray={`${data.score * 2.83} 283`}
                                strokeLinecap="round"
                                transform="rotate(-90 50 50)"
                                style={{ transition: 'stroke-dasharray 1.5s ease-out' }}
                            />
                            <text x="50" y="55" fontSize="24" fontWeight="800" textAnchor="middle" fill="#2D3436">{data.score}</text>
                            <text x="50" y="70" fontSize="6" fontWeight="700" textAnchor="middle" fill="#b2bec3">PEARL SCORE</text>
                        </svg>
                    </div>
                    <p style={{ fontSize: '13px', color: '#636e72', marginTop: '15px', lineHeight: '1.5' }}>
                        {data.score >= 80 ? 'Your business is in the top 5% of handmade brands on our platform.' : 'A few tweaks to your stock levels could boost your performance.'}
                    </p>
                </div>

                {/* Revenue Performance Chart (CSS Based) */}
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h3 style={cardTitle}>Revenue Strength</h3>
                        <span style={{ fontSize: '11px', color: '#2ecc71', fontWeight: '800' }}>TRENDING UP</span>
                    </div>
                    <div className="chart-container">
                        {[40, 65, 80, 55, 90, 75, 100].map((h, i) => (
                            <div key={i} className="chart-bar" style={{ height: `${h}%` }}>
                                <div style={barTooltip}>Day {i + 1}</div>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '10px', color: '#b2bec3', fontWeight: '700' }}>
                        <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
                    </div>
                </div>
            </div>

            <div style={metricsGrid}>
                <div className="card" style={metricItem}>
                    <div style={mIcon}>💰</div>
                    <div style={mLabel}>Est. Profit</div>
                    <div style={mValue}>${data.metrics.profit}</div>
                    {viewMore && <div style={mExtra}>Gross Revenue: ${data.metrics.revenue}</div>}
                </div>
                <div className="card" style={metricItem}>
                    <div style={mIcon}>📈</div>
                    <div style={mLabel}>Avg. Margin</div>
                    <div style={mValue}>{data.metrics.avgMarginPct}%</div>
                    {viewMore && <div style={mExtra}>Target: 45%</div>}
                </div>
                <div className="card" style={metricItem}>
                    <div style={mIcon}>📦</div>
                    <div style={mLabel}>Inventory Load</div>
                    <div style={{ ...mValue, color: data.metrics.lowStockCount > 3 ? '#e74c3c' : '#2D3436' }}>{data.metrics.lowStockCount} Flags</div>
                    {viewMore && <div style={mExtra}>{data.metrics.preOrderCount} Pending Pre-orders</div>}
                </div>
                <div className="card" style={metricItem}>
                    <div style={mIcon}>🤝</div>
                    <div style={mLabel}>Retention</div>
                    <div style={mValue}>{data.metrics.loyaltyRatePct}%</div>
                    {viewMore && <div style={mExtra}>Repeat Customer Gain: +12%</div>}
                </div>
            </div>

            <div style={{ textAlign: 'center', margin: '20px 0' }}>
                <button onClick={() => setViewMore(!viewMore)} style={btnViewMore}>
                    {viewMore ? 'Show Less ▴' : 'View Detailed Metrics ▾'}
                </button>
            </div>

            <div style={bottomGrid}>
                <div className="card" style={{ flex: 1.5 }}>
                    <h3 style={cardTitle}>Product Popularity</h3>
                    <div style={{ marginTop: '20px' }}>
                        {data.topProducts.map((p, i) => (
                            <div key={i} style={pRow}>
                                <div style={pInfo}>
                                    <div style={pRank}>{i + 1}</div>
                                    <span style={{ fontWeight: '500' }}>{p.name}</span>
                                </div>
                                <div style={pProgressWrapper}>
                                    <div style={{ ...pProgressBar, width: `${(p.qty / 10) * 100}%` }}></div>
                                </div>
                                <span style={pQty}>{p.qty}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={aiInsightBox}>
                    <h3 style={{ ...cardTitle, color: '#3f51b5', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>💠</span> AI Growth Roadmap
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
                        {data.suggestions.map((s, i) => (
                            <div key={i} style={insightRow}>
                                <div style={{ fontSize: '18px' }}>{s.type === 'profit' ? '💎' : s.type === 'stock' ? '📦' : '🌱'}</div>
                                <div style={{ fontSize: '12px', fontWeight: '500', lineHeight: '1.5' }}>{s.text}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

const header = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' };
const btnRefresh = { padding: '12px 20px', backgroundColor: '#2D3436', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '12px', fontWeight: '700' };

const topGrid = { display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '30px', marginBottom: '30px' };
const healthCard = { textAlign: 'center', padding: '30px', backgroundColor: '#fff' };
const cardTitle = { fontSize: '16px', fontWeight: '700', color: '#2D3436', textTransform: 'uppercase', letterSpacing: '0.5px' };
const gaugeWrapper = { marginTop: '20px', display: 'flex', justifyContent: 'center' };

const barTooltip = { position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#2D3436', color: '#fff', fontSize: '8px', padding: '2px 4px', borderRadius: '4px', opacity: 0, transition: 'opacity 0.2s' };
// chart-bar:hover needs a CSS rule in globals.css for the tooltip, but we'll stick to basic for now.

const metricsGrid = { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' };
const metricItem = { padding: '24px', position: 'relative', overflow: 'hidden' };
const mIcon = { fontSize: '24px', marginBottom: '12px', opacity: 0.8 };
const mLabel = { fontSize: '11px', color: '#b2bec3', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' };
const mValue = { fontSize: '26px', fontWeight: '800' };
const mSub = { fontSize: '10px', color: '#b2bec3', marginTop: '4px' };
const mExtra = { marginTop: '15px', paddingTop: '10px', borderTop: '1px solid #f9f9f9', fontSize: '10px', color: '#636e72', fontWeight: '600' };

const btnViewMore = { padding: '10px 20px', backgroundColor: 'transparent', border: '1px dashed #ccc', borderRadius: '30px', color: '#636e72', fontSize: '12px', fontWeight: '600' };

const bottomGrid = { display: 'flex', gap: '30px' };
const pRow = { display: 'flex', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #f9f9f9', gap: '20px' };
const pInfo = { display: 'flex', alignItems: 'center', gap: '12px', width: '150px' };
const pRank = { width: '22px', height: '22px', backgroundColor: '#FAF9F6', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700' };
const pProgressWrapper = { flex: 1, height: '6px', backgroundColor: '#f0f0f0', borderRadius: '3px', overflow: 'hidden' };
const pProgressBar = { height: '100%', backgroundColor: '#FDE2E4', borderRadius: '3px', transition: 'width 1s ease' };
const pQty = { fontSize: '14px', fontWeight: '800', width: '30px', textAlign: 'right' };

const aiInsightBox = { flex: 1, backgroundColor: '#f0f4ff', borderRadius: '24px', padding: '30px', border: '1px solid #d0daff' };
const insightRow = { display: 'flex', gap: '15px', backgroundColor: '#fff', padding: '16px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(63, 81, 181, 0.04)' };
