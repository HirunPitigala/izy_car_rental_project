"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
    Plane, Users, Briefcase, Gauge, Fuel, ArrowLeft,
    Search, Calendar, AlertCircle, Loader2, ChevronRight
} from "lucide-react";
import Link from "next/link";

interface AirportVehicle {
    vehicleId: number;
    brand: string | null;
    model: string | null;
    plateNumber: string;
    seatingCapacity: number;
    luggageCapacity: number;
    transmission: string;
    fuelType: string;
    rentPerDay: string;
    image: string | null;
    description: string | null;
    status: string | null;
}

function AirportAvailableContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const transferType = searchParams.get("transferType") || "pickup";
    const airport = searchParams.get("airport") || "katunayaka";
    const pickupDate = searchParams.get("pickupDate") || "";
    const pickupTime = searchParams.get("pickupTime") || "";
    const dropDate = searchParams.get("dropDate") || "";
    const dropTime = searchParams.get("dropTime") || "";
    const passengers = searchParams.get("passengers") || "1";
    const luggage = searchParams.get("luggage") || "0";

    const [vehicles, setVehicles] = useState<AirportVehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchVehicles = async () => {
            setLoading(true);
            setError(null);
            try {
                const query = new URLSearchParams({
                    passengers,
                    luggage,
                    transferType,
                    pickupDate,
                    pickupTime,
                    dropDate,
                    dropTime
                });
                const res = await fetch(`/api/airport-rental/search?${query.toString()}`);
                const data = await res.json();
                if (res.ok && data.success) {
                    setVehicles(data.data);
                } else {
                    setError(data.error || "Failed to load vehicles.");
                }
            } catch {
                setError("Network error. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchVehicles();
    }, [passengers, luggage]);

    const airportLabel =
        airport === "katunayaka"
            ? "BIA — Katunayaka (Colombo)"
            : "HRI — Mattala (Hambantota)";

    const dateDisplay =
        transferType === "pickup"
            ? `${pickupDate}${pickupTime ? ` · ${pickupTime}` : ""}`
            : `${dropDate}${dropTime ? ` · ${dropTime}` : ""}`;

    const handleBookNow = (vehicleId: number) => {
        const params = new URLSearchParams({
            transferType,
            airport,
            pickupDate,
            pickupTime,
            dropDate,
            dropTime,
            passengers,
            luggage,
        });
        router.push(`/airport/${vehicleId}?${params.toString()}`);
    };

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
                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Type</p>
                            <p className="text-sm font-semibold text-gray-900 whitespace-nowrap capitalize">
                                Airport {transferType}
                            </p>
                        </div>
                        <div className="h-10 w-px bg-gray-100 hidden md:block" />
                        <div className="min-w-0">
                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Airport</p>
                            <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">{airportLabel}</p>
                        </div>
                        <div className="h-10 w-px bg-gray-100 hidden md:block" />
                        <div className="min-w-0">
                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Date &amp; Time</p>
                            <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">{dateDisplay || "N/A"}</p>
                        </div>
                        <div className="h-10 w-px bg-gray-100 hidden md:block" />
                        <div className="min-w-0">
                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Capacity</p>
                            <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">{passengers} pax · {luggage} bags</p>
                        </div>
                    </div>
                </div>

                <Link
                    href="/airport"
                    className="h-9 px-4 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-900 hover:text-white flex items-center justify-center gap-1.5 transition-all whitespace-nowrap shrink-0"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Modify Search
                </Link>
            </div>

            <div className="mb-5">
                <h2 className="text-xl font-bold text-gray-900 mb-1">Available Airport Vehicles</h2>
                <p className="text-sm text-gray-500">
                    Found <span className="text-red-600 font-semibold">{vehicles.length}</span> vehicle{vehicles.length !== 1 ? "s" : ""} for your transfer
                </p>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-40 bg-white rounded-[3rem] border border-dashed border-gray-200">
                    <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-6" />
                    <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-xs">Finding Available Vehicles...</p>
                </div>
            ) : error ? (
                <div className="bg-white border border-red-100 rounded-[3rem] p-16 text-center max-w-2xl mx-auto shadow-xl shadow-red-50">
                    <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center text-red-600 mx-auto mb-8 shadow-sm">
                        <AlertCircle className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-3 uppercase">Availability Error</h3>
                    <p className="text-gray-500 font-medium mb-10 leading-relaxed">{error}</p>
                    <Link
                        href="/airport"
                        className="inline-block bg-red-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-900 transition-all shadow-xl shadow-red-100"
                    >
                        Try Again
                    </Link>
                </div>
            ) : vehicles.length === 0 ? (
                <div className="bg-white border border-gray-100 rounded-[3rem] p-16 text-center max-w-2xl mx-auto shadow-sm">
                    <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-400 mx-auto mb-8">
                        <Search className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-3 uppercase">No Availability</h3>
                    <p className="text-gray-500 font-medium mb-10 leading-relaxed">
                        No vehicles can accommodate <strong>{passengers} passengers</strong> with <strong>{luggage} bags</strong>. Try reducing the count.
                    </p>
                    <Link
                        href="/airport"
                        className="inline-block bg-gray-900 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-600 transition-all shadow-xl shadow-gray-100"
                    >
                        Modify Search
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {vehicles.map((v) => (
                        <div
                            key={v.vehicleId}
                            className="group bg-white rounded-2xl border border-gray-100 transition-all duration-300 shadow-sm overflow-hidden flex flex-col sm:flex-row hover:shadow-md hover:border-gray-200"
                        >
                            {/* Image */}
                            <div className="relative sm:w-52 sm:shrink-0 h-44 sm:h-auto bg-gray-50 overflow-hidden">
                                {v.image ? (
                                    <Image
                                        src={v.image}
                                        alt={`${v.brand} ${v.model}`}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Plane className="w-12 h-12 text-gray-200" />
                                    </div>
                                )}
                                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wide shadow-sm bg-white text-gray-700">
                                    Airport Transfer
                                </span>
                            </div>

                            {/* Content */}
                            <div className="flex flex-col flex-1 p-4 sm:p-5 gap-3">
                                {/* Title row */}
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <h3 className="text-base font-bold text-gray-900 leading-tight">
                                            {v.brand}{" "}
                                            <span className="font-medium text-gray-500">{v.model}</span>
                                        </h3>
                                        <p className="text-[11px] font-medium text-gray-400 mt-0.5 tracking-wide">
                                            {v.plateNumber}
                                        </p>
                                    </div>
                                </div>

                                {/* Specs row */}
                                <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                                    <span className="flex items-center gap-1 text-gray-700 whitespace-nowrap">
                                        <Users className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                        <span className="text-xs font-medium">{v.seatingCapacity} Seats</span>
                                    </span>
                                    <span className="flex items-center gap-1 text-gray-700 whitespace-nowrap">
                                        <Briefcase className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                        <span className="text-xs font-medium">{v.luggageCapacity} Bags</span>
                                    </span>
                                    <span className="flex items-center gap-1 text-gray-700 whitespace-nowrap">
                                        <Gauge className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                        <span className="text-xs font-medium">{v.transmission}</span>
                                    </span>
                                    <span className="flex items-center gap-1 text-gray-700 whitespace-nowrap">
                                        <Fuel className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                        <span className="text-xs font-medium">{v.fuelType}</span>
                                    </span>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-gray-50" />

                                {/* Price + CTA */}
                                <div className="flex items-center justify-between gap-3 mt-auto">
                                    <div>
                                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-0.5">
                                            Fixed Rate
                                        </p>
                                        <p className="text-lg font-bold text-gray-900 leading-none">
                                            LKR {parseFloat(v.rentPerDay).toLocaleString()}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => handleBookNow(v.vehicleId)}
                                        className="inline-flex items-center gap-1.5 px-4 h-9 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 bg-gray-900 text-white hover:bg-gray-700 active:scale-95"
                                    >
                                        Book Now
                                        <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function AirportAvailablePage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen">
                    <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
                </div>
            }>
                <AirportAvailableContent />
            </Suspense>
        </div>
    );
}
