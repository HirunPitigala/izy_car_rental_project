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

function VehicleDetailsContent() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const vehicleId = params.vehicleId as string;

    const [vehicle, setVehicle] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const startDate = searchParams.get("rental_start_date") || "";
    const startTime = searchParams.get("rental_start_time") || "";
    const endDate = searchParams.get("rental_end_date") || "";
    const endTime = searchParams.get("rental_end_time") || "";

    // Calculate duration
    const start = new Date(`${startDate}T${startTime || "00:00"}`);
    const end = new Date(`${endDate}T${endTime || "00:00"}`);
    const durationMs = end.getTime() - start.getTime();
    const totalDays = Math.max(1, Math.ceil(durationMs / (1000 * 60 * 60 * 24)));

    useEffect(() => {
        const fetchVehicle = async () => {
            setLoading(true);
            try {
                // Call single vehicle API
                const res = await fetch(`/api/admin/vehicles/${vehicleId}`);
                if (res.ok) {
                    const data = await res.json();
                    setVehicle(data);
                } else {
                    // Fallback to mock
                    const mock = mockVehicles.find(v => v.id === vehicleId);
                    if (mock) {
                        setVehicle({
                            vehicleId: parseInt(mock.id),
                            brand: mock.brand,
                            model: mock.model,
                            plateNumber: mock.plateNumber,
                            capacity: mock.capacity,
                            transmissionType: mock.transmissionType,
                            fuelType: mock.fuelType,
                            luggageCapacity: mock.luggageCapacity,
                            ratePerDay: mock.ratePerDay,
                            description: mock.description,
                            image: mock.image,
                            availabilityStatus: mock.availabilityStatus
                        });
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchVehicle();
    }, [vehicleId]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-400 font-bold">Loading vehicle details...</p>
            </div>
        );
    }

    if (!vehicle) {
        return (
            <div className="container mx-auto px-6 py-24 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Vehicle not found</h2>
                <Link href="/rent/results" className="text-blue-600 font-bold hover:underline">Return to search</Link>
            </div>
        );
    }

    const totalPrice = totalDays * Number(vehicle.ratePerDay);

    return (
        <div className="container mx-auto px-6 py-12">
            <Link href={`/rent/results?${searchParams.toString()}`} className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors mb-8 group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to results
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left: Vehicle Details */}
                <div className="lg:col-span-2 space-y-12">
                    <section className="bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm">
                        <div className="relative h-[480px] w-full bg-gray-50">
                            <Image
                                src={vehicle.image || "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000"}
                                alt={vehicle.brand}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="p-10">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                                <div>
                                    <h1 className="text-2xl font-black text-gray-900 mb-2">{vehicle.brand} <span className="text-gray-400 font-medium">{vehicle.model}</span></h1>
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">{vehicle.plateNumber}</span>
                                        <div className="h-3 w-px bg-gray-200" />
                                        <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg uppercase tracking-wider">
                                            {vehicle.transmissionType}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-left md:text-right bg-gray-50 md:bg-transparent p-4 md:p-0 rounded-2xl w-full md:w-auto">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Standard Rate</p>
                                    <p className="text-2xl font-black text-gray-900">LKR {Number(vehicle.ratePerDay).toLocaleString()}<span className="text-sm text-gray-400 font-bold tracking-tight">/day</span></p>
                                </div>
                            </div>

                            <div className="bg-gray-50/50 rounded-3xl p-8 mb-10 border border-gray-50">
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Vehicle Description</h3>
                                <p className="text-gray-600 leading-relaxed font-medium">
                                    {vehicle.description || "The ultimate comfort and performance for your journey. Experience the best of automotive engineering with our premium fleet."}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                                    <Users className="w-5 h-5 text-blue-600 mb-3" />
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Capacity</p>
                                    <p className="font-bold text-gray-900">{vehicle.capacity} Seats</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                                    <Briefcase className="w-5 h-5 text-blue-600 mb-3" />
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Luggage</p>
                                    <p className="font-bold text-gray-900">{vehicle.luggageCapacity} Bags</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                                    <Gauge className="w-5 h-5 text-blue-600 mb-3" />
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Transmission</p>
                                    <p className="font-bold text-gray-900">{vehicle.transmissionType}</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                                    <Fuel className="w-5 h-5 text-blue-600 mb-3" />
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Fuel Type</p>
                                    <p className="font-bold text-gray-900">{vehicle.fuelType}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white rounded-[32px] border border-gray-100 p-10 shadow-sm">
                        <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                            <ShieldCheck className="w-6 h-6 text-blue-600" />
                            Rental Includes
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                            {[
                                "Collision Damage Waiver",
                                "Theft Protection",
                                "Roadside Assistance 24/7",
                                "Unlimited Mileage",
                                "Third Party Liability",
                                "Fuel Policy: Full to Full"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-blue-500" />
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
                            vehicle={vehicle}
                            startDate={startDate}
                            startTime={startTime}
                            endDate={endDate}
                            endTime={endTime}
                            totalDays={totalDays}
                            totalPrice={totalPrice}
                        />

                        <button
                            onClick={() => router.push(`/rent/agreement?${searchParams.toString()}&vehicleId=${vehicleId}&totalPrice=${totalPrice}`)}
                            className="w-full mt-8 h-16 bg-blue-600 hover:bg-black text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-3 text-lg group active:scale-95"
                        >
                            Proceed to Booking
                            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <div className="mt-6 flex items-start gap-3 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            <Info className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                            <p className="text-xs font-bold text-gray-500 leading-tight">
                                Immediate payment is NOT required. You will only pay once our team reviews and approves your reservation.
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
        <div className="min-h-screen bg-[#fafafa]">
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                </div>
            }>
                <VehicleDetailsContent />
            </Suspense>
        </div>
    );
}
