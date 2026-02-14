import { getProducts, saveProduct, addAuditLog } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const products = await getProducts();
        return NextResponse.json({ products });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const newProduct = await saveProduct(body);
        await addAuditLog('Product Created', `New product added: ${newProduct.name}`, 'Admin');
        return NextResponse.json({ success: true, product: newProduct });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
