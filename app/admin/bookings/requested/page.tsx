"use client";

import { useEffect, useState } from "react";
import {
    getPendingBookings,
    updateBookingStatus,
    getBookingDocuments
} from "@/lib/actions/bookingActions";
import {
    Check,
    X,
    Eye,
    Loader2,
    Calendar,
    User,
    Car,
    FileText,
    AlertCircle,
    Info,
    ExternalLink
} from "lucide-react";
import Image from "next/image";

export default function RequestedBookingsPage() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const [selectedDocs, setSelectedDocs] = useState<any>(null);
    const [viewingDocs, setViewingDocs] = useState(false);
    const [viewingDetails, setViewingDetails] = useState<any>(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const [showRejectModal, setShowRejectModal] = useState<number | null>(null);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        setLoading(true);
        const result = await getPendingBookings();
        if (result.success) {
            setBookings(result.data || []);
        }
        setLoading(false);
    };

    const handleAction = async (id: number, status: "ACCEPTED" | "REJECTED", reason?: string) => {
        setActionLoading(id);
        const formData = new FormData();
        if (reason) formData.append("rejectionReason", reason);

        const result = await updateBookingStatus(id, status, formData);
        if (result.success) {
            fetchBookings();
            setShowRejectModal(null);
            setRejectionReason("");
        }
        setActionLoading(null);
    };

    const viewDocs = async (id: number) => {
        setViewingDocs(true);
        const result = await getBookingDocuments(id);
        if (result.success) {
            setSelectedDocs(result.data);
        } else {
            alert(result.error);
            setViewingDocs(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
                <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Loading pending requests...</p>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-10">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-[#0f0f0f] uppercase tracking-tight">Requested Bookings</h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">Rent-A-Car Approval Pipeline</p>
                </div>
                <div className="bg-red-50 px-6 py-3 rounded-2xl border border-red-100">
                    <p className="text-red-600 font-black text-xs uppercase tracking-widest">{bookings.length} Pending Review</p>
                </div>
            </div>

            {bookings.length === 0 ? (
                <div className="bg-gray-50 rounded-[2.5rem] border border-gray-100 p-20 text-center">
                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-gray-200 mx-auto mb-6 shadow-sm">
                        <Info className="w-10 h-10" />
                    </div>
                    <h2 className="text-xl font-black text-[#0f0f0f] uppercase tracking-tight mb-2">No Requests Found</h2>
                    <p className="text-gray-400 font-medium">All booking requests have been processed.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {bookings.map((booking) => (
                        <div key={booking.bookingId} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-4 group">
                            <div className="flex items-center gap-6">
                                {/* Status Indicator */}
                                <div className="w-2 h-12 bg-red-600 rounded-full" title="Pending Review" />

                                {/* Customer Summary */}
                                <div className="flex-1 min-w-[200px]">
                                    <h3 className="text-sm font-black text-[#0f0f0f] uppercase tracking-tight">{booking.customerName}</h3>
                                    <p className="text-[10px] font-bold text-gray-400">{booking.phone}</p>
                                </div>

                                {/* Vehicle Summary */}
                                <div className="flex-1 min-w-[200px] border-l border-gray-100 pl-6">
                                    <h3 className="text-sm font-black text-[#0f0f0f] uppercase tracking-tight">
                                        {booking.vehicle?.brand} {booking.vehicle?.model}
                                    </h3>
                                    <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">{booking.vehicle?.plateNumber}</p>
                                </div>

                                {/* Dates Summary */}
                                <div className="flex-1 min-w-[150px] border-l border-gray-100 pl-6">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Rental Dates</span>
                                        <span className="text-[11px] font-black text-[#0f0f0f]">
                                            {new Date(booking.rentalDate).toLocaleDateString()} - {new Date(booking.returnDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Fare Summary */}
                                <div className="min-w-[120px] border-l border-gray-100 pl-6">
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Fare</span>
                                    <span className="text-sm font-black text-[#0f0f0f]">LKR {Number(booking.totalFare).toLocaleString()}</span>
                                </div>

                                {/* Quick Actions */}
                                <div className="flex items-center gap-2 border-l border-gray-100 pl-6">
                                    <button
                                        onClick={() => setViewingDetails(booking)}
                                        className="h-10 px-4 bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-xl flex items-center gap-2 transition-all font-black text-[9px] uppercase tracking-widest"
                                    >
                                        <Eye className="w-3.5 h-3.5" />
                                        Show Details
                                    </button>
                                    <button
                                        onClick={() => handleAction(booking.bookingId, "ACCEPTED")}
                                        disabled={actionLoading === booking.bookingId}
                                        className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center hover:bg-green-600 hover:text-white transition-all disabled:opacity-50"
                                        title="Approve"
                                    >
                                        <Check className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setShowRejectModal(booking.bookingId)}
                                        disabled={actionLoading === booking.bookingId}
                                        className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center hover:bg-red-600 hover:text-white transition-all disabled:opacity-50"
                                        title="Reject"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Rejection Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-[#0f0f0f]/60 backdrop-blur-md z-[60] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl space-y-8">
                        <div>
                            <h2 className="text-2xl font-black text-[#0f0f0f] uppercase tracking-tight">Reject Request</h2>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Please provide a reason for rejection</p>
                        </div>
                        <div className="space-y-4">
                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="w-full h-32 bg-gray-50 border border-gray-100 rounded-3xl p-6 text-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 transition-all resize-none"
                                placeholder="E.g. Documents are blurry, vehicle is undergoing maintenance..."
                            />
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => { setShowRejectModal(null); setRejectionReason(""); }}
                                className="flex-1 h-12 rounded-2xl border border-gray-100 font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleAction(showRejectModal, "REJECTED", rejectionReason)}
                                disabled={actionLoading !== null || !rejectionReason.trim()}
                                className="flex-1 h-12 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-200 hover:bg-red-700 transition-all disabled:opacity-50 active:scale-95"
                            >
                                {actionLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Confirm Reject"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Detailed Info Modal */}
            {viewingDetails && (
                <div className="fixed inset-0 bg-[#0f0f0f]/80 backdrop-blur-md z-50 flex items-center justify-center p-6 lg:p-12 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-5xl max-h-full rounded-[3rem] overflow-hidden flex flex-col shadow-2xl">
                        <div className="p-8 lg:px-12 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h2 className="text-2xl font-black text-[#0f0f0f] uppercase tracking-tight">Booking Request Details</h2>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full verification file for #{viewingDetails.bookingId}</p>
                            </div>
                            <button
                                onClick={() => setViewingDetails(null)}
                                className="w-12 h-12 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-[#0f0f0f] hover:bg-red-50 hover:text-red-600 transition-all shadow-sm"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 lg:p-12 space-y-12">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                {/* Customer & Guarantor Sections */}
                                <div className="space-y-10">
                                    <section>
                                        <h4 className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                                            <User className="w-4 h-4" /> Customer Information
                                        </h4>
                                        <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 space-y-4">
                                            <DetailItem label="Full Name" value={viewingDetails.customerName} />
                                            <DetailItem label="Phone Number" value={viewingDetails.phone} />
                                            <DetailItem label="NIC Number" value={viewingDetails.nic} />
                                            <DetailItem label="License No" value={viewingDetails.license} />
                                        </div>
                                    </section>

                                    <section>
                                        <h4 className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                                            <FileText className="w-4 h-4" /> Verification Documents
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <button
                                                onClick={() => viewDocs(viewingDetails.bookingId)}
                                                className="h-16 bg-white border border-gray-100 rounded-2xl flex items-center justify-center gap-3 hover:border-red-600 transition-all shadow-sm"
                                            >
                                                <Eye className="w-4 h-4 text-red-600" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">View All Files</span>
                                            </button>
                                        </div>
                                    </section>
                                </div>

                                {/* Vehicle & Booking Info */}
                                <div className="space-y-10">
                                    <section>
                                        <h4 className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                                            <Car className="w-4 h-4" /> Rental Details
                                        </h4>
                                        <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 space-y-4">
                                            <DetailItem label="Vehicle" value={`${viewingDetails.vehicle?.brand} ${viewingDetails.vehicle?.model}`} />
                                            <DetailItem label="Plate Number" value={viewingDetails.vehicle?.plateNumber} />
                                            <DetailItem label="Rental Dates" value={`${new Date(viewingDetails.rentalDate).toLocaleDateString()} to ${new Date(viewingDetails.returnDate).toLocaleDateString()}`} />
                                            <DetailItem label="Total Fare" value={`LKR ${Number(viewingDetails.totalFare).toLocaleString()}`} />
                                        </div>
                                    </section>

                                    <section>
                                        <div className="bg-green-50/50 rounded-3xl p-6 border border-green-100">
                                            <div className="flex items-center gap-3 mb-2">
                                                <Check className="w-4 h-4 text-green-600" />
                                                <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Agreement Status</p>
                                            </div>
                                            <p className="text-xs font-bold text-green-700">Customer has accepted all rental terms and conditions including insurance and liability clauses.</p>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 lg:px-12 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-6">
                            <button
                                onClick={() => setShowRejectModal(viewingDetails.bookingId)}
                                className="h-14 px-8 border border-red-100 bg-white text-red-600 font-black rounded-3xl hover:bg-red-600 hover:text-white transition-all text-xs uppercase tracking-widest"
                            >
                                Reject with Reason
                            </button>
                            <button
                                onClick={() => handleAction(viewingDetails.bookingId, "ACCEPTED")}
                                className="h-14 px-12 bg-[#0f0f0f] text-white font-black rounded-3xl hover:bg-green-600 transition-all shadow-xl shadow-gray-200 text-xs uppercase tracking-widest"
                            >
                                Approve Booking
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Document Modal */}
            {viewingDocs && (
                <div className="fixed inset-0 bg-[#0f0f0f]/80 backdrop-blur-sm z-[70] flex items-center justify-center p-10 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-6xl max-h-[90vh] rounded-[3rem] overflow-hidden flex flex-col shadow-2xl border border-gray-100">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-black text-[#0f0f0f] uppercase tracking-tight">Vault Documents</h2>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Secure document retrieval</p>
                            </div>
                            <button
                                onClick={() => { setViewingDocs(false); setSelectedDocs(null); }}
                                className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-[#0f0f0f] hover:bg-red-50 hover:text-red-600 transition-all"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-12 bg-gray-50/30">
                            {!selectedDocs ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-4">
                                    <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Decrypting files...</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                    <DocCard title="Hirer ID Document" file={selectedDocs.customerID} filename="hirer_id.pdf" />
                                    <DocCard title="Driving License" file={selectedDocs.license} filename="driver_license.pdf" />
                                    <DocCard title="Guarantor NIC" file={selectedDocs.nic} filename="guarantor_nic.pdf" />
                                    <DocCard title="Guarantor License" file={selectedDocs.gLicense} filename="guarantor_license.pdf" />
                                </div>
                            )}
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

function DocCard({ title, file, filename }: { title: string; file: string; filename: string }) {
    if (!file) {
        return (
            <div className="space-y-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">{title}</p>
                <div className="aspect-[4/3] bg-gray-100 rounded-[2.5rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 grayscale">
                    <X className="w-8 h-8 text-gray-300" />
                    <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Not Uploaded</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">{title}</p>
            <div className="aspect-[4/3] bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex items-center justify-center relative group">
                <embed src={file.startsWith('http') ? file : `data:application/pdf;base64,${file}`} className="w-full h-full" type="application/pdf" />
                <div className="absolute inset-0 bg-[#0f0f0f]/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4 pointer-events-none">
                    <a href={file.startsWith('http') ? file : `data:application/pdf;base64,${file}`} download={filename} className="bg-white px-6 h-10 rounded-full font-black text-[10px] uppercase tracking-tight flex items-center gap-2 hover:bg-red-600 hover:text-white transition-all pointer-events-auto shadow-lg z-10">
                        <ExternalLink className="w-3.5 h-3.5" /> Download
                    </a>
                </div>
            </div>
        </div>
    );
}
