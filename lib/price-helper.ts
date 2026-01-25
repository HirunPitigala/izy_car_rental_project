export type ServiceCategory = "PICKME" | "WEDDING" | "AIRPORT" | "NORMAL";

const MULTIPLIERS: Record<ServiceCategory, number> = {
    PICKME: 1.2,
    WEDDING: 1.5,
    AIRPORT: 1.3,
    NORMAL: 1.0,
};

/**
 * Calculates the final price based on base price and service category.
 * @param basePrice - The base rate (hour, day, or month)
 * @param category - The service category
 * @returns The calculated final price
 */
export function calculateFinalPrice(basePrice: number | string, category: ServiceCategory | string): number {
    const price = typeof basePrice === "string" ? parseFloat(basePrice) : basePrice;
    const cat = (category as ServiceCategory) || "NORMAL";
    const multiplier = MULTIPLIERS[cat] || 1.0;

    return parseFloat((price * multiplier).toFixed(2));
}

/**
 * Gets the multiplier for a service category.
 */
export function getMultiplier(category: ServiceCategory | string): number {
    const cat = (category as ServiceCategory) || "NORMAL";
    return MULTIPLIERS[cat] || 1.0;
}
