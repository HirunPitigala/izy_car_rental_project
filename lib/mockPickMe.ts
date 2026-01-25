export interface RideVehicle {
    id: string;
    name: string;
    type: "Tuk" | "Mini" | "Car" | "Van";
    pricePerKm: number;
    estimatedTime: string;
    image: string;
}

export interface Driver {
    id: string;
    name: string;
    photo: string;
    vehicleNumber: string;
    rating: number;
}

export const mockRideVehicles: RideVehicle[] = [
    {
        id: "v1",
        name: "Bajaj RE",
        type: "Tuk",
        pricePerKm: 60,
        estimatedTime: "2 min",
        image: "https://images.unsplash.com/photo-1590457100441-9fb9f5597792?auto=format&fit=crop&q=80&w=400"
    },
    {
        id: "v2",
        name: "Suzuki Alto",
        type: "Mini",
        pricePerKm: 100,
        estimatedTime: "4 min",
        image: "https://images.unsplash.com/photo-1621245084961-4148417c8008?auto=format&fit=crop&q=80&w=400"
    },
    {
        id: "v3",
        name: "Toyota Corolla",
        type: "Car",
        pricePerKm: 150,
        estimatedTime: "5 min",
        image: "https://images.unsplash.com/photo-1594070319944-7c0c63146b7c?auto=format&fit=crop&q=80&w=400"
    },
    {
        id: "v4",
        name: "Toyota KDH",
        type: "Van",
        pricePerKm: 250,
        estimatedTime: "8 min",
        image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=400"
    }
];

export const mockDriver: Driver = {
    id: "d1",
    name: "Gihan Perera",
    photo: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=400",
    vehicleNumber: "WP CAB-1234",
    rating: 4.8
};
