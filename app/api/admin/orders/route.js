import { getOrders, getProducts, getUsers } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const orders = await getOrders();
        const products = await getProducts();
        const users = await getUsers();

        // Enrich orders with product and business names
        const enrichedOrders = orders.map(order => {
            const product = products.find(p => p.id === order.productId);
            const user = users.find(u => u.id === order.businessId); // Assuming businessId is stored in order

            return {
                ...order,
                productName: product ? product.name : 'Unknown Product',
                businessName: user ? user.businessName : 'Direct Customer',
                totalAmount: product ? (Number(product.price.replace(/,/g, '')) * order.quantity) : 0
            };
        });

        return NextResponse.json({ success: true, orders: enrichedOrders });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
