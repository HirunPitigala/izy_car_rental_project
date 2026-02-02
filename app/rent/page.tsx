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
        <div className="min-h-screen bg-white">
            <section className="container mx-auto px-6 pt-16 pb-24">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-12">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Rent a Car</h1>
                        <p className="text-gray-500 text-lg">Select your rental period to check available vehicles.</p>
                    </div>

                    <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 md:p-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mb-12">
                            {/* Start Date & Time */}
                            <div className="space-y-6">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pick-up Details</h3>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-blue-600" /> Start Date
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-700"
                                            onChange={(e) => setFormData({ ...formData, rental_start_date: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-blue-600" /> Start Time
                                        </label>
                                        <input
                                            type="time"
                                            required
                                            className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-700"
                                            onChange={(e) => setFormData({ ...formData, rental_start_time: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* End Date & Time */}
                            <div className="space-y-6">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Return Details</h3>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-blue-600" /> End Date
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-700"
                                            onChange={(e) => setFormData({ ...formData, rental_end_date: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-blue-600" /> End Time
                                        </label>
                                        <input
                                            type="time"
                                            required
                                            className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-700"
                                            onChange={(e) => setFormData({ ...formData, rental_end_time: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-3 text-lg"
                        >
                            <Search className="w-6 h-6" />
                            Check Availability
                        </button>
                    </form>

                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <h4 className="font-bold text-gray-900 mb-2">Flexibility</h4>
                            <p className="text-sm text-gray-500 leading-relaxed">Book for a few hours or several weeks. Your schedule, your choice.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                                <Search className="w-5 h-5" />
                            </div>
                            <h4 className="font-bold text-gray-900 mb-2">Real-time</h4>
                            <p className="text-sm text-gray-500 leading-relaxed">Instantly see available vehicles from our wide fleet.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                                <Clock className="w-5 h-5" />
                            </div>
                            <h4 className="font-bold text-gray-900 mb-2">24/7 Support</h4>
                            <p className="text-sm text-gray-500 leading-relaxed">We're here to help you at any time during your rental period.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
