"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    getPendingBookings,
    updateBookingStatus,
    getBookingDocuments
} from "@/lib/actions/bookingActions";
import {
    getPendingPickups,
    updatePickupStatus
} from "@/lib/actions/pickupActions";
import {
    getWeddingCarInquiries,
    markWeddingInquiryContacted
} from "@/lib/actions/weddingActions";
import {
    Check,
    X,
    Eye,
    Loader2,
    User,
    Car,
    FileText,
    Info,
    ExternalLink,
    ChevronRight,
    Truck,
    Key,
    Wind,
    MessageSquare
} from "lucide-react";

// --- Categories Configuration ---
const categories = [
    {
        id: "rent-a-car",
        name: "Rent a Car",
        description: "Standard daily/monthly vehicle rental approvals.",
        icon: Car,
        color: "bg-blue-50 text-blue-600 border-blue-100 ring-blue-50",
    },
    {
        id: "pickups",
        name: "Pickups",
        description: "Point-to-point local pickup and drop-off requests.",
        icon: Truck,
        color: "bg-emerald-50 text-emerald-600 border-emerald-100 ring-emerald-50",
    },
    {
        id: "airport",
        name: "Airport Pickups",
        description: "Airport transfer and rental bookings pipeline.",
        icon: Key,
        color: "bg-purple-50 text-purple-600 border-purple-100 ring-purple-50",
    },
    {
        id: "wedding",
        name: "Wedding Car Rental",
        description: "Premium wedding vehicle inquiries and bookings.",
        icon: Wind,
        color: "bg-amber-50 text-amber-600 border-amber-100 ring-amber-50",
    },
];

export default function EmployeeRequestedBookingsPage() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Data states
    const [rentBookings, setRentBookings] = useState<any[]>([]);
    const [pickupBookings, setPickupBookings] = useState<any[]>([]);
    const [airportBookings, setAirportBookings] = useState<any[]>([]);
    const [weddingBookings, setWeddingBookings] = useState<any[]>([]);

    // Shared states
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const [viewingDetails, setViewingDetails] = useState<any>(null);
    const [showRejectModal, setShowRejectModal] = useState<number | null>(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const [employeeId, setEmployeeId] = useState<number | null>(null);

    // Rent-A-Car specific
    const [viewingDocs, setViewingDocs] = useState(false);
    const [selectedDocs, setSelectedDocs] = useState<any>(null);

    // Initial Fetch
    useEffect(() => {
        const fetchSession = async () => {
            const res = await fetch("/api/auth/session");
            const data = await res.json();
            if (data.session?.relatedId) {
                setEmployeeId(data.session.relatedId);
            }
        };
        fetchSession();

        if (selectedCategory && employeeId) {
            fetchData(selectedCategory, employeeId);
        }
    }, [selectedCategory, employeeId]);

    const fetchData = async (category: string, empId: number) => {
        setLoading(true);
        if (category === "rent-a-car") {
            const res = await getPendingBookings(empId);
            if (res.success) setRentBookings(res.data || []);
        } else if (category === "pickups") {
            const res = await getPendingPickups(empId);
            if (res.success) setPickupBookings(res.data || []);
        } else if (category === "airport") {
            try {
                const res = await fetch(`/api/airport-rental/bookings?status=PENDING&employeeId=${empId}`);
                const data = await res.json();
                if (res.ok && data.success) setAirportBookings(data.data.reverse());
            } catch (e) { console.error(e); }
        } else if (category === "wedding") {
            // Wedding inquiries don't have assignment yet in schema logic, 
            // but if we want to filter them, we'd need to add assignedEmployeeId to wedding inquiries too.
            // For now, let's keep it as is or hide it if we want strict assignment.
            const res = await getWeddingCarInquiries();
            if (res.success && res.data) setWeddingBookings(res.data.filter((b: any) => b.status === "WEDDING_INQUIRY") || []);
        }
        setLoading(false);
    };

    // --- RENT-A-CAR ACTIONS ---
    const handleRentAction = async (id: number, status: "ACCEPTED" | "REJECTED", reason?: string) => {
        setActionLoading(id);
        const formData = new FormData();
        if (reason) formData.append("rejectionReason", reason);
        const result = await updateBookingStatus(id, status, formData);
        if (result.success && employeeId) {
            fetchData("rent-a-car", employeeId);
            setShowRejectModal(null);
            setRejectionReason("");
            setViewingDetails(null);
        }
        setActionLoading(null);
    };

    const viewDocs = async (id: number) => {
        setViewingDocs(true);
        const result = await getBookingDocuments(id);
        if (result.success) setSelectedDocs(result.data);
        else { alert(result.error); setViewingDocs(false); }
    };

    // --- PICKUP ACTIONS ---
    const handlePickupAction = async (id: number, status: "ACCEPTED" | "REJECTED", reason?: string) => {
        setActionLoading(id);
        const result = await updatePickupStatus(id, status, reason);
        if (result.success && employeeId) {
            fetchData("pickups", employeeId);
            setShowRejectModal(null);
            setRejectionReason("");
            setViewingDetails(null);
        }
        setActionLoading(null);
    };

    // --- WEDDING ACTIONS ---
    const handleWeddingAction = async (id: number) => {
        setActionLoading(id);
        const result = await markWeddingInquiryContacted(id);
        if (result.success && employeeId) fetchData("wedding", employeeId);
        setActionLoading(null);
    };

    // --- AIRPORT ACTIONS ---
    const handleAirportAction = async (id: number, status: "ACCEPTED" | "REJECTED", reason?: string) => {
        setActionLoading(id);
        try {
            const res = await fetch(`/api/airport-rental/bookings`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status, rejection_reason: reason })
            });
            if (res.ok && employeeId) fetchData("airport", employeeId);
            setShowRejectModal(null);
            setRejectionReason("");
            setViewingDetails(null);
        } catch (e) { console.error(e); }
        setActionLoading(null);
    };

    // --- MAIN RENDER ---
    if (!selectedCategory) {
        return (
            <div className="min-h-screen bg-[#fcfcfc] pb-12">
                <main className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
                    <div className="mb-10">
                        <nav className="mb-3 flex items-center gap-2 text-sm text-gray-400">
                            <Link href="/employee" className="transition-colors hover:text-[#0f0f0f]">Employee</Link>
                            <ChevronRight className="h-4 w-4" />
                            <span className="font-medium text-[#0f0f0f]">Bookings</span>
                        </nav>
                        <h1 className="text-2xl font-bold tracking-tight text-[#0f0f0f]">Requested Bookings</h1>
                        <p className="mt-2 text-base text-gray-500">Select a service category to manage requested bookings.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {categories.map((cat) => (
                            <div key={cat.id} onClick={() => setSelectedCategory(cat.id)} className="group cursor-pointer">
                                <div className="relative flex h-full flex-col p-6 transition-all duration-300 bg-white border-2 border-transparent hover:border-red-400/50 hover:shadow-premium rounded-3xl border">
                                    <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${cat.color} ring-4 transition-transform group-hover:scale-110`}>
                                        <cat.icon className="h-7 w-7" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="mb-2 text-xl font-bold text-[#0f0f0f]">{cat.name}</h3>
                                        <p className="text-sm leading-relaxed text-gray-500">{cat.description}</p>
                                    </div>
                                    <div className="mt-8 flex items-center justify-between">
                                        <span className="text-sm font-bold text-[#dc2626]">Manage Bookings</span>
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 transition-colors group-hover:bg-red-600 group-hover:text-white">
                                            <ChevronRight className="h-4 w-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-10">
            {/* Header with Back Button */}
            <div className="flex justify-between items-start">
                <div>
                    <nav className="mb-3 flex items-center gap-2 text-sm text-gray-400">
                        <Link href="/employee" className="transition-colors hover:text-[#0f0f0f]">Employee</Link>
                        <ChevronRight className="h-4 w-4" />
                        <button onClick={() => setSelectedCategory(null)} className="transition-colors hover:text-[#0f0f0f]">Requested Bookings</button>
                        <ChevronRight className="h-4 w-4" />
                        <span className="font-medium text-[#0f0f0f]">{categories.find(c => c.id === selectedCategory)?.name}</span>
                    </nav>
                    <h1 className="text-3xl font-black text-[#0f0f0f] uppercase tracking-tight">
                        {categories.find(c => c.id === selectedCategory)?.name}
                    </h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">Pending Approval Pipeline</p>
                </div>
                <button
                    onClick={() => setSelectedCategory(null)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-all"
                >
                    <ChevronRight className="w-4 h-4 rotate-180" /> Back to Categories
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
                    <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
                    <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Loading pending requests...</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* RENT-A-CAR LIST */}
                    {selectedCategory === "rent-a-car" && (
                        rentBookings.length === 0 ? <NoRequests /> : (
                            rentBookings.map((b) => (
                                <BookingCard key={b.bookingId} booking={b} onDetails={() => setViewingDetails(b)} onApprove={() => handleRentAction(b.bookingId, "ACCEPTED")} onReject={() => setShowRejectModal(b.bookingId)} />
                            ))
                        )
                    )}

                    {/* PICKUPS LIST */}
                    {selectedCategory === "pickups" && (
                        pickupBookings.length === 0 ? <NoRequests /> : (
                            pickupBookings.map((b) => (
                                <PickupCard key={b.id} booking={b} onDetails={() => setViewingDetails(b)} onApprove={() => handlePickupAction(b.id, "ACCEPTED")} onReject={() => setShowRejectModal(b.id)} />
                            ))
                        )
                    )}

                    {/* AIRPORT LIST */}
                    {selectedCategory === "airport" && (
                        airportBookings.length === 0 ? <NoRequests /> : (
                            airportBookings.map((b) => (
                                <AirportCard key={b.id} booking={b} onDetails={() => setViewingDetails(b)} onApprove={() => handleAirportAction(b.id, "ACCEPTED")} onReject={() => setShowRejectModal(b.id)} />
                            ))
                        )
                    )}

                    {/* WEDDING LIST */}
                    {selectedCategory === "wedding" && (
                        weddingBookings.length === 0 ? <NoRequests /> : (
                            weddingBookings.map((b) => (
                                <WeddingCard key={b.bookingId} booking={b} onDetails={() => setViewingDetails(b)} onContacted={() => handleWeddingAction(b.bookingId)} />
                            ))
                        )
                    )}
                </div>
            )}

            {/* SHARED REJECTION MODAL */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-[#0f0f0f]/60 backdrop-blur-md z-[60] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl space-y-8">
                        <div>
                            <h2 className="text-2xl font-black text-[#0f0f0f] uppercase tracking-tight">Reject Request</h2>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Please provide a reason for rejection</p>
                        </div>
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="w-full h-32 bg-gray-50 border border-gray-100 rounded-3xl p-6 text-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 transition-all resize-none"
                            placeholder="Reason for rejection..."
                        />
                        <div className="flex gap-4">
                            <button onClick={() => { setShowRejectModal(null); setRejectionReason(""); }} className="flex-1 h-12 rounded-2xl border border-gray-100 font-black text-[10px] uppercase tracking-widest hover:bg-gray-50">Cancel</button>
                            <button
                                onClick={() => {
                                    if (selectedCategory === "rent-a-car") handleRentAction(showRejectModal, "REJECTED", rejectionReason);
                                    else if (selectedCategory === "pickups") handlePickupAction(showRejectModal, "REJECTED", rejectionReason);
                                    else if (selectedCategory === "airport") handleAirportAction(showRejectModal, "REJECTED", rejectionReason);
                                }}
                                disabled={!rejectionReason.trim()}
                                className="flex-1 h-12 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-200 hover:bg-red-700 disabled:opacity-50"
                            >
                                Confirm Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* DETAIL MODALS (REUSING COMPONENT LOGIC) */}
            {viewingDetails && (
                <DetailModal category={selectedCategory} data={viewingDetails} onClose={() => setViewingDetails(null)} onApprove={() => {
                    if (selectedCategory === "rent-a-car") handleRentAction(viewingDetails.bookingId, "ACCEPTED");
                    else if (selectedCategory === "pickups") handlePickupAction(viewingDetails.id, "ACCEPTED");
                    else if (selectedCategory === "airport") handleAirportAction(viewingDetails.id, "ACCEPTED");
                }} onReject={() => setShowRejectModal(selectedCategory === "rent-a-car" ? viewingDetails.bookingId : viewingDetails.id)} onAction={() => {
                    if (selectedCategory === "wedding") handleWeddingAction(viewingDetails.bookingId);
                    setViewingDetails(null);
                }} onViewDocs={selectedCategory === "rent-a-car" ? viewDocs : undefined} />
            )}

            {/* DOCS MODAL FOR RENT-A-CAR */}
            {viewingDocs && (
                <div className="fixed inset-0 bg-[#0f0f0f]/80 backdrop-blur-sm z-[70] flex items-center justify-center p-10">
                    <div className="bg-white w-full max-w-6xl max-h-[90vh] rounded-[3rem] overflow-hidden flex flex-col">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-2xl font-black text-[#0f0f0f] uppercase tracking-tight">Vault Documents</h2>
                            <button onClick={() => { setViewingDocs(false); setSelectedDocs(null); }} className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center hover:text-red-600"><X /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-12 bg-gray-50/30">
                            {selectedDocs ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                    <DocCard title="Hirer ID Document" file={selectedDocs.customerID} />
                                    <DocCard title="Driving License" file={selectedDocs.license} />
                                    <DocCard title="Guarantor NIC" file={selectedDocs.nic} />
                                    <DocCard title="Guarantor License" file={selectedDocs.gLicense} />
                                </div>
                            ) : <Loader2 className="mx-auto animate-spin" />}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// --- SUB-COMPONENTS ---

function NoRequests() {
    return (
        <div className="bg-gray-50 rounded-[2.5rem] border border-gray-100 p-20 text-center">
            <Info className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-black text-[#0f0f0f] uppercase tracking-tight mb-2">No Requests Found</h2>
            <p className="text-gray-400 font-medium">All booking requests for this category have been processed.</p>
        </div>
    );
}

function BookingCard({ booking, onDetails, onApprove, onReject }: any) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-4">
            <div className="flex items-center gap-6">
                <div className="w-2 h-12 bg-red-600 rounded-full" />
                <div className="flex-1">
                    <h3 className="text-sm font-black text-[#0f0f0f] uppercase tracking-tight">{booking.customerName}</h3>
                    <p className="text-[10px] font-bold text-gray-400">{booking.phone}</p>
                </div>
                <div className="flex-1 border-l border-gray-100 pl-6">
                    <h3 className="text-sm font-black text-[#0f0f0f] uppercase tracking-tight">{booking.vehicle?.brand} {booking.vehicle?.model}</h3>
                    <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">{booking.vehicle?.plateNumber}</p>
                </div>
                <div className="flex-1 border-l border-gray-100 pl-6">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Rental Dates</span>
                    <span className="text-[11px] font-black text-[#0f0f0f]">{new Date(booking.rentalDate).toLocaleDateString()} - {new Date(booking.returnDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 border-l border-gray-100 pl-6">
                    <button onClick={onDetails} className="h-10 px-4 bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-xl flex items-center gap-2 font-black text-[9px] uppercase tracking-widest"><Eye className="w-3.5 h-3.5" /> Details</button>
                    <button onClick={onApprove} className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center hover:bg-green-600 hover:text-white transition-all"><Check className="w-4 h-4" /></button>
                    <button onClick={onReject} className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center hover:bg-red-600 hover:text-white transition-all"><X className="w-4 h-4" /></button>
                </div>
            </div>
        </div>
    );
}

function PickupCard({ booking, onDetails, onApprove, onReject }: any) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-4">
            <div className="flex items-center gap-6">
                <div className="w-2 h-12 bg-emerald-500 rounded-full" />
                <div className="flex-1">
                    <h3 className="text-sm font-black text-[#0f0f0f] uppercase tracking-tight">{booking.customerFullName}</h3>
                    <p className="text-[10px] font-bold text-gray-400">{booking.customerPhone}</p>
                </div>
                <div className="flex-1 border-l border-gray-100 pl-6">
                    <h3 className="text-sm font-black text-[#0f0f0f] uppercase tracking-tight">{booking.pickupLocation} → {booking.dropLocation}</h3>
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{new Date(booking.pickupTime).toLocaleString()}</p>
                </div>
                <div className="flex-1 border-l border-gray-100 pl-6">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Travelers</span>
                    <span className="text-[11px] font-black text-[#0f0f0f]">{booking.travelers} Pax · {booking.luggageCount} Bags</span>
                </div>
                <div className="flex items-center gap-2 border-l border-gray-100 pl-6">
                    <button onClick={onDetails} className="h-10 px-4 bg-gray-50 hover:bg-emerald-50 text-gray-600 hover:text-emerald-600 rounded-xl flex items-center gap-2 font-black text-[9px] uppercase tracking-widest"><Eye className="w-3.5 h-3.5" /> Details</button>
                    <button onClick={onApprove} className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center hover:bg-green-600 hover:text-white transition-all"><Check className="w-4 h-4" /></button>
                    <button onClick={onReject} className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center hover:bg-red-600 hover:text-white transition-all"><X className="w-4 h-4" /></button>
                </div>
            </div>
        </div>
    );
}

function AirportCard({ booking, onDetails, onApprove, onReject }: any) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-4">
            <div className="flex items-center gap-6">
                <div className="w-2 h-12 bg-purple-500 rounded-full" />
                <div className="flex-1">
                    <h3 className="text-sm font-black text-[#0f0f0f] uppercase tracking-tight">{booking.customerFullName}</h3>
                    <p className="text-[10px] font-bold text-gray-400">{booking.customerPhone}</p>
                </div>
                <div className="flex-1 border-l border-gray-100 pl-6">
                    <h3 className="text-sm font-black text-[#0f0f0f] uppercase tracking-tight">{booking.airport === "BANDARANAYAKE" ? "BIA (Colombo)" : "HRI (Mattala)"}</h3>
                    <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest">{booking.transferType}</p>
                </div>
                <div className="flex-1 border-l border-gray-100 pl-6">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Schedule</span>
                    <span className="text-[11px] font-black text-[#0f0f0f]">{booking.transferDate} {booking.transferTime}</span>
                </div>
                <div className="flex items-center gap-2 border-l border-gray-100 pl-6">
                    <button onClick={onDetails} className="h-10 px-4 bg-gray-50 hover:bg-purple-50 text-gray-600 hover:text-purple-600 rounded-xl flex items-center gap-2 font-black text-[9px] uppercase tracking-widest"><Eye className="w-3.5 h-3.5" /> Details</button>
                    <button onClick={onApprove} className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center hover:bg-green-600 hover:text-white transition-all"><Check className="w-4 h-4" /></button>
                    <button onClick={onReject} className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center hover:bg-red-600 hover:text-white transition-all"><X className="w-4 h-4" /></button>
                </div>
            </div>
        </div>
    );
}

function WeddingCard({ booking, onDetails, onContacted }: any) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-4">
            <div className="flex items-center gap-6">
                <div className="w-2 h-12 bg-amber-500 rounded-full" />
                <div className="flex-1">
                    <h3 className="text-sm font-black text-[#0f0f0f] uppercase tracking-tight">{booking.customerName}</h3>
                    <p className="text-[10px] font-bold text-gray-400">{booking.phone}</p>
                </div>
                <div className="flex-1 border-l border-gray-100 pl-6">
                    <h3 className="text-sm font-black text-[#0f0f0f] uppercase tracking-tight">{booking.vehicle?.brand} {booking.vehicle?.model}</h3>
                    <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Wedding Request</p>
                </div>
                <div className="flex-1 border-l border-gray-100 pl-6">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Event Date</span>
                    <span className="text-[11px] font-black text-[#0f0f0f]">{new Date(booking.eventDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 border-l border-gray-100 pl-6">
                    <button onClick={onDetails} className="h-10 px-4 bg-gray-50 hover:bg-amber-50 text-gray-600 hover:text-amber-600 rounded-xl flex items-center gap-2 font-black text-[9px] uppercase tracking-widest"><MessageSquare className="w-3.5 h-3.5" /> Details</button>
                    <button onClick={onContacted} className="h-10 px-4 bg-green-50 text-green-600 rounded-xl flex items-center gap-2 hover:bg-green-600 hover:text-white transition-all font-black text-[9px] uppercase tracking-widest"><Check className="w-3.5 h-3.5" /> Contacted</button>
                </div>
            </div>
        </div>
    );
}

function DetailModal({ category, data, onClose, onApprove, onReject, onAction, onViewDocs }: any) {
    return (
        <div className="fixed inset-0 bg-[#0f0f0f]/80 backdrop-blur-md z-50 flex items-center justify-center p-6 lg:p-12 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-5xl max-h-full rounded-[3rem] overflow-hidden flex flex-col shadow-2xl">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-2xl font-black text-[#0f0f0f] uppercase tracking-tight">Request Details</h2>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full verification file for #{data.bookingId || data.id}</p>
                    </div>
                    <button onClick={onClose} className="w-12 h-12 bg-white border border-gray-100 rounded-2xl flex items-center justify-center hover:text-red-600"><X /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-10 space-y-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <section>
                            <h4 className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-3"><User className="w-4 h-4" /> Customer Information</h4>
                            <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                                <DetailItem label="Full Name" value={data.customerFullName || data.customerName} />
                                <DetailItem label="Phone" value={data.customerPhone || data.phone} />
                                {data.email && <DetailItem label="Email" value={data.email} />}
                                {data.nic && <DetailItem label="NIC" value={data.nic} />}
                            </div>
                        </section>

                        <section>
                            <h4 className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-3"><Car className="w-4 h-4" /> Service Details</h4>
                            <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                                {category === "rent-a-car" && (
                                    <>
                                        <DetailItem label="Vehicle" value={`${data.vehicle?.brand} ${data.vehicle?.model}`} />
                                        <DetailItem label="Plate" value={data.vehicle?.plateNumber} />
                                        <DetailItem label="Fare" value={`LKR ${Number(data.totalFare).toLocaleString()}`} />
                                    </>
                                )}
                                {category === "pickups" && (
                                    <>
                                        <DetailItem label="Route" value={`${data.pickupLocation} → ${data.dropLocation}`} />
                                        <DetailItem label="Travelers" value={`${data.travelers} Pax · ${data.luggageCount} Bags`} />
                                        <DetailItem label="Fare" value={`LKR ${Number(data.price).toLocaleString()}`} />
                                    </>
                                )}
                                {category === "airport" && (
                                    <>
                                        <DetailItem label="Airport" value={data.airport} />
                                        <DetailItem label="Type" value={data.transferType} />
                                        <DetailItem label="Location" value={data.transferLocation} />
                                    </>
                                )}
                                {category === "wedding" && (
                                    <>
                                        <DetailItem label="Vehicle" value={`${data.vehicle?.brand} ${data.vehicle?.model}`} />
                                        <DetailItem label="Event Date" value={new Date(data.eventDate).toLocaleDateString()} />
                                        <DetailItem label="Pickup" value={data.pickupLocation} />
                                    </>
                                )}
                            </div>
                        </section>
                    </div>

                    {category === "wedding" && data.message && (
                        <section>
                            <h4 className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-3"><MessageSquare className="w-4 h-4" /> Message</h4>
                            <div className="bg-amber-50/50 rounded-2xl p-6 border border-amber-100 text-sm">{data.message}</div>
                        </section>
                    )}

                    {category === "rent-a-car" && onViewDocs && (
                        <section>
                            <h4 className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-3"><FileText className="w-4 h-4" /> Documents</h4>
                            <button onClick={() => onViewDocs(data.bookingId)} className="w-full h-14 bg-white border border-gray-100 rounded-2xl flex items-center justify-center gap-3 hover:border-red-600 transition-all shadow-sm">
                                <Eye className="w-4 h-4 text-red-600" />
                                <span className="text-[10px] font-black uppercase tracking-widest">View All Files</span>
                            </button>
                        </section>
                    )}
                </div>

                <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-4">
                    {category === "wedding" ? (
                        <button onClick={onAction} className="h-14 px-12 bg-green-600 text-white font-black rounded-3xl hover:bg-green-700 transition-all text-xs uppercase tracking-widest">Mark Contacted</button>
                    ) : (
                        <>
                            <button onClick={onReject} className="h-14 px-8 border border-red-100 bg-white text-red-600 font-black rounded-3xl hover:bg-red-600 hover:text-white transition-all text-xs uppercase tracking-widest">Reject</button>
                            <button onClick={onApprove} className="h-14 px-12 bg-[#0f0f0f] text-white font-black rounded-3xl hover:bg-green-600 transition-all text-xs uppercase tracking-widest">Approve Booking</button>
                        </>
                    )}
                </div>
            </div>
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

function DocCard({ title, file }: { title: string; file: string }) {
    if (!file) return (
        <div className="space-y-4">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</p>
            <div className="aspect-[4/3] bg-gray-100 rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 grayscale"><X /><span className="text-[9px] font-black text-gray-300">Not Uploaded</span></div>
        </div>
    );
    return (
        <div className="space-y-4">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</p>
            <div className="aspect-[4/3] bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex items-center justify-center relative group">
                <embed src={file.startsWith('http') ? file : `data:application/pdf;base64,${file}`} className="w-full h-full" type="application/pdf" />
                <div className="absolute inset-0 bg-[#0f0f0f]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <a href={file.startsWith('http') ? file : `data:application/pdf;base64,${file}`} download="document.pdf" className="bg-white px-6 h-10 rounded-full font-black text-[10px] uppercase tracking-tight flex items-center gap-2 hover:bg-red-600 hover:text-white transition-all"><ExternalLink className="w-4 h-4" /> Download</a>
                </div>
            </div>
        </div>
    );
}
