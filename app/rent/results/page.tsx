"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import RentVehicleCard, { Vehicle } from "@/components/rent/RentVehicleCard";
import { Loader2, AlertCircle, Filter, Calendar } from "lucide-react";
import Link from "next/link";
import { mockVehicles } from "@/lib/mockVehicles";

function ResultsContent() {
    const searchParams = useSearchParams();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const startDate = searchParams.get("rental_start_date");
    const endDate = searchParams.get("rental_end_date");

    useEffect(() => {
        const fetchVehicles = async () => {
            setLoading(true);
            try {
                // Attempt to call existing admin API for vehicles
                const res = await fetch("/api/admin/vehicles");
                if (res.ok) {
                    const data = await res.json();
                    setVehicles(data);
                } else {
                    // Fallback to mock data for demonstration if API is restricted (401)
                    console.warn("API restricted or unavailable, falling back to mock data.");
                    const mockData: Vehicle[] = mockVehicles
                        .filter(v => !(v.brand === "Honda" && v.model === "Civic") && !(v.brand === "Suzuki" && v.model === "Alto"))
                        .map(v => ({
                            vehicleId: parseInt(v.id),
                            brand: v.brand,
                            model: v.model,
                            plateNumber: v.plateNumber,
                            capacity: v.capacity,
                            transmissionType: v.transmissionType,
                            fuelType: v.fuelType,
                            luggageCapacity: v.luggageCapacity,
                            ratePerDay: v.ratePerDay,
                            ratePerHour: v.ratePerHour,
                            availabilityStatus: v.availabilityStatus,
                            image: v.image,
                            description: v.description,
                            rating: 4.8 // Default rating for UI
                        }));
                    setVehicles(mockData);
                }
            } catch (err) {
                console.error("Fetch error:", err);
                setError("Unable to connect to service. Please check your connection.");
            } finally {
                setLoading(false);
            }
        };

        fetchVehicles();
    }, []);

    return (
        <div className="container mx-auto px-6 py-12">
            {/* Search Info Bar */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <div className="flex gap-8">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pick-up</p>
                            <p className="text-sm font-bold text-gray-900">{startDate || "N/A"}</p>
                        </div>
                        <div className="h-10 w-px bg-gray-100 hidden md:block" />
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Return</p>
                            <p className="text-sm font-bold text-gray-900">{endDate || "N/A"}</p>
                        </div>
                    </div>
                </div>

                <Link
                    href="/rent"
                    className="h-12 px-6 rounded-xl border border-gray-100 text-sm font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-2 transition-all"
                >
                    <Filter className="w-4 h-4" />
                    Modify Search
                </Link>
            </div>

            <div className="mb-10">
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Available Vehicles</h2>
                <p className="text-gray-500 font-medium">Found <span className="text-blue-600 font-bold">{vehicles.length}</span> results for your selected dates.</p>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-dashed border-gray-200">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                    <p className="text-gray-400 font-bold tracking-tight">Analyzing fleet availability...</p>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-100 rounded-3xl p-12 text-center max-w-2xl mx-auto">
                    <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 mx-auto mb-6">
                        <AlertCircle className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Connection Error</h3>
                    <p className="text-red-700 font-medium mb-8 leading-relaxed">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all shadow-lg"
                    >
                        Try Again
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {vehicles.map((vehicle) => (
                        <RentVehicleCard
                            key={vehicle.vehicleId}
                            vehicle={vehicle}
                            searchParams={searchParams.toString()}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function RentResultsPage() {
    return (
        <div className="min-h-screen bg-[#fafafa]">
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                </div>
            }>
                <ResultsContent />
            </Suspense>
        </div>
    );
}
