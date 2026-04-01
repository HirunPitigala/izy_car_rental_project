"use client";

import Link from "next/link";
import { Plus, ChevronRight, Search, PlaneTakeoff } from "lucide-react";
import VehicleTable, { Vehicle } from "@/components/admin/VehicleTable";
import { useState, useEffect } from "react";
import { getVehiclesByCategory } from "@/lib/actions/vehicleActions";

export default function AirportRentalAdminPage() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchVehicles = async () => {
        setLoading(true);
        try {
            const result = await getVehiclesByCategory("Airport Rental");
            if (result.success) {
                setVehicles(result.data as any);
            }
        } catch (error) {
            console.error("Error fetching Airport Rental vehicles:", error);
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
        <div className="min-h-screen bg-[#fcfcfc] pb-12">
            <main className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
                {/* Breadcrumbs & Header */}
                <div className="mb-8">
                    <nav className="mb-4 flex items-center gap-2 text-sm text-gray-400">
                        <Link href="/admin/dashboard" className="transition-colors hover:text-[#0f0f0f]">Admin</Link>
                        <ChevronRight className="h-4 w-4" />
                        <Link href="/admin/vehicles" className="transition-colors hover:text-[#0f0f0f]">Vehicles</Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="font-medium text-[#0f0f0f]">Airport Rental</span>
                    </nav>

                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-50 rounded-lg">
                                    <PlaneTakeoff className="h-5 w-5 text-purple-600" />
                                </div>
                                <h1 className="text-2xl font-black tracking-tight text-[#0f0f0f]">Airport Rental Fleet</h1>
                            </div>
                            <p className="mt-2 text-gray-500">Manage and oversee all vehicles assigned to the Airport Rental service.</p>
                        </div>

                        <Link
                            href="/admin/vehicles/airport-rental/add"
                            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#0f0f0f] px-6 text-sm font-bold text-white shadow-xl shadow-gray-200 transition-all hover:bg-[#262626] active:scale-95"
                        >
                            <Plus className="h-5 w-5" />
                            Add Vehicle
                        </Link>
                    </div>
                </div>

                {/* Filters & Actions */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative flex-1 group">
                        <input
                            type="text"
                            placeholder="Search by brand, model or plate number..."
                            className="w-full rounded-2xl border border-gray-100 bg-white pl-12 pr-4 py-3.5 text-sm outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    </div>
                </div>

                {/* Vehicle Table */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2.5rem] border border-dashed border-gray-200 shadow-sm">
                        <div className="relative">
                            <div className="h-16 w-16 rounded-full border-4 border-gray-50"></div>
                            <div className="absolute top-0 h-16 w-16 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
                        </div>
                        <p className="mt-6 text-gray-400 font-bold tracking-tight">Synchronizing Fleet Data...</p>
                    </div>
                ) : (
                    <VehicleTable vehicles={filteredVehicles} onRefresh={fetchVehicles} editPath="/admin/vehicles/airport-rental" />
                )}
            </main>
        </div>
    );
}
