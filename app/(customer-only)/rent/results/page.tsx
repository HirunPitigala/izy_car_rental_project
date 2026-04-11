"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import RentVehicleCard, { Vehicle } from "@/components/rent/RentVehicleCard";
import { Loader2, AlertCircle, Filter, Calendar, Search } from "lucide-react";
import Link from "next/link";

import { getAvailableVehicles } from "@/lib/actions/vehicleActions";

function ResultsContent() {
    const searchParams = useSearchParams();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const startDate = searchParams.get("rental_start_date");
    const startTime = searchParams.get("rental_start_time");
    const endDate = searchParams.get("rental_end_date");
    const endTime = searchParams.get("rental_end_time");

    useEffect(() => {
        const fetchVehicles = async () => {
            if (!startDate || !endDate) {
                setError("Please select valid rental dates.");
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const result = await getAvailableVehicles(
                    startDate,
                    startTime || "08:00",
                    endDate,
                    endTime || "18:00"
                );

                if (result.success && result.data) {
                    const mappedVehicles: Vehicle[] = result.data.map((v: any) => ({
                        vehicleId: v.vehicleId,
                        brand: v.brand,
                        model: v.model,
                        plateNumber: v.plateNumber,
                        capacity: v.seatingCapacity,
                        transmissionType: v.transmissionType,
                        fuelType: v.fuelType,
                        luggageCapacity: v.luggageCapacity,
                        ratePerDay: v.rentPerDay,
                        ratePerHour: v.rentPerHour,
                        availabilityStatus: v.status || "Available",
                        image: v.image,
                        description: v.description,
                        rating: 4.8 // Default rating for UI
                    }));
                    setVehicles(mappedVehicles);
                } else {
                    setError(result.error || "Failed to fetch available vehicles.");
                }
            } catch (err) {
                console.error("Fetch error:", err);
                setError("Unable to connect to service. Please check your connection.");
            } finally {
                setLoading(false);
            }
        };

        fetchVehicles();
    }, [startDate, startTime, endDate, endTime]);

    return (
        <div className="container mx-auto px-4 sm:px-6 py-8">
            {/* Search Info Bar */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-5 mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5 shadow-sm">
                <div className="flex flex-wrap items-center gap-4 md:gap-8">
                    <div className="w-9 h-9 bg-red-50 rounded-lg shrink-0 flex items-center justify-center text-red-600">
                        <Calendar className="w-4 h-4" />
                    </div>
                    <div className="flex flex-wrap items-center gap-6 md:gap-10">
                        <div className="min-w-0">
                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Pick-up</p>
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">{startDate || "N/A"}</p>
                                <span className="text-gray-300 text-sm">·</span>
                                <p className="text-xs font-medium text-gray-500 whitespace-nowrap">{startTime || "08:00"}</p>
                            </div>
                        </div>
                        <div className="h-10 w-px bg-gray-100 hidden md:block" />
                        <div className="min-w-0">
                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Return</p>
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">{endDate || "N/A"}</p>
                                <span className="text-gray-300 text-sm">·</span>
                                <p className="text-xs font-medium text-gray-500 whitespace-nowrap">{endTime || "18:00"}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <Link
                    href="/rent"
                    className="h-9 px-4 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-900 hover:text-white flex items-center justify-center gap-1.5 transition-all whitespace-nowrap shrink-0"
                >
                    <Filter className="w-3.5 h-3.5" />
                    Modify Search
                </Link>
            </div>

            <div className="mb-5">
                <h2 className="text-xl font-bold text-gray-900 mb-1">Available Vehicles</h2>
                <p className="text-sm text-gray-500">Found <span className="text-red-600 font-semibold">{vehicles.length}</span> vehicle{vehicles.length !== 1 ? "s" : ""} for your dates</p>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-40 bg-white rounded-[3rem] border border-dashed border-gray-200">
                    <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-6" />
                    <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-xs">Analyzing Fleet Availability...</p>
                </div>
            ) : error ? (
                <div className="bg-white border border-red-100 rounded-[3rem] p-16 text-center max-w-2xl mx-auto shadow-xl shadow-red-50">
                    <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center text-red-600 mx-auto mb-8 shadow-sm">
                        <AlertCircle className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-black text-primary mb-3 uppercase">Availability Error</h3>
                    <p className="text-gray-500 font-medium mb-10 leading-relaxed">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-red-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary transition-all shadow-xl shadow-red-100"
                    >
                        Retry Search
                    </button>
                </div>
            ) : vehicles.length === 0 ? (
                <div className="bg-white border border-gray-100 rounded-[3rem] p-16 text-center max-w-2xl mx-auto shadow-sm">
                    <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-400 mx-auto mb-8">
                        <Search className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-black text-primary mb-3 uppercase">No Availability</h3>
                    <p className="text-gray-500 font-medium mb-10 leading-relaxed">We couldn't find any available vehicles for the selected dates. Try adjusting your schedule or contact our support team.</p>
                    <Link
                        href="/rent"
                        className="inline-block bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-600 transition-all shadow-xl shadow-gray-100"
                    >
                        Change Dates
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
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
        <div className="min-h-screen bg-gray-50">
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen">
                    <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
                </div>
            }>
                <ResultsContent />
            </Suspense>
        </div>
    );
}
