'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function OrdelixSilkLux() {
  const router = useRouter();
  const [activeModal, setActiveModal] = useState(null); // 'login' | 'signup'
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const sectionRefs = useRef([]);

  // Form States
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [signupData, setSignupData] = useState({
    businessName: '', ownerName: '', email: '', phone: '', username: '', password: '',
    businessType: 'online', socialLink: '', address: ''
  });
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('ordelix_user');
    setIsLoggedIn(!!user);

    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    }, { threshold: 0.1 });

    const currentRefs = sectionRefs.current;
    currentRefs.forEach(ref => { if (ref) observer.observe(ref); });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      currentRefs.forEach(ref => { if (ref) observer.unobserve(ref); });
    };
  }, []);

  const addToRefs = (el) => { if (el && !sectionRefs.current.includes(el)) sectionRefs.current.push(el); };

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    const endpoint = activeModal === 'login' ? '/api/login' : '/api/register';
    const payload = activeModal === 'login' ? loginData : signupData;

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('ordelix_user', JSON.stringify(data.user));
        setIsLoggedIn(true);
        setActiveModal(null);
        // If it was a signup, redirect to pending
        router.push(data.redirectTo || (activeModal === 'signup' ? '/dashboard' : '/dashboard'));
      } else { setAuthError(data.error); }
    } catch (err) { setAuthError('Connection failed.'); }
    finally { setAuthLoading(false); }
  };

  return (
    <div style={{ position: 'relative', overflowX: 'hidden', minHeight: '200vh' }}>
      {/* Decorative Light Background */}
      <div className="bg-shape shape-1" style={{ top: '10%', left: '-10%' }}></div>
      <div className="bg-shape shape-1" style={{ top: '60%', right: '-10%', opacity: 0.03 }}></div>
      <div className="cursor-light" style={{ left: mousePos.x, top: mousePos.y }} />

      {/* Editorial Navigation */}
      <nav style={navStyle}>
        <div style={logo}>ORDELIX</div>
        <div style={navLinks}>
          <a href="#about" style={linkItem}>Studio</a>
          <a href="#showcase" style={linkItem}>Collections</a>
          {isLoggedIn ? (
            <Link href="/dashboard" className="btn-lux" style={{ padding: '12px 30px' }}>Portal</Link>
          ) : (
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <button onClick={() => { setActiveModal('login'); setIsAdminMode(true); }} style={ghostBtn}>Admin</button>
              <button onClick={() => { setActiveModal('login'); setIsAdminMode(false); }} style={ghostBtn}>Sign In</button>
              <button onClick={() => setActiveModal('signup')} className="btn-lux" style={{ padding: '12px 30px' }}>Join Now</button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Content */}
      <section style={heroSection}>
        <div className="reveal-lux" ref={addToRefs} style={heroContent}>
          <div style={luxBadge}>✨ THE ARTISAN NETWORK</div>
          <h1 style={heroHeadline}>Elegance in <br /><span style={peachText}>Handmade Scale.</span></h1>
          <p style={heroSubtext}>
            Ordelix empowers premium gift brands with AI-driven pricing logic,
            refined stock tracking, and a truly luxury commerce experience.
          </p>
          <div style={heroActions}>
            <button onClick={() => setActiveModal('signup')} className="btn-lux" style={{ padding: '22px 55px', fontSize: '17px' }}>Join the Community</button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="about" className="section-pad">
        <div className="reveal-lux" ref={addToRefs} style={centHeader}>
          <h2 style={secTitle}>Modern Tools <br />for <span style={{ color: 'var(--primary)' }}>Fine Craft.</span></h2>
          <p style={secSub}>Manage every nuance of your business with effortless precision.</p>
        </div>
        <div style={luxGrid}>
          {features.map((f, i) => (
            <div key={i} className={`reveal-lux lux-card stagger-${(i % 3) + 1}`} ref={addToRefs}>
              <div style={featIcon}>{f.icon}</div>
              <h3 style={featTitle}>{f.title}</h3>
              <p style={featDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Premium Showcase */}
      <section id="showcase" className="section-pad" style={{ backgroundColor: 'var(--white)' }}>
        <div className="reveal-lux" ref={addToRefs} style={centHeader}>
          <h2 style={secTitle}>Platinum Collection</h2>
          <p style={secSub}>A showcase of items curated and optimized via the Ordelix engine.</p>
        </div>
        <div style={showcaseGrid}>
          {treasures.map((t, i) => (
            <div key={i} className="reveal-lux lux-card" ref={addToRefs} style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ ...treasureImg, backgroundColor: t.bg }}>
                <span style={{ fontSize: '60px', opacity: 0.8 }}>{t.icon}</span>
              </div>
              <div style={{ padding: '30px' }}>
                <h4 style={{ fontSize: '22px', marginBottom: '8px' }}>{t.name}</h4>
                <div style={priceTag}>₹{t.price}</div>
                <div style={statusBadge}>AI OPTIMIZED</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-pad" style={ctaSection}>
        <div className="reveal-lux" ref={addToRefs} style={{ textAlign: 'center' }}>
          <h2 style={{ ...secTitle, fontSize: '3.8rem' }}>Ready to Elevate?</h2>
          <p style={{ color: 'var(--text-soft)', marginBottom: '50px', fontSize: '1.2rem' }}>
            Direct integration for Indian artisans scaling with professional intelligence.
          </p>
          <button onClick={() => setActiveModal('signup')} className="btn-lux" style={{ padding: '24px 65px' }}>Start Your Journey</button>
        </div>
      </section>

      {/* Footer */}
      <footer style={footerStyle}>
        <div style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '2px', marginBottom: '20px' }}>ORDELIX</div>
        <div style={{ opacity: 0.5, fontSize: '12px' }}>&copy; 2026 ARTISAN COMMERCE | BENGALURU, INDIA</div>
      </footer>

      {/* Luxurious Modals */}
      {activeModal && (
        <div className="modal-backdrop" onClick={() => setActiveModal(null)} style={{ background: 'rgba(255, 253, 249, 0.8)' }}>
          <div className="reveal-lux active lux-card" onClick={e => e.stopPropagation()} style={modalBox}>
            <div style={modalHeader}>
              <h2 style={{ fontSize: '28px' }}>{activeModal === 'login' ? (isAdminMode ? 'Admin Portal' : 'Community Access') : 'New Account'}</h2>
              <button onClick={() => setActiveModal(null)} style={closeBtn}>✕</button>
            </div>

            <form onSubmit={handleAuth} style={modalForm}>
              {activeModal === 'login' ? (
                <>
                  <div style={inputGrp}>
                    <label style={labelStyle}>Identity</label>
                    <input
                      style={luxInput}
                      placeholder="Username or email"
                      value={loginData.username}
                      onChange={e => setLoginData({ ...loginData, username: e.target.value })}
                      required
                    />
                  </div>
                  <div style={inputGrp}>
                    <label style={labelStyle}>Encryption Key</label>
                    <input
                      type="password"
                      style={luxInput}
                      placeholder="Password"
                      value={loginData.password}
                      onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                      required
                    />
                  </div>
                </>
              ) : (
                <div style={signupGrid}>
                  <input style={luxInput} placeholder="Business Name" value={signupData.businessName} onChange={e => setSignupData({ ...signupData, businessName: e.target.value })} required />
                  <input style={luxInput} placeholder="Owner Name" value={signupData.ownerName} onChange={e => setSignupData({ ...signupData, ownerName: e.target.value })} required />
                  <input style={luxInput} placeholder="Email" type="email" value={signupData.email} onChange={e => setSignupData({ ...signupData, email: e.target.value })} required />
                  <input style={luxInput} placeholder="Phone" value={signupData.phone} onChange={e => setSignupData({ ...signupData, phone: e.target.value })} required />
                  <input style={luxInput} placeholder="Username" value={signupData.username} onChange={e => setSignupData({ ...signupData, username: e.target.value })} required />
                  <input style={luxInput} placeholder="Secret Password" type="password" value={signupData.password} onChange={e => setSignupData({ ...signupData, password: e.target.value })} required />
                </div>
              )}

              {authError && <p style={errText}>{authError}</p>}
              <button type="submit" disabled={authLoading} className="btn-lux" style={{ marginTop: '10px' }}>
                {authLoading ? 'Verifying...' : (activeModal === 'login' ? 'Confirm Access' : 'Submit Application')}
              </button>

              <div style={authSwitch}>
                <div onClick={() => setIsAdminMode(!isAdminMode)} style={{ ...switchLink, color: isAdminMode ? 'var(--text-main)' : 'var(--accent)', fontWeight: '900', border: '1px solid #eee', padding: '5px 15px', borderRadius: '10px' }}>
                  {isAdminMode ? '← Switch to User Login' : 'Admin Portal Login 🗝️'}
                </div>
                {!isAdminMode && (
                  <span onClick={() => setActiveModal(activeModal === 'login' ? 'signup' : 'login')} style={switchLink}>
                    {activeModal === 'login' ? 'Create Account' : 'Have account?'}
                  </span>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const features = [
  { icon: '💎', title: 'Curated Pricing', desc: 'Algorithmically tuned margins that respect the labor of handmade craft.' },
  { icon: '🌿', title: 'Ethical Supply', desc: 'Track raw materials and inventory with high-fidelity, predictive alerts.' },
  { icon: '📈', title: 'Artisan Insights', desc: 'Visual analytics designed to translate data into actionable creative energy.' },
  { icon: '🤝', title: 'Verified Network', desc: 'Join a network of professional creators scaling with integrity.' },
  { icon: '🏛️', title: 'Professional Flow', desc: 'Enterprise-level organizational tools scaled for the independent studio.' },
  { icon: '✨', title: 'Editorial First', desc: 'A platform that looks as beautiful as the masterpieces you create.' }
];

const treasures = [
  { name: 'Ceramic Taper Set', price: '2,400', icon: '🏺', bg: '#F9F1EB' },
  { name: 'Linen Hand Towels', price: '1,850', icon: '🧣', bg: '#EDF2F4' },
  { name: 'Brass Pillar Case', price: '4,200', icon: '📦', bg: '#FDFCF0' },
  { name: 'Sandalwood Mist', price: '1,299', icon: '🕯️', bg: '#F5EFEF' }
];

// Inline Styles
const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '35px 8%', position: 'absolute', width: '100%', zIndex: 100 };
const logo = { fontSize: '24px', fontWeight: '900', letterSpacing: '4px', color: 'var(--text-main)' };
const navLinks = { display: 'flex', gap: '40px', alignItems: 'center' };
const linkItem = { fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-main)', textDecoration: 'none' };
const ghostBtn = { background: 'none', border: 'none', color: 'var(--text-soft)', fontWeight: '700', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer' };

const heroSection = { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 8%' };
const heroContent = { maxWidth: '900px' };
const luxBadge = { display: 'inline-block', padding: '10px 25px', background: 'var(--white)', border: '1px solid var(--beige)', borderRadius: '30px', fontSize: '11px', fontWeight: '800', letterSpacing: '3px', marginBottom: '35px' };
const heroHeadline = { fontSize: '6rem', lineHeight: '0.95', marginBottom: '30px' };
const peachText = { color: 'var(--accent)', fontStyle: 'italic' };
const heroSubtext = { fontSize: '1.3rem', color: 'var(--text-soft)', maxWidth: '600px', margin: '0 auto 50px auto', lineHeight: '1.7' };
const heroActions = { display: 'flex', gap: '20px', justifyContent: 'center' };
const btnSecondaryLux = { padding: '22px 55px', background: 'transparent', border: '1px solid var(--beige)', borderRadius: 'var(--radius-lux)', fontWeight: '700', textDecoration: 'none', color: 'var(--text-main)' };

const centHeader = { textAlign: 'center', maxWidth: '800px', margin: '0 auto 80px auto' };
const secTitle = { fontSize: '4.2rem', lineHeight: '1', marginBottom: '25px' };
const secSub = { fontSize: '1.2rem', color: 'var(--text-soft)', maxWidth: '500px', margin: '0 auto' };

const luxGrid = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' };
const featIcon = { fontSize: '42px', marginBottom: '25px', opacity: 0.9 };
const featTitle = { fontSize: '24px', fontWeight: '700', marginBottom: '15px' };
const featDesc = { fontSize: '15px', color: 'var(--text-soft)', lineHeight: '1.7' };

const showcaseGrid = { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '30px' };
const treasureImg = { height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const priceTag = { fontSize: '28px', fontWeight: '800', marginBottom: '8px' };
const statusBadge = { fontSize: '10px', fontWeight: '800', background: 'var(--beige)', padding: '5px 12px', borderRadius: '30px', display: 'inline-block' };

const ctaSection = { padding: '150px 8%', background: '#FDFCF0' };
const footerStyle = { textAlign: 'center', padding: '100px 8%', backgroundColor: 'var(--bg-light)' };

const modalBox = { width: '90%', maxWidth: '550px', padding: '60px', position: 'relative' };
const modalHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' };
const closeBtn = { background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#DDD' };
const modalForm = { display: 'flex', flexDirection: 'column', gap: '25px' };
const inputGrp = { display: 'flex', flexDirection: 'column', gap: '10px' };
const labelStyle = { fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-soft)', letterSpacing: '2px' };
const luxInput = { padding: '18px 24px', background: 'var(--bg-light)', border: '1px solid var(--beige)', borderRadius: '15px', fontSize: '16px', outline: 'none' };
const authSwitch = { textAlign: 'center', marginTop: '10px', display: 'flex', gap: '30px', justifyContent: 'center' };
const switchLink = { fontSize: '13px', fontWeight: '700', color: 'var(--accent)', cursor: 'pointer', textDecoration: 'underline' };
const errText = { color: '#D63031', fontSize: '14px', fontWeight: '700', margin: 0 };
const signupGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' };
