export interface Vehicle {
    id: string;
    brand: string;
    model: string;
    plateNumber: string;
    capacity: number;
    transmissionType: "Automatic" | "Manual";
    fuelType: string;
    luggageCapacity: number;
    ratePerHour: number;
    ratePerDay: number;
    ratePerMonth: number;
    availabilityStatus: "Available" | "Unavailable";
    serviceCategory: string;
    description: string;
    image: string;
    equipment: string[];
}

export const mockVehicles: Vehicle[] = [
    {
        id: "1",
        brand: "Toyota",
        model: "Prius",
        plateNumber: "CAB-1234",
        capacity: 5,
        transmissionType: "Automatic",
        fuelType: "Hybrid",
        luggageCapacity: 2,
        ratePerHour: 500,
        ratePerDay: 8500,
        ratePerMonth: 180000,
        availabilityStatus: "Available",
        serviceCategory: "Economy",
        description: "The Toyota Prius is a fuel-efficient hybrid that's perfect for city driving and long-distance travel. Comfort meets sustainability.",
        image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=1000",
        equipment: ["GPS", "Airbags", "Music system", "Reverse camera", "Air conditioning"]
    },
    {
        id: "4",
        brand: "Mercedes",
        model: "C-Class",
        plateNumber: "LP-7777",
        capacity: 5,
        transmissionType: "Automatic",
        fuelType: "Petrol",
        luggageCapacity: 2,
        ratePerHour: 2000,
        ratePerDay: 35000,
        ratePerMonth: 750000,
        availabilityStatus: "Available",
        serviceCategory: "Luxury",
        description: "Experience ultimate luxury and performance. The C-Class combines elegant design with cutting-edge technology.",
        image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=1000",
        equipment: ["Leather Seats", "Premium Audio", "Navigation", "Self-Parking", "Lane Assist"]
    },
    {
        id: "5",
        brand: "Jaguar",
        model: "XJ",
        plateNumber: "WED-0001",
        capacity: 4,
        transmissionType: "Automatic",
        fuelType: "Petrol",
        luggageCapacity: 2,
        ratePerHour: 5000,
        ratePerDay: 75000,
        ratePerMonth: 1500000,
        availabilityStatus: "Available",
        serviceCategory: "Wedding",
        description: "The ultimate wedding car. Elegant, spacious, and luxurious, ensuring a grand entrance on your special day.",
        image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=1000",
        equipment: ["GPS", "Airbags", "Music system", "Reverse camera", "Air conditioning", "Chauffeur Service"]
    },
    {
        id: "6",
        brand: "BMW",
        model: "7 Series",
        plateNumber: "WED-0007",
        capacity: 4,
        transmissionType: "Automatic",
        fuelType: "Petrol",
        luggageCapacity: 2,
        ratePerHour: 4500,
        ratePerDay: 65000,
        ratePerMonth: 1300000,
        availabilityStatus: "Available",
        serviceCategory: "Wedding",
        description: "Pure sophistication for your wedding day. The BMW 7 Series offers unparalleled comfort and style.",
        image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=1000",
        equipment: ["GPS", "Airbags", "Music system", "Reverse camera", "Air conditioning", "Sunroof"]
    },
    {
        id: "7",
        brand: "Toyota",
        model: "HiAce",
        plateNumber: "AIR-9999",
        capacity: 10,
        transmissionType: "Manual",
        fuelType: "Diesel",
        luggageCapacity: 10,
        ratePerHour: 1200,
        ratePerDay: 15000,
        ratePerMonth: 350000,
        availabilityStatus: "Available",
        serviceCategory: "Airport",
        description: "Perfect for airport transfers. Spacious and comfortable for large groups and heavy luggage.",
        image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1000",
        equipment: ["Air conditioning", "Music system", "Luggage Rack", "Spacious Interior"]
    },
    {
        id: "8",
        brand: "Nissan",
        model: "X-Trail",
        plateNumber: "AIR-5555",
        capacity: 7,
        transmissionType: "Automatic",
        fuelType: "Petrol",
        luggageCapacity: 5,
        ratePerHour: 1000,
        ratePerDay: 12000,
        ratePerMonth: 280000,
        availabilityStatus: "Available",
        serviceCategory: "Airport",
        description: "Versatile SUV ideal for airport pickups. Combines passenger comfort with generous cargo space.",
        image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000",
        equipment: ["GPS", "Airbags", "Music system", "Reverse camera", "Air conditioning", "All-Wheel Drive"]
    }
];
