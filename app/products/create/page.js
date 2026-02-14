'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateProduct() {
    const router = useRouter();
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState({
        name: '',
        description: '',
        laborHours: 1,
        complexity: 1,
        materials: [] // { materialId, quantityRequired }
    });

    useEffect(() => {
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
        fetchMaterials();
    }, []);

    const handleMaterialToggle = (materialId) => {
        const exists = product.materials.find(m => m.materialId === materialId);
        if (exists) {
            setProduct({
                ...product,
                materials: product.materials.filter(m => m.materialId !== materialId)
            });
        } else {
            setProduct({
                ...product,
                materials: [...product.materials, { materialId, quantityRequired: 1 }]
            });
        }
    };

    const updateMaterialQty = (materialId, qty) => {
        setProduct({
            ...product,
            materials: product.materials.map(m =>
                m.materialId === materialId ? { ...m, quantityRequired: Number(qty) } : m
            )
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            });
            if (res.ok) {
                router.push('/products');
            }
        } catch (err) {
            console.error('Failed to create product');
        }
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;

    return (
        <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>Create New Product</h1>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <input
                    placeholder="Product Name"
                    value={product.name}
                    onChange={(e) => setProduct({ ...product, name: e.target.value })}
                    required
                    style={inputStyle}
                />
                <textarea
                    placeholder="Product Description"
                    value={product.description}
                    onChange={(e) => setProduct({ ...product, description: e.target.value })}
                    required
                    style={{ ...inputStyle, minHeight: '100px' }}
                />

                <div style={{ display: 'flex', gap: '20px' }}>
                    <div style={{ flex: 1 }}>
                        <label>Est. Labor Hours:</label>
                        <input
                            type="number"
                            step="0.5"
                            value={product.laborHours}
                            onChange={(e) => setProduct({ ...product, laborHours: e.target.value })}
                            style={{ ...inputStyle, width: '100%' }}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label>Complexity (1-5):</label>
                        <select
                            value={product.complexity}
                            onChange={(e) => setProduct({ ...product, complexity: e.target.value })}
                            style={{ ...inputStyle, width: '100%' }}
                        >
                            {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                    </div>
                </div>

                <div>
                    <h3>Required Materials</h3>
                    <p style={{ color: '#666', fontSize: '14px' }}>Select materials and specify quantity required for one unit of this product.</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                        {materials.map(m => (
                            <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '10px', border: '1px solid #eee', borderRadius: '4px' }}>
                                <input
                                    type="checkbox"
                                    checked={!!product.materials.find(pm => pm.materialId === m.id)}
                                    onChange={() => handleMaterialToggle(m.id)}
                                />
                                <span style={{ flex: 1 }}>{m.name} (${m.unitPrice}/unit)</span>
                                {product.materials.find(pm => pm.materialId === m.id) && (
                                    <input
                                        type="number"
                                        placeholder="Qty"
                                        value={product.materials.find(pm => pm.materialId === m.id).quantityRequired}
                                        onChange={(e) => updateMaterialQty(m.id, e.target.value)}
                                        style={{ width: '60px', padding: '5px' }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <button type="submit" style={btnPrimary}>Save Product</button>
            </form>
        </div>
    );
}

const inputStyle = {
    padding: '12px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '16px'
};

const btnPrimary = {
    padding: '15px',
    backgroundColor: '#000',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: 'bold'
};
