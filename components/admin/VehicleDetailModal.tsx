"use client";

import { X, Calendar, User, Briefcase, Fuel, Settings, Luggage, Gauge, Clock, Milestone, Coins, Box } from "lucide-react";
import { Vehicle } from "./VehicleTable";

interface VehicleDetailModalProps {
    vehicle: Vehicle;
    isOpen: boolean;
    onClose: () => void;
}

export default function VehicleDetailModal({ vehicle, isOpen, onClose }: VehicleDetailModalProps) {
    if (!isOpen) return null;

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "AVAILABLE":
                return "bg-emerald-100 text-emerald-700 border-emerald-200";
            case "UNAVAILABLE":
                return "bg-rose-100 text-rose-700 border-rose-200";
            case "MAINTENANCE":
                return "bg-amber-100 text-amber-700 border-amber-200";
            default:
                return "bg-slate-100 text-slate-700 border-slate-200";
        }
    };

    const rentPerHour = parseFloat(vehicle.rentPerHour || "0");
    const rentPerDay = parseFloat(vehicle.rentPerDay || vehicle.ratePerDay || "0");
    const rentPerMonth = parseFloat(vehicle.rentPerMonth || vehicle.ratePerMonth || "0");

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all duration-300">
            <div className="w-full max-w-5xl max-h-[90vh] overflow-hidden bg-white rounded-3xl shadow-2xl flex flex-col animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">{vehicle.brand} {vehicle.model}</h2>
                            <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${getStatusBadge(vehicle.status)}`}>
                                {vehicle.status || "AVAILABLE"}
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">{vehicle.plateNumber}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 rounded-2xl bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all active:scale-95"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Left Column: Image and Status */}
                        <div className="lg:col-span-5 space-y-6">
                            <div className="aspect-[4/3] w-full overflow-hidden rounded-[2.5rem] bg-gray-50 border border-gray-100 shadow-inner">
                                {vehicle.image ? (
                                    <img
                                        src={vehicle.image.startsWith('data:') ? vehicle.image : `data:image/jpeg;base64,${vehicle.image}`}
                                        alt={vehicle.model}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="h-full w-full flex flex-col items-center justify-center text-gray-300 bg-gradient-to-br from-gray-50 to-gray-100">
                                        <Box className="h-12 w-12 mb-2 opacity-20" />
                                        <span className="text-sm font-bold opacity-30">No Visualization</span>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-2xl border border-gray-100 p-4 bg-[#fcfcfc] shadow-sm">
                                    <p className="text-xs text-gray-400 uppercase font-black tracking-widest mb-1 text-center">CATEGORY</p>
                                    <p className="text-sm font-bold text-blue-600 text-center uppercase tracking-tight">{vehicle.serviceCategory}</p>
                                </div>
                                <div className="rounded-2xl border border-gray-100 p-4 bg-[#fcfcfc] shadow-sm">
                                    <p className="text-xs text-gray-400 uppercase font-black tracking-widest mb-1 text-center">TRANSMISSION</p>
                                    <p className="text-sm font-bold text-indigo-600 text-center uppercase tracking-tight">{vehicle.transmissionType}</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Specs and Pricing */}
                        <div className="lg:col-span-7 space-y-8">
                            {/* Specs Grid */}
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-5 flex items-center gap-2">
                                    <div className="h-1 w-4 bg-yellow-400 rounded-full" /> Core Specifications
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    <SpecItem icon={User} label="Seating" value={`${vehicle.seatingCapacity} Passengers`} bgColor="bg-blue-50" iconColor="text-blue-600" />
                                    <SpecItem icon={Settings} label="Gearbox" value={vehicle.transmissionType} bgColor="bg-indigo-50" iconColor="text-indigo-600" />
                                    <SpecItem icon={Fuel} label="Fuel" value={vehicle.fuelType} bgColor="bg-emerald-50" iconColor="text-emerald-600" />
                                    <SpecItem icon={Briefcase} label="Luggage" value={`${vehicle.luggageCapacity} Items`} bgColor="bg-amber-50" iconColor="text-amber-600" />
                                    <SpecItem icon={Calendar} label="Min Rent" value={`${vehicle.minRentalPeriod || 1} Day(s)`} bgColor="bg-rose-50" iconColor="text-rose-600" />
                                    <SpecItem icon={Milestone} label="Max KMs" value={`${vehicle.maxMileagePerDay || '--'} / Day`} bgColor="bg-slate-50" iconColor="text-slate-600" />
                                </div>
                            </div>

                            {/* Pricing Section */}
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-5 flex items-center gap-2">
                                    <div className="h-1 w-4 bg-emerald-400 rounded-full" /> Rental Rates
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <PriceCard label="Hourly" amount={rentPerHour} icon={Clock} accentColor="text-blue-600" />
                                    <PriceCard label="Daily" amount={rentPerDay} icon={Calendar} accentColor="text-emerald-600" destaque />
                                    <PriceCard label="Monthly" amount={rentPerMonth} icon={Briefcase} accentColor="text-indigo-600" />
                                </div>
                                {parseFloat(vehicle.extraMileageCharge || "0") > 0 && (
                                    <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white rounded-xl shadow-sm">
                                                <Coins className="h-4 w-4 text-slate-500" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-600">Extra Mileage Charge</span>
                                        </div>
                                        <span className="text-sm font-black text-slate-900">LKR {parseFloat(vehicle.extraMileageCharge || "0").toLocaleString()} / KM</span>
                                    </div>
                                )}
                            </div>

                            <div className="pt-6 border-t border-gray-100">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Vehicle Description</h3>
                                <div className="p-5 rounded-[2rem] bg-gray-50/50 border border-gray-100">
                                    <p className="text-sm text-gray-600 leading-relaxed italic">
                                        "{vehicle.description || "The administrator hasn't provided a description for this premium vehicle yet."}"
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-6 border-t border-gray-100 bg-white flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="h-12 px-8 rounded-2xl text-sm font-bold text-gray-500 bg-gray-50 hover:bg-gray-100 transition-all active:scale-95"
                    >
                        Dismiss
                    </button>
                    <button
                        onClick={() => {
                            window.location.href = `/admin/vehicles/rent-a-car/edit/${vehicle.vehicleId}`;
                        }}
                        className="h-12 px-8 rounded-2xl text-sm font-bold text-white bg-[#0f0f0f] hover:bg-[#262626] shadow-xl shadow-gray-200 transition-all active:scale-95"
                    >
                        Edit Configuration
                    </button>
                </div>
            </div>
        </div>
    );
}

function SpecItem({ icon: Icon, label, value, bgColor, iconColor }: any) {
    return (
        <div className="flex items-center gap-4">
            <div className={`p-3 ${bgColor} rounded-2xl shadow-sm`}>
                <Icon className={`h-4 w-4 ${iconColor}`} />
            </div>
            <div>
                <p className="text-xs text-gray-400 font-black uppercase tracking-widest">{label}</p>
                <p className="text-sm font-bold text-gray-900 tracking-tight">{value}</p>
            </div>
        </div>
    );
}

function PriceCard({ label, amount, icon: Icon, accentColor, destaque }: any) {
    return (
        <div className={`flex flex-col p-5 rounded-[2rem] border transition-all duration-300 ${destaque
            ? "bg-white border-yellow-200 shadow-xl shadow-yellow-500/5 ring-4 ring-yellow-50"
            : "bg-[#fcfcfc] border-gray-100 hover:bg-white hover:shadow-lg hover:shadow-gray-200/50"
            }`}>
            <div className="flex items-center gap-2 mb-4">
                <Icon className={`h-4 w-4 ${accentColor}`} />
                <span className="text-xs text-gray-400 font-black uppercase tracking-widest">{label} Rate</span>
            </div>
            <div className="mt-auto">
                <div className="text-xs font-bold text-gray-400 mb-1">LKR</div>
                <div className={`text-xl font-black ${destaque ? "text-gray-900" : "text-gray-700"}`}>
                    {amount.toLocaleString()}
                </div>
            </div>
        </div>
    );
}
