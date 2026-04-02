"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
    Plane, Users, Briefcase, Gauge, Fuel, ArrowLeft,
    Search, MapPin, Calendar, Clock, AlertCircle
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
        <div className="bg-gray-50 min-h-screen pb-20 pt-10">
            <div className="container mx-auto px-6">
                {/* Back link */}
                <Link
                    href="/airport"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-bold mb-8 transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Modify Search
                </Link>

                {/* Search Summary Card */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-10 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-50 rounded-xl"><Plane className="w-4 h-4 text-yellow-500" /></div>
                        <div>
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Type</p>
                            <p className="text-sm font-black text-gray-900 capitalize">Airport {transferType}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-50 rounded-xl"><MapPin className="w-4 h-4 text-yellow-500" /></div>
                        <div>
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Airport</p>
                            <p className="text-sm font-black text-gray-900">{airportLabel}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-50 rounded-xl"><Calendar className="w-4 h-4 text-yellow-500" /></div>
                        <div>
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Date &amp; Time</p>
                            <p className="text-sm font-black text-gray-900">
                                {transferType === "pickup" 
                                    ? `${pickupDate} ${pickupTime}` 
                                    : `${dropDate} ${dropTime}`}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-50 rounded-xl"><Users className="w-4 h-4 text-yellow-500" /></div>
                        <div>
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Capacity</p>
                            <p className="text-sm font-black text-gray-900">{passengers} pax · {luggage} bags</p>
                        </div>
                    </div>
                </div>

                {/* Header */}
                <div className="mb-10 flex flex-col items-center">
                    <h1 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Available Airport Transfers</h1>
                    {!loading && !error && (
                        <p className="text-gray-500 font-medium bg-white px-4 py-1.5 rounded-full border border-gray-100 shadow-sm">
                            Found <span className="text-gray-900 font-bold">{vehicles.length}</span>{" "}
                            {vehicles.length === 1 ? "vehicle" : "vehicles"} ready for your journey
                        </p>
                    )}
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-32">
                        <div className="relative">
                            <div className="h-16 w-16 rounded-full border-4 border-gray-100" />
                            <div className="absolute top-0 h-16 w-16 rounded-full border-4 border-yellow-400 border-t-transparent animate-spin" />
                        </div>
                        <p className="mt-6 text-gray-400 font-bold">Finding available vehicles...</p>
                    </div>
                )}

                {/* Error */}
                {error && !loading && (
                    <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-red-100">
                        <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
                        <p className="text-gray-700 font-bold text-lg">{error}</p>
                        <Link href="/airport" className="mt-4 text-yellow-600 font-bold hover:underline">Try Again</Link>
                    </div>
                )}

                {/* No vehicles */}
                {!loading && !error && vehicles.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-gray-200">
                        <Search className="w-12 h-12 text-gray-200 mb-4" />
                        <h2 className="text-xl font-black text-gray-400">No vehicles available</h2>
                        <p className="text-sm text-gray-400 mt-2 text-center max-w-sm">
                            No vehicles can accommodate <strong>{passengers} passengers</strong> with <strong>{luggage} bags</strong>. Try reducing the count.
                        </p>
                        <Link href="/airport" className="mt-6 text-yellow-600 font-bold hover:underline flex items-center gap-1">
                            <ArrowLeft className="w-4 h-4" /> Modify Search
                        </Link>
                    </div>
                )}

                {/* Vehicle Grid */}
                {!loading && !error && vehicles.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {vehicles.map((v) => (
                            <div
                                key={v.vehicleId}
                                className="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all overflow-hidden group"
                            >
                                {/* Image */}
                                <div className="relative h-52 bg-gray-100 overflow-hidden">
                                    {v.image ? (
                                        <Image
                                            src={v.image}
                                            alt={`${v.brand} ${v.model}`}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Plane className="w-16 h-16 text-gray-200" />
                                        </div>
                                    )}
                                    <div className="absolute top-3 left-3 bg-yellow-400 text-gray-900 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                                        Airport Service
                                    </div>
                                </div>

                                <div className="p-6">
                                    {/* Title + Price */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-lg font-black text-gray-900 leading-tight">
                                                {v.brand} {v.model}
                                            </h3>
                                            <span className="text-xs text-gray-400 font-mono">{v.plateNumber}</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-black text-gray-900">
                                                LKR {parseFloat(v.rentPerDay).toLocaleString()}
                                            </p>
                                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Fixed Rate</p>
                                        </div>
                                    </div>

                                    {/* Spec Pills */}
                                    <div className="flex flex-wrap gap-2 mb-5">
                                        <span className="inline-flex items-center gap-1 text-xs font-bold bg-gray-50 text-gray-600 px-3 py-1.5 rounded-full">
                                            <Users className="w-3 h-3" /> {v.seatingCapacity} seats
                                        </span>
                                        <span className="inline-flex items-center gap-1 text-xs font-bold bg-gray-50 text-gray-600 px-3 py-1.5 rounded-full">
                                            <Briefcase className="w-3 h-3" /> {v.luggageCapacity} bags
                                        </span>
                                        <span className="inline-flex items-center gap-1 text-xs font-bold bg-gray-50 text-gray-600 px-3 py-1.5 rounded-full">
                                            <Gauge className="w-3 h-3" /> {v.transmission}
                                        </span>
                                        <span className="inline-flex items-center gap-1 text-xs font-bold bg-gray-50 text-gray-600 px-3 py-1.5 rounded-full">
                                            <Fuel className="w-3 h-3" /> {v.fuelType}
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => handleBookNow(v.vehicleId)}
                                        className="w-full h-11 bg-gray-900 hover:bg-yellow-400 hover:text-gray-900 text-white rounded-2xl text-sm font-black transition-all active:scale-95"
                                    >
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function AirportAvailablePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="h-12 w-12 rounded-full border-4 border-yellow-400 border-t-transparent animate-spin" />
            </div>
        }>
            <AirportAvailableContent />
        </Suspense>
    );
}
