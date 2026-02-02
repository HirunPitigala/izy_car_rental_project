"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { Loader2, ShieldCheck, CreditCard, Lock, ChevronRight } from "lucide-react";
import BookingSummary from "@/components/rent/BookingSummary";
import { mockVehicles } from "@/lib/mockVehicles";

function PaymentContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const vehicleId = searchParams.get("vehicleId") || "";

    const [vehicle, setVehicle] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isPaying, setIsPaying] = useState(false);

    const startDate = searchParams.get("rental_start_date") || "N/A";
    const startTime = searchParams.get("rental_start_time") || "00:00";
    const endDate = searchParams.get("rental_end_date") || "N/A";
    const endTime = searchParams.get("rental_end_time") || "00:00";
    const totalPrice = Number(searchParams.get("totalPrice")) || 0;

    useEffect(() => {
        const fetchVehicle = async () => {
            // We attempt to find the vehicle from mock data for consistent UI
            const mock = mockVehicles.find(v => v.id === vehicleId);
            if (mock) {
                setVehicle({
                    brand: mock.brand,
                    model: mock.model,
                    plateNumber: mock.plateNumber,
                    ratePerDay: mock.ratePerDay
                });
            } else {
                // Try to fetch from API if not in mock
                try {
                    const res = await fetch(`/api/admin/vehicles/${vehicleId}`);
                    if (res.ok) {
                        const data = await res.json();
                        setVehicle(data);
                    }
                } catch (e) { console.error(e); }
            }
            setLoading(false);
        };
        fetchVehicle();
    }, [vehicleId]);

    // Calculate total days for the summary
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    const durationMs = end.getTime() - start.getTime();
    const totalDays = isNaN(durationMs) ? 1 : Math.max(1, Math.ceil(durationMs / (1000 * 60 * 60 * 24)));

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPaying(true);
        // Step 7: Payment Simulation
        await new Promise(resolve => setTimeout(resolve, 3000));
        setIsPaying(false);
        router.push(`/rent/invoice?${searchParams.toString()}`);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-400 font-bold">Initializing secure checkout...</p>
            </div>
        );
    }

    if (!vehicle) {
        return <div className="p-20 text-center font-bold text-red-500">Error: Vehicle information missing.</div>;
    }

    return (
        <div className="container mx-auto px-6 py-12 lg:py-20">
            <div className="text-center mb-16">
                <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-widest mb-4 border border-blue-100">Step 4 of 5</span>
                <h1 className="text-2xl font-black text-gray-900 mb-4 tracking-tight uppercase">Payment Details</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start max-w-6xl mx-auto">
                {/* Left: Booking Details */}
                <div className="space-y-8">
                    <BookingSummary
                        vehicle={vehicle}
                        startDate={startDate}
                        startTime={startTime}
                        endDate={endDate}
                        endTime={endTime}
                        totalDays={totalDays}
                        totalPrice={totalPrice}
                    />

                    <div className="bg-green-50/50 rounded-3xl p-6 border border-green-100 flex items-start gap-5">
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600 flex-shrink-0">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-black text-green-900 mb-1 uppercase tracking-tight">Full Protection Included</p>
                            <p className="text-xs font-bold text-green-700 leading-relaxed">Your transaction is protected by 256-bit SSL encryption. We do not store your full card details in our servers.</p>
                        </div>
                    </div>
                </div>

                {/* Right: Payment Method Form */}
                <form onSubmit={handlePayment} className="bg-white rounded-[40px] border border-gray-100 p-12 shadow-[0_24px_80px_rgba(0,0,0,0.02)] space-y-10">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">Credit or Debit Card</h3>
                        <p className="text-xs font-bold text-gray-400">Standard international card payment</p>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cardholder Full Name</label>
                            <input type="text" required className="w-full h-14 bg-gray-50/50 border border-gray-100 rounded-2xl px-5 text-sm font-bold text-gray-900 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300" placeholder="JOHN DOE" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Card Number</label>
                            <div className="relative">
                                <CreditCard className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                                <input type="text" required className="w-full h-14 bg-gray-50/50 border border-gray-100 rounded-2xl pl-14 pr-5 text-sm font-bold text-gray-900 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300" placeholder="0000 0000 0000 0000" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Expiration</label>
                                <input type="text" required className="w-full h-14 bg-gray-50/50 border border-gray-100 rounded-2xl px-5 text-sm font-bold text-gray-900 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300" placeholder="MM / YY" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Secure CVV</label>
                                <div className="relative">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                                    <input type="password" required maxLength={4} className="w-full h-14 bg-gray-50/50 border border-gray-100 rounded-2xl pl-14 pr-5 text-sm font-bold text-gray-900 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300" placeholder="***" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isPaying}
                            className="w-full h-16 bg-blue-600 hover:bg-black text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-3 text-lg group active:scale-95 disabled:opacity-50"
                        >
                            {isPaying ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    Security Check...
                                </>
                            ) : (
                                <>
                                    Complete Payment
                                    <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>

                    <p className="text-xs text-gray-400 font-bold text-center tracking-tight leading-relaxed">
                        Secure 128-bit SSL Encrypted Transaction. Your data privacy is guaranteed.
                    </p>
                </form>
            </div>
        </div>
    );
}

export default function RentPaymentPage() {
    return (
        <div className="min-h-screen bg-[#fafafa]">
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                </div>
            }>
                <PaymentContent />
            </Suspense>
        </div>
    );
}
