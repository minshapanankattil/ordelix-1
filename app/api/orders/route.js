import { getOrders, saveOrder, updateOrderStatus } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const orders = await getOrders();
        return NextResponse.json({ orders });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { productId, customerId, quantity, priceType, originalPrice, discount, finalPrice } = body;

        if (!productId || !customerId || !quantity) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const order = await saveOrder({
            productId,
            customerId,
            quantity: Number(quantity),
            priceType,
            originalPrice: Number(originalPrice),
            discount: Number(discount),
            finalPrice: Number(finalPrice)
        });

        return NextResponse.json({ order, success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const body = await request.json();
        const { id, status } = body;
        const order = await updateOrderStatus(id, status);
        return NextResponse.json({ order, success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
