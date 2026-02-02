"use client";

import Image from "next/image";
import Link from "next/link";
import { Edit2, Trash2, Eye, User, Fuel, Settings, Zap } from "lucide-react";
import { useState } from "react";
import VehicleDetailModal from "./VehicleDetailModal";

export interface Vehicle {
    vehicleId: number;
    brand: string;
    model: string;
    plateNumber: string;
    seatingCapacity: number;
    passengerCapacity?: number;
    transmissionType: string;
    fuelType: string;
    luggageCapacity: number;
    rentPerHour?: string;
    rentPerDay?: string;
    rentPerMonth?: string;
    ratePerDay?: string; // Legacy
    ratePerMonth?: string; // Legacy
    maxMileagePerDay?: number;
    extraMileageCharge?: string;
    minRentalPeriod?: number;
    maxRentalPeriod?: number;
    status: "AVAILABLE" | "UNAVAILABLE" | "MAINTENANCE";
    serviceCategory: string;
    image: string | null;
    description: string | null;
}

interface VehicleTableProps {
    vehicles: Vehicle[];
    onRefresh: () => void;
}

export default function VehicleTable({ vehicles, onRefresh }: VehicleTableProps) {
    const [isDeleting, setIsDeleting] = useState<number | null>(null);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this vehicle?")) return;

        setIsDeleting(id);
        try {
            const res = await fetch(`/api/admin/vehicles/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                onRefresh();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to delete vehicle");
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("An error occurred while deleting");
        } finally {
            setIsDeleting(null);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "AVAILABLE":
                return "bg-emerald-50 text-emerald-700 border-emerald-100";
            case "UNAVAILABLE":
                return "bg-rose-50 text-rose-700 border-rose-100";
            case "MAINTENANCE":
                return "bg-amber-50 text-amber-700 border-amber-100";
            default:
                return "bg-slate-50 text-slate-700 border-slate-100";
        }
    };

    return (
        <>
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm ring-1 ring-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50/50 text-xs font-bold uppercase tracking-wider text-gray-500">
                            <tr>
                                <th className="px-6 py-4">Vehicle Details</th>
                                <th className="px-6 py-4">Plate No</th>
                                <th className="px-6 py-4">Configuration</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Rent / Day</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {vehicles.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400 italic">
                                        No vehicles found.
                                    </td>
                                </tr>
                            ) : (
                                vehicles.map((vehicle) => (
                                    <tr key={vehicle.vehicleId} className="group transition-colors hover:bg-gray-50/50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="relative h-14 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-gray-50 border border-gray-100 shadow-sm">
                                                    {vehicle.image ? (
                                                        <img
                                                            src={vehicle.image.startsWith('data:') ? vehicle.image : `data:image/jpeg;base64,${vehicle.image}`}
                                                            alt={vehicle.model}
                                                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center text-xs text-gray-300">
                                                            No Image
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900">{vehicle.brand} {vehicle.model}</div>
                                                    <div className="text-xs text-gray-500 capitalize">{vehicle.serviceCategory}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-sm font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded-md">
                                                {vehicle.plateNumber}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-2">
                                                <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50/50 px-2 py-1 text-xs font-bold text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                                    <Settings className="h-3 w-3" /> {vehicle.transmissionType}
                                                </span>
                                                <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-50/50 px-2 py-1 text-xs font-bold text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                                                    <Fuel className="h-3 w-3" /> {vehicle.fuelType}
                                                </span>
                                                <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50/50 px-2 py-1 text-xs font-bold text-amber-700 ring-1 ring-inset ring-amber-700/10">
                                                    <User className="h-3 w-3" /> {vehicle.seatingCapacity}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${getStatusBadge(vehicle.status)}`}>
                                                {vehicle.status || "AVAILABLE"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-900">
                                            <span className="text-xs font-medium text-gray-400 mr-1">LKR</span>
                                            {parseFloat(vehicle.rentPerDay || vehicle.ratePerDay || "0").toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => setSelectedVehicle(vehicle)}
                                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-all hover:bg-gray-50 hover:text-[#0f0f0f] shadow-sm active:scale-95"
                                                    title="View Details"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                <Link
                                                    href={`/admin/vehicles/rent-a-car/edit/${vehicle.vehicleId}`}
                                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-all hover:bg-gray-50 hover:text-[#0f0f0f] shadow-sm active:scale-95"
                                                    title="Edit Vehicle"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(vehicle.vehicleId)}
                                                    disabled={isDeleting === vehicle.vehicleId}
                                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-rose-100 bg-white text-rose-500 transition-all hover:bg-rose-600 hover:text-white shadow-sm active:scale-95 disabled:opacity-50"
                                                    title="Delete Vehicle"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedVehicle && (
                <VehicleDetailModal
                    vehicle={selectedVehicle}
                    isOpen={!!selectedVehicle}
                    onClose={() => setSelectedVehicle(null)}
                />
            )}
        </>
    );
}
