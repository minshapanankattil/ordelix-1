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
        <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h1>Register Your Business</h1>
            <p style={{ color: '#666' }}>Professional and neutral tone for serious business owners.</p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input name="businessName" placeholder="Business Name" required onChange={handleChange} style={inputStyle} />
                <input name="ownerName" placeholder="Owner Name" required onChange={handleChange} style={inputStyle} />
                <input name="phone" placeholder="Phone Number" required onChange={handleChange} style={inputStyle} />
                <input name="email" type="email" placeholder="Email Address" required onChange={handleChange} style={inputStyle} />
                <input name="username" placeholder="Username" required onChange={handleChange} style={inputStyle} />
                <input name="password" type="password" placeholder="Password" required onChange={handleChange} style={inputStyle} />

                <div>
                    <label>Business Type:</label>
                    <select name="businessType" value={formData.businessType} onChange={handleChange} style={inputStyle}>
                        <option value="online">Online</option>
                        <option value="offline">Offline</option>
                    </select>
                </div>

                {formData.businessType === 'online' ? (
                    <input name="socialLink" placeholder="Instagram/Facebook/WhatsApp Link" required onChange={handleChange} style={inputStyle} />
                ) : (
                    <>
                        <input name="address" placeholder="Store Address" required onChange={handleChange} style={inputStyle} />
                        <input name="location" placeholder="Location (e.g. Google Maps link)" required onChange={handleChange} style={inputStyle} />
                    </>
                )}

                {error && <p style={{ color: 'red' }}>{error}</p>}

                <button type="submit" disabled={loading} style={buttonStyle}>
                    {loading ? 'Registering...' : 'Submit Application'}
                </button>
            </form>
        </div>
    );
}

const inputStyle = {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '16px'
};

const buttonStyle = {
    padding: '12px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#000',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer'
};
