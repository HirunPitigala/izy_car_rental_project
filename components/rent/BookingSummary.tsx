"use client";

import { Calendar, Clock, MapPin, Car } from "lucide-react";

interface BookingSummaryProps {
    vehicle: {
        brand: string;
        model: string;
        plateNumber: string;
        ratePerDay: string | number;
    };
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    totalDays: number;
    totalPrice: number;
}

export default function BookingSummary({
    vehicle,
    startDate,
    startTime,
    endDate,
    endTime,
    totalDays,
    totalPrice
}: BookingSummaryProps) {
    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gray-900 p-6 text-white">
                <h3 className="text-xl font-bold flex items-center gap-3">
                    <Car className="w-6 h-6 text-blue-400" />
                    Booking Summary
                </h3>
            </div>

            <div className="p-8 space-y-8">
                {/* Vehicle Info */}
                <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Selected Vehicle</p>
                    <div className="flex justify-between items-center">
                        <p className="text-lg font-bold text-gray-900">{vehicle.brand} {vehicle.model}</p>
                        <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">{vehicle.plateNumber}</span>
                    </div>
                </div>

                <div className="h-px bg-gray-50 w-full" />

                {/* Dates Info */}
                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Pick-up</p>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
                                <Calendar className="w-4 h-4 text-blue-600" />
                                {startDate}
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 font-medium text-xs">
                                <Clock className="w-4 h-4" />
                                {startTime}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Return</p>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
                                <Calendar className="w-4 h-4 text-blue-600" />
                                {endDate}
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 font-medium text-xs">
                                <Clock className="w-4 h-4" />
                                {endTime}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-px bg-gray-50 w-full" />

                {/* Duration & Price */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-500">Rental Duration</span>
                        <span className="text-sm font-black text-gray-900">{totalDays} Day{totalDays !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-500">Daily Rate</span>
                        <span className="text-sm font-black text-gray-900">LKR {Number(vehicle.ratePerDay).toLocaleString()}</span>
                    </div>
                    <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-lg font-black text-gray-900">Estimated Total</span>
                        <div className="text-right">
                            <p className="text-2xl font-black text-blue-600">LKR {totalPrice.toLocaleString()}</p>
                            <p className="text-xs font-bold text-gray-400 italic">Inclusive of taxes</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
