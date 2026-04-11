"use client";

import React, { useEffect, useState } from "react";
import { Car, Clock, Calendar, CheckCircle, XCircle, MapPin, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type ViewTab = "all" | "past" | "pending" | "approved" | "rejected";

interface BookingVehicle {
    brand: string | null;
    model: string | null;
    plateNumber: string;
    vehicleImage: string | null;
}

interface Booking {
    bookingId: number;
    rentalDate: string;
    returnDate: string;
    totalFare: string | null;
    status: string | null;
    rejectionReason: string | null;
    createdAt: string;
    vehicle: BookingVehicle | null;
}

export default function CustomerBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<ViewTab>("all");

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
    };

    const fetchBookings = async (tab: ViewTab) => {
        setIsLoading(true);
        setError(null);
        try {
            let url = "/api/customer/bookings";
            if (tab === "past") url += "?past=true";
            else if (tab !== "all") url += `?status=${tab}`;

            const res = await fetch(url);
            if (!res.ok) throw new Error("Failed to fetch bookings");

            const result = await res.json();
            if (result.success) {
                setBookings(result.data);
            } else {
                throw new Error(result.error || "Failed to fetch bookings");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings(activeTab);
    }, [activeTab]);

    const getStatusStyle = (status: string | null) => {
        switch (status) {
            case "PENDING":
                return "bg-yellow-50 text-yellow-700 border-yellow-200";
            case "ACCEPTED":
                return "bg-green-50 text-green-700 border-green-200";
            case "REJECTED":
                return "bg-red-50 text-red-700 border-red-200";
            default:
                return "bg-gray-50 text-gray-700 border-gray-200";
        }
    };

    const getStatusIcon = (status: string | null) => {
        switch (status) {
            case "PENDING": return <Clock className="w-4 h-4 mr-1.5" />;
            case "ACCEPTED": return <CheckCircle className="w-4 h-4 mr-1.5" />;
            case "REJECTED": return <XCircle className="w-4 h-4 mr-1.5" />;
            default: return null;
        }
    };

    const tabs: { id: ViewTab, label: string }[] = [
        { id: "all", label: "All Bookings" },
        { id: "past", label: "Past Bookings" },
        { id: "pending", label: "Pending" },
        { id: "approved", label: "Approved" },
        { id: "rejected", label: "Rejected" },
    ];

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Bookings</h1>
                <p className="text-gray-500">View and manage your car rental history</p>
            </div>

            {/* Tabs Navigation */}
            <div className="flex overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 gap-2 border-b border-gray-200 no-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`whitespace-nowrap px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all duration-200 ${
                            activeTab === tab.id
                                ? "bg-blue-50 text-blue-700 border-b-2 border-blue-600 focus:outline-none"
                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50 border-b-2 border-transparent"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            {isLoading ? (
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
            ) : error ? (
                <div className="p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl">
                    Error loading bookings: {error}
                </div>
            ) : bookings.length === 0 ? (
                <div className="text-center py-20 bg-white border border-gray-100 rounded-3xl shadow-sm">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Car className="w-8 h-8 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">No bookings found</h3>
                    <p className="text-gray-500 max-w-sm mx-auto mb-6">
                        You don't have any bookings matching this category.
                    </p>
                    <Link href="/customer/dashboard" className="px-6 py-2.5 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        Browse Cars
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6">
                    {bookings.map((booking) => (
                        <div key={booking.bookingId} className="bg-white border text-left border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col sm:flex-row group">
                            {/* Vehicle Image (Optional) */}
                            <div className="sm:w-64 h-48 sm:h-auto bg-gray-50 relative shrink-0">
                                {booking.vehicle?.vehicleImage ? (
                                    <Image
                                        src={booking.vehicle.vehicleImage}
                                        alt={booking.vehicle.model || "Vehicle"}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <Car className="w-16 h-16 opacity-50" />
                                    </div>
                                )}
                            </div>

                            <div className="p-6 flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                {booking.vehicle?.brand} {booking.vehicle?.model}
                                            </h3>
                                            <p className="text-sm font-medium text-gray-500 flex items-center mt-1">
                                                <span className="bg-gray-100 px-2 py-0.5 rounded text-xs text-gray-600 font-semibold uppercase tracking-wider mr-2">
                                                    {booking.vehicle?.plateNumber}
                                                </span>
                                                Booking #{booking.bookingId}
                                            </p>
                                        </div>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(booking.status)}`}>
                                            {getStatusIcon(booking.status)}
                                            {booking.status === "ACCEPTED" ? "APPROVED" : booking.status}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                        <div className="flex items-start">
                                            <Calendar className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
                                            <div>
                                                <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Pick-up</p>
                                                <p className="text-sm text-gray-900 font-medium">
                                                    {formatDate(booking.rentalDate)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start">
                                            <Calendar className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
                                            <div>
                                                <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Drop-off</p>
                                                <p className="text-sm text-gray-900 font-medium">
                                                    {formatDate(booking.returnDate)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {booking.status === "REJECTED" && booking.rejectionReason && (
                                        <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700">
                                            <strong>Reason:</strong> {booking.rejectionReason}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-500 uppercase font-semibold">Total Fare</span>
                                        <span className="text-lg font-bold text-gray-900">
                                            RS {booking.totalFare ? parseFloat(booking.totalFare).toLocaleString() : "0.00"}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-400">
                                        Requested on {formatDate(booking.createdAt)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
