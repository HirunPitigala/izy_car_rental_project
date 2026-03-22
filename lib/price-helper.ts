export type ServiceCategory = "PICKUP" | "WEDDING" | "AIRPORT" | "NORMAL";

const MULTIPLIERS: Record<ServiceCategory, number> = {
    PICKUP: 1.2,
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

/**
 * Calculates the total rental price based on start and end dates/times and vehicle pricing.
 */
export function calculateRentalPrice(
    startDate: string,
    startTime: string,
    endDate: string,
    endTime: string,
    ratePerDay: number | string,
    ratePerHour: number | string
) {
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return { totalDays: 0, totalHours: 0, totalPrice: 0 };
    }

    const durationMs = end.getTime() - start.getTime();
    if (durationMs <= 0) {
        return { totalDays: 0, totalHours: 0, totalPrice: 0 };
    }

    const totalHoursRaw = durationMs / (1000 * 60 * 60);
    const totalDays = Math.floor(totalHoursRaw / 24);
    const remainingHours = Math.ceil(totalHoursRaw % 24);

    const dayRate = typeof ratePerDay === "string" ? parseFloat(ratePerDay) : ratePerDay;
    const hourRate = typeof ratePerHour === "string" ? parseFloat(ratePerHour) : ratePerHour;

    const totalPrice = (totalDays * dayRate) + (remainingHours * hourRate);

    return {
        totalDays,
        remainingHours,
        totalPrice: parseFloat(totalPrice.toFixed(2)),
        totalHoursRaw
    };
}
