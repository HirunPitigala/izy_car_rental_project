"use client";

import { useRouter } from "next/navigation";
import { mockRideVehicles } from "@/lib/mockPickMe";
import { ChevronLeft, Info } from "lucide-react";
import RideVehicleCard from "@/components/pick-me/RideVehicleCard";

export default function AvailableRidesPage() {
    const router = useRouter();

    return (
        <div className="bg-gray-50 min-h-screen pb-20 pt-10">
            <div className="container mx-auto px-6">
                {/* Header Section */}
                <div className="mb-12 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <button
                                onClick={() => router.push("/pick-me")}
                                className="p-2 bg-white hover:bg-gray-100 rounded-xl transition-all shadow-sm border border-gray-100"
                            >
                                <ChevronLeft className="w-6 h-6 text-gray-900" />
                            </button>
                            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Choose your ride</h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="text-gray-500 font-medium bg-white px-4 py-1.5 rounded-full border border-gray-100 shadow-sm">
                                Found <span className="text-gray-900 font-bold">{mockRideVehicles.length}</span> ride options for your journey
                            </p>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-2 text-green-600 font-bold text-sm bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        Live Availability
                    </div>
                </div>

                {/* Vehicles Grid - Matching Rent a Car grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {mockRideVehicles.map((vehicle) => (
                        <RideVehicleCard key={vehicle.id} vehicle={vehicle} />
                    ))}
                </div>

                {/* Note info - Modernized */}
                <div className="mt-16 bg-white border border-gray-100 p-8 rounded-[32px] shadow-sm flex flex-col md:flex-row gap-6 items-center">
                    <div className="p-4 bg-blue-50 rounded-2xl">
                        <Info className="w-8 h-8 text-blue-500 flex-shrink-0" />
                    </div>
                    <div>
                        <h4 className="text-lg font-black text-gray-900 mb-1">Important Information</h4>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed">
                            Estimated fares are based on distance and may vary slightly due to traffic conditions.
                            Waiting charges apply after 5 minutes of driver's arrival at the pickup point.
                            Tolls and extra parking fees are not included.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
