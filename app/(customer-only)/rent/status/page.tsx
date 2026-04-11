"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import {
    CheckCircle2,
    Calendar,
    Clock,
    ShieldCheck,
    Car,
    Loader2,
    ArrowLeft,
    Phone,
} from "lucide-react";

// ── Date formatter ─────────────────────────────────────────────────────────────
function formatDate(dateStr: string | null): string {
    if (!dateStr) return "—";
    const d = new Date(dateStr + "T00:00:00");
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

// ── Status badge ───────────────────────────────────────────────────────────────
function StatusPill({ label }: { label: string }) {
    return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded-full text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            {label}
        </span>
    );
}

// ── Detail row ─────────────────────────────────────────────────────────────────
function DetailRow({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ElementType;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-gray-500" />
            </div>
            <div className="min-w-0">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider leading-none mb-0.5">
                    {label}
                </p>
                <p className="text-sm font-semibold text-gray-800 whitespace-nowrap">{value}</p>
            </div>
        </div>
    );
}

// ── Main content ───────────────────────────────────────────────────────────────
function StatusContent() {
    const searchParams = useSearchParams();
    const startDate = searchParams.get("rental_start_date");
    const endDate = searchParams.get("rental_end_date");
    const totalPrice = searchParams.get("totalPrice");

    const [reference, setReference] = useState("—");

    useEffect(() => {
        setReference(`IZR-${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
    }, []);

    return (
        <div className="max-w-2xl mx-auto px-4 py-12">

            {/* ── Success Banner ── */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm mb-5">
                {/* Top accent */}
                <div className="h-1 bg-emerald-500 w-full" />

                <div className="p-5 flex items-start gap-4">
                    {/* Icon */}
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap mb-1">
                            <h1 className="text-base font-bold text-gray-900">
                                Booking Requested Successfully
                            </h1>
                            <StatusPill label="Under Review" />
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Your request is under review. Our team will contact you within{" "}
                            <span className="font-semibold text-gray-700">60 minutes</span> during
                            business hours.
                        </p>
                        <p className="text-[11px] text-gray-400 mt-2 font-medium">
                            Reference:{" "}
                            <span className="font-semibold text-gray-600 tracking-wide">
                                {reference}
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Booking Details Card ── */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-5">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Booking Details
                    </p>
                    <Car className="w-4 h-4 text-gray-300" />
                </div>

                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <DetailRow
                        icon={Calendar}
                        label="Rental Period"
                        value={`${formatDate(startDate)} — ${formatDate(endDate)}`}
                    />
                    <DetailRow
                        icon={ShieldCheck}
                        label="Protection"
                        value="Comprehensive Coverage"
                    />
                    <DetailRow
                        icon={Clock}
                        label="Approval Time"
                        value="Within 60 minutes"
                    />
                    <DetailRow
                        icon={Phone}
                        label="Contact Method"
                        value="Phone Notification"
                    />
                </div>

                {/* Price strip */}
                <div className="bg-gray-50 border-t border-gray-100 px-5 py-4 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
                            Estimated Total
                        </p>
                        <p className="text-xl font-bold text-gray-900">
                            LKR {Number(totalPrice || 0).toLocaleString()}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
                            Payment
                        </p>
                        <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5 justify-end">
                            <CheckCircle2 className="w-3 h-3" />
                            Due on Approval
                        </p>
                    </div>
                </div>
            </div>

            {/* ── What Happens Next ── */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-5">
                <div className="px-5 py-4 border-b border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        What Happens Next
                    </p>
                </div>
                <div className="p-5 space-y-4">
                    {[
                        {
                            step: "01",
                            title: "Document Verification",
                            desc: "Our team reviews your NIC, license, and guarantor details.",
                        },
                        {
                            step: "02",
                            title: "Approval Notification",
                            desc: "You will receive a phone call once your booking is approved.",
                        },
                        {
                            step: "03",
                            title: "Vehicle Collection",
                            desc: "Visit our office on your pickup date with original documents.",
                        },
                    ].map(({ step, title, desc }) => (
                        <div key={step} className="flex items-start gap-4">
                            <span className="text-[10px] font-bold text-gray-300 w-6 flex-shrink-0 mt-0.5 tabular-nums">
                                {step}
                            </span>
                            <div>
                                <p className="text-sm font-semibold text-gray-800 mb-0.5">{title}</p>
                                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Actions ── */}
            <div className="flex flex-col sm:flex-row gap-3">
                <Link
                    href="/rent"
                    className="flex-1 h-10 bg-gray-900 hover:bg-red-600 text-white font-semibold rounded-xl transition-all text-sm flex items-center justify-center gap-2 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    Back to Rentals
                </Link>
                <Link
                    href="/"
                    className="flex-1 h-10 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-all text-sm flex items-center justify-center"
                >
                    Go to Home
                </Link>
            </div>
        </div>
    );
}

// ── Page wrapper ───────────────────────────────────────────────────────────────
export default function BookingStatusPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Suspense
                fallback={
                    <div className="flex items-center justify-center min-h-screen">
                        <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
                    </div>
                }
            >
                <StatusContent />
            </Suspense>
        </div>
    );
}
