import { getProducts, getMaterials } from '@/lib/db';
import { calculatePriceRecommendations } from '@/lib/pricing';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('productId');

        if (!productId) {
            return NextResponse.json({ error: 'ProductId required' }, { status: 400 });
        }

        const products = await getProducts();
        const materials = await getMaterials();
        const product = products.find(p => p.id === productId);

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        const recommendations = calculatePriceRecommendations(product, materials);
        return NextResponse.json({ recommendations });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
