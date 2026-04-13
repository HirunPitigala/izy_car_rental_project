"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    Plane, MapPin, Calendar, Clock, Users, Briefcase,
    ChevronRight, CheckCircle2, XCircle, AlertCircle, Loader2
} from "lucide-react";

interface AirportBooking {
    id: number;
    pickupDate: string | Date | null;
    passengers: number;
    luggageCount: number | null;
    transferLocation: string;
    pickupLocation: string;
    dropoffLocation: string;
    status: string | null;
    rejectionReason: string | null;
    createdAt: string | null;
    vehicleBrand: string | null;
    vehicleModel: string | null;
    vehiclePlate: string | null;
    vehicleImage: string | null;
}

const STATUS_CONFIG: Record<string, { pill: string; icon: React.ReactNode; label: string }> = {
    PENDING:  { pill: "bg-yellow-100 text-yellow-800",  icon: <Clock className="w-3.5 h-3.5" />,        label: "Pending" },
    ACCEPTED: { pill: "bg-green-100 text-green-800",    icon: <CheckCircle2 className="w-3.5 h-3.5" />, label: "Accepted" },
    REJECTED: { pill: "bg-red-100 text-red-800",        icon: <XCircle className="w-3.5 h-3.5" />,      label: "Rejected" },
};

export default function CustomerAirportBookingsPage() {
    const [bookings, setBookings] = useState<AirportBooking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await fetch("/api/airport-rental/customer");
                const data = await res.json();
                if (res.ok && data.success) {
                    setBookings(data.data.reverse()); // newest first
                } else {
                    setError(data.error || "Failed to load bookings.");
                }
            } catch {
                setError("Network error. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const airportLabel = (a: string) =>
        a === "BANDARANAYAKE" ? "BIA (Colombo)" : "HRI (Mattala)";

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-20">
            <div className="container mx-auto px-6 pt-10">
                {/* Header */}
                <nav className="mb-6 flex items-center gap-2 text-sm text-gray-400">
                    <Link href="/customer/dashboard" className="hover:text-gray-900 transition-colors">Dashboard</Link>
                    <ChevronRight className="h-4 w-4" />
                    <span className="font-medium text-gray-900">Airport Bookings</span>
                </nav>

                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2.5 bg-yellow-400 rounded-2xl shadow-lg shadow-yellow-200">
                        <Plane className="h-6 w-6 text-gray-900" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">My Airport Bookings</h1>
                        <p className="text-sm text-gray-500">Track your airport transfer requests</p>
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex flex-col items-center py-32">
                        <div className="relative">
                            <div className="h-16 w-16 rounded-full border-4 border-gray-100" />
                            <div className="absolute top-0 h-16 w-16 rounded-full border-4 border-yellow-400 border-t-transparent animate-spin" />
                        </div>
                        <p className="mt-6 text-gray-400 font-bold">Loading your bookings...</p>
                    </div>
                )}

                {/* Error */}
                {error && !loading && (
                    <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-red-100">
                        <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
                        <p className="text-gray-700 font-bold">{error}</p>
                    </div>
                )}

                {/* Empty */}
                {!loading && !error && bookings.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-dashed border-gray-200">
                        <Plane className="w-16 h-16 text-gray-200 mb-4" />
                        <h2 className="text-xl font-black text-gray-400">No bookings yet</h2>
                        <p className="text-sm text-gray-400 mt-2">Start by searching for an airport transfer.</p>
                        <Link
                            href="/airport"
                            className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-black px-6 py-3 rounded-2xl transition-all active:scale-95"
                        >
                            Book an Airport Transfer
                        </Link>
                    </div>
                )}

                {/* Bookings List */}
                {!loading && !error && bookings.length > 0 && (
                    <div className="space-y-5">
                        {bookings.map((b) => {
                            const cfg = STATUS_CONFIG[b.status ?? "PENDING"] ?? STATUS_CONFIG.PENDING;
                            return (
                                <div key={b.id} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all">
                                    <div className="flex flex-col lg:flex-row gap-6">
                                        {/* Vehicle Image */}
                                        {b.vehicleImage && (
                                            <div className="relative w-full lg:w-40 h-28 rounded-2xl overflow-hidden flex-shrink-0">
                                                <Image src={b.vehicleImage} alt="Vehicle" fill className="object-cover" />
                                            </div>
                                        )}

                                        {/* Details */}
                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-center justify-between flex-wrap gap-3">
                                                <div>
                                                    <p className="text-xs font-black text-gray-300 uppercase tracking-widest mb-1">Booking #{b.id}</p>
                                                    <h3 className="text-lg font-black text-gray-900">
                                                        {b.vehicleBrand} {b.vehicleModel}
                                                        {b.vehiclePlate && <span className="text-sm text-gray-400 font-mono ml-2">({b.vehiclePlate})</span>}
                                                    </h3>
                                                </div>
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black ${cfg.pill}`}>
                                                    {cfg.icon} {cfg.label}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <MapPin className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                                    <div>
                                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Origin</p>
                                                        <p className="font-bold text-gray-900 line-clamp-1">{b.pickupLocation}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
                                                    <div>
                                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Destination</p>
                                                        <p className="font-bold text-gray-900 line-clamp-1">{b.dropoffLocation}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Calendar className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                                                    <div>
                                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Date &amp; Time</p>
                                                        <p className="font-bold text-gray-900">{b.pickupDate ? new Date(b.pickupDate).toLocaleString() : "TBD"}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                    <div>
                                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Capacity</p>
                                                        <p className="font-bold text-gray-900">{b.passengers} pax · {b.luggageCount ?? 0} bags</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {b.status === "REJECTED" && b.rejectionReason && (
                                                <div className="bg-red-50 border border-red-100 rounded-2xl px-4 py-3 text-sm text-red-700">
                                                    <span className="font-black">Reason: </span>{b.rejectionReason}
                                                </div>
                                            )}

                                            {b.status === "ACCEPTED" && (
                                                <div className="bg-green-50 border border-green-100 rounded-2xl px-4 py-3 text-sm text-green-700 flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                                                    <span className="font-semibold">Your booking has been confirmed. Our team will contact you shortly.</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
