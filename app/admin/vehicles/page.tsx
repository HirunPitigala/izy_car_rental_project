"use client";

import Link from "next/link";
import { Plus, ChevronRight, LayoutGrid, List } from "lucide-react";
import VehicleTable, { Vehicle } from "@/components/admin/VehicleTable";
import { useState } from "react";

const mockVehicles: Vehicle[] = [
    {
        id: "1",
        name: "Toyota Axio",
        brand: "Toyota",
        type: "Sedan",
        pricePerDay: 8500,
        status: "Available",
        imageUrl: "",
    },
    {
        id: "2",
        name: "Honda Vezel",
        brand: "Honda",
        type: "SUV",
        pricePerDay: 12000,
        status: "Available",
        imageUrl: "",
    },
    {
        id: "3",
        name: "Nissan Caravan",
        brand: "Nissan",
        type: "Van",
        pricePerDay: 15000,
        status: "Unavailable",
        imageUrl: "",
    },
    {
        id: "4",
        name: "Suzuki Alto",
        brand: "Suzuki",
        type: "Sedan",
        pricePerDay: 4500,
        status: "Available",
        imageUrl: "",
    },
];

export default function AdminVehiclesPage() {
    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <main className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <nav className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                            <Link href="/admin/dashboard" className="hover:text-yellow-600">Admin</Link>
                            <ChevronRight className="h-4 w-4" />
                            <span className="text-gray-900 font-medium">Vehicles</span>
                        </nav>
                        <h1 className="text-3xl font-bold text-gray-900">Vehicles</h1>
                        <p className="mt-1 text-sm text-gray-500">Manage and monitor your vehicle fleet status.</p>
                    </div>

                    <Link
                        href="/admin/vehicles/add"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 text-sm font-bold text-black shadow-md transition-all hover:bg-yellow-500 hover:shadow-lg"
                    >
                        <Plus className="h-5 w-5" />
                        Add Vehicle
                    </Link>
                </div>

                {/* Filters/Actions Placeholder */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl bg-white p-4 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Search vehicles..."
                            className="w-full sm:w-80 rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none focus:border-yellow-500"
                        />
                        <select className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-yellow-500">
                            <option>All Types</option>
                            <option>Sedan</option>
                            <option>SUV</option>
                            <option>Van</option>
                        </select>
                    </div>
                </div>

                {/* Vehicle Table */}
                <VehicleTable vehicles={mockVehicles} />
            </main>
        </div>
    );
}
