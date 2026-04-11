"use client";

import { useSearchParams, useRouter, useParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import {
    Loader2,
    ArrowLeft,
    ShieldCheck,
    CheckCircle2,
    ChevronRight,
    Users,
    Briefcase,
    Gauge,
    Fuel,
    Info
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import BookingSummary from "@/components/rent/BookingSummary";
import { mockVehicles } from "@/lib/mockVehicles";

import { getVehicleById } from "@/lib/actions/vehicleActions";
import { calculateRentalPrice } from "@/lib/price-helper";

function VehicleDetailsContent() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const vehicleId = params.vehicleId as string;

    const [vehicle, setVehicle] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const startDate = searchParams.get("rental_start_date") || "";
    const startTime = searchParams.get("rental_start_time") || "";
    const endDate = searchParams.get("rental_end_date") || "";
    const endTime = searchParams.get("rental_end_time") || "";

    const pricing = vehicle
        ? calculateRentalPrice(
              startDate,
              startTime || "08:00",
              endDate,
              endTime || "18:00",
              vehicle.rentPerDay,
              vehicle.rentPerHour
          )
        : { totalDays: 0, remainingHours: 0, totalPrice: 0 };

    const totalDays = pricing.totalDays;
    const totalPrice = pricing.totalPrice;

    useEffect(() => {
        const fetchVehicle = async () => {
            setLoading(true);
            try {
                const result = await getVehicleById(parseInt(vehicleId));
                if (result.success && result.data) {
                    setVehicle(result.data);
                } else {
                    setError(result.error || "Vehicle not found");
                }
            } catch (err) {
                console.error(err);
                setError("Failed to load vehicle details");
            } finally {
                setLoading(false);
            }
        };
        fetchVehicle();
    }, [vehicleId]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 text-red-600 animate-spin mb-3" />
                <p className="text-gray-400 font-medium text-sm">Loading vehicle details...</p>
            </div>
        );
    }

    if (error || !vehicle) {
        return (
            <div className="container mx-auto px-6 py-24 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Vehicle not found</h2>
                <Link href="/rent/results" className="text-red-600 font-semibold hover:underline text-sm">
                    Return to search
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 py-8">
            {/* Back link */}
            <Link
                href={`/rent/results?${searchParams.toString()}`}
                className="inline-flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-gray-800 transition-colors mb-6 group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                Back to results
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Vehicle Details */}
                <div className="lg:col-span-2 space-y-5">
                    {/* Main vehicle card */}
                    <section className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        {/* Image */}
                        <div className="relative h-64 sm:h-72 w-full bg-gray-50">
                            <Image
                                src={
                                    vehicle.image ||
                                    "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000"
                                }
                                alt={vehicle.brand}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute top-4 left-4">
                                <span className="bg-gray-900 text-white text-[10px] font-semibold px-3 py-1.5 rounded-md uppercase tracking-wider">
                                    Premium Fleet
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
                                            {vehicle.transmissionType}
                                        </span>
                                    </div>
                                </div>
                                <div className="sm:text-right flex-shrink-0">
                                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                                        Daily Rate
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        LKR {Number(vehicle.rentPerDay).toLocaleString()}
                                        <span className="text-sm text-gray-400 font-normal ml-1">/day</span>
                                    </p>
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
                                            <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center text-gray-600 border border-gray-100 flex-shrink-0">
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

                    {/* Rental Protection */}
                    <section className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 shadow-sm">
                        <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-red-600" />
                            Rental Protection &amp; Includes
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {[
                                "Collision Damage Waiver",
                                "Theft Protection Coverage",
                                "24/7 Roadside Assistance",
                                "Unlimited Mileage Policy",
                                "Third Party Liability",
                                "Fuel Policy: Full to Full",
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                    <span className="text-sm text-gray-600">{item}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right: Booking Summary */}
                <div className="space-y-4">
                    <div className="sticky top-20">
                        <BookingSummary
                            vehicle={{
                                brand: vehicle.brand,
                                model: vehicle.model,
                                plateNumber: vehicle.plateNumber,
                                ratePerDay: vehicle.rentPerDay,
                                ratePerHour: vehicle.rentPerHour,
                            }}
                            startDate={startDate}
                            startTime={startTime || "08:00"}
                            endDate={endDate}
                            endTime={endTime || "18:00"}
                            totalDays={totalDays}
                            totalPrice={totalPrice}
                            remainingHours={pricing.remainingHours}
                        />

                        {/* CTA */}
                        <button
                            onClick={() =>
                                router.push(
                                    `/rent/agreement?${searchParams.toString()}&vehicleId=${vehicleId}&totalPrice=${totalPrice}`
                                )
                            }
                            className="w-full mt-4 h-11 bg-gray-900 hover:bg-red-600 text-white font-semibold rounded-lg transition-all text-sm flex items-center justify-center gap-2 group active:scale-[0.98]"
                        >
                            Complete Reservation
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </button>

                        {/* Info note */}
                        <div className="mt-3 flex items-start gap-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <Info className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Instant approval is not guaranteed. Our team reviews all reservations within 60 minutes
                                during business hours.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function VehicleDetailsPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Suspense
                fallback={
                    <div className="flex items-center justify-center min-h-screen">
                        <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
                    </div>
                }
            >
                <VehicleDetailsContent />
            </Suspense>
        </div>
    );
}
