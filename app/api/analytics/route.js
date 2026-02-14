import { getOrders, getProducts, getMaterials, getCustomers } from '@/lib/db';
import { calculatePriceRecommendations } from '@/lib/pricing';
import { calculateBusinessHealth } from '@/lib/analytics';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const orders = await getOrders();
        const products = await getProducts();
        const materials = await getMaterials();
        const customers = await getCustomers();

        // Pass the pricing helper to calculation logic
        const healthReport = calculateBusinessHealth(orders, products, materials, customers, calculatePriceRecommendations);

        return NextResponse.json(healthReport);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
