"use client";

import { useEffect, useState } from "react";
import { getWeddingCarInquiries, markWeddingInquiryContacted } from "@/lib/actions/weddingActions";
import {
    Check,
    Loader2,
    Calendar,
    User,
    Car,
    Info,
    MapPin,
    Phone,
    Mail,
    MessageSquare,
    Heart,
    ChevronRight,
    X
} from "lucide-react";
import Link from "next/link";

export default function WeddingRequestsPage() {
    const [inquiries, setInquiries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const [viewingDetails, setViewingDetails] = useState<any>(null);

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        setLoading(true);
        const result = await getWeddingCarInquiries();
        if (result.success) {
            setInquiries(result.data || []);
        }
        setLoading(false);
    };

    const handleMarkContacted = async (id: number) => {
        setActionLoading(id);
        const result = await markWeddingInquiryContacted(id);
        if (result.success) {
            fetchInquiries();
        }
        setActionLoading(null);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
                <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Loading wedding inquiries...</p>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <nav className="mb-3 flex items-center gap-2 text-sm text-gray-400">
                        <Link href="/admin/dashboard" className="transition-colors hover:text-[#0f0f0f]">Admin</Link>
                        <ChevronRight className="h-4 w-4" />
                        <Link href="/admin/bookings/requested" className="transition-colors hover:text-[#0f0f0f]">Bookings</Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="font-medium text-[#0f0f0f]">Wedding Requests</span>
                    </nav>
                    <div className="flex items-center gap-3">
                        <Heart className="h-6 w-6 text-amber-500 fill-amber-500" />
                        <h1 className="text-3xl font-black text-[#0f0f0f] uppercase tracking-tight">Wedding Car Requests</h1>
                    </div>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1 ml-9">Customer Inquiry Pipeline</p>
                </div>
                <div className="bg-amber-50 px-6 py-3 rounded-2xl border border-amber-100">
                    <p className="text-amber-600 font-black text-xs uppercase tracking-widest">{inquiries.length} Inquiries</p>
                </div>
            </div>

            {/* Content */}
            {inquiries.length === 0 ? (
                <div className="bg-gray-50 rounded-[2.5rem] border border-gray-100 p-20 text-center">
                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-gray-200 mx-auto mb-6 shadow-sm">
                        <Info className="w-10 h-10" />
                    </div>
                    <h2 className="text-xl font-black text-[#0f0f0f] uppercase tracking-tight mb-2">No Inquiries Found</h2>
                    <p className="text-gray-400 font-medium">No wedding car inquiries have been submitted yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {inquiries.map((inquiry) => (
                        <div key={inquiry.bookingId} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-4 group">
                            <div className="flex items-center gap-6 flex-wrap">
                                {/* Status Indicator */}
                                <div className="w-2 h-12 bg-amber-500 rounded-full" title="Wedding Inquiry" />

                                {/* Customer */}
                                <div className="flex-1 min-w-[160px]">
                                    <h3 className="text-sm font-black text-[#0f0f0f] uppercase tracking-tight">{inquiry.customerName}</h3>
                                    <p className="text-[10px] font-bold text-gray-400">{inquiry.phone}</p>
                                    <p className="text-[10px] font-bold text-gray-400">{inquiry.email}</p>
                                </div>

                                {/* Vehicle */}
                                <div className="flex-1 min-w-[160px] border-l border-gray-100 pl-6">
                                    <h3 className="text-sm font-black text-[#0f0f0f] uppercase tracking-tight">
                                        {inquiry.vehicle?.brand} {inquiry.vehicle?.model}
                                    </h3>
                                    <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">{inquiry.vehicle?.plateNumber}</p>
                                </div>

                                {/* Event Date */}
                                <div className="min-w-[120px] border-l border-gray-100 pl-6">
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Event Date</span>
                                    <span className="text-[11px] font-black text-[#0f0f0f]">
                                        {inquiry.eventDate ? new Date(inquiry.eventDate).toLocaleDateString() : "N/A"}
                                    </span>
                                </div>

                                {/* Location */}
                                <div className="min-w-[120px] border-l border-gray-100 pl-6 hidden lg:block">
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Pickup</span>
                                    <span className="text-[11px] font-black text-[#0f0f0f] truncate block max-w-[140px]">
                                        {inquiry.pickupLocation || "Not specified"}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 border-l border-gray-100 pl-6">
                                    <button
                                        onClick={() => setViewingDetails(inquiry)}
                                        className="h-10 px-4 bg-gray-50 hover:bg-amber-50 text-gray-600 hover:text-amber-600 rounded-xl flex items-center gap-2 transition-all font-black text-[9px] uppercase tracking-widest"
                                    >
                                        <MessageSquare className="w-3.5 h-3.5" />
                                        Details
                                    </button>
                                    <button
                                        onClick={() => handleMarkContacted(inquiry.bookingId)}
                                        disabled={actionLoading === inquiry.bookingId}
                                        className="h-10 px-4 bg-green-50 text-green-600 rounded-xl flex items-center gap-2 hover:bg-green-600 hover:text-white transition-all disabled:opacity-50 font-black text-[9px] uppercase tracking-widest"
                                        title="Mark as Contacted"
                                    >
                                        <Check className="w-3.5 h-3.5" />
                                        Contacted
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Detail Modal */}
            {viewingDetails && (
                <div className="fixed inset-0 bg-[#0f0f0f]/80 backdrop-blur-md z-50 flex items-center justify-center p-6 lg:p-12 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-3xl max-h-full rounded-[3rem] overflow-hidden flex flex-col shadow-2xl">
                        <div className="p-8 lg:px-12 border-b border-gray-100 flex justify-between items-center bg-amber-50/50">
                            <div>
                                <h2 className="text-2xl font-black text-[#0f0f0f] uppercase tracking-tight">Wedding Inquiry Details</h2>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Inquiry #{viewingDetails.bookingId}</p>
                            </div>
                            <button
                                onClick={() => setViewingDetails(null)}
                                className="w-12 h-12 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-[#0f0f0f] hover:bg-red-50 hover:text-red-600 transition-all shadow-sm"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 lg:p-12 space-y-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Customer Info */}
                                <section>
                                    <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                                        <User className="w-4 h-4" /> Customer Information
                                    </h4>
                                    <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 space-y-4">
                                        <DetailItem label="Full Name" value={viewingDetails.customerName} />
                                        <DetailItem label="Email" value={viewingDetails.email} />
                                        <DetailItem label="Phone" value={viewingDetails.phone} />
                                    </div>
                                </section>

                                {/* Event Info */}
                                <section>
                                    <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                                        <Calendar className="w-4 h-4" /> Event Details
                                    </h4>
                                    <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 space-y-4">
                                        <DetailItem label="Vehicle" value={`${viewingDetails.vehicle?.brand} ${viewingDetails.vehicle?.model}`} />
                                        <DetailItem label="Event Date" value={viewingDetails.eventDate ? new Date(viewingDetails.eventDate).toLocaleDateString() : "N/A"} />
                                        <DetailItem label="Pickup Location" value={viewingDetails.pickupLocation || "Not specified"} />
                                    </div>
                                </section>
                            </div>

                            {/* Message */}
                            {viewingDetails.message && (
                                <section>
                                    <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                                        <MessageSquare className="w-4 h-4" /> Special Requests / Message
                                    </h4>
                                    <div className="bg-amber-50/50 rounded-3xl p-6 border border-amber-100">
                                        <p className="text-sm text-gray-700 leading-relaxed">{viewingDetails.message}</p>
                                    </div>
                                </section>
                            )}
                        </div>

                        <div className="p-8 lg:px-12 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-4">
                            <button
                                onClick={() => setViewingDetails(null)}
                                className="h-14 px-8 border border-gray-100 bg-white text-gray-600 font-black rounded-3xl hover:bg-gray-100 transition-all text-xs uppercase tracking-widest"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => { handleMarkContacted(viewingDetails.bookingId); setViewingDetails(null); }}
                                className="h-14 px-12 bg-green-600 text-white font-black rounded-3xl hover:bg-green-700 transition-all shadow-xl shadow-green-200 text-xs uppercase tracking-widest"
                            >
                                Mark as Contacted
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function DetailItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
            <span className="text-sm font-bold text-[#0f0f0f]">{value || "Not Provided"}</span>
        </div>
    );
}
