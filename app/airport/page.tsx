"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Search, Calendar, MapPin, Plane, Users, Clock,
    ShieldCheck, Briefcase, ArrowRight
} from "lucide-react";

interface FormState {
    transferType: "PICKUP" | "DROP";
    airport: "BANDARANAYAKE" | "MATTALA";
    transferDate: string;
    transferTime: string;
    passengers: number;
    luggageCount: number;
}

interface FormErrors {
    transferDate?: string;
    transferTime?: string;
    passengers?: string;
    luggageCount?: string;
}

export default function AirportLandingPage() {
    const router = useRouter();

    const today = new Date().toISOString().split("T")[0];

    const [form, setForm] = useState<FormState>({
        transferType: "PICKUP",
        airport: "BANDARANAYAKE",
        transferDate: "",
        transferTime: "",
        passengers: 1,
        luggageCount: 0,
    });
    const [errors, setErrors] = useState<FormErrors>({});

    const validate = (): boolean => {
        const e: FormErrors = {};
        if (!form.transferDate) e.transferDate = "Please select a date.";
        else if (form.transferDate < today) e.transferDate = "Date cannot be in the past.";
        if (!form.transferTime) e.transferTime = "Please select a time.";
        if (form.passengers < 1) e.passengers = "At least 1 passenger required.";
        if (form.luggageCount < 0) e.luggageCount = "Cannot be negative.";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        const params = new URLSearchParams({
            transferType: form.transferType,
            airport: form.airport,
            transferDate: form.transferDate,
            transferTime: form.transferTime,
            passengers: String(form.passengers),
            luggage: String(form.luggageCount),
        });
        router.push(`/airport/available?${params.toString()}`);
    };

    const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
        setForm(prev => ({ ...prev, [key]: value }));

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative h-[580px] w-full flex items-center justify-center bg-[#f8fafc] overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-yellow-50 to-transparent pointer-events-none" />

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="max-w-3xl mx-auto">
                        <span className="inline-block px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 text-sm font-bold tracking-wider uppercase mb-6">
                            24/7 Airport Transfers
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6 tracking-tight">
                            Reliable airport{" "}
                            <span className="text-yellow-500">pickups &amp; drops</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 font-medium max-w-2xl mx-auto">
                            Start or end your journey with comfort.
                            Professional drivers and spacious vehicles for all your luggage needs.
                        </p>
                    </div>
                </div>
            </section>

            {/* Search Panel */}
            <div className="container mx-auto px-6 -mt-20 relative z-20 mb-20">
                <div className="bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.10)] p-8 md:p-10 border border-gray-100">
                    <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                        <div className="w-2.5 h-10 bg-yellow-400 rounded-full" />
                        Find Your Airport Ride
                    </h2>

                    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Transfer Type */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Plane className="w-4 h-4 text-yellow-500" /> Transfer Type
                            </label>
                            <select
                                value={form.transferType}
                                onChange={e => set("transferType", e.target.value as "PICKUP" | "DROP")}
                                className="w-full h-14 bg-gray-50 border-2 border-transparent focus:border-yellow-400 rounded-2xl px-5 font-bold text-gray-700 outline-none transition-all"
                            >
                                <option value="PICKUP">Airport Pickup</option>
                                <option value="DROP">Airport Drop</option>
                            </select>
                        </div>

                        {/* Airport */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-yellow-500" /> Airport
                            </label>
                            <select
                                value={form.airport}
                                onChange={e => set("airport", e.target.value as "BANDARANAYAKE" | "MATTALA")}
                                className="w-full h-14 bg-gray-50 border-2 border-transparent focus:border-yellow-400 rounded-2xl px-5 font-bold text-gray-700 outline-none transition-all"
                            >
                                <option value="BANDARANAYAKE">BIA — Bandaranayake (Colombo)</option>
                                <option value="MATTALA">HRI — Mattala (Hambantota)</option>
                            </select>
                        </div>

                        {/* Transfer Date */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-yellow-500" /> Transfer Date
                            </label>
                            <input
                                type="date"
                                min={today}
                                value={form.transferDate}
                                onChange={e => { set("transferDate", e.target.value); setErrors(prev => ({ ...prev, transferDate: undefined })); }}
                                className={`w-full h-14 bg-gray-50 border-2 rounded-2xl px-5 font-bold text-gray-700 outline-none transition-all ${errors.transferDate ? "border-red-400" : "border-transparent focus:border-yellow-400"}`}
                            />
                            {errors.transferDate && <p className="text-xs text-red-500 font-semibold">{errors.transferDate}</p>}
                        </div>

                        {/* Transfer Time */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Clock className="w-4 h-4 text-yellow-500" /> Transfer Time
                            </label>
                            <input
                                type="time"
                                value={form.transferTime}
                                onChange={e => { set("transferTime", e.target.value); setErrors(prev => ({ ...prev, transferTime: undefined })); }}
                                className={`w-full h-14 bg-gray-50 border-2 rounded-2xl px-5 font-bold text-gray-700 outline-none transition-all ${errors.transferTime ? "border-red-400" : "border-transparent focus:border-yellow-400"}`}
                            />
                            {errors.transferTime && <p className="text-xs text-red-500 font-semibold">{errors.transferTime}</p>}
                        </div>

                        {/* Passengers */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Users className="w-4 h-4 text-yellow-500" /> Passengers
                            </label>
                            <input
                                type="number"
                                min={1}
                                max={20}
                                value={form.passengers}
                                onChange={e => { set("passengers", parseInt(e.target.value) || 1); setErrors(prev => ({ ...prev, passengers: undefined })); }}
                                className={`w-full h-14 bg-gray-50 border-2 rounded-2xl px-5 font-bold text-gray-700 outline-none transition-all ${errors.passengers ? "border-red-400" : "border-transparent focus:border-yellow-400"}`}
                            />
                            {errors.passengers && <p className="text-xs text-red-500 font-semibold">{errors.passengers}</p>}
                        </div>

                        {/* Luggage */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-yellow-500" /> Luggage Count
                            </label>
                            <input
                                type="number"
                                min={0}
                                max={20}
                                value={form.luggageCount}
                                onChange={e => { set("luggageCount", parseInt(e.target.value) || 0); setErrors(prev => ({ ...prev, luggageCount: undefined })); }}
                                className={`w-full h-14 bg-gray-50 border-2 rounded-2xl px-5 font-bold text-gray-700 outline-none transition-all ${errors.luggageCount ? "border-red-400" : "border-transparent focus:border-yellow-400"}`}
                            />
                            {errors.luggageCount && <p className="text-xs text-red-500 font-semibold">{errors.luggageCount}</p>}
                        </div>

                        {/* Search Button - spans full width on last row */}
                        <div className="md:col-span-2 lg:col-span-3 pt-2">
                            <button
                                type="submit"
                                className="w-full h-14 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-black rounded-2xl shadow-xl shadow-yellow-100 transition-all flex items-center justify-center gap-3 text-base active:scale-95"
                            >
                                <Search className="w-5 h-5" />
                                Search Available Cars
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Features Section */}
            <section className="container mx-auto px-6 mb-20 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-3xl border border-gray-100 flex items-center gap-5 shadow-sm hover:shadow-md transition-all">
                    <div className="w-14 h-14 bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-500 flex-shrink-0">
                        <Clock className="w-7 h-7" />
                    </div>
                    <div>
                        <h4 className="font-black text-gray-900">Complimentary Wait</h4>
                        <p className="text-sm text-gray-400 font-medium">60 mins wait time for pickups</p>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-gray-100 flex items-center gap-5 shadow-sm hover:shadow-md transition-all">
                    <div className="w-14 h-14 bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-500 flex-shrink-0">
                        <Plane className="w-7 h-7" />
                    </div>
                    <div>
                        <h4 className="font-black text-gray-900">Flight Tracking</h4>
                        <p className="text-sm text-gray-400 font-medium">We track your flight live</p>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-gray-100 flex items-center gap-5 shadow-sm hover:shadow-md transition-all">
                    <div className="w-14 h-14 bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-500 flex-shrink-0">
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
