"use client";

import Link from "next/link";
import { ChevronRight, Search, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import RequestedBookingTable, { RequestedBooking } from "@/components/admin/RequestedBookingTable";

// Mock Data
const MOCK_BOOKINGS: RequestedBooking[] = [
    {
        reservationId: 1001,
        customerId: 1,
        vehicleId: 5,
        startDatetime: "2026-02-01T10:00:00",
        endDatetime: "2026-02-05T18:00:00",
        pickupLocation: "Bandaranaike International Airport",
        dropoffLocation: "Colombo 07",
        distance: "35.5",
        totalFare: "25000.00",
        reservationStatus: "Requested",
        customer: {
            fullName: "John Doe",
            nic: "199012345678",
            email: "john.doe@example.com",
            phone: "+94 77 123 4567",
            address: "No 123, Galle Road, Colombo 03",
            licenseNumber: "B1234567",
            registrationDate: "2025-10-15",
            termsAccepted: 1,
        }
    },
    {
        reservationId: 1002,
        customerId: 2,
        vehicleId: 8,
        startDatetime: "2026-02-10T08:30:00",
        endDatetime: "2026-02-12T20:00:00",
        pickupLocation: "Mount Lavinia Hotel",
        dropoffLocation: "Kandy City Center",
        distance: "115.0",
        totalFare: "45000.00",
        reservationStatus: "Requested",
        customer: {
            fullName: "Jane Smith",
            nic: "199556781234",
            email: "jane.smith@example.com",
            phone: "+94 71 987 6543",
            address: "No 45, Temple Road, Mount Lavinia",
            licenseNumber: "C7654321",
            registrationDate: "2025-11-20",
            termsAccepted: 1,
        }
    },
    {
        reservationId: 1003,
        customerId: 3,
        vehicleId: 12,
        startDatetime: "2026-03-01T09:00:00",
        endDatetime: "2026-03-01T17:00:00",
        pickupLocation: "Colombo Fort Railway Station",
        dropoffLocation: "Galle Fort",
        distance: "125.5",
        totalFare: "18500.00",
        reservationStatus: "Pending",
        customer: {
            fullName: "Kamal Perera",
            nic: "198512348765",
            email: "kamal.perera@example.com",
            phone: "+94 76 555 4444",
            address: "No 88, Marine Drive, Bambalapitiya",
            licenseNumber: "A9988776",
            registrationDate: "2025-09-05",
            termsAccepted: 1,
        }
    }
];

export default function RequestedBookingsPage() {
    const [bookings, setBookings] = useState<RequestedBooking[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        // Simulate API fetch
        const timer = setTimeout(() => {
            setBookings(MOCK_BOOKINGS);
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const filteredBookings = bookings.filter(b =>
        b.reservationId.toString().includes(searchTerm) ||
        b.customer?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.dropoffLocation.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <main className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <nav className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                            <Link href="/admin/dashboard" className="hover:text-yellow-600">Admin</Link>
                            <ChevronRight className="h-4 w-4" />
                            <Link href="/admin/reservations" className="hover:text-yellow-600">Reservations</Link>
                            <ChevronRight className="h-4 w-4" />
                            <span className="text-gray-900 font-medium font-bold">Requested Bookings</span>
                        </nav>
                        <h1 className="text-2xl font-bold text-gray-900">Requested Bookings</h1>
                        <p className="mt-1 text-sm text-gray-500">Review and manage new reservation requests from customers.</p>
                    </div>
                </div>

                {/* Filters/Actions */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl bg-white p-4 border border-gray-100 shadow-sm transition-all hover:shadow-md">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by ID, customer name or location..."
                            className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Bookings Table */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                        <Loader2 className="h-10 w-10 animate-spin text-yellow-500" />
                        <p className="mt-4 text-gray-500 font-medium">Fetching requested bookings...</p>
                    </div>
                ) : (
                    <RequestedBookingTable bookings={filteredBookings} />
                )}
            </main>
        </div>
    );
}
