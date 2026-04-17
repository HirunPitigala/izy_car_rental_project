"use client";

import { useState, useEffect } from "react";
import { Car, CreditCard, ChevronRight, ArrowRight, Sparkles, Navigation, Calendar, MapPin, Star, History, MessageSquareQuote } from "lucide-react";
import Link from "next/link";
import { getCustomerBookings } from "@/lib/actions/bookingActions";
import ReviewModal from "@/components/customer/ReviewModal";
import Image from "next/image";

export default function CustomerDashboard() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

    const fetchBookings = async () => {
        setLoading(true);
        const result = await getCustomerBookings();
        if (result.success) {
            setBookings(result.data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const activeRentals = bookings.filter(b => b.status === "PICKED_UP").length;
    const completedRentals = bookings.filter(b => b.status === "COMPLETED" || b.status === "RETURNED").length;

    const handleReviewClick = (booking: any) => {
        setSelectedBooking(booking);
        setIsReviewModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-[#fcfcfc] pb-20">
            {/* High-Impact Header */}
            <header className="bg-gray-950 text-white px-8 py-16 md:px-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full -mr-48 -mt-48 blur-[100px]" />
                <div className="container mx-auto relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <Sparkles className="w-5 h-5 text-yellow-400" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Member Exclusive</span>
                        </div>
                        <h1 className="text-5xl font-black tracking-tighter mb-2">My Command Center</h1>
                        <p className="text-white/40 font-bold uppercase tracking-widest text-xs">Premium Mobility Dashboard</p>
                    </div>

                    <div className="flex gap-4">
                        <Link href="/rent" className="px-8 py-4 bg-yellow-400 text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-yellow-500 transition-all shadow-xl shadow-yellow-400/10 active:scale-95">
                            Rent a Car
                        </Link>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 -mt-10 md:px-12 relative z-20">
                {/* Stats Grid - Glassmorphism cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 flex items-center justify-between group">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Active Rentals</p>
                            <p className="text-4xl font-black text-gray-900 tracking-tighter">{activeRentals}</p>
                        </div>
                        <div className="h-14 w-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-900 group-hover:scale-110 transition-transform">
                            <Navigation className="h-7 w-7" />
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 flex items-center justify-between group">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Completed Trips</p>
                            <p className="text-4xl font-black text-gray-900 tracking-tighter">
                                {completedRentals}
                            </p>
                        </div>
                        <div className="h-14 w-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-900 group-hover:scale-110 transition-transform">
                            <Car className="h-7 w-7" />
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 flex items-center justify-between group">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Loyalty Tier</p>
                            <p className="text-4xl font-black text-yellow-500 tracking-tighter italic">GOLD</p>
                        </div>
                        <div className="h-14 w-14 rounded-2xl bg-yellow-50 flex items-center justify-center text-yellow-500 group-hover:scale-110 transition-transform">
                            <Sparkles className="h-7 w-7" />
                        </div>
                    </div>
                </div>

                {/* Rental History Section */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-4">
                            <History className="w-8 h-8 text-gray-900" />
                            <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Rental History</h2>
                        </div>
                        <div className="h-0.5 flex-1 bg-gray-100 mx-8 hidden md:block" />
                        <Link href="/rent" className="text-xs font-black text-yellow-600 hover:text-yellow-700 flex items-center gap-2 uppercase tracking-widest transition-colors">
                            View All <ChevronRight className="h-4 w-4" />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="bg-white rounded-[3.5rem] border border-gray-100 shadow-sm p-24 text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                                <Car className="h-8 w-8 text-gray-200" />
                            </div>
                            <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Synchronizing Fleet History...</p>
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="bg-white rounded-[3.5rem] border border-gray-100 shadow-sm p-16 text-center group">
                            <div className="w-24 h-24 bg-gray-50 rounded-4xl flex items-center justify-center mx-auto mb-8 transition-transform group-hover:scale-110 duration-500">
                                <Car className="h-10 w-10 text-gray-200" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">Your fleet is waiting</h3>
                            <p className="text-gray-400 font-medium mb-10 max-w-sm mx-auto">
                                You haven't rented any cars yet.
                                Ready to experience premium mobility?
                            </p>
                            <Link href="/rent" className="inline-flex items-center gap-3 rounded-2xl bg-gray-950 px-10 py-5 text-xs font-black text-white hover:bg-black transition-all active:scale-95 shadow-2xl shadow-gray-300 uppercase tracking-widest">
                                Rent Now <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {bookings.map((booking) => (
                                <div key={booking.bookingId} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-yellow-100 transition-all p-6 group">
                                    <div className="flex gap-6">
                                        {/* Image */}
                                        <div className="relative w-32 h-32 rounded-3xl bg-gray-50 overflow-hidden shrink-0">
                                            {booking.vehicle?.image ? (
                                                <Image 
                                                    src={booking.vehicle.image} 
                                                    alt={booking.vehicle.brand} 
                                                    fill 
                                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            ) : (
                                                <Car className="w-full h-full p-8 text-gray-200" />
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h4 className="text-lg font-black text-gray-900 tracking-tight leading-tight">
                                                        {booking.vehicle?.brand} <span className="text-gray-400 font-bold">{booking.vehicle?.model}</span>
                                                    </h4>
                                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5">#{booking.bookingId}</p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm ${
                                                    booking.status === "COMPLETED" || booking.status === "RETURNED" ? "bg-emerald-50 text-emerald-600" :
                                                    booking.status === "REJECTED" ? "bg-red-50 text-red-600" :
                                                    "bg-blue-50 text-blue-600"
                                                }`}>
                                                    {booking.status}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 mb-4">
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    <span className="text-[10px] font-bold">{new Date(booking.rentalDate).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <Navigation className="w-3.5 h-3.5" />
                                                    <span className="text-[10px] font-bold text-gray-900">LKR {Number(booking.totalFare).toLocaleString()}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {(booking.status === "COMPLETED" || booking.status === "RETURNED") && (
                                                    booking.review?.reviewId ? (
                                                        <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-xl text-yellow-600">
                                                            <Star className="w-3.5 h-3.5 fill-yellow-600" />
                                                            <span className="text-[10px] font-black uppercase tracking-widest">Reviewed</span>
                                                        </div>
                                                    ) : (
                                                        <button 
                                                            onClick={() => handleReviewClick(booking)}
                                                            className="flex items-center gap-2 bg-gray-950 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-yellow-400 hover:text-gray-950 transition-all active:scale-95 shadow-lg shadow-gray-200"
                                                        >
                                                            <MessageSquareQuote className="w-3.5 h-3.5" />
                                                            Rate Service
                                                        </button>
                                                    )
                                                )}
                                                <Link href={`/rent/status?bookingId=${booking.bookingId}`} className="text-[10px] font-black text-gray-400 hover:text-gray-900 uppercase tracking-widest ml-auto px-2">
                                                    Details
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Secondary Actions */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Link href="/rent" className="bg-white p-10 rounded-[3rem] border border-gray-100 flex items-center gap-8 group hover:shadow-2xl transition-all">
                        <div className="h-16 w-16 rounded-3xl bg-gray-900 flex items-center justify-center text-yellow-400 shadow-xl shadow-gray-200 group-hover:scale-110 transition-transform">
                            <Car className="h-8 w-8" />
                        </div>
                        <div>
                            <h4 className="text-xl font-black text-gray-900 tracking-tight">Luxury Fleet Rental</h4>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Self-drive or chauffeured</p>
                        </div>
                        <ChevronRight className="h-6 w-6 text-gray-300 ml-auto group-hover:translate-x-2 transition-transform" />
                    </Link>
                    <div className="bg-yellow-400 p-10 rounded-[3rem] shadow-xl shadow-yellow-100 flex items-center gap-8 group cursor-pointer hover:bg-yellow-500 transition-all">
                        <div className="h-16 w-16 rounded-3xl bg-gray-900 flex items-center justify-center text-white shadow-xl shadow-gray-200 group-hover:scale-110 transition-transform">
                            <CreditCard className="h-8 w-8" />
                        </div>
                        <div>
                            <h4 className="text-xl font-black text-gray-900 tracking-tight">Payment Portal</h4>
                            <p className="text-xs font-black text-gray-900/40 uppercase tracking-widest mt-1">Manage billing & invoices</p>
                        </div>
                        <ChevronRight className="h-6 w-6 text-gray-900/20 ml-auto group-hover:translate-x-2 transition-transform" />
                    </div>
                </div>
            </main>

            {/* Review Modal */}
            {selectedBooking && (
                <ReviewModal 
                    isOpen={isReviewModalOpen}
                    onClose={() => setIsReviewModalOpen(false)}
                    bookingId={selectedBooking.bookingId}
                    vehicleId={selectedBooking.vehicleId}
                    vehicleName={`${selectedBooking.vehicle?.brand} ${selectedBooking.vehicle?.model}`}
                    onSuccess={() => {
                        fetchBookings();
                        // Optional: Show a success toast/message
                    }}
                />
            )}
        </div>
    );
}
