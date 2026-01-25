"use client";

import Link from "next/link";
import { Plus, ChevronRight, Search, Loader2 } from "lucide-react";
import VehicleTable, { Vehicle } from "@/components/admin/VehicleTable";
import { useState, useEffect } from "react";

export default function AdminVehiclesPage() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchVehicles = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/vehicles");
            if (res.ok) {
                const data = await res.json();
                setVehicles(data);
            }
        } catch (error) {
            console.error("Error fetching vehicles:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    const filteredVehicles = vehicles.filter(v =>
        v.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.plateNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

                {/* Filters/Actions */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl bg-white p-4 border border-gray-100 shadow-sm transition-all hover:shadow-md">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by brand, model or plate number..."
                            className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Vehicle Table */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                        <Loader2 className="h-10 w-10 animate-spin text-yellow-500" />
                        <p className="mt-4 text-gray-500 font-medium">Loading your fleet...</p>
                    </div>
                ) : (
                    <VehicleTable vehicles={filteredVehicles} onRefresh={fetchVehicles} />
                )}
            </main>
        </div>
    );
}
