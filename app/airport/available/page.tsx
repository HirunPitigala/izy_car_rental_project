"use client";

import { mockVehicles } from "@/lib/mockVehicles";
import VehicleCard from "@/components/rent/VehicleCard";

export default function AirportAvailablePage() {
    const airportVehicles = mockVehicles.filter(v => v.serviceCategory === "Airport");

    return (
        <div className="bg-gray-50 min-h-screen pb-20 pt-10">
            <div className="container mx-auto px-6">
                {/* Header Section - Master Style */}
                <div className="mb-12 flex flex-col items-center">
                    <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Available Airport Transfers</h1>
                    <div className="flex items-center gap-2">
                        <p className="text-gray-500 font-medium bg-white px-4 py-1.5 rounded-full border border-gray-100 shadow-sm">
                            Found <span className="text-gray-900 font-bold">{airportVehicles.length}</span> vehicles ready for your journey
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {airportVehicles.map((vehicle) => (
                        <VehicleCard key={vehicle.id} vehicle={vehicle} baseUrl="/airport" />
                    ))}
                </div>
            </div>
        </div>
    );
}
