"use client";

import Link from "next/link";
import { Plus, ChevronRight, Search, Loader2, Trash2, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { getWeddingCars, removeVehicleFromWeddingCategory } from "@/lib/actions/weddingActions";

interface WeddingVehicle {
    vehicleId: number;
    brand: string | null;
    model: string | null;
    plateNumber: string;
    seatingCapacity: number;
    status: string | null;
    image: string | null;
    description: string | null;
    rentPerDay: string | null;
}

export default function WeddingCarsAdminPage() {
    const [vehicles, setVehicles] = useState<WeddingVehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [removing, setRemoving] = useState<number | null>(null);

    const fetchVehicles = async () => {
        setLoading(true);
        try {
            const result = await getWeddingCars();
            if (result.success) {
                setVehicles(result.data as any);
            }
        } catch (error) {
            console.error("Error fetching wedding cars:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    const handleRemove = async (vehicleId: number) => {
        if (!confirm("Remove this vehicle from the Wedding Car Rental list?")) return;
        setRemoving(vehicleId);
        const result = await removeVehicleFromWeddingCategory(vehicleId);
        if (result.success) {
            fetchVehicles();
        } else {
            alert(result.error);
        }
        setRemoving(null);
    };

    const filteredVehicles = vehicles.filter(v =>
        (v.brand || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (v.model || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
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
                        <span className="font-medium text-[#0f0f0f]">Wedding Car Rentals</span>
                    </nav>

                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="flex items-center gap-3">
                                <Heart className="h-6 w-6 text-amber-500 fill-amber-500" />
                                <h1 className="text-2xl font-black tracking-tight text-[#0f0f0f]">Wedding Car Rentals</h1>
                            </div>
                            <p className="mt-2 text-gray-500">Manage vehicles assigned to the Wedding Car Rental service.</p>
                        </div>

                        <div className="flex gap-3">
                            <Link
                                href="/admin/bookings/wedding-requests"
                                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border-2 border-amber-200 bg-amber-50 px-6 text-sm font-bold text-amber-700 transition-all hover:bg-amber-100 active:scale-95"
                            >
                                View Inquiries
                            </Link>
                            <Link
                                href="/admin/vehicles/wedding-cars/add"
                                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#0f0f0f] px-6 text-sm font-bold text-white shadow-xl shadow-gray-200 transition-all hover:bg-[#262626] active:scale-95"
                            >
                                <Plus className="h-5 w-5" />
                                Add Vehicle
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by brand, model or plate number..."
                            className="w-full rounded-2xl border border-gray-100 bg-white pl-12 pr-4 py-3.5 text-sm outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/5 transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Vehicle Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2.5rem] border border-dashed border-gray-200 shadow-sm">
                        <div className="relative">
                            <div className="h-16 w-16 rounded-full border-4 border-gray-50"></div>
                            <div className="absolute top-0 h-16 w-16 rounded-full border-4 border-amber-400 border-t-transparent animate-spin"></div>
                        </div>
                        <p className="mt-6 text-gray-400 font-bold tracking-tight">Loading Wedding Vehicles...</p>
                    </div>
                ) : filteredVehicles.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2.5rem] border border-dashed border-gray-200 shadow-sm">
                        <Heart className="h-16 w-16 text-gray-200 mb-4" />
                        <h2 className="text-xl font-bold text-gray-400 mb-2">No Wedding Cars Found</h2>
                        <p className="text-gray-400 mb-6">Add vehicles to the wedding car rental list to get started.</p>
                        <Link
                            href="/admin/vehicles/wedding-cars/add"
                            className="inline-flex h-12 items-center gap-2 rounded-2xl bg-[#0f0f0f] px-6 text-sm font-bold text-white"
                        >
                            <Plus className="h-5 w-5" />
                            Add First Vehicle
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredVehicles.map((v) => (
                            <div key={v.vehicleId} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all group">
                                {/* Image */}
                                <div className="relative h-48 bg-gray-100">
                                    {v.image ? (
                                        <img src={v.image} alt={`${v.brand} ${v.model}`} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-gray-300">
                                            <Heart className="h-12 w-12" />
                                        </div>
                                    )}
                                    <div className="absolute top-3 left-3 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                                        Wedding Special
                                    </div>
                                    <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${v.status === "AVAILABLE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                        {v.status}
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-5">
                                    <h3 className="text-lg font-bold text-[#0f0f0f] mb-1">
                                        {v.brand} {v.model}
                                    </h3>
                                    <p className="text-xs font-bold text-gray-400 mb-1">{v.plateNumber}</p>
                                    <p className="text-sm text-gray-500 mb-4">{v.seatingCapacity} Seats • {v.rentPerDay ? `LKR ${Number(v.rentPerDay).toLocaleString()}/day` : "Price on request"}</p>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleRemove(v.vehicleId)}
                                            disabled={removing === v.vehicleId}
                                            className="flex-1 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center gap-2 text-xs font-bold hover:bg-red-100 transition-all disabled:opacity-50"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                            {removing === v.vehicleId ? "Removing..." : "Remove"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
