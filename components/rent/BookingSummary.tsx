"use client";

import { Calendar, Clock, Car } from "lucide-react";

interface BookingSummaryProps {
    vehicle: {
        brand: string;
        model: string;
        plateNumber: string;
        ratePerDay: string | number;
        ratePerHour?: string | number;
    };
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    totalDays: number;
    totalPrice: number;
    remainingHours?: number;
}

export default function BookingSummary({
    vehicle,
    startDate,
    startTime,
    endDate,
    endTime,
    totalDays,
    totalPrice,
    remainingHours = 0,
}: BookingSummaryProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-gray-900 px-5 py-4 flex items-center gap-3">
                <Car className="w-4 h-4 text-red-500 shrink-0" />
                <h3 className="text-sm font-semibold text-white tracking-wide">Booking Summary</h3>
            </div>

            <div className="px-5 py-4 space-y-4">
                {/* Vehicle Info */}
                <div>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                        Selected Vehicle
                    </p>
                    <div className="flex items-center justify-between gap-2 bg-gray-50 px-3 py-2.5 rounded-lg border border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">
                            {vehicle.brand}{" "}
                            <span className="font-normal text-gray-500">{vehicle.model}</span>
                        </p>
                        <span className="text-[10px] font-semibold text-white bg-gray-900 px-2.5 py-1 rounded-md tracking-wide whitespace-nowrap shrink-0">
                            {vehicle.plateNumber}
                        </span>
                    </div>
                </div>

                <div className="border-t border-gray-100" />

                {/* Pickup & Return */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Pick-up */}
                    <div>
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                            Pick-up
                        </p>
                        <div className="flex items-center gap-2 text-gray-800 mb-1.5">
                            <Calendar className="w-3.5 h-3.5 text-red-500 shrink-0" />
                            <span className="text-xs font-semibold whitespace-nowrap">{startDate || "—"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                            <Clock className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                            <span className="text-xs font-medium whitespace-nowrap">{startTime}</span>
                        </div>
                    </div>

                    {/* Return */}
                    <div>
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                            Return
                        </p>
                        <div className="flex items-center gap-2 text-gray-800 mb-1.5">
                            <Calendar className="w-3.5 h-3.5 text-red-500 shrink-0" />
                            <span className="text-xs font-semibold whitespace-nowrap">{endDate || "—"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                            <Clock className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                            <span className="text-xs font-medium whitespace-nowrap">{endTime}</span>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100" />

                {/* Duration & Rates */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-500">Duration</span>
                        <span className="text-xs font-semibold text-gray-800">
                            {totalDays} Day{totalDays !== 1 ? "s" : ""}
                            {remainingHours > 0 && ` ${remainingHours} Hr${remainingHours !== 1 ? "s" : ""}`}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-500">Daily Rate</span>
                        <span className="text-xs font-semibold text-gray-800">
                            LKR {Number(vehicle.ratePerDay).toLocaleString()} / day
                        </span>
                    </div>
                    {vehicle.ratePerHour && Number(vehicle.ratePerHour) > 0 && (
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-500">Hourly Rate</span>
                            <span className="text-xs font-semibold text-gray-800">
                                LKR {Number(vehicle.ratePerHour).toLocaleString()} / hr
                            </span>
                        </div>
                    )}
                </div>

                <div className="border-t border-gray-100" />

                {/* Total */}
                <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-800">Estimated Total</span>
                    <div className="text-right">
                        <p className="text-xl font-bold text-red-600">
                            LKR {totalPrice.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                            {totalDays}d × {Number(vehicle.ratePerDay).toLocaleString()}
                            {remainingHours > 0 &&
                                ` + ${remainingHours}h × ${Number(vehicle.ratePerHour || 0).toLocaleString()}`}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
