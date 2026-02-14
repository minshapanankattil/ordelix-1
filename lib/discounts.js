export function calculateDiscountRecommendations(product, customer, materials, pricing) {
    let discountPercentage = 0;
    let reasons = [];
    let alternatives = [];

    // 1. Customer Loyalty
    if (customer.loyaltyLevel === 'gold') {
        discountPercentage += 10;
        reasons.push('Gold Loyalty Reward (10%)');
    } else if (customer.loyaltyLevel === 'silver') {
        discountPercentage += 5;
        reasons.push('Silver Loyalty Reward (5%)');
    }

    // 2. Stock Availability (Check if any material has high stock)
    const highStockTrigger = materials.some(m => m.quantity > 50);
    if (highStockTrigger) {
        discountPercentage += 5;
        reasons.push('Inventory Surplus Clearance (5%)');
    }

    // 3. Seasonal Demand (Off-season boost)
    if (pricing.factors.seasonalFactor === 1.0) {
        discountPercentage += 5;
        reasons.push('Off-season promotion (5%)');
    }

    // 4. Payment Behavior
    if (customer.paymentBehavior === 'average') {
        discountPercentage -= 2;
        reasons.push('Payment Reliability adjustment (-2%)');
    }

    // Max discount cap
    if (discountPercentage > 25) discountPercentage = 25;
    if (discountPercentage < 0) discountPercentage = 0;

    // 5. Alternative Promotions Trigger
    // If margin after discount is tight, suggest alternatives
    const recommendedPrice = pricing.recommended.price;
    const productionCost = pricing.productionCost;
    const finalPrice = recommendedPrice * (1 - (discountPercentage / 100));
    const newMargin = (finalPrice - productionCost) / finalPrice;

    if (newMargin < 0.20) {
        alternatives.push('Free Greeting Card');
        alternatives.push('Premium Gift Wrapping');
        alternatives.push('Priority Delivery');
    }

    return {
        discountPercentage,
        reasons,
        alternatives,
        optimizedPrice: Number(finalPrice.toFixed(2)),
        originalPrice: recommendedPrice,
        marginAfterDiscount: (newMargin * 100).toFixed(0) + '%'
    };
}
