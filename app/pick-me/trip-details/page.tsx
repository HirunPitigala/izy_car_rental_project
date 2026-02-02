"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { mockRideVehicles, mockDriver } from "@/lib/mockPickMe";
import MockMap from "@/components/pick-me/MockMap";
import { ChevronLeft, Star, Phone, Shield, MapPin, Hash, Zap, CheckCircle2, Navigation, Clock, Info } from "lucide-react";
import { useState } from "react";

export default function TripDetailsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const vehicleId = searchParams.get("v");
    const [isSuccess, setIsSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const vehicle = mockRideVehicles.find(v => v.id === vehicleId) || mockRideVehicles[0];
    const bookingId = "BK-" + Math.random().toString(36).substr(2, 9).toUpperCase();

    const handleConfirm = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/auth/session");
            const data = await res.json();

            if (!data.loggedIn) {
                router.push("/login?redirect=/pick-me/trip-details?v=" + vehicleId);
                return;
            }

            // Mock booking success
            setTimeout(() => {
                setIsSuccess(true);
                setLoading(false);
            }, 1500);
        } catch (err) {
            console.error("Session check failed", err);
            setLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-[calc(100vh-72px)] flex items-center justify-center bg-[#f8fafc] p-6 text-center">
                <div className="max-w-md w-full bg-white rounded-[48px] p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 animate-in fade-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle2 className="w-12 h-12 text-green-500" />
                    </div>
                    <h1 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">Ride Confirmed!</h1>
                    <p className="text-gray-500 font-medium leading-relaxed mb-10 text-lg">
                        Gihan is on his way and will arrive in <span className="text-gray-900 font-bold">{vehicle.estimatedTime}</span>.
                        Get ready for your journey!
                    </p>
                    <div className="space-y-4">
                        <button
                            onClick={() => router.push("/")}
                            className="w-full h-16 bg-gray-900 text-white rounded-2xl font-black shadow-lg shadow-gray-200 transition-all active:scale-95"
                        >
                            Back to Home
                        </button>
                        <button
                            className="w-full h-16 bg-white text-gray-900 rounded-2xl font-black border border-gray-100 hover:bg-gray-50 transition-all"
                        >
                            Track Ride
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-[#f8fafc] min-h-[calc(100vh-72px)] flex flex-col md:flex-row">
            {/* Left Section: Live Map Panel */}
            <div className="w-full md:w-3/5 p-4 md:p-8 h-[400px] md:h-auto">
                <div className="h-full relative rounded-[40px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-4 border-white">
                    <MockMap />
                    <div className="absolute top-6 left-6 z-10">
                        <button
                            onClick={() => router.back()}
                            className="p-3 bg-white hover:bg-gray-50 rounded-2xl shadow-xl border border-gray-100 transition-all flex items-center gap-2 font-bold text-gray-900"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            <span className="hidden sm:inline">Back</span>
                        </button>
                    </div>
                    {/* Live Status Overlay */}
                    <div className="absolute top-6 right-6 z-10 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-xl border border-white/20 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-xs font-black text-gray-900 uppercase tracking-widest">Live Tracking</span>
                    </div>
                </div>
            </div>

            {/* Right Section: Details & Booking */}
            <div className="w-full md:w-2/5 p-4 md:p-8 flex flex-col">
                <div className="bg-white h-full rounded-[40px] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-50 overflow-y-auto max-h-[calc(100vh-140px)]">
                    <div className="flex items-center justify-between mb-10">
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Confirm Trip</h1>
                        <span className="px-4 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-black uppercase tracking-widest">{vehicle.type} Option</span>
                    </div>

                    <div className="space-y-8">
                        {/* Driver & Vehicle Panel */}
                        <div className="bg-[#f8fafc] rounded-[32px] p-6 border border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-5">
                                <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-md border-2 border-white">
                                    <Image
                                        src={mockDriver.photo}
                                        alt={mockDriver.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-gray-900">{mockDriver.name}</h3>
                                    <p className="text-sm font-bold text-gray-400 mb-2 uppercase">{mockDriver.vehicleNumber}</p>
                                    <div className="flex items-center gap-1.5 bg-white w-fit px-2.5 py-1 rounded-lg text-xs font-black shadow-sm">
                                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400 border-none" />
                                        {mockDriver.rating}
                                    </div>
                                </div>
                            </div>
                            <button className="p-4 bg-white rounded-2xl shadow-sm border border-gray-50 hover:bg-yellow-400 hover:text-gray-900 transition-all group">
                                <Phone className="w-6 h-6 text-gray-400 group-hover:text-gray-900 transition-colors" />
                            </button>
                        </div>

                        {/* Route Info */}
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center py-1">
                                    <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full ring-4 ring-yellow-50" />
                                    <div className="w-0.5 flex-1 bg-dashed border-l-2 border-dashed border-gray-200 my-1" />
                                    <div className="w-2.5 h-2.5 bg-gray-900 rounded-full ring-4 ring-gray-100" />
                                </div>
                                <div className="flex-1 space-y-6">
                                    <div>
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Pickup point</p>
                                        <p className="font-bold text-gray-900">Current Location (Galle Road, Colombo)</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Destination</p>
                                        <p className="font-bold text-gray-900">City Center Mall (Drop point)</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Trip Details Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[#f8fafc] p-5 rounded-3xl border border-gray-100">
                                <div className="flex items-center gap-3 mb-1">
                                    <div className="p-2 bg-white rounded-xl shadow-sm"><Navigation className="w-4 h-4 text-gray-400" /></div>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Distance</p>
                                </div>
                                <p className="text-xl font-black text-gray-900">12.5 KM</p>
                            </div>
                            <div className="bg-[#f8fafc] p-5 rounded-3xl border border-gray-100">
                                <div className="flex items-center gap-3 mb-1">
                                    <div className="p-2 bg-white rounded-xl shadow-sm"><Clock className="w-4 h-4 text-gray-400" /></div>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Est. Time</p>
                                </div>
                                <p className="text-xl font-black text-gray-900">{vehicle.estimatedTime}</p>
                            </div>
                            <div className="bg-[#f8fafc] p-5 rounded-3xl border border-gray-100 col-span-2">
                                <div className="flex items-center gap-3 mb-1">
                                    <div className="p-2 bg-white rounded-xl shadow-sm"><Hash className="w-4 h-4 text-gray-400" /></div>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Booking ID</p>
                                </div>
                                <p className="text-xl font-black text-gray-900">{bookingId}</p>
                            </div>
                        </div>

                        {/* Price Panel */}
                        <div className="bg-gray-900 p-8 rounded-[40px] text-white flex justify-between items-center shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-yellow-400/20 transition-all" />
                            <div className="relative z-10">
                                <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Total Fare Estimate</p>
                                <p className="text-2xl font-black text-yellow-400 tracking-tight">LKR {(vehicle.pricePerKm * 12.5).toLocaleString()}</p>
                            </div>
                            <div className="text-right relative z-10">
                                <Shield className="w-8 h-8 text-yellow-500 ml-auto mb-2" />
                                <p className="text-xs font-black leading-none opacity-50 uppercase tracking-tighter">Secured by<br />PickMe</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-4 flex gap-4">
                            <button
                                onClick={() => router.push("/pick-me/available-vehicles")}
                                className="h-16 px-8 rounded-2xl bg-[#f8fafc] text-gray-400 font-bold hover:bg-gray-100 transition-all border border-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={loading}
                                className="flex-1 h-16 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-black rounded-2xl shadow-xl shadow-yellow-100 transition-all flex items-center justify-center gap-3 text-xl disabled:opacity-50 active:scale-95"
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-4 border-gray-900 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Confirm Ride
                                        <Zap className="w-6 h-6 fill-gray-900" />
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                            <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
                            <p className="text-xs text-blue-600/80 font-medium">Standard waiting charges of LKR 5.00/min apply after 5 mins.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
