'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

export default function OrdelixLanding() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const sectionRefs = useRef([]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);

        // Scroll reveal observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });

        const currentRefs = sectionRefs.current;
        currentRefs.forEach(ref => {
            if (ref) observer.observe(ref);
        });

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            currentRefs.forEach(ref => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, []);

    const addToRefs = (el) => {
        if (el && !sectionRefs.current.includes(el)) {
            sectionRefs.current.push(el);
        }
    };

    return (
        <div style={{ position: 'relative', overflowX: 'hidden' }}>
            {/* Interactive Cursor Glow */}
            <div
                className="cursor-glow"
                style={{ left: mousePos.x, top: mousePos.y }}
            />

            {/* Navigation */}
            <nav style={navStyle}>
                <div style={logo}>ORDELIX</div>
                <div style={navLinks}>
                    <a href="#features">Features</a>
                    <a href="#showcase">Showcase</a>
                    <a href="#demo">Preview</a>
                    <Link href="/" style={ctaBtnSmall}>Get Started</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section style={heroSection}>
                <div className="reveal" ref={addToRefs} style={heroContent}>
                    <div style={silkBadge}>✨ HANDMADE WITH HEART</div>
                    <h1 style={heroHeadline}>Turn Your Creativity <br /> Into a <span style={gradientText}>Global Brand.</span></h1>
                    <p style={heroSubtext}>
                        The all-in-one AI platform for handmade gift creators.
                        Smart pricing, effortless logistics, and real-time growth analytics.
                    </p>
                    <div style={heroActions}>
                        <Link href="/signup" style={btnPrimaryLarge}>Start Free Trial</Link>
                        <Link href="/demo" style={btnSecondaryLarge}>Watch Demo</Link>
                    </div>
                </div>
                <div className="float-anim" style={heroVisual}>
                    <div style={floatingGift}>🎁</div>
                    <div style={{ ...floatingGift, animationDelay: '1s', left: '70%', top: '20%' }}>✨</div>
                    <div style={{ ...floatingGift, animationDelay: '2s', left: '20%', top: '60%' }}>🎗️</div>
                </div>
            </section>

            {/* Multi-colored Section Divider */}
            <div style={divider} />

            {/* Features Section */}
            <section id="features" style={sectionPad}>
                <div className="reveal" ref={addToRefs} style={centeredHeader}>
                    <h2 style={secTitle}>Everything you need to <span style={{ color: '#6c5ce7' }}>Scale.</span></h2>
                    <p style={secSub}>Built specifically for the unique needs of creators and artisans.</p>
                </div>

                <div style={featureGrid}>
                    {features.map((f, i) => (
                        <div key={i} className={`reveal stagger-${(i % 3) + 1}`} ref={addToRefs} style={featureCard}>
                            <div style={featIcon}>{f.icon}</div>
                            <h3 style={featTitle}>{f.title}</h3>
                            <p style={featDesc}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Product Showcase - ₹ Pricing */}
            <section id="showcase" style={showcaseSec}>
                <div className="reveal" ref={addToRefs} style={centeredHeader}>
                    <h2 style={secTitle}>Curated Collection</h2>
                    <p style={secSub}>See how Ordelix optimizes your catalog for profitability.</p>
                </div>

                <div style={showcaseGrid}>
                    {sampleProducts.map((p, i) => (
                        <div key={i} className="card reveal" ref={addToRefs} style={showcaseCard}>
                            <div style={showcaseImg}>
                                <div style={{ fontSize: '40px', opacity: 0.1 }}>ART</div>
                            </div>
                            <div style={{ padding: '20px' }}>
                                <h4 style={{ margin: 0 }}>{p.name}</h4>
                                <div style={priceTag}>₹{p.price}</div>
                                <div style={hoverInfo}>AI Optimized</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Dashboard Preview Section */}
            <section id="demo" style={demoSec}>
                <div className="reveal" ref={addToRefs} style={demoContent}>
                    <div style={silkBadge}>📊 REAL-TIME INTELLIGENCE</div>
                    <h2 style={secTitle}>Manage from your <br /> Dashboard.</h2>
                    <p style={secSub}>Visual data that makes growing your brand look as good as your products.</p>
                    <ul style={checkList}>
                        <li>✅ 0-100 Business Health Scoring</li>
                        <li>✅ AI Sales Forecasts</li>
                        <li>✅ Material Stock Level Alerts</li>
                    </ul>
                    <Link href="/demo" style={btnPrimaryLarge}>Try the Interactive Demo</Link>
                </div>
                <div className="reveal" ref={addToRefs} style={demoVisual}>
                    <div className="card" style={mockDashboard}>
                        <div style={mockCircle}>84</div>
                        <div style={mockBars}>
                            <div style={{ height: '40px', width: '20px', background: '#FDE2E4' }}></div>
                            <div style={{ height: '70px', width: '20px', background: '#E2ECE9' }}></div>
                            <div style={{ height: '50px', width: '20px', background: '#FDE2E4' }}></div>
                        </div>
                        <p style={{ fontSize: '12px', fontWeight: '700', marginTop: '10px' }}>Health: Peak</p>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section style={testimonialsSec}>
                <div className="reveal" ref={addToRefs} style={{ textAlign: 'center' }}>
                    <p style={quote}>"Ordelix helped me triple my production speed. I finally feel like a CEO, not just a crafter."</p>
                    <div style={author}>— Ananya S., Founder of 'The Silk Thread'</div>
                </div>
            </section>

            {/* Footer / CTA */}
            <section style={finalCta}>
                <div className="reveal" ref={addToRefs} style={{ textAlign: 'center' }}>
                    <h2 style={{ ...secTitle, color: '#fff', fontSize: '3rem' }}>Ready to grow?</h2>
                    <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '40px' }}>Join 500+ makers who trust Ordelix Pearl technology.</p>
                    <Link href="/signup" style={btnWhiteLarge}>Join Now</Link>
                </div>
                <div style={bottomLinks}>
                    <p>&copy; 2026 ORDELIX CRAFT TECH. ALL RIGHTS RESERVED.</p>
                </div>
            </section>
        </div>
    );
}

const features = [
    { icon: '💎', title: 'AI Pricing', desc: 'Calculates complexity, labor, and materials instantly.' },
    { icon: '📦', title: 'Smart Stock', desc: 'Predictive alerts before you run out of supplies.' },
    { icon: '📈', title: 'Health Score', desc: 'A 0-100 score on your business profitability.' },
    { icon: '🎁', title: 'Order Tracking', desc: 'Manage every gift from creation to delivery.' },
    { icon: '🤝', title: 'Loyalty Rewards', desc: 'Automated perks for your best customers.' },
    { icon: '🎨', title: 'Artisan First', desc: 'Designed for the unique workflows of hand-makers.' }
];

const sampleProducts = [
    { name: 'Scented Aura Candle', price: '1,299' },
    { name: 'Leather Bound Journal', price: '2,450' },
    { name: 'Hand-Painted Silk Scarf', price: '3,800' },
    { name: 'Ceramic Tableware Set', price: '4,200' }
];

// Styles
const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '30px 10%', position: 'absolute', width: '100%', top: 0, zIndex: 100 };
const logo = { fontSize: '24px', fontWeight: '800', letterSpacing: '2px', color: '#2D3436' };
const navLinks = { display: 'flex', gap: '40px', alignItems: 'center', fontSize: '14px', fontWeight: '600' };
const ctaBtnSmall = { padding: '10px 20px', backgroundColor: '#2D3436', color: '#fff', borderRadius: '30px', transition: 'all 0.3s' };

const heroSection = { height: '100vh', display: 'flex', alignItems: 'center', padding: '0 10%', backgroundColor: '#FFF5EE' /* Silk Peach */, gap: '50px' };
const heroContent = { flex: 1.2 };
const silkBadge = { display: 'inline-block', padding: '8px 16px', backgroundColor: '#E6E6FA' /* Lavender */, borderRadius: '20px', fontSize: '10px', fontWeight: '800', color: '#5b548b', marginBottom: '20px' };
const heroHeadline = { fontSize: '4.5rem', fontWeight: '800', lineHeight: 1.1, color: '#2D3436', marginBottom: '24px' };
const gradientText = { color: '#6c5ce7' };
const heroSubtext = { fontSize: '1.2rem', color: '#636e72', lineHeight: '1.6', marginBottom: '40px' };
const heroActions = { display: 'flex', gap: '20px' };

const btnPrimaryLarge = { padding: '20px 40px', backgroundColor: '#2D3436', color: '#fff', borderRadius: '40px', fontWeight: '700', fontSize: '18px', transition: 'all 0.3s' };
const btnSecondaryLarge = { padding: '20px 40px', backgroundColor: '#fff', color: '#2D3436', borderRadius: '40px', fontWeight: '700', fontSize: '18px', border: '1px solid #eee' };
const btnWhiteLarge = { padding: '20px 60px', backgroundColor: '#fff', color: '#2D3436', borderRadius: '40px', fontWeight: '700', fontSize: '18px' };

const heroVisual = { flex: 1, position: 'relative', height: '400px' };
const floatingGift = { position: 'absolute', fontSize: '60px', top: '40%', left: '40%' };

const divider = { height: '100px', background: 'linear-gradient(to bottom, #FFF5EE, #FFF)' };

const sectionPad = { padding: '120px 10%', backgroundColor: '#fff' };
const centeredHeader = { textAlign: 'center', marginBottom: '80px', maxWidth: '700px', margin: '0 auto 80px auto' };
const secTitle = { fontSize: '3rem', fontWeight: '800', marginBottom: '20px' };
const secSub = { fontSize: '1.2rem', color: '#b2bec3' };

const featureGrid = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' };
const featureCard = { padding: '40px', backgroundColor: '#F9F9F9', borderRadius: '30px', transition: 'all 0.3s' };
const featIcon = { fontSize: '32px', marginBottom: '20px' };
const featTitle = { fontSize: '20px', fontWeight: '700', marginBottom: '15px' };
const featDesc = { fontSize: '14px', color: '#636e72', lineHeight: '1.6' };

const showcaseSec = { padding: '120px 10%', backgroundColor: '#F0FFF0' /* Soft Sage */ };
const showcaseGrid = { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' };
const showcaseCard = { padding: 0, overflow: 'hidden' };
const showcaseImg = { height: '220px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const priceTag = { fontSize: '24px', fontWeight: '800', margin: '10px 0' };
const hoverInfo = { fontSize: '10px', fontWeight: '700', color: '#2ecc71', textTransform: 'uppercase' };

const demoSec = { padding: '120px 10%', display: 'flex', alignItems: 'center', gap: '80px', backgroundColor: '#fff' };
const demoContent = { flex: 1 };
const demoVisual = { flex: 1, display: 'flex', justifyContent: 'center' };
const checkList = { listStyle: 'none', padding: 0, margin: '30px 0 40px 0', fontSize: '18px', lineHeight: '2.5' };
const mockDashboard = { width: '320px', height: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', borderRadius: '40px' };
const mockCircle = { width: '100px', height: '100px', borderRadius: '50%', border: '8px solid #E6E6FA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: '800' };
const mockBars = { display: 'flex', gap: '8px', alignItems: 'flex-end', marginTop: '30px' };

const testimonialsSec = { padding: '120px 10%', backgroundColor: '#FFF0F5' /* Blush */ };
const quote = { fontSize: '2.5rem', fontWeight: '700', color: '#2D3436', fontStyle: 'italic', maxWidth: '900px', margin: '0 auto 30px auto' };
const author = { fontSize: '1.1rem', color: '#636e72', fontWeight: '600' };

const finalCta = { padding: '150px 10%', backgroundColor: '#2D3436', position: 'relative' };
const bottomLinks = { position: 'absolute', bottom: '40px', left: '10%', color: 'rgba(255,255,255,0.3)', fontSize: '11px', fontWeight: '600', letterSpacing: '1px' };
