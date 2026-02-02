"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { mockVehicles } from "@/lib/mockVehicles";
import {
    ArrowLeft, Users, Fuel, Gauge, Snowflake, Package,
    MapPin, Clock, Calendar, Check, Info, ShieldCheck,
    Navigation, Music, Camera, Zap, LifeBuoy, Wind, Heart
} from "lucide-react";
import Link from "next/link";

export default function WeddingDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const vehicle = mockVehicles.find((v) => v.id === id);

    if (!vehicle) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Vehicle Not Found</h1>
                    <Link href="/wedding/available" className="text-red-600 font-bold hover:underline">
                        Back to Available Wedding Cars
                    </Link>
                </div>
            </div>
        );
    }

    const handlePayNow = () => {
        router.push("/login");
    };

    const getEquipmentIcon = (name: string) => {
        switch (name.toLowerCase()) {
            case 'gps': case 'navigation': return <Navigation className="w-5 h-5" />;
            case 'music system': case 'bluetooth': return <Music className="w-5 h-5" />;
            case 'backup camera': case 'reverse camera': return <Camera className="w-5 h-5" />;
            case 'air conditioning': return <Snowflake className="w-5 h-5" />;
            case 'airbags': return <LifeBuoy className="w-5 h-5" />;
            case 'wind': return <Wind className="w-5 h-5" />;
            default: return <Zap className="w-5 h-5" />;
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <div className="container mx-auto px-6 pt-10">
                <button
                    onClick={() => router.push("/wedding/available")}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-bold mb-8 transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to wedding fleet
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-[40px] overflow-hidden shadow-xl border border-gray-100">
                            <div className="relative h-[400px] md:h-[500px]">
                                <Image
                                    src={vehicle.image}
                                    alt={`${vehicle.brand} ${vehicle.model}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <div className="p-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
                                            {vehicle.brand} <span className="text-gray-400">{vehicle.model}</span>
                                        </h1>
                                        <div className="flex items-center gap-4 text-gray-500 font-medium font-mono text-lg">
                                            <span className="bg-gray-100 px-3 py-1 rounded-lg">{vehicle.plateNumber}</span>
                                            <span>•</span>
                                            <span className="text-red-500 font-bold">Wedding Special</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-extrabold text-red-600 leading-none">LKR {vehicle.ratePerDay.toLocaleString()}</p>
                                        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm mt-1">per day</p>
                                    </div>
                                </div>

                                <p className="text-gray-600 text-lg leading-relaxed mb-10 border-l-4 border-red-200 pl-6 italic">
                                    "{vehicle.description}"
                                </p>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <div className="bg-gray-50 p-6 rounded-3xl text-center">
                                        <Users className="w-8 h-8 mx-auto mb-3 text-red-500" />
                                        <p className="text-xs text-gray-400 font-bold uppercase">Capacity</p>
                                        <p className="text-lg font-bold text-gray-900">{vehicle.capacity} Seats</p>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-3xl text-center">
                                        <Gauge className="w-8 h-8 mx-auto mb-3 text-red-500" />
                                        <p className="text-xs text-gray-400 font-bold uppercase">Gearbox</p>
                                        <p className="text-lg font-bold text-gray-900">{vehicle.transmissionType}</p>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-3xl text-center">
                                        <Fuel className="w-8 h-8 mx-auto mb-3 text-red-500" />
                                        <p className="text-xs text-gray-400 font-bold uppercase">Fuel Type</p>
                                        <p className="text-lg font-bold text-gray-900">{vehicle.fuelType}</p>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-3xl text-center">
                                        <Package className="w-8 h-8 mx-auto mb-3 text-red-500" />
                                        <p className="text-xs text-gray-400 font-bold uppercase">Luggage</p>
                                        <p className="text-lg font-bold text-gray-900">{vehicle.luggageCapacity} Bags</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[40px] p-10 shadow-lg border border-gray-100">
                            <h3 className="text-2xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
                                <Heart className="w-8 h-8 text-red-500 fill-red-500" />
                                Wedding Inclusions
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {vehicle.equipment.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100 group">
                                        <div className="text-red-500 group-hover:scale-110 transition-transform">
                                            {getEquipmentIcon(item)}
                                        </div>
                                        <span className="font-bold text-gray-700">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-white rounded-[40px] p-10 shadow-xl border-t-8 border-gray-900 sticky top-28">
                            <h3 className="text-2xl font-extrabold text-gray-900 mb-8 italic text-center underline decoration-red-500 underline-offset-8">Wedding Package</h3>

                            <div className="space-y-4 mb-10">
                                <div className="flex justify-between items-center p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                    <span className="font-bold text-gray-500">Decorations Incl.</span>
                                    <span className="text-lg font-extrabold text-green-600">YES</span>
                                </div>
                                <div className="flex justify-between items-center p-4 rounded-2xl bg-red-50 border-2 border-red-100">
                                    <span className="font-bold text-red-600">Full Day Rate</span>
                                    <span className="text-xl font-extrabold text-red-600">LKR {vehicle.ratePerDay.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <button
                                    onClick={handlePayNow}
                                    className="w-full bg-gray-900 hover:bg-black text-white h-16 rounded-2xl text-xl font-extrabold shadow-xl transition-all hover:translate-y-[-2px] active:scale-95"
                                >
                                    Pay Now
                                </button>
                                <p className="text-xs text-gray-400 text-center font-medium">Verify your booking by signing in.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
