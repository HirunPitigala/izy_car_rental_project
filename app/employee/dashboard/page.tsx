"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
    LayoutDashboard, Car, Truck, Heart, Plane,
    Clock, CheckCircle2, XCircle, Loader2,
    RefreshCw, ChevronRight, MapPin, Calendar,
    Users, Briefcase, Phone, User, AlertCircle,
    ArrowRight, Star
} from "lucide-react";

// ──────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────

interface BaseBooking {
    id: number;
    status: string;
    createdAt?: string;
    customerFullName?: string;
    customerPhone?: string;
    vehicleBrand?: string;
    vehicleModel?: string;
    vehiclePlate?: string;
}

interface CommonDetails {
    location?: string;
    date?: string;
    time?: string;
}

// ──────────────────────────────────────────────────────────────
// Dashboard Page
// ──────────────────────────────────────────────────────────────

export default function EmployeeDashboardPage() {
    const [activeTab, setActiveTab] = useState<"rent" | "pickup" | "wedding" | "airport">("rent");
    const [data, setData] = useState<{
        rent: any[];
        pickup: any[];
        wedding: any[];
        airport: any[];
    }>({
        rent: [],
        pickup: [],
        wedding: [],
        airport: [],
    });
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<number | string | null>(null);
    const [rejectModal, setRejectModal] = useState<{ id: number; type: string; reason: string } | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [rentRes, pickupRes, weddingRes, airportRes] = await Promise.all([
                fetch("/api/bookings?status=PENDING"),
                fetch("/api/pickup/bookings?status=PENDING"),
                fetch("/api/wedding"),
                fetch("/api/airport-rental/bookings?status=requested")
            ]);

            const [rent, pickup, wedding, airport] = await Promise.all([
                rentRes.json(),
                pickupRes.json(),
                weddingRes.json(),
                airportRes.json()
            ]);

            setData({
                rent: rent.data || [],
                pickup: pickup.data || [],
                wedding: wedding.data || [],
                airport: airport.data || []
            });
        } catch (error) {
            console.error("Dashboard data fetch error:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAction = async (type: string, id: number, status: "ACCEPTED" | "REJECTED", reason?: string) => {
        setActionLoading(`${type}-${id}`);
        try {
            let endpoint = "";
            let method = "PATCH";
            let body: any = { id, status };

            switch (type) {
                case "rent": endpoint = "/api/bookings"; break;
                case "pickup": endpoint = "/api/pickup/bookings"; break;
                case "wedding": 
                    endpoint = "/api/wedding"; 
                    body = { id }; // Wedding only has 'contacted' action in its current API
                    break;
                case "airport": endpoint = "/api/airport-rental/bookings"; break;
            }

            if (reason) body.rejection_reason = reason;

            const res = await fetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                fetchData();
                setRejectModal(null);
            }
        } catch (error) {
            console.error("Action error:", error);
        } finally {
            setActionLoading(null);
        }
    };

    const stats = [
        { label: "Rent a Car", count: data.rent.length, icon: <Car className="w-5 h-5" />, color: "bg-blue-500", tab: "rent" },
        { label: "PickMe", count: data.pickup.length, icon: <Truck className="w-5 h-5" />, color: "bg-emerald-500", tab: "pickup" },
        { label: "Wedding", count: data.wedding.length, icon: <Heart className="w-5 h-5" />, color: "bg-pink-500", tab: "wedding" },
        { label: "Airport", count: data.airport.length, icon: <Plane className="w-5 h-5" />, color: "bg-yellow-500", tab: "airport" },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-[#0f0f0f] rounded-xl">
                            <LayoutDashboard className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                                Requested Bookings
                                <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full font-black animate-pulse">LIVE</span>
                            </h1>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Employee Portal / Management</p>
                        </div>
                    </div>
                    <button 
                        onClick={fetchData}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-sm font-bold text-gray-600 transition-all border border-gray-100"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                        Refresh
                    </button>
                </div>
            </div>

            <div className="container mx-auto px-6 mt-10">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {stats.map((s) => (
                        <button
                            key={s.label}
                            onClick={() => setActiveTab(s.tab as any)}
                            className={`p-6 rounded-[2.5rem] border transition-all text-left relative overflow-hidden group ${
                                activeTab === s.tab 
                                ? "bg-white border-gray-200 shadow-xl shadow-gray-200/50 scale-[1.02]" 
                                : "bg-gray-50/50 border-transparent hover:bg-white hover:border-gray-100"
                            }`}
                        >
                            <div className="flex items-center justify-between relative z-10">
                                <div className={`p-3 rounded-2xl ${s.color} text-white`}>
                                    {s.icon}
                                </div>
                                <span className="text-3xl font-black text-gray-900">{s.count}</span>
                            </div>
                            <h3 className="mt-4 text-sm font-bold text-gray-400 uppercase tracking-widest relative z-10">{s.label}</h3>
                            {activeTab === s.tab && (
                                <div className="absolute bottom-0 left-0 h-1.5 w-full bg-current opacity-10" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden min-h-[600px]">
                    <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                                {stats.find(s => s.tab === activeTab)?.label} Requests
                                <span className="px-3 py-1 bg-gray-100 rounded-lg text-xs text-gray-500 font-bold">{data[activeTab].length} New</span>
                            </h2>
                        </div>
                    </div>

                    <div className="p-8">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-32">
                                <Loader2 className="w-12 h-12 text-gray-200 animate-spin mb-4" />
                                <p className="text-gray-400 font-bold">Fetching latest requests...</p>
                            </div>
                        ) : data[activeTab].length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-32 opacity-40 text-center">
                                <CheckCircle2 className="w-16 h-16 text-gray-200 mb-6" />
                                <h3 className="text-xl font-black text-gray-900 tracking-tight">All Clear!</h3>
                                <p className="text-sm text-gray-500 mt-2">No pending {activeTab} requests at the moment.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                {data[activeTab].map((req: any) => (
                                    <div key={req.id || req.bookingId} className="bg-white rounded-[2rem] border border-gray-100 p-6 hover:shadow-lg transition-all group">
                                        <div className="flex flex-col gap-6">
                                            {/* Top info */}
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1 block">Request #{req.id || req.bookingId}</span>
                                                    <h4 className="text-lg font-black text-gray-900 tracking-tight">{req.customerFullName || req.customerName}</h4>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className="text-xs font-bold text-gray-400 flex items-center gap-1"><Phone className="w-3 h-3" /> {req.customerPhone || req.phone}</span>
                                                        <span className="w-1 h-1 rounded-full bg-gray-200" />
                                                        <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">Pending Review</span>
                                                    </div>
                                                </div>
                                                <div className="bg-gray-50 p-3 rounded-2xl text-right">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Vehicle</p>
                                                    <p className="text-xs font-black text-gray-900">
                                                        {req.vehicle?.brand || req.vehicleBrand} {req.vehicle?.model || req.vehicleModel}
                                                    </p>
                                                    <p className="text-[10px] font-mono text-gray-400 uppercase tracking-tighter mt-1">{req.vehicle?.plateNumber || req.vehiclePlate}</p>
                                                </div>
                                            </div>

                                            {/* Details Grid */}
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-gray-50/50 p-4 rounded-2xl flex items-start gap-3">
                                                    <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                                                    <div>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</p>
                                                        <p className="text-xs font-bold text-gray-900 line-clamp-2">
                                                            {req.pickupLocation || req.transferLocation || "N/A"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="bg-gray-50/50 p-4 rounded-2xl flex items-start gap-3">
                                                    <Calendar className="w-4 h-4 text-gray-400 mt-1" />
                                                    <div>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date / Time</p>
                                                        <p className="text-xs font-bold text-gray-900">
                                                            {req.rentalDate || req.pickupTime || req.pickupDate || req.eventDate ? 
                                                                new Date(req.rentalDate || req.pickupTime || req.pickupDate || req.eventDate).toLocaleDateString() : "—"}
                                                        </p>
                                                        <p className="text-[10px] text-gray-400 font-bold">{req.transferTime || req.pickupTime?.split(' ')[1] || "—"}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Meta tags */}
                                            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-50">
                                                {req.passengers && <span className="px-3 py-1 bg-gray-50 text-gray-500 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1"><Users className="w-3 h-3" /> {req.passengers} pax</span>}
                                                {req.luggageCount > 0 && <span className="px-3 py-1 bg-gray-50 text-gray-500 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1"><Briefcase className="w-3 h-3" /> {req.luggageCount} bags</span>}
                                                {activeTab === "rent" && <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">Self Drive</span>}
                                                {activeTab === "wedding" && <span className="px-3 py-1 bg-pink-50 text-pink-600 rounded-full text-[10px] font-black uppercase tracking-widest">Wedding Special</span>}
                                                {activeTab === "airport" && <span className="px-3 py-1 bg-yellow-50 text-yellow-600 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1"><Plane className="w-3 h-3" /> {req.transferType}</span>}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-3 mt-2">
                                                {activeTab === "wedding" ? (
                                                    <button
                                                        onClick={() => handleAction("wedding", req.bookingId, "ACCEPTED" as any)}
                                                        disabled={!!actionLoading}
                                                        className="flex-1 h-12 bg-pink-500 hover:bg-pink-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                                    >
                                                        {actionLoading === `wedding-${req.bookingId}` ? <Loader2 className="w-4 h-4 animate-spin" /> : <Phone className="w-4 h-4" />}
                                                        Mark as Contacted
                                                    </button>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => handleAction(activeTab, req.id || req.bookingId, "ACCEPTED")}
                                                            disabled={!!actionLoading}
                                                            className="flex-1 h-12 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                                        >
                                                            {actionLoading === `${activeTab}-${req.id || req.bookingId}` ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                                            Accept
                                                        </button>
                                                        <button
                                                            onClick={() => setRejectModal({ id: req.id || req.bookingId, type: activeTab, reason: "" })}
                                                            disabled={!!actionLoading}
                                                            className="flex-1 h-12 bg-white hover:bg-red-50 text-red-500 border-2 border-red-50 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Reject Modal */}
            {rejectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 max-w-md w-full space-y-6 animate-in zoom-in-95 duration-200">
                        <div>
                            <h3 className="text-xl font-black text-gray-900 tracking-tight">Reject Request</h3>
                            <p className="text-sm text-gray-400 font-medium mt-1">Please provide a reason for the rejection.</p>
                        </div>
                        <textarea
                            rows={4}
                            placeholder="e.g. Vehicle maintenance, Fully booked for this slot, etc."
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-red-400 focus:bg-white rounded-3xl p-5 text-sm font-medium text-gray-900 outline-none transition-all resize-none shadow-inner"
                            value={rejectModal.reason}
                            onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
                        />
                        <div className="flex gap-4">
                            <button
                                onClick={() => setRejectModal(null)}
                                className="flex-1 h-14 border-2 border-gray-100 rounded-3xl font-black text-gray-400 hover:bg-gray-50 transition-all text-xs uppercase tracking-widest"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleAction(rejectModal.type, rejectModal.id, "REJECTED", rejectModal.reason)}
                                disabled={!rejectModal.reason.trim() || !!actionLoading}
                                className="flex-1 h-14 bg-red-500 hover:bg-red-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-red-200 disabled:opacity-50"
                            >
                                {actionLoading ? "Processing..." : "Confirm Reject"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
