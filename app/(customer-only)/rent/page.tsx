"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Calendar, Clock, Search } from "lucide-react";

export default function RentPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        rental_start_date: "",
        rental_start_time: "",
        rental_end_date: "",
        rental_end_time: "",
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const searchParams = new URLSearchParams(formData);
        router.push(`/rent/results?${searchParams.toString()}`);
    };

    return (
        <div className="min-h-screen bg-[#fcfcfc]">
            <section className="container mx-auto px-6 pt-16 pb-24">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-12">
                        <h1 className="text-3xl font-black text-[#0f0f0f] mb-4 tracking-tight uppercase">Rent a Car</h1>
                        <p className="text-gray-500 text-lg font-medium">Select your rental period to check available vehicles from our premium fleet.</p>
                    </div>

                    <form onSubmit={handleSearch} className="bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 p-6 md:p-10 transition-all space-y-6">
                        {/* Line 1: Pick-up Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                    <Calendar className="w-3 h-3 text-red-600" />
                                    Pick-up Date
                                </label>
                                <input
                                    type="date"
                                    required
                                    className="w-full h-14 bg-gray-50 border border-transparent rounded-2xl px-6 outline-none focus:bg-white focus:ring-2 focus:ring-red-600/10 focus:border-red-600 transition-all font-bold text-[#0f0f0f] text-sm shadow-sm"
                                    onChange={(e) => setFormData({ ...formData, rental_start_date: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                    <Clock className="w-3 h-3 text-red-600" />
                                    Pick-up Time
                                </label>
                                <input
                                    type="time"
                                    required
                                    className="w-full h-14 bg-gray-50 border border-transparent rounded-2xl px-6 outline-none focus:bg-white focus:ring-2 focus:ring-red-600/10 focus:border-red-600 transition-all font-bold text-[#0f0f0f] text-sm shadow-sm"
                                    onChange={(e) => setFormData({ ...formData, rental_start_time: e.target.value })}
                                />
                            </div>
                            {/* Spacer to align with the 3rd column in the second row */}
                            <div className="hidden md:block" />
                        </div>

                        {/* Line 2: Return Details + Button */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                    <Calendar className="w-3 h-3 text-[#0f0f0f]" />
                                    Return Date
                                </label>
                                <input
                                    type="date"
                                    required
                                    className="w-full h-14 bg-gray-50 border border-transparent rounded-2xl px-6 outline-none focus:bg-white focus:ring-2 focus:ring-red-600/10 focus:border-red-600 transition-all font-bold text-[#0f0f0f] text-sm shadow-sm"
                                    onChange={(e) => setFormData({ ...formData, rental_end_date: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                    <Clock className="w-3 h-3 text-[#0f0f0f]" />
                                    Return Time
                                </label>
                                <input
                                    type="time"
                                    required
                                    className="w-full h-14 bg-gray-50 border border-transparent rounded-2xl px-6 outline-none focus:bg-white focus:ring-2 focus:ring-red-600/10 focus:border-red-600 transition-all font-bold text-[#0f0f0f] text-sm shadow-sm"
                                    onChange={(e) => setFormData({ ...formData, rental_end_time: e.target.value })}
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full h-14 bg-[#0f0f0f] hover:bg-red-600 text-white font-black rounded-2xl transition-all shadow-xl shadow-gray-200 flex items-center justify-center text-xs uppercase tracking-[0.2em] active:scale-[0.98]"
                            >
                                Check Availability
                            </button>
                        </div>
                    </form>

                    <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="p-8 rounded-[2rem] bg-white border border-gray-100 shadow-sm transition-all hover:shadow-md">
                            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mb-6">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <h4 className="font-black text-[#0f0f0f] mb-3 uppercase tracking-tight">Flexibility</h4>
                            <p className="text-sm font-medium text-gray-400 leading-relaxed">Book for a few hours or several weeks. Your schedule, your choice.</p>
                        </div>
                        <div className="p-8 rounded-[2rem] bg-white border border-gray-100 shadow-sm transition-all hover:shadow-md">
                            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mb-6">
                                <Search className="w-6 h-6" />
                            </div>
                            <h4 className="font-black text-[#0f0f0f] mb-3 uppercase tracking-tight">Real-time</h4>
                            <p className="text-sm font-medium text-gray-400 leading-relaxed">Instantly see available vehicles from our wide fleet.</p>
                        </div>
                        <div className="p-8 rounded-[2rem] bg-white border border-gray-100 shadow-sm transition-all hover:shadow-md">
                            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mb-6">
                                <Clock className="w-6 h-6" />
                            </div>
                            <h4 className="font-black text-[#0f0f0f] mb-3 uppercase tracking-tight">24/7 Support</h4>
                            <p className="text-sm font-medium text-gray-400 leading-relaxed">We're here to help you at any time during your rental period.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
