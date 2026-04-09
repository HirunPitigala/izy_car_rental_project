export const SERVICE_CATEGORIES = {
    RENT_A_CAR: "Rent a Car",
    PICKUPS: "Pickups",
    AIRPORT_RENTAL: "Airport Rental",
    WEDDING_CAR_RENTAL: "Wedding Car Rental",
} as const;

export type ServiceCategory = typeof SERVICE_CATEGORIES[keyof typeof SERVICE_CATEGORIES];
