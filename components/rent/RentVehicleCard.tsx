"use client";

import Image from "next/image";
import Link from "next/link";
import { Users, Fuel, Gauge, Briefcase, Star, Info, ChevronRight } from "lucide-react";

export interface Vehicle {
    vehicleId: number;
    brand: string;
    model: string;
    plateNumber: string;
    capacity: number;
    transmissionType: string;
    fuelType: string;
    luggageCapacity: number;
    ratePerDay: string | number;
    ratePerHour?: string | number;
    rating?: number;
    availabilityStatus: string;
    image?: string;
    imageUrl?: string;
    description?: string;
}

interface RentVehicleCardProps {
    vehicle: Vehicle;
    searchParams?: string;
}

export default function RentVehicleCard({ vehicle, searchParams }: RentVehicleCardProps) {
    const isAvailable = vehicle.availabilityStatus.toLowerCase() === "available";

    // Fallback image handling
    const displayImage = vehicle.image || vehicle.imageUrl || "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000";

    return (
        <div className={`group bg-white rounded-2xl overflow-hidden border border-gray-100 transition-all duration-300 ${isAvailable ? "hover:shadow-xl hover:border-blue-100" : "opacity-75"}`}>
            {/* Image Container */}
            <div className="relative h-56 w-full overflow-hidden bg-gray-50">
                <Image
                    src={displayImage}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    fill
                    className={`object-cover transition-transform duration-500 ${isAvailable ? "group-hover:scale-105" : "grayscale"}`}
                />
                <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${isAvailable ? "bg-green-500 text-white" : "bg-red-500 text-white"
                        }`}>
                        {vehicle.availabilityStatus}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-bold text-gray-900">{vehicle.brand} {vehicle.model}</h3>
                            {vehicle.rating && (
                                <div className="flex items-center gap-1 text-yellow-500 bg-yellow-50 px-2 py-0.5 rounded-lg">
                                    <Star className="w-3 h-3 fill-current" />
                                    <span className="text-xs font-bold">{vehicle.rating}</span>
                                </div>
                            )}
                        </div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{vehicle.plateNumber}</p>
                    </div>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-6">
                    <div className="flex items-center gap-2 text-gray-500">
                        <Users className="w-4 h-4 text-blue-500" />
                        <span className="text-xs font-medium">{vehicle.capacity} Seats</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                        <Briefcase className="w-4 h-4 text-blue-500" />
                        <span className="text-xs font-medium">{vehicle.luggageCapacity} Luggages</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                        <Gauge className="w-4 h-4 text-blue-500" />
                        <span className="text-xs font-medium">{vehicle.transmissionType}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                        <Fuel className="w-4 h-4 text-blue-500" />
                        <span className="text-xs font-medium">{vehicle.fuelType}</span>
                    </div>
                </div>

                <div className="border-t border-gray-50 pt-4 mt-4 flex items-center justify-between">
                    <div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-lg font-black text-gray-900">LKR {Number(vehicle.ratePerDay).toLocaleString()}</span>
                            <span className="text-xs font-bold text-gray-400">/ day</span>
                        </div>
                        {vehicle.ratePerHour && (
                            <p className="text-xs font-bold text-gray-400">LKR {Number(vehicle.ratePerHour).toLocaleString()} / hour</p>
                        )}
                    </div>

                    <Link
                        href={isAvailable ? `/rent/${vehicle.vehicleId}${searchParams ? `?${searchParams}` : ""}` : "#"}
                        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${isAvailable
                            ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-100 active:scale-95"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                    >
                        {isAvailable ? "Book Now" : "Unavailable"}
                        {isAvailable && <ChevronRight className="w-4 h-4" />}
                    </Link>
                </div>
            </div>
        </div>
    );
}
