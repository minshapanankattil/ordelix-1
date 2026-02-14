'use client';

import "./globals.css";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { client } from '@/lib/appwrite';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Verify Appwrite connection
    client.ping().then(response => {
      console.log('Appwrite connection verified:', response);
    }).catch(error => {
      console.error('Appwrite connection failed:', error);
    });
  }, []);

  useEffect(() => {
    // Basic login simulation using localStorage
    const user = localStorage.getItem('ordelix_user');
    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('ordelix_user');
    setIsLoggedIn(false);
    router.push('/');
  };

  // We show the sidebar ONLY if logged in and NOT on the home/landing page
  // Actually, let's show sidebar on all platform pages (/products, /admin, etc.) if logged in.
  const isPlatformPage = pathname !== '/' && pathname !== '/landing' && pathname !== '/pending';
  const showSidebar = isLoggedIn && isPlatformPage;

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('ordelix_user');
    if (user) setCurrentUser(JSON.parse(user));
  }, [pathname]);

  const isApproved = currentUser?.status === 'approved' || currentUser?.role === 'admin';
  const isAdmin = currentUser?.role === 'admin';

  return (
    <html lang="en" style={{ scrollBehavior: 'smooth' }}>
      <body style={{ backgroundColor: showSidebar ? '#FAF9F6' : '#fff' }}>
        <div style={layoutWrapper}>
          {showSidebar && (
            <nav style={sidebarStyle}>
              <div style={logoStyle}>ORDELIX</div>
              <div style={navGroup}>
                <Link href="/" style={navItem}>🏠 Home</Link>
                {isApproved && <Link href="/products" style={navItem}>🎁 Products</Link>}
                {isAdmin && <Link href="/admin/orders" style={navItem}>📋 Orders</Link>}
                {isApproved && <Link href="/dashboard" style={navItem}>📊 Dashboard</Link>}
                {isApproved && <Link href="/inventory" style={navItem}>📦 Inventory</Link>}
                <Link href="/demo" style={navItem}>✨ Demo</Link>
              </div>
              <div style={{ marginTop: 'auto', borderTop: '1px solid #f0f0f0', paddingTop: '20px' }}>
                {isAdmin && <Link href="/admin" style={navItem}>🛠️ Admin Panel</Link>}
                <button onClick={handleLogout} style={{ ...navItem, background: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', border: 'none' }}>🚪 Logout</button>
              </div>
            </nav>
          )}

          <main style={showSidebar ? mainContentStyle : fullContentStyle}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

const layoutWrapper = {
  display: 'flex',
  minHeight: '100vh',
};

const sidebarStyle = {
  width: '260px',
  backgroundColor: '#fff',
  borderRight: '1px solid #f0f0f0',
  padding: '40px 20px',
  display: 'flex',
  flexDirection: 'column',
  position: 'fixed',
  height: '100vh',
  zIndex: 100
};

const logoStyle = {
  fontSize: '24px',
  fontWeight: '700',
  fontFamily: 'Poppins',
  marginBottom: '40px',
  color: '#2D3436',
  letterSpacing: '2px'
};

const navGroup = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
};

const navItem = {
  padding: '12px 16px',
  borderRadius: '8px',
  color: '#636e72',
  fontSize: '15px',
  fontWeight: '500',
  transition: 'all 0.2s',
  display: 'block',
  textDecoration: 'none'
};

const mainContentStyle = {
  flex: 1,
  marginLeft: '260px',
  padding: '40px',
  backgroundColor: '#FAF9F6'
};

const fullContentStyle = {
  flex: 1,
  width: '100%',
  backgroundColor: '#fff'
};
