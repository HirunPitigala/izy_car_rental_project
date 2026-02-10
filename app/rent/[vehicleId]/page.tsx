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

    // Calculate duration
    const pricing = vehicle ? calculateRentalPrice(
        startDate,
        startTime || "08:00",
        endDate,
        endTime || "18:00",
        vehicle.rentPerDay,
        vehicle.rentPerHour
    ) : { totalDays: 0, remainingHours: 0, totalPrice: 0 };

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
                <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-4" />
                <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Loading Vehicle details...</p>
            </div>
        );
    }

    if (error || !vehicle) {
        return (
            <div className="container mx-auto px-6 py-24 text-center">
                <h2 className="text-2xl font-black text-[#0f0f0f] mb-4 uppercase">Vehicle not found</h2>
                <Link href="/rent/results" className="text-red-600 font-black hover:underline uppercase tracking-widest text-xs">Return to search</Link>
            </div>
        );
    }

    // Pricing is already calculated above

    return (
        <div className="container mx-auto px-6 py-12">
            <Link href={`/rent/results?${searchParams.toString()}`} className="inline-flex items-center gap-3 text-[10px] font-black text-gray-400 hover:text-[#0f0f0f] uppercase tracking-[0.2em] transition-colors mb-10 group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to results
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left: Vehicle Details */}
                <div className="lg:col-span-2 space-y-12">
                    <section className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-xl shadow-gray-50">
                        <div className="relative h-[520px] w-full bg-[#fcfcfc]">
                            <Image
                                src={vehicle.image || "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000"}
                                alt={vehicle.brand}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute top-8 left-8">
                                <span className="bg-[#0f0f0f] text-white text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-[0.2em] shadow-2xl">
                                    Premium Fleet
                                </span>
                            </div>
                        </div>
                        <div className="p-12">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
                                <div>
                                    <h1 className="text-4xl font-black text-[#0f0f0f] mb-3 tracking-tight uppercase">{vehicle.brand} <span className="text-gray-400 font-medium">{vehicle.model}</span></h1>
                                    <div className="flex items-center gap-6">
                                        <span className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">{vehicle.plateNumber}</span>
                                        <div className="h-4 w-px bg-gray-200" />
                                        <span className="text-xs font-black text-red-600 bg-red-50 px-4 py-1.5 rounded-xl uppercase tracking-widest">
                                            {vehicle.transmissionType}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-left md:text-right bg-gray-50 md:bg-transparent p-6 md:p-0 rounded-3xl w-full md:w-auto border border-gray-100 md:border-transparent">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Standard Daily Rate</p>
                                    <p className="text-4xl font-black text-[#0f0f0f]">LKR {Number(vehicle.rentPerDay).toLocaleString()}<span className="text-sm text-gray-400 font-bold tracking-tight uppercase ml-2">/Day</span></p>
                                </div>
                            </div>

                            <div className="bg-gray-50/50 rounded-[2.5rem] p-10 mb-12 border border-gray-50 shadow-inner">
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 underline decoration-red-600 decoration-2 underline-offset-8">Vehicle Specifications</h3>
                                <p className="text-gray-600 leading-[1.8] font-medium text-lg">
                                    {vehicle.description || "The ultimate comfort and performance for your journey. Experience the best of automotive engineering with our premium local fleet."}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm transition-all hover:shadow-md">
                                    <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mb-4">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Capacity</p>
                                    <p className="font-black text-[#0f0f0f]">{vehicle.seatingCapacity} Seats</p>
                                </div>
                                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm transition-all hover:shadow-md">
                                    <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mb-4">
                                        <Briefcase className="w-6 h-6" />
                                    </div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Luggage</p>
                                    <p className="font-black text-[#0f0f0f]">{vehicle.luggageCapacity} Bags</p>
                                </div>
                                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm transition-all hover:shadow-md">
                                    <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mb-4">
                                        <Gauge className="w-6 h-6" />
                                    </div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Drive</p>
                                    <p className="font-black text-[#0f0f0f]">{vehicle.transmissionType}</p>
                                </div>
                                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm transition-all hover:shadow-md">
                                    <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mb-4">
                                        <Fuel className="w-6 h-6" />
                                    </div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Fuel Type</p>
                                    <p className="font-black text-[#0f0f0f]">{vehicle.fuelType}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white rounded-[2.5rem] border border-gray-100 p-12 shadow-xl shadow-gray-50/50">
                        <h3 className="text-xl font-black text-[#0f0f0f] mb-10 flex items-center gap-4 uppercase tracking-wider">
                            <ShieldCheck className="w-8 h-8 text-red-600" />
                            Rental Protection & Includes
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
                            {[
                                "Collision Damage Waiver",
                                "Theft Protection Coverage",
                                "24/7 Roadside Assistance",
                                "Unlimited Mileage Policy",
                                "Third Party Liability",
                                "Fuel Policy: Full to Full"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-5 border-b border-gray-50 pb-4">
                                    <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                                        <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                    <span className="font-bold text-sm text-gray-600">{item}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right: Booking Summary sticky */}
                <div className="space-y-8">
                    <div className="sticky top-24">
                        <BookingSummary
                            vehicle={{
                                brand: vehicle.brand,
                                model: vehicle.model,
                                plateNumber: vehicle.plateNumber,
                                ratePerDay: vehicle.rentPerDay,
                                ratePerHour: vehicle.rentPerHour
                            }}
                            startDate={startDate}
                            startTime={startTime || "08:00"}
                            endDate={endDate}
                            endTime={endTime || "18:00"}
                            totalDays={totalDays}
                            totalPrice={totalPrice}
                            remainingHours={pricing.remainingHours}
                        />

                        <button
                            onClick={() => router.push(`/rent/agreement?${searchParams.toString()}&vehicleId=${vehicleId}&totalPrice=${totalPrice}`)}
                            className="w-full mt-10 h-20 bg-[#0f0f0f] hover:bg-red-600 text-white font-black rounded-3xl transition-all shadow-2xl shadow-gray-200 flex items-center justify-center gap-4 text-xl group active:scale-[0.98] uppercase tracking-widest"
                        >
                            Complete Reservation
                            <ChevronRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
                        </button>

                        <div className="mt-8 flex items-start gap-4 bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 shadow-inner">
                            <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0">
                                <Info className="w-5 h-5 text-red-600" />
                            </div>
                            <p className="text-[11px] font-bold text-gray-500 leading-relaxed uppercase tracking-widest">
                                Instant approval is not guaranteed. Our team reviews all reservations within 60 minutes during business hours.
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
        <div className="min-h-screen bg-[#fcfcfc]">
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen">
                    <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
                </div>
            }>
                <VehicleDetailsContent />
            </Suspense>
        </div>
    );
}
