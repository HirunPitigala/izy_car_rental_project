"use client";

import Link from "next/link";
import { ChevronRight, Search, Loader2, Plus, ArrowLeft, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { getNonWeddingVehicles, addVehicleToWeddingCategory } from "@/lib/actions/weddingActions";
import { useRouter } from "next/navigation";

interface VehicleItem {
    vehicleId: number;
    brand: string | null;
    model: string | null;
    plateNumber: string;
    seatingCapacity: number;
    status: string | null;
    serviceCategory: string | null;
    image: string | null;
}

export default function AddWeddingCarPage() {
    const router = useRouter();
    const [vehicles, setVehicles] = useState<VehicleItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [adding, setAdding] = useState<number | null>(null);

    const fetchVehicles = async () => {
        setLoading(true);
        try {
            const result = await getNonWeddingVehicles();
            if (result.success) {
                setVehicles(result.data as any);
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

    const handleAdd = async (vehicleId: number) => {
        setAdding(vehicleId);
        const result = await addVehicleToWeddingCategory(vehicleId);
        if (result.success) {
            // Remove from local list
            setVehicles(prev => prev.filter(v => v.vehicleId !== vehicleId));
        } else {
            alert(result.error);
        }
        setAdding(null);
    };

    const filteredVehicles = vehicles.filter(v =>
        (v.brand || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (v.model || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.plateNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#fcfcfc] pb-12">
            <main className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
                {/* Breadcrumbs */}
                <div className="mb-8">
                    <nav className="mb-4 flex items-center gap-2 text-sm text-gray-400">
                        <Link href="/admin/dashboard" className="transition-colors hover:text-[#0f0f0f]">Admin</Link>
                        <ChevronRight className="h-4 w-4" />
                        <Link href="/admin/vehicles" className="transition-colors hover:text-[#0f0f0f]">Vehicles</Link>
                        <ChevronRight className="h-4 w-4" />
                        <Link href="/admin/vehicles/wedding-cars" className="transition-colors hover:text-[#0f0f0f]">Wedding Cars</Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="font-medium text-[#0f0f0f]">Add Vehicle</span>
                    </nav>

                    <div className="flex items-center gap-4 mb-2">
                        <button onClick={() => router.back()} className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-all">
                            <ArrowLeft className="h-5 w-5 text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight text-[#0f0f0f]">Add to Wedding Fleet</h1>
                            <p className="mt-1 text-gray-500">Select a vehicle to assign to the Wedding Car Rental category.</p>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="mb-6">
                    <div className="relative">
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

                {/* Vehicle List */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2.5rem] border border-dashed border-gray-200 shadow-sm">
                        <div className="relative">
                            <div className="h-16 w-16 rounded-full border-4 border-gray-50"></div>
                            <div className="absolute top-0 h-16 w-16 rounded-full border-4 border-amber-400 border-t-transparent animate-spin"></div>
                        </div>
                        <p className="mt-6 text-gray-400 font-bold tracking-tight">Loading vehicles...</p>
                    </div>
                ) : filteredVehicles.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2.5rem] border border-dashed border-gray-200 shadow-sm">
                        <Heart className="h-16 w-16 text-gray-200 mb-4" />
                        <h2 className="text-xl font-bold text-gray-400 mb-2">No Vehicles Available</h2>
                        <p className="text-gray-400">All vehicles are already assigned to categories or none match your search.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-3">
                        {filteredVehicles.map((v) => (
                            <div key={v.vehicleId} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-4 flex items-center gap-5">
                                {/* Thumbnail */}
                                <div className="h-16 w-24 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden">
                                    {v.image ? (
                                        <img src={v.image} alt={`${v.brand} ${v.model}`} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-gray-300">
                                            <Heart className="h-6 w-6" />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-bold text-[#0f0f0f] truncate">{v.brand} {v.model}</h3>
                                    <p className="text-xs text-gray-400">{v.plateNumber} • {v.seatingCapacity} Seats</p>
                                </div>

                                {/* Current Category */}
                                <div className="hidden sm:block">
                                    <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg">{v.serviceCategory}</span>
                                </div>

                                {/* Status */}
                                <div className={`px-3 py-1.5 rounded-lg text-xs font-bold ${v.status === "AVAILABLE" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                                    {v.status}
                                </div>

                                {/* Add Button */}
                                <button
                                    onClick={() => handleAdd(v.vehicleId)}
                                    disabled={adding === v.vehicleId}
                                    className="h-10 px-5 bg-amber-500 text-white rounded-xl flex items-center gap-2 text-xs font-bold hover:bg-amber-600 transition-all disabled:opacity-50 active:scale-95 flex-shrink-0"
                                >
                                    {adding === v.vehicleId ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <>
                                            <Plus className="h-4 w-4" />
                                            Add to Wedding
                                        </>
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
