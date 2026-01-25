"use client";

import { X, Calendar, User, Briefcase, Fuel, Settings, Luggage, Gauge } from "lucide-react";
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
                return "bg-green-100 text-green-700 border-green-200";
            case "UNAVAILABLE":
                return "bg-red-100 text-red-700 border-red-200";
            case "MAINTENANCE":
                return "bg-yellow-100 text-yellow-700 border-yellow-200";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
            <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white rounded-lg shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200" style={{ boxShadow: 'var(--ek-shadow)' }}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{vehicle.brand} {vehicle.model}</h2>
                        <p className="text-sm text-gray-500 font-mono mt-1">{vehicle.plateNumber}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <X className="h-6 w-6 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Image Gallery */}
                        <div className="space-y-4">
                            <div className="aspect-video w-full overflow-hidden rounded-[var(--ek-border-radius)] bg-gray-100 border">
                                {vehicle.image ? (
                                    <img
                                        src={vehicle.image.startsWith('data:') ? vehicle.image : `data:image/jpeg;base64,${vehicle.image}`}
                                        alt={vehicle.model}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-gray-400 italic">
                                        No Image Available
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-[var(--ek-border-radius)] border p-4 bg-gray-50/50">
                                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Status</p>
                                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(vehicle.status || "AVAILABLE")}`}>
                                        {vehicle.status || "AVAILABLE"}
                                    </span>
                                </div>
                                <div className="rounded-[var(--ek-border-radius)] border p-4 bg-gray-50/50">
                                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Category</p>
                                    <span className="text-sm font-bold text-blue-700">{vehicle.serviceCategory || "NORMAL"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Core Specifications</h3>
                                <div className="grid grid-cols-2 gap-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-yellow-50 rounded-lg">
                                            <User className="h-4 w-4 text-yellow-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Seating</p>
                                            <p className="font-semibold">{vehicle.seatingCapacity} Persons</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 rounded-lg">
                                            <Settings className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Transmission</p>
                                            <p className="font-semibold">{vehicle.transmissionType}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-50 rounded-lg">
                                            <Fuel className="h-4 w-4 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Fuel Type</p>
                                            <p className="font-semibold">{vehicle.fuelType}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-50 rounded-lg">
                                            <Luggage className="h-4 w-4 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Luggage</p>
                                            <p className="font-semibold">{vehicle.luggageCapacity} Items</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Pricing (Base Rates)</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between p-3 rounded-[var(--ek-border-radius)] bg-yellow-50 border border-yellow-100">
                                        <span className="text-gray-700 font-medium">Per Day</span>
                                        <span className="font-bold text-gray-900 text-lg">LKR {parseFloat(vehicle.ratePerDay || "0").toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between p-3 rounded-[var(--ek-border-radius)] bg-gray-50 border">
                                        <span className="text-gray-600">Per Month</span>
                                        <span className="font-bold text-gray-900">LKR {parseFloat(vehicle.ratePerMonth || "0").toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3">Vehicle Description</h3>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                            {vehicle.description || "No description provided for this vehicle."}
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="ek-button border border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
                    >
                        Close
                    </button>
                    <button
                        onClick={() => {
                            window.location.href = `/admin/vehicles/edit/${vehicle.vehicleId}`;
                        }}
                        className="ek-button bg-yellow-400 text-black font-bold shadow-sm hover:bg-yellow-500 transition-all hover:shadow-md"
                    >
                        Edit Details
                    </button>
                </div>
            </div>
        </div>
    );
}
