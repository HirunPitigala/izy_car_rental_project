"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getWeddingCarById } from "@/lib/actions/weddingActions";
import {
    ArrowLeft, Users, Fuel, Gauge, Package,
    Heart, Loader2, MapPin
} from "lucide-react";
import Link from "next/link";

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
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="h-10 w-10 text-amber-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-400 font-medium">Loading vehicle details...</p>
                </div>
            </div>
        );
    }

    if (notFound || !vehicle) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Vehicle Not Found</h1>
                    <Link href="/wedding" className="text-amber-600 font-bold hover:underline">
                        Back to Wedding Cars
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <div className="container mx-auto px-6 pt-10">
                <button
                    onClick={() => router.push("/wedding")}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-bold mb-8 transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to wedding fleet
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left: Vehicle Details */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-[40px] overflow-hidden shadow-xl border border-gray-100">
                            {/* Image */}
                            <div className="relative h-[400px] md:h-[500px] bg-gray-100">
                                {vehicle.image ? (
                                    <img
                                        src={vehicle.image}
                                        alt={`${vehicle.brand} ${vehicle.model}`}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-gray-300">
                                        <Heart className="h-24 w-24" />
                                    </div>
                                )}
                                <div className="absolute top-4 left-4 bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                                    <Heart className="h-4 w-4 fill-white" />
                                    Wedding Special
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-10">
                                <div className="flex justify-between items-start mb-6 flex-wrap gap-4">
                                    <div>
                                        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
                                            {vehicle.brand} <span className="text-gray-400">{vehicle.model}</span>
                                        </h1>
                                        <div className="flex items-center gap-4 text-gray-500 font-medium font-mono text-lg">
                                            <span className="bg-gray-100 px-3 py-1 rounded-lg">{vehicle.plateNumber}</span>
                                            <span>•</span>
                                            <span className="text-amber-500 font-bold">Wedding Special</span>
                                        </div>
                                    </div>
                                    {vehicle.rentPerDay && (
                                        <div className="text-right">
                                            <p className="text-2xl font-extrabold text-amber-600 leading-none">LKR {Number(vehicle.rentPerDay).toLocaleString()}</p>
                                            <p className="text-gray-400 font-bold uppercase tracking-widest text-sm mt-1">per day</p>
                                        </div>
                                    )}
                                </div>

                                {vehicle.description && (
                                    <p className="text-gray-600 text-lg leading-relaxed mb-10 border-l-4 border-amber-200 pl-6 italic">
                                        &quot;{vehicle.description}&quot;
                                    </p>
                                )}

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <div className="bg-gray-50 p-6 rounded-3xl text-center">
                                        <Users className="w-8 h-8 mx-auto mb-3 text-amber-500" />
                                        <p className="text-xs text-gray-400 font-bold uppercase">Capacity</p>
                                        <p className="text-lg font-bold text-gray-900">{vehicle.seatingCapacity} Seats</p>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-3xl text-center">
                                        <Gauge className="w-8 h-8 mx-auto mb-3 text-amber-500" />
                                        <p className="text-xs text-gray-400 font-bold uppercase">Gearbox</p>
                                        <p className="text-lg font-bold text-gray-900">{vehicle.transmissionType}</p>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-3xl text-center">
                                        <Fuel className="w-8 h-8 mx-auto mb-3 text-amber-500" />
                                        <p className="text-xs text-gray-400 font-bold uppercase">Fuel Type</p>
                                        <p className="text-lg font-bold text-gray-900">{vehicle.fuelType}</p>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-3xl text-center">
                                        <Package className="w-8 h-8 mx-auto mb-3 text-amber-500" />
                                        <p className="text-xs text-gray-400 font-bold uppercase">Luggage</p>
                                        <p className="text-lg font-bold text-gray-900">{vehicle.luggageCapacity} Bags</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Wedding Package + CTA */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-[40px] p-10 shadow-xl border-t-8 border-amber-500 sticky top-28">
                            <h3 className="text-2xl font-extrabold text-gray-900 mb-8 italic text-center underline decoration-amber-500 underline-offset-8">
                                Wedding Package
                            </h3>

                            <div className="space-y-4 mb-10">
                                <div className="flex justify-between items-center p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                    <span className="font-bold text-gray-500">Decorations Incl.</span>
                                    <span className="text-lg font-extrabold text-green-600">YES</span>
                                </div>
                                {vehicle.rentPerDay && (
                                    <div className="flex justify-between items-center p-4 rounded-2xl bg-amber-50 border-2 border-amber-100">
                                        <span className="font-bold text-amber-600">Full Day Rate</span>
                                        <span className="text-xl font-extrabold text-amber-600">LKR {Number(vehicle.rentPerDay).toLocaleString()}</span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-6">
                                <Link
                                    href={`/wedding#inquiry`}
                                    className="w-full bg-amber-500 hover:bg-amber-600 text-white h-16 rounded-2xl text-xl font-extrabold shadow-xl transition-all hover:translate-y-[-2px] active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <Heart className="h-5 w-5 fill-white" />
                                    Request Wedding Car
                                </Link>
                                <p className="text-xs text-gray-400 text-center font-medium">
                                    Submit an inquiry and our team will contact you.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
