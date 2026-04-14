"use client";

import { X, Calendar, MapPin, DollarSign, User, FileText, Phone, Mail, Home, CreditCard } from "lucide-react";
import { RequestedBooking } from "./RequestedBookingTable";

interface BookingDetailModalProps {
    booking: RequestedBooking;
    isOpen: boolean;
    onClose: () => void;
}

export default function BookingDetailModal({ booking, isOpen, onClose }: BookingDetailModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white/80 px-6 py-4 backdrop-blur-md">
                    <h2 className="text-xl font-bold text-gray-900">Booking Details - #{booking.reservationId}</h2>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                        {/* Section A: Reservation Details */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 text-yellow-600">
                                <FileText className="h-5 w-5" />
                                <h3 className="text-lg font-bold">Reservation Details</h3>
                            </div>

                            <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <DetailItem label="Reservation ID" value={`#${booking.reservationId}`} />
                                    <DetailItem
                                        label="Status"
                                        value={booking.reservationStatus}
                                        isBadge
                                        badgeClasses={
                                            booking.reservationStatus.toLowerCase() === 'requested'
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : 'bg-blue-100 text-blue-700'
                                        }
                                    />
                                </div>

                                <div className="border-t border-gray-200 pt-4 space-y-4">
                                    <div className="flex items-start gap-3">
                                        <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                                        <div className="flex-1 grid grid-cols-2 gap-4">
                                            <DetailItem label="Start Date/Time" value={new Date(booking.startDatetime).toLocaleString()} />
                                            <DetailItem label="End Date/Time" value={new Date(booking.endDatetime).toLocaleString()} />
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                                        <div className="flex-1 grid grid-cols-2 gap-4">
                                            <DetailItem label="Pickup Location" value={booking.pickupLocation} />
                                            <DetailItem label="Drop-off Location" value={booking.dropoffLocation} />
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <DollarSign className="h-5 w-5 text-gray-400 mt-0.5" />
                                        <div className="flex-1 grid grid-cols-2 gap-4">
                                            <DetailItem label="Distance" value={`${booking.distance} km`} />
                                            <DetailItem label="Total Fare" value={`LKR ${parseFloat(booking.totalFare).toLocaleString()}`} isBold />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section B: Customer Details */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 text-yellow-600">
                                <User className="h-5 w-5" />
                                <h3 className="text-lg font-bold">Customer Details</h3>
                            </div>

                            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="h-16 w-16 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700 text-2xl font-bold">
                                        {booking.customer?.fullName.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold text-gray-900">{booking.customer?.fullName}</div>
                                        <div className="text-sm text-gray-500">Registered since {booking.customer?.registrationDate}</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                                    <InfoField icon={CreditCard} label="NIC" value={booking.customer?.nic || "N/A"} />
                                    <InfoField icon={FileText} label="License No" value={booking.customer?.licenseNumber || "N/A"} />
                                    <InfoField icon={Mail} label="Email" value={booking.customer?.email || "N/A"} />
                                    <InfoField icon={Phone} label="Phone" value={booking.customer?.phone || "N/A"} />
                                    <div className="sm:col-span-2">
                                        <InfoField icon={Home} label="Address" value={booking.customer?.address || "N/A"} />
                                    </div>
                                    <InfoField
                                        icon={FileText}
                                        label="Terms Accepted"
                                        value={booking.customer?.termsAccepted ? "Yes" : "No"}
                                        valueClasses={booking.customer?.termsAccepted ? "text-green-600 font-bold" : "text-red-600 font-bold"}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="sticky bottom-0 border-t bg-gray-50 px-6 py-4 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-bold text-gray-700 transition-all hover:bg-gray-50"
                    >
                        Close
                    </button>
                    <button
                        className="rounded-xl bg-yellow-400 px-6 py-2.5 text-sm font-bold text-black shadow-md transition-all hover:bg-yellow-500 hover:shadow-lg"
                        onClick={() => alert("Actions like Accept/Reject can be implemented here.")}
                    >
                        Process Booking
                    </button>
                </div>
            </div>
        </div>
    );
}

function DetailItem({ label, value, isBadge = false, badgeClasses = "", isBold = false }: { label: string, value: string, isBadge?: boolean, badgeClasses?: string, isBold?: boolean }) {
    return (
        <div>
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{label}</div>
            {isBadge ? (
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${badgeClasses}`}>
                    {value}
                </span>
            ) : (
                <div className={`text-sm ${isBold ? 'font-bold text-gray-900' : 'text-gray-700'}`}>{value}</div>
            )}
        </div>
    );
}

function InfoField({ icon: Icon, label, value, valueClasses = "" }: { icon: any, label: string, value: string, valueClasses?: string }) {
    return (
        <div className="flex items-start gap-3">
            <div className="bg-gray-50 p-2 rounded-lg">
                <Icon className="h-4 w-4 text-gray-400" />
            </div>
            <div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</div>
                <div className={`text-sm text-gray-700 ${valueClasses}`}>{value}</div>
            </div>
        </div>
    );
}
