"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
    CheckCircle2,
    Calendar,
    Clock,
    ShieldCheck,
    ArrowRight,
    Car,
    FileText,
    MapPin
} from "lucide-react";
import { Suspense } from "react";

function StatusContent() {
    const searchParams = useSearchParams();
    const startDate = searchParams.get("rental_start_date");
    const endDate = searchParams.get("rental_end_date");
    const totalPrice = searchParams.get("totalPrice");

    const [reference, setReference] = useState("—");

    useEffect(() => {
        setReference(`IZR-${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
    }, []);

    return (
        <div className="max-w-4xl mx-auto py-20 px-6">
            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-100 overflow-hidden text-center">
                {/* Header Decoration */}
                <div className="h-4 bg-red-600 w-full" />

                <div className="p-16">
                    <div className="w-24 h-24 bg-green-50 rounded-[2.5rem] flex items-center justify-center text-green-600 mx-auto mb-10 shadow-xl shadow-green-100 animate-in zoom-in-50 duration-700">
                        <CheckCircle2 className="w-12 h-12" />
                    </div>

                    <h1 className="text-4xl font-black text-[#0f0f0f] mb-4 uppercase tracking-tight">Booking Requested</h1>
                    <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs mb-12">Reference: <span className="text-[#0f0f0f]">{reference}</span></p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 text-left">
                        <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-100 pb-2">Journey Details</p>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                        <Calendar className="w-5 h-5 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-tight">Rental Period</p>
                                        <p className="text-sm font-black text-[#0f0f0f]">{startDate} — {endDate}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                        <ShieldCheck className="w-5 h-5 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-tight">Protection Status</p>
                                        <p className="text-sm font-black text-[#0f0f0f]">Comprehensive Coverage Included</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#0f0f0f] p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col justify-center">
                            <Car className="absolute -right-10 -top-10 w-48 h-48 text-white/5" />
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Estimated Total</p>
                            <p className="text-4xl font-black text-white mb-2">LKR {Number(totalPrice).toLocaleString()}</p>
                            <p className="text-[10px] font-black text-green-500 uppercase tracking-widest flex items-center gap-2">
                                <CheckCircle2 className="w-3 h-3" />
                                Payment on Approval
                            </p>
                        </div>
                    </div>

                    <div className="bg-red-50 p-10 rounded-[2.5rem] border border-red-100 mb-16 text-left flex items-start gap-6">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0">
                            <Clock className="w-7 h-7 text-red-600 animate-pulse" />
                        </div>
                        <div>
                            <h3 className="font-black text-[#0f0f0f] uppercase tracking-tight text-lg mb-2">Pending Approval</h3>
                            <p className="text-sm font-medium text-gray-600 leading-relaxed mb-4">
                                Your booking is currently being reviewed by our administrative team. We typically approve requests within <strong>60 minutes</strong> during operational hours.
                            </p>
                            <div className="flex gap-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-red-600" />
                                    <span className="text-[10px] font-black text-[#0f0f0f] uppercase tracking-widest">Identity Check</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-red-600" />
                                    <span className="text-[10px] font-black text-[#0f0f0f] uppercase tracking-widest">Insurance Review</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link
                            href="/rent"
                            className="h-16 px-12 bg-[#0f0f0f] hover:bg-red-600 text-white font-black rounded-2xl transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-4 text-xs uppercase tracking-widest"
                        >
                            Return Home
                        </Link>
                        <button
                            className="h-16 px-12 border border-gray-100 bg-white hover:bg-gray-50 text-[#0f0f0f] font-black rounded-2xl transition-all flex items-center justify-center gap-4 text-xs uppercase tracking-widest"
                            onClick={() => window.print()}
                        >
                            <FileText className="w-4 h-4" />
                            Print Confirmation
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function BookingStatusPage() {
    return (
        <div className="min-h-screen bg-[#fcfcfc]">
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen">
                    <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
                </div>
            }>
                <StatusContent />
            </Suspense>
        </div>
    );
}

import { Loader2 } from "lucide-react";
