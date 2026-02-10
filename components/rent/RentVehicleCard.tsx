"use client";

import Image from "next/image";
import Link from "next/link";
import { Users, Fuel, Gauge, Briefcase, Star, Info, ChevronRight, Calculator } from "lucide-react";
import { calculateRentalPrice } from "@/lib/price-helper";

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

    // Parse search params for pricing
    const urlParams = new URLSearchParams(searchParams || "");
    const startDate = urlParams.get("rental_start_date") || "";
    const startTime = urlParams.get("rental_start_time") || "08:00";
    const endDate = urlParams.get("rental_end_date") || "";
    const endTime = urlParams.get("rental_end_time") || "18:00";

    const pricing = calculateRentalPrice(
        startDate,
        startTime,
        endDate,
        endTime,
        vehicle.ratePerDay,
        vehicle.ratePerHour || 0
    );

    // Fallback image handling
    const displayImage = vehicle.image || vehicle.imageUrl || "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000";

    return (
        <div className={`group bg-white rounded-3xl overflow-hidden border border-gray-100 transition-all duration-500 shadow-sm ${isAvailable ? "hover:shadow-2xl hover:shadow-gray-200 hover:border-red-100" : "opacity-75"}`}>
            {/* Image Container */}
            <div className="relative h-60 w-full overflow-hidden bg-[#f8f8f8]">
                <Image
                    src={displayImage}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    fill
                    className={`object-cover transition-transform duration-700 ${isAvailable ? "group-hover:scale-110" : "grayscale"}`}
                />
                <div className="absolute top-5 right-5">
                    <span className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg ${isAvailable ? "bg-white text-green-600" : "bg-white text-red-600"
                        }`}>
                        {vehicle.availabilityStatus}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-black text-[#0f0f0f] tracking-tight">{vehicle.brand} {vehicle.model}</h3>
                            {vehicle.rating && (
                                <div className="flex items-center gap-1.5 text-red-600 bg-red-50 px-2.5 py-1 rounded-xl">
                                    <Star className="w-3.5 h-3.5 fill-current" />
                                    <span className="text-[10px] font-black">{vehicle.rating}</span>
                                </div>
                            )}
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{vehicle.plateNumber}</p>
                    </div>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-y-4 gap-x-6 mb-8">
                    <div className="flex items-center gap-3 text-gray-500">
                        <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-[#0f0f0f]">
                            <Users className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold">{vehicle.capacity} Seats</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-500">
                        <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-[#0f0f0f]">
                            <Briefcase className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold">{vehicle.luggageCapacity} Lugg</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-500">
                        <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-[#0f0f0f]">
                            <Gauge className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold">{vehicle.transmissionType}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-500">
                        <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-[#0f0f0f]">
                            <Fuel className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold">{vehicle.fuelType}</span>
                    </div>
                </div>

                <div className="border-t border-gray-50 pt-6 flex items-center justify-between">
                    <div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                <Calculator className="w-3 h-3" />
                                Estimated Total
                            </span>
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-2xl font-black text-red-600">LKR {pricing.totalPrice.toLocaleString()}</span>
                            </div>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                                {pricing.totalDays}D {pricing.remainingHours}H @ LKR {Number(vehicle.ratePerDay).toLocaleString()}/day
                            </p>
                        </div>
                    </div>

                    <Link
                        href={isAvailable ? `/rent/${vehicle.vehicleId}${searchParams ? `?${searchParams}` : ""}` : "#"}
                        className={`inline-flex items-center gap-2 px-6 h-12 rounded-[14px] font-black text-xs uppercase tracking-widest transition-all ${isAvailable
                            ? "bg-[#0f0f0f] text-white hover:bg-red-600 shadow-xl shadow-gray-200 active:scale-95"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                    >
                        {isAvailable ? "Reserve" : "Blocked"}
                        {isAvailable && <ChevronRight className="w-4 h-4" />}
                    </Link>
                </div>
            </div>
        </div>
    );
}
