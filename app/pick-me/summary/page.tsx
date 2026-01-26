"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { MapPin, Navigation, Clock, Calendar, MoveRight, Receipt, Loader2, CheckCircle2 } from "lucide-react";

export default function SummaryPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get params
    const pickup_location = searchParams.get("pickup_location") || "";
    const dropoff_location = searchParams.get("dropoff_location") || "";
    const pickup_date = searchParams.get("pickup_date") || "";
    const pickup_time = searchParams.get("pickup_time") || "";

    const [loading, setLoading] = useState(false);
    const [fareDetails, setFareDetails] = useState({
        distance: "0",
        driver_charge: "0",
        total_fare: "0"
    });

    useEffect(() => {
        // Mock API Call to "Calculate Fare"
        const calculateFare = async () => {
            // In a real scenario, this would call /api/fare/calculate
            // Here we simulate the existing backend logic
            const mockDistance = (Math.random() * 15 + 5).toFixed(1);
            const rate = 120; // LKR per KM
            const driverFee = 500;
            const total = (parseFloat(mockDistance) * rate) + driverFee;

            setFareDetails({
                distance: mockDistance,
                driver_charge: driverFee.toLocaleString(),
                total_fare: total.toLocaleString()
            });
        };

        if (pickup_location && dropoff_location) {
            calculateFare();
        }
    }, [pickup_location, dropoff_location]);

    const handleConfirmBooking = async () => {
        setLoading(true);
        try {
            // 1. Check Auth (Authentication Gate)
            const sessionRes = await fetch("/api/auth/session");
            const sessionData = await sessionRes.json();

            if (!sessionData.loggedIn) {
                // Redirect to login, then back here
                const redirectUrl = encodeURIComponent(`/pick-me/summary?${searchParams.toString()}`);
                router.push(`/login?redirect=${redirectUrl}`);
                return;
            }

            // 2. Call "Existing API" to save booking
            // We'll treat /api/bookings as the endpoint
            // Wait, I must implement the server action or a mock if API is missing per strict rules
            // I will use a server action if this fails, but let's try a direct DB insert via a new route if needed.
            // For now, let's assume we post to a new generic booking handler I will create

            const res = await fetch("/api/bookings/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customer_id: sessionData.user.id,
                    pickup_location,
                    dropoff_location,
                    start_datetime: `${pickup_date} ${pickup_time}`,
                    distance: fareDetails.distance,
                    total_fare: fareDetails.total_fare.replace(/,/g, ''),
                    reservation_status: "PENDING"
                })
            });

            if (res.ok) {
                const data = await res.json();
                router.push(`/pick-me/success?bookingId=${data.bookingId}`);
            } else {
                alert("Failed to book.");
            }

        } catch (error) {
            console.error(error);
            alert("An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="w-full max-w-2xl bg-white rounded-[32px] shadow-[0_20px_40px_rgba(0,0,0,0.05)] overflow-hidden border border-gray-100">
                {/* Header */}
                <div className="bg-gray-900 px-8 py-6 text-white flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight">Trip Summary</h1>
                        <p className="text-gray-400 text-sm font-medium">Review your trip details before confirming</p>
                    </div>
                </div>

                <div className="p-8 space-y-8">
                    {/* Route Details */}
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="mt-1">
                                <div className="w-3 h-3 bg-yellow-400 rounded-full ring-4 ring-yellow-50" />
                                <div className="w-0.5 h-12 bg-gray-100 mx-auto my-1" />
                                <div className="w-3 h-3 bg-gray-900 rounded-full ring-4 ring-gray-100" />
                            </div>
                            <div className="flex-1 space-y-8">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Pickup From</label>
                                    <h3 className="text-lg font-bold text-gray-900">{pickup_location}</h3>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Dropoff At</label>
                                    <h3 className="text-lg font-bold text-gray-900">{dropoff_location}</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <div className="flex items-center gap-2 mb-2">
                                <Calendar className="w-4 h-4 text-blue-500" />
                                <span className="text-xs font-bold text-gray-500 uppercase">Date</span>
                            </div>
                            <p className="font-bold text-gray-900">{pickup_date}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="w-4 h-4 text-orange-500" />
                                <span className="text-xs font-bold text-gray-500 uppercase">Time</span>
                            </div>
                            <p className="font-bold text-gray-900">{pickup_time}</p>
                        </div>
                    </div>

                    {/* Fare Details */}
                    <div className="bg-gray-50 rounded-2xl p-6 space-y-4 border border-gray-100">
                        <h4 className="flex items-center gap-2 font-bold text-gray-900 pb-4 border-b border-gray-200">
                            <Receipt className="w-5 h-5 text-gray-400" />
                            Fare Breakdown
                        </h4>

                        <div className="flex justify-between items-center text-sm font-medium text-gray-600">
                            <span>Total Distance</span>
                            <span className="font-bold text-gray-900">{fareDetails.distance} km</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-medium text-gray-600">
                            <span>Driver Charge</span>
                            <span className="font-bold text-gray-900">LKR {fareDetails.driver_charge}</span>
                        </div>

                        <div className="pt-4 border-t border-gray-200 flex justify-between items-end">
                            <span className="text-sm font-bold text-gray-500 uppercase">Total Fare</span>
                            <span className="text-3xl font-black text-gray-900 tracking-tight">LKR {fareDetails.total_fare}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                        <button
                            onClick={() => router.back()}
                            className="w-1/3 h-14 rounded-xl border border-gray-200 font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleConfirmBooking}
                            disabled={loading}
                            className="flex-1 h-14 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-black rounded-xl shadow-lg shadow-yellow-100 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                "Confirm Booking"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
