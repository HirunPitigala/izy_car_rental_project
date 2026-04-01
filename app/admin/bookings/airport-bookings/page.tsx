"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Plane, MapPin, Calendar, Users, Briefcase,
    ChevronRight, CheckCircle2, XCircle, Clock,
    RefreshCw, Search, Phone, User as UserIcon
} from "lucide-react";

interface AirportBooking {
    id: number;
    transferType: string;
    airport: string;
    transferDate: string;
    transferTime: string;
    passengers: number;
    luggageCount: number | null;
    customerFullName: string;
    customerPhone: string;
    customerEmail: string | null;
    transferLocation: string;
    status: string | null;
    rejectionReason: string | null;
    createdAt: string | null;
    vehicleBrand: string | null;
    vehicleModel: string | null;
    vehiclePlate: string | null;
    customerName: string | null;
    customerAccountEmail: string | null;
    handledByName: string | null;
}

const STATUS_CONFIG: Record<string, { pill: string; icon: React.ReactNode; label: string }> = {
    PENDING:  { pill: "bg-yellow-100 text-yellow-800",  icon: <Clock className="w-3.5 h-3.5" />,        label: "Pending" },
    ACCEPTED: { pill: "bg-green-100 text-green-800",    icon: <CheckCircle2 className="w-3.5 h-3.5" />, label: "Accepted" },
    REJECTED: { pill: "bg-red-100 text-red-800",        icon: <XCircle className="w-3.5 h-3.5" />,      label: "Rejected" },
};

export default function AdminAirportBookingsPage() {
    const [bookings, setBookings] = useState<AirportBooking[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>("ALL");
    const [search, setSearch] = useState("");

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/airport-rental/admin");
            const data = await res.json();
            if (res.ok && data.success) {
                setBookings(data.data.reverse());
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBookings(); }, []);

    const filtered = bookings
        .filter(b => filter === "ALL" || b.status === filter)
        .filter(b => {
            if (!search) return true;
            const q = search.toLowerCase();
            return (
                b.customerFullName.toLowerCase().includes(q) ||
                b.vehicleBrand?.toLowerCase().includes(q) ||
                b.vehicleModel?.toLowerCase().includes(q) ||
                b.vehiclePlate?.toLowerCase().includes(q) ||
                String(b.id).includes(q)
            );
        });

    const counts = {
        ALL: bookings.length,
        PENDING: bookings.filter(b => b.status === "PENDING").length,
        ACCEPTED: bookings.filter(b => b.status === "ACCEPTED").length,
        REJECTED: bookings.filter(b => b.status === "REJECTED").length,
    };

    const airportLabel = (a: string) =>
        a === "BANDARANAYAKE" ? "BIA (Colombo)" : "HRI (Mattala)";

    return (
        <div className="min-h-screen bg-[#fcfcfc] pb-12">
            <main className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <nav className="mb-4 flex items-center gap-2 text-sm text-gray-400">
                        <Link href="/admin/dashboard" className="hover:text-[#0f0f0f] transition-colors">Admin</Link>
                        <ChevronRight className="h-4 w-4" />
                        <Link href="/admin/bookings/requested" className="hover:text-[#0f0f0f] transition-colors">Bookings</Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="font-medium text-[#0f0f0f]">Airport Bookings</span>
                    </nav>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-yellow-400 rounded-xl shadow-lg shadow-yellow-200">
                                <Plane className="h-5 w-5 text-gray-900" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black tracking-tight text-[#0f0f0f]">Airport Transfer Bookings</h1>
                                <p className="text-sm text-gray-500">All airport rental bookings across all statuses.</p>
                            </div>
                        </div>
                        <button
                            onClick={fetchBookings}
                            className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-100 bg-white px-4 text-sm font-bold text-gray-600 shadow-sm hover:bg-gray-50 transition-all"
                        >
                            <RefreshCw className="h-4 w-4" /> Refresh
                        </button>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {(["ALL", "PENDING", "ACCEPTED", "REJECTED"] as const).map(s => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`rounded-2xl p-4 text-left transition-all border ${
                                filter === s
                                    ? "bg-gray-900 text-white border-gray-900"
                                    : "bg-white border-gray-100 hover:border-gray-200"
                            }`}
                        >
                            <p className={`text-3xl font-black ${filter === s ? "text-white" : "text-gray-900"}`}>{counts[s]}</p>
                            <p className={`text-xs font-black uppercase tracking-widest mt-1 ${filter === s ? "text-gray-300" : "text-gray-400"}`}>{s}</p>
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative mb-6">
                    <input
                        type="text"
                        placeholder="Search by customer name, vehicle, plate, or booking ID..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full rounded-2xl border border-gray-100 bg-white pl-12 pr-4 py-3.5 text-sm outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 transition-all shadow-sm"
                    />
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2.5rem] border border-dashed border-gray-200">
                        <div className="relative">
                            <div className="h-16 w-16 rounded-full border-4 border-gray-50" />
                            <div className="absolute top-0 h-16 w-16 rounded-full border-4 border-yellow-400 border-t-transparent animate-spin" />
                        </div>
                        <p className="mt-6 text-gray-400 font-bold">Loading bookings...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2.5rem] border border-dashed border-gray-200">
                        <Plane className="h-16 w-16 text-gray-200 mb-4" />
                        <h2 className="text-xl font-bold text-gray-400">No bookings found</h2>
                        <p className="text-sm text-gray-400 mt-2">Try adjusting your search or filter.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filtered.map(b => {
                            const cfg = STATUS_CONFIG[b.status ?? "PENDING"] ?? STATUS_CONFIG.PENDING;
                            return (
                                <div key={b.id} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all">
                                    <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                                        {/* Details */}
                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-center justify-between flex-wrap gap-3">
                                                <span className="text-xs font-black text-gray-300 uppercase tracking-widest">Booking #{b.id}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black ${cfg.pill}`}>
                                                        {cfg.icon} {b.status}
                                                    </span>
                                                    {b.handledByName && (
                                                        <span className="text-xs bg-blue-50 text-blue-700 font-bold px-3 py-1 rounded-full">
                                                            By: {b.handledByName}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                <div className="flex items-start gap-2">
                                                    <Plane className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                                                    <div>
                                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Transfer</p>
                                                        <p className="text-sm font-bold text-gray-900">{b.transferType === "PICKUP" ? "Pickup" : "Drop"}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                                    <div>
                                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Airport</p>
                                                        <p className="text-sm font-bold text-gray-900">{airportLabel(b.airport)}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                                    <div>
                                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Date &amp; Time</p>
                                                        <p className="text-sm font-bold text-gray-900">{b.transferDate} {b.transferTime}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <Plane className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                                    <div>
                                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Vehicle</p>
                                                        <p className="text-sm font-bold text-gray-900">{b.vehicleBrand} {b.vehicleModel}</p>
                                                        <p className="text-xs text-gray-400 font-mono">{b.vehiclePlate}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <Users className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                                    <div>
                                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Capacity</p>
                                                        <p className="text-sm font-bold text-gray-900">{b.passengers} pax · {b.luggageCount ?? 0} bags</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                                    <div>
                                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Address</p>
                                                        <p className="text-sm font-bold text-gray-900 truncate max-w-[160px]">{b.transferLocation}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Customer */}
                                            <div className="flex flex-wrap gap-4 pt-2 border-t border-gray-50">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <UserIcon className="h-3.5 w-3.5 text-gray-400" />
                                                    <span className="font-bold">{b.customerFullName}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Phone className="h-3.5 w-3.5 text-gray-400" />
                                                    <span className="font-medium">{b.customerPhone}</span>
                                                </div>
                                                {b.customerEmail && (
                                                    <span className="text-sm text-gray-500">{b.customerEmail}</span>
                                                )}
                                            </div>

                                            {b.status === "REJECTED" && b.rejectionReason && (
                                                <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-700">
                                                    <span className="font-black">Reason: </span>{b.rejectionReason}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}
