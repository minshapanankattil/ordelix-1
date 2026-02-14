'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Inventory() {
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newMaterial, setNewMaterial] = useState({ name: '', quantity: '', unitPrice: '', lowStockThreshold: '10' });

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

    const fetchMaterials = async () => {
        try {
            const res = await fetch('/api/materials');
            const data = await res.json();
            setMaterials(data.materials || []);
        } catch (err) {
            console.error('Failed to fetch materials');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMaterials();
    }, []);

    const handleAddMaterial = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/materials', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMaterial)
            });
            if (res.ok) {
                setNewMaterial({ name: '', quantity: '', unitPrice: '', lowStockThreshold: '10' });
                fetchMaterials();
            }
        } catch (err) {
            console.error('Failed to add material');
        }
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;

    return (
        <div className="container-lux fade-in">
            <h1 className="mb-40">Inventory Management</h1>

            <section style={{ marginBottom: '40px', padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
                <h2>Add New Material</h2>
                <form onSubmit={handleAddMaterial} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <input
                        placeholder="Material Name (e.g. Flowers)"
                        value={newMaterial.name}
                        onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                        required
                        style={inputStyle}
                    />
                    <input
                        type="number"
                        placeholder="Unit Cost ($)"
                        step="0.01"
                        value={newMaterial.unitPrice}
                        onChange={(e) => setNewMaterial({ ...newMaterial, unitPrice: e.target.value })}
                        required
                        style={inputStyle}
                    />
                    <input
                        type="number"
                        placeholder="Initial Quantity"
                        value={newMaterial.quantity}
                        onChange={(e) => setNewMaterial({ ...newMaterial, quantity: e.target.value })}
                        required
                        style={inputStyle}
                    />
                    <input
                        type="number"
                        placeholder="Low Stock Alert Level"
                        value={newMaterial.lowStockThreshold}
                        onChange={(e) => setNewMaterial({ ...newMaterial, lowStockThreshold: e.target.value })}
                        style={inputStyle}
                    />
                    <button type="submit" style={btnPrimary}>Add Material</button>
                </form>
            </section>

            <section>
                <h2>Current Stock</h2>
                <table style={tableStyle}>
                    <thead>
                        <tr style={headerRowStyle}>
                            <th>Material Name</th>
                            <th>Unit Cost</th>
                            <th>Quantity</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {materials.map(m => (
                            <tr key={m.id} style={rowStyle}>
                                <td>{m.name}</td>
                                <td>${Number(m.unitPrice).toFixed(2)}</td>
                                <td>{m.quantity}</td>
                                <td>
                                    {m.quantity <= m.lowStockThreshold ? (
                                        <span style={{ color: 'red', fontWeight: 'bold' }}>⚠️ Low Stock</span>
                                    ) : (
                                        <span style={{ color: 'green' }}>OK</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
}

const inputStyle = {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    flex: '1',
    minWidth: '200px'
};

const btnPrimary = {
    padding: '10px 20px',
    backgroundColor: '#000',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
};

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px'
};

const headerRowStyle = {
    textAlign: 'left',
    borderBottom: '2px solid #ddd',
    backgroundColor: '#f5f5f5'
};

const rowStyle = {
    borderBottom: '1px solid #eee'
};
