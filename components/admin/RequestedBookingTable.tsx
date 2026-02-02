"use client";

import { Eye } from "lucide-react";
import { useState } from "react";
import BookingDetailModal from "./BookingDetailModal";

export interface RequestedBooking {
    reservationId: number;
    customerId: number;
    vehicleId: number;
    startDatetime: string;
    endDatetime: string;
    pickupLocation: string;
    dropoffLocation: string;
    distance: string;
    totalFare: string;
    reservationStatus: string;
    customer?: {
        fullName: string;
        nic: string;
        email: string;
        phone: string;
        address: string;
        licenseNumber: string;
        registrationDate: string;
        termsAccepted: number;
    };
    vehicle?: {
        brand: string;
        model: string;
        plateNumber: string;
    };
}

interface RequestedBookingTableProps {
    bookings: RequestedBooking[];
}

export default function RequestedBookingTable({ bookings }: RequestedBookingTableProps) {
    const [selectedBooking, setSelectedBooking] = useState<RequestedBooking | null>(null);

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case "requested":
                return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "pending":
                return "bg-blue-100 text-blue-700 border-blue-200";
            case "confirmed":
                return "bg-green-100 text-green-700 border-green-200";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    return (
        <>
            <div className="rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden mb-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500">
                            <tr>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Schedule</th>
                                <th className="px-6 py-4">Route</th>
                                <th className="px-6 py-4">Total Fare</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {bookings.map((booking) => (
                                <tr key={booking.reservationId} className="transition-colors hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        #{booking.reservationId}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{booking.customer?.fullName || "Unknown Customer"}</div>
                                        <div className="text-xs text-gray-500">{booking.customer?.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-gray-900">
                                            {new Date(booking.startDatetime).toLocaleDateString()}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {new Date(booking.startDatetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(booking.endDatetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        <div className="text-xs font-medium">From: {booking.pickupLocation}</div>
                                        <div className="text-xs font-medium">To: {booking.dropoffLocation}</div>
                                        <div className="text-xs text-gray-400 mt-0.5">{booking.distance} km</div>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-900">
                                        LKR {parseFloat(booking.totalFare).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(booking.reservationStatus)}`}>
                                            {booking.reservationStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => setSelectedBooking(booking)}
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50"
                                        >
                                            <Eye className="h-3.5 w-3.5" />
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedBooking && (
                <BookingDetailModal
                    booking={selectedBooking}
                    isOpen={!!selectedBooking}
                    onClose={() => setSelectedBooking(null)}
                />
            )}
        </>
    );
}
