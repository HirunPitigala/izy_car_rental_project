"use client";

import Image from "next/image";
import Link from "next/link";
import { Edit2, Trash2, Eye } from "lucide-react";
import { useState } from "react";
import VehicleDetailModal from "./VehicleDetailModal";

export interface Vehicle {
    vehicleId: number;
    brand: string;
    model: string;
    plateNumber: string;
    seatingCapacity: number;
    transmissionType: string;
    fuelType: string;
    luggageCapacity: number;
    ratePerDay: string;
    ratePerMonth: string;
    status: "AVAILABLE" | "UNAVAILABLE" | "MAINTENANCE";
    serviceCategory: "PICKME" | "WEDDING" | "AIRPORT" | "NORMAL";
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
        <>
            <div className="ek-card border border-gray-100 mb-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500">
                            <tr>
                                <th className="px-6 py-4">Vehicle</th>
                                <th className="px-6 py-4">Plate No</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Service Category</th>
                                <th className="px-6 py-4">Base Price / Day</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {vehicles.map((vehicle) => (
                                <tr key={vehicle.vehicleId} className="transition-colors hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="relative h-12 w-16 overflow-hidden rounded-lg bg-gray-100 italic text-[10px] flex items-center justify-center text-gray-400 border">
                                                {vehicle.image ? (
                                                    <img
                                                        src={vehicle.image.startsWith('data:') ? vehicle.image : `data:image/jpeg;base64,${vehicle.image}`}
                                                        alt={vehicle.model}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <span>No Image</span>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{vehicle.brand} {vehicle.model}</div>
                                                <div className="text-xs text-gray-500 capitalize">{vehicle.transmissionType} • {vehicle.fuelType}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 font-mono font-medium">{vehicle.plateNumber}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(vehicle.status)}`}>
                                            {vehicle.status || "AVAILABLE"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                            {vehicle.serviceCategory || "NORMAL"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-900">
                                        LKR {parseFloat(vehicle.ratePerDay || "0").toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => setSelectedVehicle(vehicle)}
                                                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50"
                                            >
                                                <Eye className="h-3.5 w-3.5" />
                                                View
                                            </button>
                                            <Link
                                                href={`/admin/vehicles/edit/${vehicle.vehicleId}`}
                                                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50"
                                            >
                                                <Edit2 className="h-3.5 w-3.5" />
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(vehicle.vehicleId)}
                                                disabled={isDeleting === vehicle.vehicleId}
                                                className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 bg-white px-3 py-1.5 text-xs font-medium text-red-600 shadow-sm transition-all hover:bg-red-50 disabled:opacity-50"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                                {isDeleting === vehicle.vehicleId ? "..." : "Delete"}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
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
