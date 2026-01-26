"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function SuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const bookingId = searchParams.get("bookingId") || "PENDING";

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6">
            <div className="w-full max-w-md text-center space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Booking Confirmed!</h1>
                    <p className="text-gray-500 font-medium text-lg leading-relaxed">
                        Your pickup request has been successfully placed. <br />
                        A driver will be assigned shortly.
                    </p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 max-w-sm mx-auto">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Booking Reference</p>
                    <p className="text-2xl font-black text-gray-900 tracking-wider font-mono">#{bookingId}</p>
                </div>

                <div className="pt-8 space-y-4">
                    <button
                        onClick={() => router.push("/pick-me")}
                        className="w-full h-16 bg-gray-900 text-white rounded-2xl font-bold shadow-xl shadow-gray-200 hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        Book Another Ride
                    </button>
                    <button
                        onClick={() => router.push("/")}
                        className="w-full h-16 bg-white text-gray-900 rounded-2xl font-bold border border-gray-100 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
}
