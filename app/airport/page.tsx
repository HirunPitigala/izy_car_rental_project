"use client";

import { useRouter } from "next/navigation";
import { Search, Calendar, MapPin, Plane, Users, Clock, ShieldCheck, Briefcase } from "lucide-react";

export default function AirportLandingPage() {
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.push("/airport/available");
    };

    return (
        <div className="flex flex-col">
            {/* Hero Section - Master Style */}
            <section className="relative h-[650px] w-full flex items-center justify-center bg-[#f8fafc] overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-yellow-50 to-transparent pointer-events-none" />

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="max-w-4xl mx-auto">
                        <span className="inline-block px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 text-sm font-bold tracking-wider uppercase mb-6">
                            24/7 Airport Transfers
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight mb-6 tracking-tight">
                            Reliable airport <span className="text-yellow-500">pickups & drops</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 font-medium max-w-2xl mx-auto">
                            Start or end your journey with comfort.
                            Professional drivers and spacious vehicles for all your luggage needs.
                        </p>
                    </div>
                </div>
            </section>

            {/* Booking Filter Panel - Refined with Luggage Field */}
            <div className="container mx-auto px-6 -mt-24 relative z-20 mb-20">
                <div className="bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-10 border border-gray-100">
                    <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
                        <div className="w-2.5 h-10 bg-yellow-400 rounded-full" />
                        Find Your Airport Ride
                    </h2>

                    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Service Type */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Plane className="w-4 h-4 text-yellow-500" /> Transfer Type
                            </label>
                            <select className="w-full h-14 bg-gray-50 border-2 border-transparent focus:border-yellow-400 rounded-2xl px-5 font-bold text-gray-700 outline-none transition-all">
                                <option>Airport Drop</option>
                                <option>Airport Pickup</option>
                            </select>
                        </div>

                        {/* Location */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-yellow-500" /> Airport
                            </label>
                            <select className="w-full h-14 bg-gray-50 border-2 border-transparent focus:border-yellow-400 rounded-2xl px-5 font-bold text-gray-700 outline-none transition-all">
                                <option>BIA (Colombo)</option>
                                <option>Mattala (HRI)</option>
                            </select>
                        </div>

                        {/* Date */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-yellow-500" /> Transfer Date
                            </label>
                            <input type="date" className="w-full h-14 bg-gray-50 border-2 border-transparent focus:border-yellow-400 rounded-2xl px-5 font-bold text-gray-700 outline-none transition-all" required />
                        </div>

                        {/* Passengers */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Users className="w-4 h-4 text-yellow-500" /> Passengers
                            </label>
                            <select className="w-full h-14 bg-gray-50 border-2 border-transparent focus:border-yellow-400 rounded-2xl px-5 font-bold text-gray-700 outline-none transition-all">
                                <option>1-4 People</option>
                                <option>5-8 People</option>
                                <option>Full Van (10+)</option>
                            </select>
                        </div>

                        {/* Luggage Field - NEW */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-yellow-500" /> Number of Luggages
                            </label>
                            <select className="w-full h-14 bg-gray-50 border-2 border-transparent focus:border-yellow-400 rounded-2xl px-5 font-bold text-gray-700 outline-none transition-all">
                                <option>0</option>
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4+</option>
                            </select>
                        </div>

                        {/* Search Button */}
                        <div className="flex items-end">
                            <button
                                type="submit"
                                className="w-full h-14 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-black rounded-2xl shadow-xl shadow-yellow-100 transition-all flex items-center justify-center gap-2 text-lg active:scale-95"
                            >
                                <Search className="w-6 h-6" /> Search Available Cars
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Features Section - Modern & Clean */}
            <section className="container mx-auto px-6 mb-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-3xl border border-gray-100 flex items-center gap-5 shadow-sm hover:shadow-md transition-all">
                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-yellow-500">
                        <Clock className="w-7 h-7" />
                    </div>
                    <div>
                        <h4 className="font-black text-gray-900">Complimentary Wait</h4>
                        <p className="text-sm text-gray-400 font-medium">60 mins wait time for pickups</p>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-gray-100 flex items-center gap-5 shadow-sm hover:shadow-md transition-all">
                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-yellow-500">
                        <Plane className="w-7 h-7" />
                    </div>
                    <div>
                        <h4 className="font-black text-gray-900">Flight Tracking</h4>
                        <p className="text-sm text-gray-400 font-medium">We track your flight live</p>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-gray-100 flex items-center gap-5 shadow-sm hover:shadow-md transition-all">
                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-yellow-500">
                        <ShieldCheck className="w-7 h-7" />
                    </div>
                    <div>
                        <h4 className="font-black text-gray-900">Fixed Prices</h4>
                        <p className="text-sm text-gray-400 font-medium">No hidden surge charges</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
