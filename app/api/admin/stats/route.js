import { getUsers, getProducts, getOrders, getSettings } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const users = await getUsers();
        const products = await getProducts();
        const orders = await getOrders();
        const settings = await getSettings();

        const totalUsers = users.length;
        const pendingUsers = users.filter(u => u.status === 'pending').length;
        const approvedUsers = users.filter(u => u.status === 'approved').length;
        const totalProducts = products.length;

        // Calculate total revenue (demo logic)
        const totalRevenue = orders.reduce((sum, order) => {
            const product = products.find(p => p.id === order.productId);
            return sum + (product ? Number(product.price.replace(/,/g, '')) * order.quantity : 0);
        }, 0);

        return NextResponse.json({
            success: true,
            stats: {
                totalUsers,
                pendingUsers,
                approvedUsers,
                totalProducts,
                totalRevenue,
                activeBanners: settings.bannerText ? 1 : 0
            }
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
