"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
    Plane, MapPin, Calendar, Clock, Users, Briefcase,
    ChevronRight, CheckCircle2, XCircle, Loader2,
    RefreshCw, Phone, User, AlertCircle
} from "lucide-react";

interface AirportBookingRequest {
    id: number;
    pickupDate: string | Date | null;
    passengers: number;
    luggageCount: number | null;
    customerFullName: string;
    customerPhone: string;
    transferLocation: string;
    pickupLocation: string;
    dropoffLocation: string;
    status: string | null;
    rejectionReason: string | null;
    createdAt: string | null;
    vehicleBrand: string | null;
    vehicleModel: string | null;
    vehiclePlate: string | null;
    customerName: string | null;
    customerAccountEmail: string | null;
}

const STATUS_CONFIG: Record<string, { pill: string; icon: React.ReactNode; label: string }> = {
    PENDING:  { pill: "bg-yellow-100 text-yellow-800",  icon: <Clock className="w-3.5 h-3.5" />,        label: "Pending" },
    ACCEPTED: { pill: "bg-green-100 text-green-800",    icon: <CheckCircle2 className="w-3.5 h-3.5" />, label: "Accepted" },
    REJECTED: { pill: "bg-red-100 text-red-800",        icon: <XCircle className="w-3.5 h-3.5" />,      label: "Rejected" },
};

export default function EmployeeAirportRequestsPage() {
    const [requests, setRequests] = useState<AirportBookingRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("PENDING");
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const [rejectModal, setRejectModal] = useState<{ id: number; reason: string } | null>(null);

    const fetchRequests = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/airport-rental/bookings?status=${filter}`);
            const data = await res.json();
            if (res.ok) setRequests(data.data ?? []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => { fetchRequests(); }, [fetchRequests]);

    const handleAccept = async (id: number) => {
        if (!confirm("Accept this airport transfer booking?")) return;
        setActionLoading(id);
        try {
            await fetch("/api/airport-rental/bookings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status: "ACCEPTED" }),
            });
            fetchRequests();
        } finally {
            setActionLoading(null);
        }
    };

    const handleRejectSubmit = async () => {
        if (!rejectModal) return;
        if (!rejectModal.reason.trim()) {
            alert("Please provide a rejection reason.");
            return;
        }
        setActionLoading(rejectModal.id);
        try {
            await fetch("/api/airport-rental/bookings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: rejectModal.id,
                    status: "REJECTED",
                    rejection_reason: rejectModal.reason,
                }),
            });
            setRejectModal(null);
            fetchRequests();
        } finally {
            setActionLoading(null);
        }
    };

    const airportLabel = (a: string) =>
        a === "BANDARANAYAKE" ? "BIA — Bandaranayake" : "HRI — Mattala";

    return (
        <div className="min-h-screen bg-[#fcfcfc] pb-12">
            <main className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <nav className="mb-4 flex items-center gap-2 text-sm text-gray-400">
                        <Link href="/employee" className="hover:text-[#0f0f0f] transition-colors">Employee</Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="font-medium text-[#0f0f0f]">Airport Transfer Requests</span>
                    </nav>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-yellow-400 rounded-xl shadow-lg shadow-yellow-200">
                                <Plane className="h-5 w-5 text-gray-900" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black tracking-tight text-[#0f0f0f]">Airport Transfer Requests</h1>
                                <p className="text-sm text-gray-500">Review and manage customer airport transfer bookings.</p>
                            </div>
                        </div>
                        <button
                            onClick={fetchRequests}
                            className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-100 bg-white px-4 text-sm font-bold text-gray-600 shadow-sm hover:bg-gray-50 transition-all"
                        >
                            <RefreshCw className="h-4 w-4" /> Refresh
                        </button>
                    </div>
                </div>

                {/* Status Filter Tabs */}
                <div className="flex gap-2 mb-6 flex-wrap">
                    {["PENDING", "ACCEPTED", "REJECTED"].map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                                filter === s
                                    ? "bg-gray-950 text-white shadow-md"
                                    : "bg-white border border-gray-100 text-gray-500 hover:border-gray-200"
                            }`}
                        >
                            {STATUS_CONFIG[s]?.icon}
                            {STATUS_CONFIG[s]?.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2.5rem] border border-dashed border-gray-200">
                        <div className="relative">
                            <div className="h-16 w-16 rounded-full border-4 border-gray-50" />
                            <div className="absolute top-0 h-16 w-16 rounded-full border-4 border-yellow-400 border-t-transparent animate-spin" />
                        </div>
                        <p className="mt-6 text-gray-400 font-bold">Loading requests...</p>
                    </div>
                ) : requests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2.5rem] border border-dashed border-gray-200">
                        <Plane className="h-16 w-16 text-gray-200 mb-4" />
                        <h2 className="text-xl font-bold text-gray-400">No {filter.toLowerCase()} requests</h2>
                        <p className="text-sm text-gray-400 mt-2">All clear — nothing to action right now.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {requests.map((req) => {
                            const cfg = STATUS_CONFIG[req.status ?? "PENDING"] ?? STATUS_CONFIG.PENDING;
                            return (
                                <div key={req.id} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all">
                                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                                        {/* Left: Info */}
                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-center justify-between flex-wrap gap-3">
                                                <span className="text-xs font-black text-gray-300 uppercase tracking-widest">Request #{req.id}</span>
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black ${cfg.pill}`}>
                                                    {cfg.icon} {req.status}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div className="flex items-start gap-3">
                                                    <div className="p-2 bg-emerald-50 rounded-lg flex-shrink-0">
                                                        <MapPin className="h-4 w-4 text-emerald-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Origin</p>
                                                        <p className="text-sm font-bold text-gray-900">{req.pickupLocation}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="p-2 bg-red-50 rounded-lg flex-shrink-0">
                                                        <MapPin className="h-4 w-4 text-red-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Destination</p>
                                                        <p className="text-sm font-bold text-gray-900">{req.dropoffLocation}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="p-2 bg-yellow-50 rounded-lg flex-shrink-0">
                                                        <Calendar className="h-4 w-4 text-yellow-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date &amp; Time</p>
                                                        <p className="text-sm font-bold text-gray-900">
                                                            {req.pickupDate ? new Date(req.pickupDate).toLocaleString() : "TBD"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="p-2 bg-gray-50 rounded-lg flex-shrink-0">
                                                        <Plane className="h-4 w-4 text-gray-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Vehicle</p>
                                                        <p className="text-sm font-bold text-gray-900">{req.vehicleBrand} {req.vehicleModel}</p>
                                                        <p className="text-xs text-gray-400 font-mono">{req.vehiclePlate}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Tags */}
                                            <div className="flex flex-wrap gap-2">
                                                <span className="inline-flex items-center gap-1 text-xs font-bold bg-gray-50 text-gray-600 px-3 py-1 rounded-full">
                                                    <Users className="h-3 w-3" /> {req.passengers} pax
                                                </span>
                                                <span className="inline-flex items-center gap-1 text-xs font-bold bg-gray-50 text-gray-600 px-3 py-1 rounded-full">
                                                    <Briefcase className="h-3 w-3" /> {req.luggageCount ?? 0} bags
                                                </span>
                                            </div>

                                            {/* Customer Info */}
                                            <div className="flex flex-wrap gap-4 pt-2 border-t border-gray-50">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <User className="h-3.5 w-3.5 text-gray-400" />
                                                    <span className="font-bold">{req.customerFullName}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Phone className="h-3.5 w-3.5 text-gray-400" />
                                                    <span className="font-medium">{req.customerPhone}</span>
                                                </div>

                                            </div>

                                            {req.status === "REJECTED" && req.rejectionReason && (
                                                <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-700">
                                                    <span className="font-black">Reason: </span>{req.rejectionReason}
                                                </div>
                                            )}
                                        </div>

                                        {/* Right: Actions */}
                                        {req.status === "PENDING" && (
                                            <div className="flex flex-col gap-2 min-w-[160px]">
                                                <button
                                                    onClick={() => handleAccept(req.id)}
                                                    disabled={actionLoading === req.id}
                                                    className="flex items-center justify-center gap-2 h-11 bg-green-500 hover:bg-green-600 text-white rounded-2xl text-sm font-black transition-all active:scale-95 disabled:opacity-50"
                                                >
                                                    {actionLoading === req.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => setRejectModal({ id: req.id, reason: "" })}
                                                    disabled={actionLoading === req.id}
                                                    className="flex items-center justify-center gap-2 h-11 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl text-sm font-black transition-all active:scale-95 disabled:opacity-50"
                                                >
                                                    <XCircle className="h-4 w-4" /> Reject
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* Reject Modal */}
            {rejectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-[2rem] shadow-2xl p-8 max-w-md w-full space-y-5">
                        <div>
                            <h3 className="text-xl font-black text-gray-900">Reject Request #{rejectModal.id}</h3>
                            <p className="text-sm text-gray-500 mt-1">Please provide a clear reason for the customer.</p>
                        </div>
                        <textarea
                            rows={4}
                            placeholder="Enter rejection reason..."
                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm font-medium text-gray-900 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/10 resize-none transition-all"
                            value={rejectModal.reason}
                            onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => setRejectModal(null)}
                                className="flex-1 h-12 border-2 border-gray-100 rounded-2xl font-bold text-gray-600 hover:bg-gray-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRejectSubmit}
                                disabled={actionLoading === rejectModal.id}
                                className="flex-1 h-12 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-black transition-all disabled:opacity-50"
                            >
                                {actionLoading === rejectModal.id ? "Rejecting..." : "Confirm Reject"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
