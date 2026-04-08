
"use client";

import React from "react";
import Link from "next/link";
import { Car, User, ArrowRight, ClipboardCheck, AlertTriangle, ShieldCheck } from "lucide-react";

export type InspectionStatus = "PENDING_PICKUP" | "ACTIVE" | "PENDING_RETURN" | "COMPLETED";

interface Booking {
  bookingId: number;
  customerFullName: string;
  vehicle: {
    brand: string;
    model: string;
    plateNumber: string;
  } | null;
  rentalDate: string | null | Date;
  returnDate: string | null | Date;
  bookingStatus: string | null;
}

interface InspectionCardProps {
  booking: Booking;
  status: InspectionStatus;
}

export default function InspectionCard({ booking, status }: InspectionCardProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "PENDING_PICKUP":
        return { 
          label: "Pending Pickup", 
          icon: <ClipboardCheck className="w-4 h-4" />, 
          color: "bg-yellow-50 text-yellow-600 border-yellow-100",
          action: "Start Pickup Inspection",
          link: `/employee/bookings/${booking.bookingId}/inspection?type=BEFORE`
        };
      case "ACTIVE":
        return { 
          label: "Active Rental", 
          icon: <ShieldCheck className="w-4 h-4" />, 
          color: "bg-emerald-50 text-emerald-600 border-emerald-100",
          action: "View Before Inspection",
          link: `/employee/bookings/${booking.bookingId}/inspection?view=BEFORE`
        };
      case "PENDING_RETURN":
        return { 
          label: "Pending Return", 
          icon: <AlertTriangle className="w-4 h-4" />, 
          color: "bg-red-50 text-red-600 border-red-100",
          action: "Start Return Inspection",
          link: `/employee/bookings/${booking.bookingId}/inspection?type=AFTER`
        };
      case "COMPLETED":
        return { 
            label: "Completed", 
            icon: <ShieldCheck className="w-4 h-4" />, 
            color: "bg-gray-50 text-gray-400 border-gray-100",
            action: "View All Inspections",
            link: `/employee/bookings/${booking.bookingId}/inspection?view=ALL`
          };
      default:
        return { 
          label: "Unknown", 
          icon: null, 
          color: "bg-gray-50 text-gray-400", 
          action: "View Details",
          link: "#"
        };
    }
  };

  const config = getStatusConfig();
  const vehicle = booking.vehicle || { brand: "Unknown", model: "Vehicle", plateNumber: "—" };

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 p-6 hover:shadow-xl transition-all group overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-5">
            <Car className="w-32 h-32 rotate-12" />
        </div>
        
        <div className="relative z-10 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div className="space-y-1">
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-1.5 w-fit ${config.color}`}>
                        {config.icon}
                        {config.label}
                    </div>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight mt-3">
                        {vehicle.brand} {vehicle.model}
                    </h3>
                    <p className="text-[10px] font-mono text-gray-400 uppercase tracking-tighter">{vehicle.plateNumber}</p>
                </div>
                <div className="bg-gray-50 p-2 rounded-2xl">
                    <User className="w-4 h-4 text-gray-300" />
                </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Customer</span>
                    <p className="text-sm font-bold text-gray-900 line-clamp-1">{booking.customerFullName || "N/A"}</p>
                </div>
                <div className="space-y-1 text-right">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Booking ID</span>
                    <p className="text-sm font-bold text-gray-900">#{booking.bookingId}</p>
                </div>
            </div>

            {/* Dates */}
            <div className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50">
                <div className="flex-1">
                    <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest block mb-0.5">Pickup</span>
                    <p className="text-xs font-black text-gray-700">
                        {booking.rentalDate ? new Date(booking.rentalDate).toLocaleDateString() : "—"}
                    </p>
                </div>
                <div className="w-px h-8 bg-gray-200 opacity-50" />
                <div className="flex-1 text-right">
                    <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest block mb-0.5">Return</span>
                    <p className="text-xs font-black text-gray-700">
                        {booking.returnDate ? new Date(booking.returnDate).toLocaleDateString() : "—"}
                    </p>
                </div>
            </div>

            {/* Action */}
            <Link 
                href={config.link}
                className={`w-full h-14 rounded-[1.25rem] flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest transition-all active:scale-95 ${
                    status === "PENDING_RETURN" ? "bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-100" :
                    status === "PENDING_PICKUP" ? "bg-yellow-500 text-white hover:bg-yellow-600 shadow-lg shadow-yellow-100" :
                    "bg-[#0f0f0f] text-white hover:bg-gray-800 shadow-lg shadow-gray-200"
                }`}
            >
                {config.action}
                <ArrowRight className="w-4 h-4" />
            </Link>
        </div>
    </div>
  );
}
