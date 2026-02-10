"use client";

import { Calendar, Clock, MapPin, Car } from "lucide-react";

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
    remainingHours = 0
}: BookingSummaryProps) {
    return (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-100 overflow-hidden">
            <div className="bg-[#0f0f0f] p-8 text-white">
                <h3 className="text-lg font-black uppercase tracking-[0.2em] flex items-center gap-4">
                    <Car className="w-6 h-6 text-red-600" />
                    Booking Summary
                </h3>
            </div>

            <div className="p-8 space-y-8">
                {/* Vehicle Info */}
                <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Selected Vehicle</p>
                    <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <p className="text-lg font-black text-[#0f0f0f]">{vehicle.brand} <span className="text-gray-400 font-bold">{vehicle.model}</span></p>
                        <span className="text-[10px] font-black text-white bg-[#0f0f0f] px-3 py-1.5 rounded-lg uppercase tracking-wider">{vehicle.plateNumber}</span>
                    </div>
                </div>

                <div className="h-px bg-gray-100 w-full" />

                {/* Dates Info */}
                <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pick-up</p>
                        <div className="space-y-2">
                            <div className="flex items-center gap-3 text-[#0f0f0f] font-black text-sm">
                                <Calendar className="w-4 h-4 text-red-600" />
                                {startDate}
                            </div>
                            <div className="flex items-center gap-3 text-gray-400 font-bold text-[10px] uppercase tracking-wider">
                                <Clock className="w-4 h-4 text-red-600/50" />
                                {startTime}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Return</p>
                        <div className="space-y-2">
                            <div className="flex items-center gap-3 text-[#0f0f0f] font-black text-sm">
                                <Calendar className="w-4 h-4 text-red-600" />
                                {endDate}
                            </div>
                            <div className="flex items-center gap-3 text-gray-400 font-bold text-[10px] uppercase tracking-wider">
                                <Clock className="w-4 h-4 text-red-600/50" />
                                {endTime}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-px bg-gray-100 w-full" />

                {/* Duration & Price */}
                <div className="space-y-5">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Rental Duration</span>
                        <div className="text-right">
                            <span className="text-sm font-black text-[#0f0f0f]">{totalDays} Day{totalDays !== 1 ? 's' : ''}</span>
                            {remainingHours > 0 && (
                                <span className="text-sm font-black text-[#0f0f0f]"> {remainingHours} Hour{remainingHours !== 1 ? 's' : ''}</span>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Base Rates</span>
                        <div className="text-right">
                            <p className="text-sm font-black text-[#0f0f0f]">LKR {Number(vehicle.ratePerDay).toLocaleString()}/Day</p>
                            {vehicle.ratePerHour && Number(vehicle.ratePerHour) > 0 && (
                                <p className="text-[10px] font-bold text-gray-400">LKR {Number(vehicle.ratePerHour).toLocaleString()}/Hour</p>
                            )}
                        </div>
                    </div>
                    <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-sm font-black text-[#0f0f0f] uppercase tracking-widest">Estimated Total</span>
                        <div className="text-right">
                            <p className="text-3xl font-black text-red-600">LKR {totalPrice.toLocaleString()}</p>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Breakdown: ({totalDays}d × {Number(vehicle.ratePerDay).toLocaleString()}) + ({remainingHours}h × {Number(vehicle.ratePerHour || 0).toLocaleString()})</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
