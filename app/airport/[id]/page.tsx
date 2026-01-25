"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { mockVehicles } from "@/lib/mockVehicles";
import {
    ArrowLeft, Users, Fuel, Gauge, Snowflake, Package,
    MapPin, Clock, Check, Info, ShieldCheck,
    Navigation, Music, Camera, Zap, Plane, Shield, Briefcase
} from "lucide-react";
import Link from "next/link";

export default function AirportDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const vehicle = mockVehicles.find((v) => v.id === id);

    if (!vehicle) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
                <div className="text-center">
                    <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Vehicle Not Found</h1>
                    <Link href="/airport/available" className="text-yellow-600 font-bold hover:underline">
                        Back to Airport Fleet
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
            default: return <Zap className="w-5 h-5" />;
        }
    };

    return (
        <div className="bg-[#f8fafc] min-h-screen pb-20">
            <div className="container mx-auto px-6 pt-10">
                {/* Back Button */}
                <button
                    onClick={() => router.push("/airport/available")}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-bold mb-8 transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to airport fleet
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Photos and Main Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-[40px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100">
                            <div className="relative h-[400px] md:h-[500px]">
                                <Image
                                    src={vehicle.image}
                                    alt={`${vehicle.brand} ${vehicle.model}`}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute top-6 left-6 bg-gray-900/80 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-white flex items-center gap-2">
                                    <Plane className="w-4 h-4" /> Airport Service
                                </div>
                            </div>

                            <div className="p-10">
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2 tracking-tight">
                                            {vehicle.brand} <span className="text-gray-400">{vehicle.model}</span>
                                        </h1>
                                        <div className="flex items-center gap-4 text-gray-400 font-bold text-lg">
                                            <span className="bg-gray-100 px-3 py-1 rounded-lg text-sm">{vehicle.plateNumber}</span>
                                            <span>•</span>
                                            <span className="text-sm uppercase tracking-widest">{vehicle.serviceCategory}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-4xl font-black text-gray-900 leading-none">LKR {vehicle.ratePerDay.toLocaleString()}</p>
                                        <p className="text-gray-400 font-black uppercase tracking-widest text-[10px] mt-2 italic">Standard Fixed Rate</p>
                                    </div>
                                </div>

                                <p className="text-gray-600 text-lg leading-relaxed mb-10 border-l-4 border-yellow-400 pl-6 italic font-medium">
                                    "{vehicle.description}"
                                </p>

                                {/* Specs Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <div className="bg-gray-50 p-6 rounded-3xl text-center hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100">
                                        <Users className="w-8 h-8 mx-auto mb-3 text-yellow-500" />
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Capacity</p>
                                        <p className="text-lg font-black text-gray-900">{vehicle.capacity} Seats</p>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-3xl text-center hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100">
                                        <Gauge className="w-8 h-8 mx-auto mb-3 text-yellow-500" />
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Gearbox</p>
                                        <p className="text-lg font-black text-gray-900">{vehicle.transmissionType}</p>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-3xl text-center hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100">
                                        <Fuel className="w-8 h-8 mx-auto mb-3 text-yellow-500" />
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Fuel Type</p>
                                        <p className="text-lg font-black text-gray-900">{vehicle.fuelType}</p>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-3xl text-center hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100">
                                        <Briefcase className="w-8 h-8 mx-auto mb-3 text-yellow-500" />
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Luggage</p>
                                        <p className="text-lg font-black text-gray-900">{vehicle.luggageCapacity} Bags</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Service Inclusions */}
                        <div className="bg-white rounded-[40px] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100">
                            <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                                <Shield className="w-8 h-8 text-yellow-500" />
                                Service Inclusions
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {vehicle.equipment.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100 group">
                                        <div className="text-yellow-500 group-hover:scale-110 transition-transform">
                                            {getEquipmentIcon(item)}
                                        </div>
                                        <span className="font-bold text-gray-700">{item}</span>
                                    </div>
                                ))}
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100 group">
                                    <div className="text-yellow-500 group-hover:scale-110 transition-transform">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <span className="font-bold text-gray-700">60m Free Wait</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Trip Details Sidebar */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-[40px] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border-t-8 border-yellow-400 sticky top-28">
                            <h3 className="text-2xl font-black text-gray-900 mb-8 tracking-tight">Travel Quote</h3>

                            <div className="space-y-6 mb-10">
                                <div className="flex justify-between items-center p-5 rounded-3xl bg-gray-50 border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-xl shadow-sm"><MapPin className="w-4 h-4 text-gray-400" /></div>
                                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Route</span>
                                    </div>
                                    <span className="font-bold text-gray-900">Airport ↔ City</span>
                                </div>

                                <div className="flex justify-between items-center p-5 rounded-3xl bg-gray-50 border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-xl shadow-sm"><ShieldCheck className="w-4 h-4 text-gray-400" /></div>
                                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Fixed Rate</span>
                                    </div>
                                    <span className="text-xl font-black text-gray-900">LKR {vehicle.ratePerDay.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <button
                                    onClick={handlePayNow}
                                    className="w-full bg-gray-900 hover:bg-yellow-400 hover:text-gray-900 text-white h-16 rounded-2xl text-xl font-black shadow-xl shadow-gray-100 transition-all hover:translate-y-[-2px] active:scale-95"
                                >
                                    Confirm & Pay
                                </button>
                                <div className="flex items-center gap-3 justify-center text-gray-400 text-[10px] font-black uppercase tracking-widest">
                                    <Clock className="w-4 h-4" />
                                    Instant Confirmation
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
