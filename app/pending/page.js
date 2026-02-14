'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PendingApproval() {
    const router = useRouter();
    const [user, setUser] = useState(null);

    const storedUser = localStorage.getItem('ordelix_user');
    if (!storedUser) {
        router.push('/');
        return;
    }
    const user = JSON.parse(storedUser);
    setUser(user);

    // If approved, no need to be here
    if (user.status === 'approved') {
        router.push('/dashboard');
    }
}, [router]);

const handleLogout = () => {
    localStorage.removeItem('ordelix_user');
    router.push('/');
};

return (
    <div style={container}>
        <div style={luxGlass}>
            <div style={iconBadge}>⏳</div>
            <h1 style={title}>Account Pending Approval</h1>
            <p style={subtitle}>
                Welcome to the Ordelix Studio, <strong>{user?.ownerName}</strong>!
                Your registration for <em>{user?.businessName}</em> is currently being reviewed by our curators.
            </p>

            <div style={demoNotice}>
                <h3>✨ Studio Preview Mode</h3>
                <p>While we verify your business, you can explore the platform features. However, management actions and dashboard analytics are currently locked.</p>
            </div>

            <div style={actionGroup}>
                <Link href="/" style={backBtn}>Explore Features</Link>
                <button onClick={handleLogout} style={logoutBtn}>Sign Out</button>
            </div>

            <div style={footerText}>
                Typically approved within 24-48 hours. Thank you for your patience.
            </div>
        </div>
    </div>
);
}

// Styles
const container = { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFDF9', padding: '20px' };
const luxGlass = { maxWidth: '600px', width: '100%', padding: '60px', backgroundColor: '#FFF', borderRadius: '25px', border: '1px solid #ECE4DB', boxShadow: '0 15px 50px rgba(236, 228, 219, 0.4)', textAlign: 'center' };
const iconBadge = { fontSize: '60px', marginBottom: '30px' };
const title = { fontSize: '32px', marginBottom: '20px', fontFamily: 'Playfair Display, serif' };
const subtitle = { fontSize: '16px', color: '#7D7D7D', lineHeight: '1.6', marginBottom: '40px' };
const demoNotice = { backgroundColor: '#FDFCF0', padding: '30px', borderRadius: '15px', border: '1px solid #FFE5D9', marginBottom: '40px', textAlign: 'left' };
const actionGroup = { display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '30px' };
const backBtn = { padding: '15px 30px', backgroundColor: '#FFD1D1', color: '#3D3D3D', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '14px' };
const logoutBtn = { padding: '15px 30px', backgroundColor: '#FFF', border: '1px solid #ECE4DB', color: '#7D7D7D', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' };
const footerText = { fontSize: '12px', color: '#AAA', fontStyle: 'italic' };
