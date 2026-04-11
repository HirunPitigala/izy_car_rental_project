"use client";

import Image from "next/image";
import Link from "next/link";
import { Users, Fuel, Gauge, Briefcase, Star, ChevronRight, Calculator } from "lucide-react";
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

    const displayImage =
        vehicle.image ||
        vehicle.imageUrl ||
        "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000";

    return (
        <div
            className={`group bg-white rounded-2xl border border-gray-100 transition-all duration-300 shadow-sm overflow-hidden flex flex-col sm:flex-row ${
                isAvailable
                    ? "hover:shadow-md hover:border-gray-200"
                    : "opacity-70"
            }`}
        >
            {/* Image */}
            <div className="relative sm:w-52 sm:flex-shrink-0 h-44 sm:h-auto bg-gray-50 overflow-hidden">
                <Image
                    src={displayImage}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    fill
                    className={`object-cover transition-transform duration-500 ${
                        isAvailable ? "group-hover:scale-105" : "grayscale"
                    }`}
                />
                {/* Status badge */}
                <span
                    className={`absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wide shadow-sm ${
                        isAvailable
                            ? "bg-white text-emerald-700"
                            : "bg-white text-red-600"
                    }`}
                >
                    {vehicle.availabilityStatus}
                </span>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-4 sm:p-5 gap-3">
                {/* Title row */}
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <h3 className="text-base font-bold text-gray-900 leading-tight">
                            {vehicle.brand}{" "}
                            <span className="font-medium text-gray-500">{vehicle.model}</span>
                        </h3>
                        <p className="text-[11px] font-medium text-gray-400 mt-0.5 tracking-wide">
                            {vehicle.plateNumber}
                        </p>
                    </div>
                    {vehicle.rating && (
                        <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-1 rounded-lg flex-shrink-0">
                            <Star className="w-3 h-3 fill-current" />
                            <span className="text-[11px] font-semibold">{vehicle.rating}</span>
                        </div>
                    )}
                </div>

                {/* Specs row — single horizontal line, no dividers to avoid wrapping */}
                <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                    <span className="flex items-center gap-1 text-gray-700 whitespace-nowrap">
                        <Users className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <span className="text-xs font-medium">{vehicle.capacity} Seats</span>
                    </span>
                    <span className="flex items-center gap-1 text-gray-700 whitespace-nowrap">
                        <Briefcase className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <span className="text-xs font-medium">{vehicle.luggageCapacity} Bags</span>
                    </span>
                    <span className="flex items-center gap-1 text-gray-700 whitespace-nowrap">
                        <Gauge className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <span className="text-xs font-medium">{vehicle.transmissionType}</span>
                    </span>
                    <span className="flex items-center gap-1 text-gray-700 whitespace-nowrap">
                        <Fuel className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <span className="text-xs font-medium">{vehicle.fuelType}</span>
                    </span>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-50" />

                {/* Pricing + CTA */}
                <div className="flex items-center justify-between gap-3 mt-auto">
                    <div>
                        <p className="flex items-center gap-1 text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-0.5">
                            <Calculator className="w-3 h-3" />
                            Estimated Total
                        </p>
                        <p className="text-lg font-bold text-gray-900 leading-none">
                            LKR {pricing.totalPrice.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                            {pricing.totalDays}d {pricing.remainingHours}h &middot; LKR{" "}
                            {Number(vehicle.ratePerDay).toLocaleString()}/day
                        </p>
                    </div>

                    <Link
                        href={
                            isAvailable
                                ? `/rent/${vehicle.vehicleId}${searchParams ? `?${searchParams}` : ""}`
                                : "#"
                        }
                        className={`inline-flex items-center gap-1.5 px-4 h-9 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex-shrink-0 ${
                            isAvailable
                                ? "bg-gray-900 text-white hover:bg-gray-700 active:scale-95"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                    >
                        {isAvailable ? "View Deal" : "Unavailable"}
                        {isAvailable && <ChevronRight className="w-3.5 h-3.5" />}
                    </Link>
                </div>
            </div>
        </div>
    );
}
