"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getWeddingCarById } from "@/lib/actions/weddingActions";
import {
    ArrowLeft, Users, Fuel, Gauge, Briefcase,
    Heart, Loader2, ShieldCheck, CheckCircle2, Info, ChevronRight, Star
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ReviewList from "@/components/customer/ReviewList";

interface WeddingCarDetail {
    vehicleId: number;
    brand: string | null;
    model: string | null;
    plateNumber: string;
    seatingCapacity: number;
    luggageCapacity: number;
    transmissionType: string;
    fuelType: string;
    rentPerDay: string | null;
    rentPerHour: string | null;
    status: string | null;
    image: string | null;
    description: string | null;
}

export default function WeddingDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = parseInt(params.id as string);

    const [vehicle, setVehicle] = useState<WeddingCarDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        async function fetchVehicle() {
            if (isNaN(id)) {
                setNotFound(true);
                setLoading(false);
                return;
            }
            setLoading(true);
            const result = await getWeddingCarById(id);
            if (result.success && result.data) {
                setVehicle(result.data as any);
            } else {
                setNotFound(true);
            }
            setLoading(false);
        }
        fetchVehicle();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-red-600 animate-spin mb-3" />
                <p className="text-gray-400 font-medium text-sm">Loading vehicle details...</p>
            </div>
        );
    }

    if (notFound || !vehicle) {
        return (
            <div className="container mx-auto px-6 py-24 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Vehicle not found</h2>
                <Link href="/wedding/available" className="text-red-600 font-semibold hover:underline text-sm">
                    Return to wedding fleet
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 py-8">
                {/* Back link */}
                <button
                    onClick={() => router.push("/wedding/available")}
                    className="inline-flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-gray-800 transition-colors mb-6 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    Back to wedding fleet
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Vehicle Details */}
                    <div className="lg:col-span-2 space-y-5">
                        {/* Main vehicle card */}
                        <section className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                            {/* Image */}
                            <div className="relative h-64 sm:h-72 w-full bg-gray-50">
                                {vehicle.image ? (
                                    <Image
                                        src={vehicle.image}
                                        alt={`${vehicle.brand} ${vehicle.model}`}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                        <Heart className="w-20 h-20 text-gray-200" />
                                    </div>
                                )}
                                <div className="absolute top-4 left-4">
                                    <span className="bg-gray-900 text-white text-[10px] font-semibold px-3 py-1.5 rounded-md uppercase tracking-wider">
                                        Wedding Special
                                    </span>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="p-5 sm:p-6">
                                {/* Name + price row */}
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
                                        <div>
                                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                                                {vehicle.brand}{" "}
                                                <span className="text-gray-400 font-medium">{vehicle.model}</span>
                                            </h1>
                                            <div className="flex items-center gap-3 mt-1.5">
                                                <span className="text-xs font-medium text-gray-400 tracking-wide">
                                                    {vehicle.plateNumber}
                                                </span>
                                                <span className="w-px h-3 bg-gray-200" />
                                                <span className="text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-md">
                                                    Wedding Package
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                {/* Description */}
                                {vehicle.description && (
                                    <p className="text-sm text-gray-600 leading-relaxed mb-5 pb-5 border-b border-gray-100">
                                        {vehicle.description}
                                    </p>
                                )}

                                {/* Specs row */}
                                <div>
                                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
                                        Specifications
                                    </p>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {[
                                            { icon: Users, label: "Seats", value: `${vehicle.seatingCapacity} Seats` },
                                            { icon: Briefcase, label: "Luggage", value: `${vehicle.luggageCapacity} Bags` },
                                            { icon: Gauge, label: "Drive", value: vehicle.transmissionType },
                                            { icon: Fuel, label: "Fuel", value: vehicle.fuelType },
                                        ].map(({ icon: Icon, label, value }) => (
                                            <div
                                                key={label}
                                                className="flex items-center gap-3 bg-gray-50 px-3 py-3 rounded-lg border border-gray-100"
                                            >
                                                <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center text-gray-600 border border-gray-100 shrink-0">
                                                    <Icon className="w-4 h-4" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider">
                                                        {label}
                                                    </p>
                                                    <p className="text-xs font-semibold text-gray-800 truncate">{value}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Wedding Inclusions */}
                        <section className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 shadow-sm">
                            <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-red-600" />
                                Wedding Package Includes
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {[
                                    "Floral Decorations",
                                    "Professional Driver",
                                    "Full Day Availability",
                                    "Ribbon &amp; Bow Dressing",
                                    "Flexible Pickup Location",
                                    "Dedicated Support",
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                        <span className="text-sm text-gray-600">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Customer Reviews */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-3 px-2">
                                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                <h3 className="text-xl font-bold text-gray-900 tracking-tight">Customer Experiences</h3>
                            </div>
                            <ReviewList vehicleId={id} />
                        </section>
                    </div>

                    {/* Right: Wedding Package Sidebar */}
                    <div className="space-y-4">
                        <div className="sticky top-20">
                            <section className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 shadow-sm">
                                <h3 className="text-sm font-semibold text-gray-800 mb-4">Wedding Package</h3>

                                <div className="space-y-2 mb-5">
                                    <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2.5 border border-gray-100">
                                        <span className="text-xs font-medium text-gray-600">Decorations Included</span>
                                        <span className="text-xs font-bold text-emerald-600">YES</span>
                                    </div>
                                </div>

                                <Link
                                    href="/wedding#inquiry"
                                    className="w-full h-11 bg-gray-900 hover:bg-red-600 text-white font-semibold rounded-lg transition-all text-sm flex items-center justify-center gap-2 group active:scale-[0.98]"
                                >
                                    <Heart className="h-4 w-4" />
                                    Request Wedding Car
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                            </section>

                            {/* Info note */}
                            <div className="mt-3 flex items-start gap-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <Info className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    Submit an inquiry and our team will contact you to discuss your wedding requirements.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
