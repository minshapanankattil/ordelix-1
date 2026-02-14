export function calculateBusinessHealth(orders, products, materials, customers, pricingHelper) {
    // 1. Basic Sales Metrics
    const totalOrders = orders.length;
    const completedOrders = orders.filter(o => o.status === 'completed' || o.status === 'shipped');
    const revenue = completedOrders.reduce((sum, o) => sum + o.finalPrice, 0);

    // Calculate Profit
    let totalProfit = 0;
    completedOrders.forEach(o => {
        const product = products.find(p => p.id === o.productId);
        if (product) {
            // In a real app we'd store productionCost at time of order
            // For this prototype, we'll recalculate using current prices or pricing helper
            const pricing = pricingHelper(product, materials);
            totalProfit += (o.finalPrice - pricing.productionCost);
        }
    });

    const avgMargin = revenue > 0 ? (totalProfit / revenue) : 0;

    // 2. Top Products
    const productCounts = {};
    orders.forEach(o => {
        productCounts[o.productId] = (productCounts[o.productId] || 0) + o.quantity;
    });
    const topProducts = Object.entries(productCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([id, qty]) => ({
            name: products.find(p => p.id === id)?.name || 'Unknown',
            qty
        }));

    // 3. Stock Health
    const lowStockItems = materials.filter(m => m.quantity <= m.lowStockThreshold);
    const preOrderCount = orders.filter(o => o.isPreOrder && o.status !== 'cancelled').length;

    // 5. Customer Loyalty
    const repeatCustomerCount = customers.filter(c => c.purchaseCount > 1).length;
    const loyaltyRate = customers.length > 0 ? (repeatCustomerCount / customers.length) : 0;

    // 6. Business Health Score Calculation (0-100)
    let score = 50; // Starting baseline

    // Profitability (up to +20)
    score += Math.min(20, avgMargin * 40);

    // Efficiency (Pre-order penalty, up to -20)
    const preOrderRatio = totalOrders > 0 ? (preOrderCount / totalOrders) : 0;
    score -= Math.min(20, preOrderRatio * 50);

    // Loyalty (up to +15)
    score += Math.min(15, loyaltyRate * 30);

    // Inventory (Low stock penalty)
    score -= Math.min(15, lowStockItems.length * 3);

    // Growth Suggestions
    const suggestions = [];
    if (avgMargin < 0.25) suggestions.push({ type: 'profit', text: 'Low Profit Margins detected. Review your labor hours or material providers to reduce production costs.' });
    if (preOrderRatio > 0.20) suggestions.push({ type: 'stock', text: 'High Pre-order Rate. Increase safety stock levels for your most popular items to prevent delivery delays.' });
    if (loyaltyRate < 0.20) suggestions.push({ type: 'growth', text: 'Low Customer Retention. Consider a loyalty program or follow-up discount for first-time buyers.' });
    if (lowStockItems.length > 3) suggestions.push({ type: 'inventory', text: 'Multiple items are low in stock. Restock soon to avoid missing out on potential sales.' });

    if (suggestions.length === 0) {
        suggestions.push({ type: 'positive', text: 'Your business health is looking great! Maintain current efficiency levels.' });
    }

    return {
        score: Math.min(100, Math.max(0, Math.round(score))),
        metrics: {
            revenue: Number(revenue.toFixed(2)),
            profit: Number(totalProfit.toFixed(2)),
            avgMarginPct: Math.round(avgMargin * 100),
            orderCount: totalOrders,
            preOrderCount,
            lowStockCount: lowStockItems.length,
            loyaltyRatePct: Math.round(loyaltyRate * 100)
        },
        topProducts,
        suggestions: suggestions.slice(0, 3)
    };
}
