'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Signup() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        businessName: '',
        ownerName: '',
        phone: '',
        email: '',
        username: '',
        password: '',
        businessType: 'online',
        socialLink: '',
        address: '',
        location: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (data.success) {
                router.push('/dashboard');
            } else {
                setError(data.error || 'Something went wrong');
            }
        } catch (err) {
            setError('Failed to register');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-lux fade-in" style={{ maxWidth: '800px' }}>
            <div className="text-center mb-40">
                <h1 style={{ fontSize: '42px' }}>Empower Your Craft</h1>
                <p style={{ color: 'var(--text-soft)', fontSize: '18px' }}>Join the elite network of artisan brands.</p>
            </div>

            <form onSubmit={handleSubmit} className="lux-card">
                <div className="grid-2col mb-20">
                    <div className="form-group">
                        <label style={labelLabel}>Business Identity</label>
                        <input name="businessName" placeholder="Business Name" required onChange={handleChange} style={inputStyle} />
                    </div>
                    <div className="form-group">
                        <label style={labelLabel}>Owner Name</label>
                        <input name="ownerName" placeholder="Full Name" required onChange={handleChange} style={inputStyle} />
                    </div>
                </div>
                <div className="grid-2col mb-20">
                    <div className="form-group">
                        <label style={labelLabel}>Contact Phone</label>
                        <input name="phone" placeholder="+91 ..." required onChange={handleChange} style={inputStyle} />
                    </div>
                    <div className="form-group">
                        <label style={labelLabel}>Email Address</label>
                        <input name="email" type="email" placeholder="email@example.com" required onChange={handleChange} style={inputStyle} />
                    </div>
                </div>

                <div className="grid-2col mb-20">
                    <div className="form-group">
                        <label style={labelLabel}>Unique Username</label>
                        <input name="username" placeholder="username" required onChange={handleChange} style={inputStyle} />
                    </div>
                    <div className="form-group">
                        <label style={labelLabel}>Private Key (Password)</label>
                        <input name="password" type="password" placeholder="••••••••" required onChange={handleChange} style={inputStyle} />
                    </div>
                </div>

                <div className="mb-20">
                    <div className="form-group">
                        <label style={labelLabel}>Business Type</label>
                        <select name="businessType" value={formData.businessType} onChange={handleChange} style={inputStyle}>
                            <option value="online">Online Boutique / Studio</option>
                            <option value="offline">Physical Storefront / Workshop</option>
                        </select>
                    </div>
                </div>

                <div className="mb-40">
                    <div className="form-group">
                        <label style={labelLabel}>{formData.businessType === 'online' ? 'Social Catalog Link' : 'Physical Address'}</label>
                        {formData.businessType === 'online' ? (
                            <input name="socialLink" placeholder="Instagram/Facebook/WhatsApp Link" required onChange={handleChange} style={inputStyle} />
                        ) : (
                            <div className="grid-2col">
                                <input name="address" placeholder="Store Address" required onChange={handleChange} style={inputStyle} />
                                <input name="location" placeholder="Google Maps Link" required onChange={handleChange} style={inputStyle} />
                            </div>
                        )}
                    </div>
                </div>

                {error && <p style={{ color: 'red', fontWeight: '700', marginBottom: '20px' }}>{error}</p>}

                <button type="submit" disabled={loading} className="btn-lux" style={{ width: '100%', padding: '20px' }}>
                    {loading ? 'Processing Registration...' : 'Finalize Onboarding'}
                </button>
            </form>
        </div>
    );
}

const inputStyle = {
    padding: '18px 24px',
    borderRadius: '12px',
    border: '1px solid var(--beige)',
    fontSize: '16px',
    backgroundColor: 'var(--bg-light)',
    outline: 'none',
    width: '100%'
};

const labelLabel = {
    fontSize: '11px',
    fontWeight: '800',
    color: 'var(--text-soft)',
    textTransform: 'uppercase',
    letterSpacing: '1px'
};
