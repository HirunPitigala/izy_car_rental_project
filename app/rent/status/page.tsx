"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Clock, CheckCircle2, XCircle, ChevronRight } from "lucide-react";

function StatusContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<"pending" | "approved" | "rejected">("pending");
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setSeconds(prev => prev + 1);
        }, 1000);

        // Simulation: Approve after 8 seconds for demonstration purposes
        const promoTimer = setTimeout(() => {
            setStatus("approved");
        }, 8000);

        return () => {
            clearInterval(timer);
            clearTimeout(promoTimer);
        };
    }, []);

    return (
        <div className="max-w-2xl mx-auto py-20 px-6">
            <div className="bg-white rounded-[48px] border border-gray-100 p-12 text-center shadow-[0_24px_80px_rgba(0,0,0,0.03)]">
                {status === "pending" && (
                    <>
                        <div className="w-28 h-28 bg-blue-50/50 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-10 relative border border-blue-50">
                            <Loader2 className="w-14 h-14 animate-spin" />
                            <div className="absolute top-0 right-0 w-10 h-10 bg-blue-600 text-white rounded-full border-4 border-white flex items-center justify-center text-xs font-black">
                                {8 - seconds > 0 ? 8 - seconds : 1}s
                            </div>
                        </div>
                        <h1 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">Reviewing Request</h1>
                        <p className="text-gray-400 font-bold mb-10 leading-relaxed px-4">
                            Our team is currently verifying your documents and vehicle availability. Please stay on this page.
                        </p>
                        <div className="flex items-center justify-center gap-3 bg-gray-50/80 p-5 rounded-2xl border border-gray-100 mb-4 max-w-sm mx-auto">
                            <Clock className="w-5 h-5 text-gray-400" />
                            <span className="text-sm font-bold text-gray-500 uppercase tracking-widest text-xs">Real-time Status Polling Active</span>
                        </div>
                    </>
                )}

                {status === "approved" && (
                    <>
                        <div className="w-28 h-28 bg-green-50 rounded-full flex items-center justify-center text-green-500 mx-auto mb-10 border border-green-100 shadow-sm shadow-green-50">
                            <CheckCircle2 className="w-14 h-14" />
                        </div>
                        <h1 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">Request Approved!</h1>
                        <p className="text-gray-400 font-bold mb-10 leading-relaxed px-4">
                            Congratulations! Your rental request has been approved and the vehicle is reserved for you. Please complete payment to secure your booking.
                        </p>
                        <button
                            onClick={() => router.push(`/rent/payment?${searchParams.toString()}`)}
                            className="w-full h-16 bg-blue-600 hover:bg-black text-white font-black rounded-[20px] transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-3 text-lg group active:scale-95"
                        >
                            Proceed to Payment
                            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </>
                )}

                {status === "rejected" && (
                    <>
                        <div className="w-28 h-28 bg-red-50 rounded-full flex items-center justify-center text-red-500 mx-auto mb-10 border border-red-100">
                            <XCircle className="w-14 h-14" />
                        </div>
                        <h1 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">Request Declined</h1>
                        <p className="text-gray-400 font-bold mb-10 leading-relaxed px-4">
                            We're sorry, but we couldn't approve your request at this time. Please contact support for more information.
                        </p>
                        <button
                            onClick={() => router.push("/rent")}
                            className="w-full h-16 bg-gray-900 hover:bg-black text-white font-black rounded-[20px] transition-all shadow-xl shadow-gray-100 flex items-center justify-center gap-3 text-lg active:scale-95"
                        >
                            Back to Fleet
                        </button>
                    </>
                )}
            </div>

            <div className="mt-12 text-center">
                <p className="text-xs font-black text-gray-300 uppercase tracking-[0.4em]">Reservation Reference: #CAR-{Math.floor(Math.random() * 9000) + 1000}</p>
            </div>
        </div>
    );
}

export default function RentStatusPage() {
    return (
        <div className="min-h-screen bg-[#fafafa]">
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                </div>
            }>
                <StatusContent />
            </Suspense>
        </div>
    );
}
