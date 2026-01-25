"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, Calendar, MapPin, Heart, Map as MapIcon, Users } from "lucide-react";
import dynamic from "next/dynamic";

const MapModal = dynamic(() => import("@/components/rent/MapModal"), {
    ssr: false,
    loading: () => <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent"></div></div>
});

export default function WeddingLandingPage() {
    const router = useRouter();
    const [pickupLocation, setPickupLocation] = useState("");
    const [isMapOpen, setIsMapOpen] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.push("/wedding/available");
    };

    const handleLocationSelect = (location: string) => {
        setPickupLocation(location);
    };

    return (
        <div className="flex flex-col">
            {/* Hero Section - Clean, Light, Modern */}
            <section className="relative h-[600px] w-full flex items-center justify-center bg-[#fdfaf9] overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-red-50 to-transparent pointer-events-none" />

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="max-w-4xl mx-auto">
                        <span className="inline-block px-4 py-2 rounded-full bg-red-50 text-red-600 text-sm font-bold tracking-wider uppercase mb-6">
                            Wedding Collections
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight mb-6 tracking-tight">
                            Make your day <span className="text-red-500 italic">extraordinary</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 font-medium max-w-2xl mx-auto">
                            Premium luxury vehicles for the most important journey of your life.
                            Elegant choice, professional service.
                        </p>
                    </div>
                </div>
            </section>

            {/* Booking Filter Panel */}
            <div className="container mx-auto px-6 -mt-24 relative z-20 mb-20 flex justify-center">
                <div className="w-full max-w-5xl bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-10 border border-gray-100">
                    <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
                        <div className="w-2.5 h-10 bg-yellow-400 rounded-full" />
                        Plan Your Wedding Transport
                    </h2>

                    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Pickup Location */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-yellow-500" /> Pickup Location
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Select on map"
                                    value={pickupLocation}
                                    readOnly
                                    onClick={() => setIsMapOpen(true)}
                                    className="w-full h-14 bg-gray-50 border-2 border-transparent focus:border-yellow-400 rounded-2xl px-5 font-bold text-gray-700 outline-none transition-all cursor-pointer"
                                    required
                                />
                                <MapIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                            </div>
                        </div>

                        {/* Wedding Date */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-yellow-500" /> Wedding Date
                            </label>
                            <input type="date" className="w-full h-14 bg-gray-50 border-2 border-transparent focus:border-yellow-400 rounded-2xl px-5 font-bold text-gray-700 outline-none transition-all" required />
                        </div>

                        {/* Drive Option */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <Users className="w-4 h-4 text-yellow-500" /> Drive Option
                            </label>
                            <select className="w-full h-14 bg-gray-50 border-2 border-transparent focus:border-yellow-400 rounded-2xl px-5 font-bold text-gray-700 outline-none transition-all">
                                <option>With Driver</option>
                                <option>Self Drive</option>
                            </select>
                        </div>

                        {/* Search Button */}
                        <div className="flex items-end">
                            <button
                                type="submit"
                                className="w-full h-14 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-black rounded-2xl shadow-xl shadow-yellow-100 transition-all flex items-center justify-center gap-2 text-lg active:scale-95"
                            >
                                Find Wedding Cars
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <MapModal
                isOpen={isMapOpen}
                onClose={() => setIsMapOpen(false)}
                onSelectLocation={handleLocationSelect}
                title="Select Pickup Location"
            />
        </div>
    );
}
