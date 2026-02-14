export function calculatePriceRecommendations(product, materials) {
    // 1. Calculate Raw Material Cost
    let totalMaterialCost = 0;
    if (product.materials) {
        product.materials.forEach(req => {
            const material = materials.find(m => m.id === req.materialId);
            if (material) {
                totalMaterialCost += (material.unitPrice * req.quantityRequired);
            }
        });
    }

    // 2. Labor Cost (Base rate $20/hr)
    const baseHourlyRate = 20;
    const laborCost = product.laborHours * baseHourlyRate;

    // 3. Complexity Multiplier (1 + (complexity * 0.1))
    const complexityMultiplier = 1 + (product.complexity * 0.1);

    // 4. Seasonal Factor (Nov-Dec = 1.2x)
    const currentMonth = new Date().getMonth(); // 0-indexed
    const seasonalFactor = (currentMonth === 10 || currentMonth === 11) ? 1.2 : 1.0;

    // Total Production Cost
    const productionCost = (totalMaterialCost + laborCost) * complexityMultiplier * seasonalFactor;

    // 5. Margin Calculations
    const calculateResult = (margin) => {
        const price = productionCost / (1 - margin);
        const profit = price - productionCost;
        return {
            price: Number(price.toFixed(2)),
            profit: Number(profit.toFixed(2)),
            margin: (margin * 100).toFixed(0) + '%'
        };
    };

    return {
        productionCost: Number(productionCost.toFixed(2)),
        base: calculateResult(0.20),      // 20% margin
        recommended: calculateResult(0.50), // 50% margin
        premium: calculateResult(0.75),     // 75% margin (realistic for premium gifts)
        factors: {
            materialCost: Number(totalMaterialCost.toFixed(2)),
            laborCost: Number(laborCost.toFixed(2)),
            complexityMultiplier,
            seasonalFactor
        }
    };
}
