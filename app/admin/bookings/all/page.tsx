"use client";

import React, { useEffect, useState } from "react";
import { Search, Filter, History, Clock, CheckCircle, XCircle, ChevronDown, ListFilter, AlertCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type ViewStatus = "all" | "pending" | "approved" | "rejected";

interface BookingVehicle {
    brand: string | null;
    model: string | null;
    plateNumber: string;
}

interface AdminBooking {
    bookingId: number;
    customerName: string | null;
    customerPhone: string | null;
    userEmail: string | null;
    rentalDate: string;
    returnDate: string;
    totalFare: string | null;
    status: string | null;
    rejectionReason: string | null;
    createdAt: string;
    vehicle: BookingVehicle | null;
}

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState<AdminBooking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<ViewStatus>("all");
    const [showPastOnly, setShowPastOnly] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const formatYYYYMMDD = (dateString: string) => {
        try {
            return new Date(dateString).toISOString().split('T')[0];
        } catch {
            return dateString;
        }
    };

    const fetchBookings = async () => {
        setIsLoading(true);
        setError(null);
        try {
            let url = "/api/admin/bookings?";
            if (statusFilter !== "all") url += `status=${statusFilter}&`;
            if (showPastOnly) url += `past=true&`;

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
        fetchBookings();
    }, [statusFilter, showPastOnly]);

    const getStatusStyle = (status: string | null) => {
        switch (status) {
            case "PENDING":
                return "bg-yellow-100 text-yellow-800";
            case "ACCEPTED":
                return "bg-green-100 text-green-800";
            case "REJECTED":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const displayStatus = (status: string | null) => {
        if (status === "ACCEPTED") return "APPROVED";
        return status || "UNKNOWN";
    };

    const getStatusIcon = (status: string | null) => {
        switch (status) {
            case "PENDING": return <Clock className="w-4 h-4 mr-1.5" />;
            case "ACCEPTED": return <CheckCircle className="w-4 h-4 mr-1.5" />;
            case "REJECTED": return <XCircle className="w-4 h-4 mr-1.5" />;
            default: return null;
        }
    };

    const filteredBookings = bookings.filter((b) => 
        (b.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
        (b.bookingId.toString().includes(searchTerm)) ||
        (b.vehicle?.plateNumber?.toLowerCase().includes(searchTerm.toLowerCase()) || '')
    );

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">All Rent-a-Car Bookings</h1>
                    <p className="text-gray-500 mt-1">Manage and view the complete history of car rental reservations.</p>
                </div>
            </div>

            {/* Filter Controls Widget */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 items-center justify-between">
                
                <div className="flex-1 w-full relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by ID, Customer Name, or Plate No..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex items-center min-w-[200px]">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as ViewStatus)}
                            className="block w-full px-4 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white cursor-pointer appearance-none"
                        >
                            <option value="all">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 pointer-events-none" />
                    </div>

                    <button
                        onClick={() => setShowPastOnly(!showPastOnly)}
                        className={`flex items-center space-x-2 px-4 py-2 border rounded-xl text-sm font-medium transition-colors ${
                            showPastOnly 
                            ? "bg-blue-50 border-blue-200 text-blue-700" 
                            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                        <History className={`w-4 h-4 ${showPastOnly ? "text-blue-600" : "text-gray-500"}`} />
                        <span>Past Bookings</span>
                    </button>
                </div>
            </div>

            {/* Data Area */}
            {isLoading ? (
                 <div className="flex items-center justify-center py-20 bg-white rounded-2xl border border-gray-200">
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
                        <p className="text-gray-500 font-medium">Loading bookings...</p>
                    </div>
                </div>
            ) : error ? (
                <div className="p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl flex items-start">
                    <AlertCircle className="w-5 h-5 mr-3 mt-0.5 shrink-0" />
                    <div>
                        <h3 className="font-semibold text-red-800">Error Retreiving Data</h3>
                        <p className="text-sm mt-1">{error}</p>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Booking ID
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Vehicle
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Rental Period
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Total Fare
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredBookings.length > 0 ? (
                                    filteredBookings.map((booking) => (
                                        <tr key={booking.bookingId} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                #{booking.bookingId}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-gray-900">{booking.customerName || "N/A"}</span>
                                                    <span className="text-xs text-gray-500">{booking.userEmail}</span>
                                                    <span className="text-xs text-gray-500 font-mono mt-0.5">{booking.customerPhone}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-gray-900">{booking.vehicle?.brand} {booking.vehicle?.model}</span>
                                                    <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded w-fit mt-1">
                                                        {booking.vehicle?.plateNumber}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col text-sm text-gray-900">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="w-8 text-xs text-gray-500 font-semibold">OUT:</span> 
                                                        <span>{formatYYYYMMDD(booking.rentalDate)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 mt-1">
                                                        <span className="w-8 text-xs text-gray-500 font-semibold">IN:</span> 
                                                        <span>{formatYYYYMMDD(booking.returnDate)}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                                Rs {booking.totalFare ? parseFloat(booking.totalFare).toLocaleString() : "0.00"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusStyle(booking.status)}`}>
                                                    {getStatusIcon(booking.status)}
                                                    {displayStatus(booking.status)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                                                    <History className="w-6 h-6 text-gray-400" />
                                                </div>
                                                <h3 className="text-sm font-semibold text-gray-900">No bookings found</h3>
                                                <p className="text-sm text-gray-500 mt-1">Try adjusting your filters or search term</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination or Footer could go here */}
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500 text-center font-medium">
                            Showing {filteredBookings.length} {filteredBookings.length === 1 ? "result" : "results"}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
