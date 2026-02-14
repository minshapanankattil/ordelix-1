import { getProducts, getMaterials, getCustomers } from '@/lib/db';
import { calculatePriceRecommendations } from '@/lib/pricing';
import { calculateDiscountRecommendations } from '@/lib/discounts';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('productId');
        const customerId = searchParams.get('customerId');

        if (!productId || !customerId) {
            return NextResponse.json({ error: 'Missing productId or customerId' }, { status: 400 });
        }

        const products = await getProducts();
        const materials = await getMaterials();
        const customers = await getCustomers();

        const product = products.find(p => p.id === productId);
        const customer = customers.find(c => c.id === customerId);

        if (!product || !customer) {
            return NextResponse.json({ error: 'Product or Customer not found' }, { status: 404 });
        }

        const pricing = calculatePriceRecommendations(product, materials);
        const discounts = calculateDiscountRecommendations(product, customer, materials, pricing);

        return NextResponse.json({ recommendations: discounts });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST() {
    // Helper to just get customers list
    const customers = await getCustomers();
    return NextResponse.json({ customers });
}
