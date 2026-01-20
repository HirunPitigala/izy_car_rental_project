"use client";

import Image from "next/image";
import Link from "next/link";
import { Edit2 } from "lucide-react";

export interface Vehicle {
    id: string;
    name: string;
    brand: string;
    type: string;
    pricePerDay: number;
    status: "Available" | "Unavailable";
    imageUrl: string;
}

interface VehicleTableProps {
    vehicles: Vehicle[];
}

export default function VehicleTable({ vehicles }: VehicleTableProps) {
    return (
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500">
                        <tr>
                            <th className="px-6 py-4">Vehicle</th>
                            <th className="px-6 py-4">Brand</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Price / Day</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {vehicles.map((vehicle) => (
                            <tr key={vehicle.id} className="transition-colors hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="relative h-12 w-16 overflow-hidden rounded-lg bg-gray-100">
                                            <Image
                                                src={vehicle.imageUrl || "/placeholder-car.png"}
                                                alt={vehicle.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <span className="font-medium text-gray-900">{vehicle.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600">{vehicle.brand}</td>
                                <td className="px-6 py-4 text-gray-600">{vehicle.type}</td>
                                <td className="px-6 py-4 font-semibold text-green-600">
                                    LKR {vehicle.pricePerDay.toLocaleString()}
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${vehicle.status === "Available"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {vehicle.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Link
                                        href={`/admin/vehicles/edit/${vehicle.id}`}
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                                    >
                                        <Edit2 className="h-3.5 w-3.5" />
                                        Edit
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
