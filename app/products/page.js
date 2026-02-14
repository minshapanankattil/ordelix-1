'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState('');
    const [loading, setLoading] = useState(true);
    const [recommendations, setRecommendations] = useState({});
    const [discountRecs, setDiscountRecs] = useState({});
    const [orderModal, setOrderModal] = useState(null); // { product, type }

    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('ordelix_user');
        if (!storedUser) {
            router.push('/');
            return;
        }

        const user = JSON.parse(storedUser);
        // Removed status check
    }, [router]);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/products');
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            setProducts(data.products || []);

            const custRes = await fetch('/api/discounts', { method: 'POST' });
            const custData = await custRes.json();
            setCustomers(custData.customers || []);
            if (custData.customers?.length > 0) setSelectedCustomerId(custData.customers[0].id);

            data.products?.forEach(async (p) => {
                const recRes = await fetch(`/api/pricing?productId=${p.id}`);
                const recData = await recRes.json();
                setRecommendations(prev => ({ ...prev, [p.id]: recData.recommendations }));
            });
        } catch (err) {
            console.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedCustomerId && products.length > 0) {
            products.forEach(async (p) => {
                const res = await fetch(`/api/discounts?productId=${p.id}&customerId=${selectedCustomerId}`);
                const data = await res.json();
                setDiscountRecs(prev => ({ ...prev, [p.id]: data.recommendations }));
            });
        }
    }, [selectedCustomerId, products]);

    const placeOrder = async () => {
        if (!orderModal) return;
        const { product, type } = orderModal;
        const pricing = recommendations[product.id][type];
        const disc = discountRecs[product.id];

        try {
            const orderData = {
                productId: product.id,
                customerId: selectedCustomerId,
                quantity: 1,
                priceType: type,
                originalPrice: type === 'recommended' && disc ? disc.originalPrice : pricing.price,
                discount: type === 'recommended' && disc ? disc.discountPercentage : 0,
                finalPrice: type === 'recommended' && disc ? disc.optimizedPrice : pricing.price
            };

            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            if (res.ok) {
                setOrderModal(null);
                alert('🎉 Gift order confirmed & stock updated!');
            }
        } catch (err) {
            alert('Failed to place order.');
        }
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '18px', color: '#636e72' }}>Curating your product line...</div>;

    return (
        <div className="fade-in">
            <div className="flex-between mb-40">
                <div>
                    <h1 style={{ fontSize: '32px' }}>Product Collection</h1>
                    <p style={{ color: '#636e72' }}>Discover and manage your premium handmade items.</p>
                </div>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <div style={selectWrapper}>
                        <span style={selectTag}>SELECT CUSTOMER</span>
                        <select
                            value={selectedCustomerId}
                            onChange={(e) => setSelectedCustomerId(e.target.value)}
                            style={selectMain}
                        >
                            {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.loyaltyLevel})</option>)}
                        </select>
                    </div>
                    <Link href="/products/create" style={btnAction}>+ Create New Piece</Link>
                </div>
            </div>

            <div style={productGrid}>
                {products.map((p, index) => {
                    const rec = recommendations[p.id];
                    const disc = discountRecs[p.id];
                    const delayClass = `stagger-${(index % 3) + 1}`;
                    return (
                        <div key={p.id} className={`card fade-in ${delayClass}`} style={productCard}>
                            <div style={imageBox}>
                                <div style={{ fontSize: '48px', opacity: 0.2 }}>🎁</div>
                            </div>
                            <div style={{ padding: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <h3 style={{ fontSize: '20px', fontWeight: '700' }}>{p.name}</h3>
                                    <div style={priceHighlight}>${rec?.recommended.price || '...'}</div>
                                </div>
                                <p style={{ color: '#636e72', fontSize: '13px', height: '36px', overflow: 'hidden', marginTop: '10px' }}>{p.description}</p>

                                <div style={detailRow}>
                                    <span>{p.laborHours}h Labor</span>
                                    <span>•</span>
                                    <span>Level {p.complexity}</span>
                                </div>

                                <div style={cardActions}>
                                    <button
                                        onClick={() => setOrderModal({ product: p, type: 'recommended' })}
                                        style={btnSecondary}
                                    >
                                        View AI Strategy
                                    </button>
                                    <button
                                        onClick={() => setOrderModal({ product: p, type: 'base' })}
                                        style={btnPrimary}
                                    >
                                        Add to Order
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Confirmation Modal */}
            {orderModal && (
                <div className="modal-backdrop" onClick={() => setOrderModal(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div style={{ fontSize: '40px', marginBottom: '15px' }}>🚀</div>
                        <h3 style={{ fontSize: '22px' }}>Confirm Your Selection</h3>
                        <p style={{ color: '#636e72', fontSize: '14px', margin: '10px 0 20px 0' }}>
                            Ready to process <strong>{orderModal.product.name}</strong> at the {orderModal.type} price tier?
                        </p>

                        {orderModal.type === 'recommended' && discountRecs[orderModal.product.id] && (
                            <div style={modalStrategyBox}>
                                <div style={{ fontSize: '11px', color: '#3f51b5', fontWeight: '800', marginBottom: '5px' }}>PEARL AI SUGGESTION</div>
                                <div style={{ fontSize: '24px', fontWeight: '800' }}>${discountRecs[orderModal.product.id].optimizedPrice}</div>
                                <div style={{ fontSize: '12px', color: '#2ecc71', fontWeight: '700' }}>
                                    Includes {discountRecs[orderModal.product.id].discountPercentage}% Reward
                                </div>
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '15px' }}>
                            <button onClick={() => setOrderModal(null)} style={modalBtnCancel}>Nevermind</button>
                            <button onClick={placeOrder} style={modalBtnConfirm}>Confirm Order</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const headerSection = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' };
const selectWrapper = { position: 'relative', minWidth: '220px' };
const selectTag = { fontSize: '9px', color: '#b2bec3', position: 'absolute', top: '8px', left: '12px', fontWeight: '800', letterSpacing: '0.5px' };
const selectMain = { width: '100%', padding: '24px 12px 10px 12px', borderRadius: '14px', border: '1px solid #f0f0f0', backgroundColor: '#fff', fontSize: '14px', fontWeight: '700' };
const btnAction = { padding: '16px 24px', backgroundColor: '#2D3436', color: '#fff', borderRadius: '14px', fontSize: '14px', fontWeight: '700', textDecoration: 'none' };

const productGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' };
const productCard = { padding: 0, overflow: 'hidden', border: 'none' };
const imageBox = { height: '180px', backgroundColor: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const priceHighlight = { fontSize: '18px', fontWeight: '800', color: '#2D3436' };
const detailRow = { display: 'flex', gap: '10px', fontSize: '11px', color: '#b2bec3', fontWeight: '700', textTransform: 'uppercase', marginTop: '12px' };

const cardActions = { display: 'flex', gap: '10px', marginTop: '24px' };
const btnPrimary = { flex: 1.2, padding: '12px', backgroundColor: '#2D3436', color: '#fff', borderRadius: '10px', fontSize: '13px', fontWeight: '700' };
const btnSecondary = { flex: 1, padding: '12px', backgroundColor: '#FAF9F6', color: '#2D3436', borderRadius: '10px', fontSize: '13px', fontWeight: '700', border: '1px solid #eee' };

const modalStrategyBox = { padding: '20px', backgroundColor: '#f0f4ff', borderRadius: '16px', border: '1px solid #d0daff', marginBottom: '25px' };
const modalBtnConfirm = { flex: 1, padding: '14px', backgroundColor: '#2D3436', color: '#fff', borderRadius: '12px', fontSize: '14px', fontWeight: '700' };
const modalBtnCancel = { flex: 0.8, padding: '14px', backgroundColor: 'transparent', color: '#636e72', borderRadius: '12px', fontSize: '14px', fontWeight: '600' };
