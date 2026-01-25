"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Navigation, ArrowRight, Clock, ShieldCheck, Map as MapIcon } from "lucide-react";
import dynamic from "next/dynamic";

const MapModal = dynamic(() => import("@/components/rent/MapModal"), {
    ssr: false,
    loading: () => <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent"></div></div>
});

export default function PickMeSearchPage() {
    const router = useRouter();
    const [pickup, setPickup] = useState("");
    const [destination, setDestination] = useState("");
    const [tripType, setTripType] = useState("one-way");
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [activeField, setActiveField] = useState<"pickup" | "destination" | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (pickup && destination) {
            router.push("/pick-me/available-vehicles");
        }
    };

    const openMap = (field: "pickup" | "destination") => {
        setActiveField(field);
        setIsMapOpen(true);
    };

    const handleLocationSelect = (location: string) => {
        if (activeField === "pickup") {
            setPickup(location);
        } else {
            setDestination(location);
        }
    };

    return (
        <div className="flex flex-col">
            {/* Hero Section - Clean, Light, Modern */}
            <section className="relative h-[600px] w-full flex items-center justify-center bg-[#f8fafc] overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="max-w-4xl mx-auto">
                        <span className="inline-block px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 text-sm font-bold tracking-wider uppercase mb-6">
                            Smart City Travel
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight mb-6 tracking-tight">
                            Request a ride, <span className="text-yellow-500">hop in</span> & go.
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 font-medium max-w-2xl mx-auto">
                            The most reliable ride-hailing service.
                            Professional drivers, fixed transparent pricing.
                        </p>
                    </div>
                </div>
            </section>

            {/* Booking Filter Panel */}
            <div className="container mx-auto px-6 -mt-24 relative z-20 mb-20 flex justify-center">
                <div className="w-full max-w-4xl bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-8 md:p-12 border border-gray-100">
                    <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
                        <div className="w-2.5 h-10 bg-yellow-400 rounded-full" />
                        Book a Ride
                    </h2>

                    <form onSubmit={handleSearch} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Pickup */}
                            <div className="relative">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 block">Pickup Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-500" />
                                    <input
                                        type="text"
                                        placeholder="Select pickup point on map"
                                        readOnly
                                        onClick={() => openMap("pickup")}
                                        className="w-full h-16 bg-gray-50 border-2 border-transparent focus:border-yellow-400 rounded-2xl pl-12 pr-12 font-bold text-gray-700 outline-none transition-all cursor-pointer"
                                        value={pickup}
                                        required
                                    />
                                    <MapIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                </div>
                            </div>

                            {/* Destination */}
                            <div className="relative">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 block">Destination</label>
                                <div className="relative">
                                    <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-500" />
                                    <input
                                        type="text"
                                        placeholder="Where to?"
                                        readOnly
                                        onClick={() => openMap("destination")}
                                        className="w-full h-16 bg-gray-50 border-2 border-transparent focus:border-yellow-400 rounded-2xl pl-12 pr-12 font-bold text-gray-700 outline-none transition-all cursor-pointer"
                                        value={destination}
                                        required
                                    />
                                    <MapIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                </div>
                            </div>
                        </div>

                        {/* Trip Type */}
                        <div className="space-y-4">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block">Trip Type</label>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setTripType("one-way")}
                                    className={`flex-1 h-14 rounded-2xl font-bold transition-all border-2 ${tripType === "one-way" ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-500 border-gray-100 hover:border-yellow-400"}`}
                                >
                                    One Way
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setTripType("round-trip")}
                                    className={`flex-1 h-14 rounded-2xl font-bold transition-all border-2 ${tripType === "round-trip" ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-500 border-gray-100 hover:border-yellow-400"}`}
                                >
                                    Round Trip
                                </button>
                            </div>
                        </div>

                        {/* Search Button */}
                        <button
                            type="submit"
                            className="w-full h-16 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-black rounded-2xl shadow-xl shadow-yellow-100 transition-all flex items-center justify-center gap-3 text-xl active:scale-95 group"
                        >
                            Search Available Vehicles
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>
                </div>
            </div>

            <MapModal
                isOpen={isMapOpen}
                onClose={() => setIsMapOpen(false)}
                onSelectLocation={handleLocationSelect}
                title={`Select ${activeField === "pickup" ? "Pickup Point" : "Destination"}`}
            />
        </div>
    );
}
