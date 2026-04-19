"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect, Suspense } from "react";
import {
    ArrowLeft, Users, Fuel, Gauge, Plane, Briefcase,
    MapPin, Clock, ShieldCheck, CheckCircle2, AlertCircle,
    Phone, User as UserIcon, Loader2, Info, ChevronRight, Lock
} from "lucide-react";
import { validateAddress } from "@/lib/validation";
import { uploadFileToCloudinary } from "@/lib/utils/cloudinaryClient";
import Link from "next/link";
import { lockVehicle, unlockVehicle } from "@/lib/actions/lockActions";
import { checkVehicleAvailability } from "@/lib/actions/availabilityActions";

interface AirportVehicle {
    vehicleId: number;
    brand: string | null;
    model: string | null;
    plateNumber: string;
    seatingCapacity: number;
    luggageCapacity: number;
    transmission: string;
    fuelType: string;
    rentPerDay: string;
    image: string | null;
    description: string | null;
}

interface BookingFormState {
    customerFullName: string;
    customerPhone: string;
    transferLocation: string;
}

interface FormErrors {
    customerFullName?: string;
    customerPhone?: string;
    transferLocation?: string;
}

function AirportDetailContent() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const vehicleId = params.id as string;

    const transferType = searchParams.get("transferType") || "pickup";
    const airport = searchParams.get("airport") || "katunayaka";
    const pickupDate = searchParams.get("pickupDate") || "";
    const pickupTime = searchParams.get("pickupTime") || "";
    const dropDate = searchParams.get("dropDate") || "";
    const dropTime = searchParams.get("dropTime") || "";
    const passengers = searchParams.get("passengers") || "1";
    const luggage = searchParams.get("luggage") || "0";

    const [vehicle, setVehicle] = useState<AirportVehicle | null>(null);
    const [loadingVehicle, setLoadingVehicle] = useState(true);
    const [booking, setBooking] = useState<BookingFormState>({
        customerFullName: "",
        customerPhone: "",
        transferLocation: "",
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [paymentslip, setPaymentslip] = useState<File | null>(null);

    // ── Lock state ──────────────────────────────────────────────
    const [lockStatus, setLockStatus] = useState<"locking" | "locked" | "unavailable" | "idle">("idle");
    const [lockError, setLockError] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                const res = await fetch(
                    `/api/airport-rental/search?passengers=${passengers}&luggage=${luggage}`
                );
                const data = await res.json();
                if (res.ok && data.success) {
                    const found = data.data.find(
                        (v: AirportVehicle) => v.vehicleId === parseInt(vehicleId, 10)
                    );
                    setVehicle(found || null);
                }
            } catch {
                setVehicle(null);
            } finally {
                setLoadingVehicle(false);
            }
        };
        fetchVehicle();
    }, [vehicleId, passengers, luggage]);

    // ── Auto-lock when vehicle data is ready ────────────────────
    useEffect(() => {
        if (!vehicle) return;
        let cancelled = false;

        const acquireLock = async () => {
            setLockStatus("locking");
            setLockError(null);

            // 1. Check actual availability for the requested slot
            const transferDate = transferType === "pickup" ? pickupDate : dropDate;
            const transferTimeStr = transferType === "pickup" ? pickupTime : dropTime;
            const rentalDate = transferDate ? new Date(`${transferDate}T${transferTimeStr || "00:00"}`) : new Date();
            // Standard 4-hour window for airport transfers
            const checkEnd = new Date(rentalDate.getTime() + 4 * 60 * 60 * 1000);

            try {
                const isAvailable = await checkVehicleAvailability(vehicle.vehicleId, rentalDate, checkEnd);
                if (!isAvailable) {
                    setLockStatus("unavailable");
                    setLockError("This vehicle is no longer available for the selected time slot.");
                    return;
                }

                // 2. Acquire temporary lock
                const res = await lockVehicle(vehicle.vehicleId);
                if (cancelled) return;
                
                if (res.success) {
                    setLockStatus("locked");
                    setTimeLeft(600);
                } else {
                    setLockStatus("unavailable");
                    setLockError(res.error || "This vehicle is temporarily unavailable.");
                }
            } catch (err: any) {
                setLockStatus("unavailable");
                setLockError(err.message || "Failed to verify availability.");
            }
        };

        acquireLock();

        return () => { cancelled = true; };
    }, [vehicle]);

    // ── Countdown timer ─────────────────────────────────────────
    useEffect(() => {
        if (lockStatus !== "locked") return;
        if (timeLeft <= 0) {
            unlockVehicle(vehicle!.vehicleId).finally(() => {
                setLockStatus("unavailable");
                setLockError("Your 10-minute hold has expired. Please go back and search again.");
            });
            return;
        }
        const id = setInterval(() => setTimeLeft(t => t - 1), 1000);
        return () => clearInterval(id);
    }, [lockStatus, timeLeft]);

    const formatTimeLeft = () => {
        const m = Math.floor(timeLeft / 60);
        const s = timeLeft % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    // Unlock when user navigates away
    const handleBack = () => {
        if (lockStatus === "locked" && vehicle) {
            unlockVehicle(vehicle.vehicleId);
        }
        router.back();
    };

    const validateForm = (): boolean => {
        const e: FormErrors = {};
        if (!booking.customerFullName.trim()) e.customerFullName = "Full name is required.";
        if (!booking.customerPhone.trim()) e.customerPhone = "Phone number is required.";
        const addressVal = validateAddress(booking.transferLocation);
        if (!addressVal.valid) e.transferLocation = addressVal.error;
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm() || !vehicle) return;

        if (!paymentslip) {
            setSubmitError("Payment slip is required. Please upload your bank payment slip to proceed.");
            return;
        }

        setSubmitting(true);
        setSubmitError(null);

        try {
            const paymentslipUrl = await uploadFileToCloudinary(paymentslip, "pay-slips/airport");

            const formData = new FormData();
            formData.append("vehicle_id", vehicle.vehicleId.toString());
            formData.append("transfer_type", transferType);
            formData.append("airport", airport);
            formData.append("pickupDate", pickupDate);
            formData.append("pickupTime", pickupTime);
            formData.append("dropDate", dropDate);
            formData.append("dropTime", dropTime);
            formData.append("passengers", passengers);
            formData.append("luggage_count", luggage);
            formData.append("customer_full_name", booking.customerFullName);
            formData.append("customer_phone", booking.customerPhone);
            formData.append("transfer_location", booking.transferLocation);
            formData.append("paymentslip", paymentslipUrl);

            const res = await fetch("/api/airport-rental/book", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (res.ok && data.success) {
                setSubmitSuccess(true);
                setTimeout(() => router.push("/airport/bookings"), 2000);
            } else if (res.status === 401) {
                router.push("/login");
            } else {
                setSubmitError(data.error || "Booking failed. Please try again.");
            }
        } catch {
            setSubmitError("Network error. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const airportLabel =
        airport === "katunayaka"
            ? "BIA — Katunayaka (Colombo)"
            : "HRI — Mattala (Hambantota)";

    if (loadingVehicle) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 text-red-600 animate-spin mb-3" />
                <p className="text-gray-400 font-medium text-sm">Loading vehicle details...</p>
            </div>
        );
    }

    // Back button — release lock
    if (!vehicle) {
        return (
            <div className="container mx-auto px-6 py-24 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Vehicle not found</h2>
                <Link href="/airport/available" className="text-red-600 font-semibold hover:underline text-sm">
                    Return to search
                </Link>
            </div>
        );
    }

    const formDisabled = lockStatus !== "locked" || submitting;

    return (
        <div className="container mx-auto px-4 sm:px-6 py-8">
            {/* Back link */}
            <button
                onClick={handleBack}
                className="inline-flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-gray-800 transition-colors mb-6 group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                Back to airport fleet
            </button>

            {/* Lock status banners */}
            {lockStatus === "locking" && (
                <div className="mb-4 flex items-center gap-2 bg-blue-50 border border-blue-100 py-2 px-4 rounded-full max-w-max">
                    <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                    <span className="text-xs font-bold text-blue-700">Securing your vehicle hold...</span>
                </div>
            )}
            {lockStatus === "locked" && (
                <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-100 py-2 px-4 rounded-full max-w-max">
                    <Clock className="w-4 h-4 text-red-600 animate-pulse" />
                    <span className="text-xs font-bold text-red-700">
                        Vehicle held for <span className="font-mono text-sm tracking-widest">{formatTimeLeft()}</span>
                    </span>
                </div>
            )}
            {lockStatus === "unavailable" && lockError && (
                <div className="mb-4 flex items-center gap-3 bg-amber-50 border border-amber-200 py-2 px-4 rounded-xl max-w-max">
                    <Lock className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold text-amber-800">{lockError}</span>
                </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Vehicle Details */}
                <div className="lg:col-span-2 space-y-5">
                    {/* Main vehicle card */}
                    <section className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        {/* Image */}
                        <div className="relative h-64 sm:h-72 w-full bg-gray-50">
                            {vehicle.image ? (
                                <Image
                                    src={vehicle.image}
                                    alt={`${vehicle.brand} ${vehicle.model}`}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                    <Plane className="w-20 h-20 text-gray-200" />
                                </div>
                            )}
                            <div className="absolute top-4 left-4">
                                <span className="bg-gray-900 text-white text-[10px] font-semibold px-3 py-1.5 rounded-md uppercase tracking-wider">
                                    Airport Service
                                </span>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="p-5 sm:p-6">
                            {/* Name + price row */}
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                                        {vehicle.brand}{" "}
                                        <span className="text-gray-400 font-medium">{vehicle.model}</span>
                                    </h1>
                                    <div className="flex items-center gap-3 mt-1.5">
                                        <span className="text-xs font-medium text-gray-400 tracking-wide">
                                            {vehicle.plateNumber}
                                        </span>
                                        <span className="w-px h-3 bg-gray-200" />
                                        <span className="text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-md">
                                            {vehicle.transmission}
                                        </span>
                                    </div>
                                </div>
                                <div className="sm:text-right shrink-0">
                                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                                        Fixed Transfer Rate
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        LKR {parseFloat(vehicle.rentPerDay).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {/* Description */}
                            {vehicle.description && (
                                <p className="text-sm text-gray-600 leading-relaxed mb-5 pb-5 border-b border-gray-100">
                                    {vehicle.description}
                                </p>
                            )}

                            {/* Specs row */}
                            <div>
                                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
                                    Specifications
                                </p>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {[
                                        { icon: Users, label: "Seats", value: `${vehicle.seatingCapacity} Seats` },
                                        { icon: Briefcase, label: "Luggage", value: `${vehicle.luggageCapacity} Bags` },
                                        { icon: Gauge, label: "Drive", value: vehicle.transmission },
                                        { icon: Fuel, label: "Fuel", value: vehicle.fuelType },
                                    ].map(({ icon: Icon, label, value }) => (
                                        <div
                                            key={label}
                                            className="flex items-center gap-3 bg-gray-50 px-3 py-3 rounded-lg border border-gray-100"
                                        >
                                            <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center text-gray-600 border border-gray-100 shrink-0">
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider">
                                                    {label}
                                                </p>
                                                <p className="text-xs font-semibold text-gray-800 truncate">{value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Service Inclusions */}
                    <section className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 shadow-sm">
                        <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-red-600" />
                            Service Inclusions
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {[
                                "Professional Driver",
                                "60 Min Free Wait",
                                "Flight Tracking",
                                "Fixed Pricing",
                                "Door-to-Door Service",
                                "Luggage Assistance",
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                    <span className="text-sm text-gray-600">{item}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right: Sidebar */}
                <div className="space-y-4">
                    <div className="sticky top-20 space-y-4">
                        {/* Transfer Summary */}
                        <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                            <h3 className="text-sm font-semibold text-gray-800 mb-4">Transfer Summary</h3>
                            <div className="space-y-2">
                                {[
                                    { icon: Plane, label: "Type", value: `Airport ${transferType}` },
                                    { icon: MapPin, label: "Airport", value: airportLabel },
                                    {
                                        icon: Clock,
                                        label: "Date & Time",
                                        value: transferType === "pickup"
                                            ? `${pickupDate} at ${pickupTime}`
                                            : `${dropDate} at ${dropTime}`
                                    },
                                    { icon: Users, label: "Passengers", value: `${passengers} pax` },
                                    { icon: Briefcase, label: "Luggage", value: `${luggage} bags` },
                                    { icon: ShieldCheck, label: "Rate", value: `LKR ${parseFloat(vehicle.rentPerDay).toLocaleString()}` },
                                ].map(({ icon: Icon, label, value }) => (
                                    <div key={label} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2.5 border border-gray-100">
                                        <div className="flex items-center gap-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
                                            <Icon className="w-3.5 h-3.5" /> {label}
                                        </div>
                                        <span className="font-semibold text-gray-900 text-xs text-right max-w-35">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Booking Form */}
                        <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                            <h3 className="text-sm font-semibold text-gray-800 mb-4">Your Details</h3>

                            {lockStatus === "unavailable" ? (
                                <div className="py-8 text-center space-y-3">
                                    <Lock className="w-10 h-10 text-amber-400 mx-auto" />
                                    <p className="text-sm font-semibold text-amber-700">
                                        {lockError || "This vehicle is temporarily held by another user."}
                                    </p>
                                    <button
                                        onClick={handleBack}
                                        className="mt-2 text-xs font-bold text-gray-500 hover:text-gray-900 underline transition-colors"
                                    >
                                        Go back and choose another vehicle
                                    </button>
                                </div>
                            ) : submitSuccess ? (
                                <div className="text-center py-8">
                                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                                    <h4 className="text-base font-bold text-gray-900 mb-2">Booking Submitted!</h4>
                                    <p className="text-sm text-gray-500">Redirecting to your bookings...</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Full Name */}
                                    <div>
                                        <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                                            <UserIcon className="w-3 h-3" /> Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="John Perera"
                                            value={booking.customerFullName}
                                            onChange={e => { setBooking(p => ({ ...p, customerFullName: e.target.value })); setErrors(p => ({ ...p, customerFullName: undefined })); }}
                                            className={`w-full h-10 bg-gray-50 border-2 rounded-lg px-3 text-sm font-medium text-gray-900 outline-none transition-all ${errors.customerFullName ? "border-red-400" : "border-transparent focus:border-gray-300"}`}
                                        />
                                        {errors.customerFullName && <p className="text-xs text-red-500 font-medium mt-1">{errors.customerFullName}</p>}
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                                            <Phone className="w-3 h-3" /> Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            placeholder="+94 77 123 4567"
                                            value={booking.customerPhone}
                                            onChange={e => { setBooking(p => ({ ...p, customerPhone: e.target.value })); setErrors(p => ({ ...p, customerPhone: undefined })); }}
                                            className={`w-full h-10 bg-gray-50 border-2 rounded-lg px-3 text-sm font-medium text-gray-900 outline-none transition-all ${errors.customerPhone ? "border-red-400" : "border-transparent focus:border-gray-300"}`}
                                        />
                                        {errors.customerPhone && <p className="text-xs text-red-500 font-medium mt-1">{errors.customerPhone}</p>}
                                    </div>

                                    {/* Pickup/Drop Address */}
                                    <div>
                                        <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                                            <MapPin className="w-3 h-3" /> {transferType === "pickup" ? "Drop-off" : "Pickup"} Address *
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Your home / hotel address"
                                            value={booking.transferLocation}
                                            onChange={e => {
                                                setBooking(p => ({ ...p, transferLocation: e.target.value }));
                                                const val = validateAddress(e.target.value);
                                                if (val.valid) {
                                                    setErrors(p => ({ ...p, transferLocation: undefined }));
                                                } else {
                                                    setErrors(p => ({ ...p, transferLocation: val.error }));
                                                }
                                            }}
                                            className={`w-full h-10 bg-gray-50 border-2 rounded-lg px-3 text-sm font-medium text-gray-900 outline-none transition-all ${errors.transferLocation ? "border-red-400 focus:border-red-600" : "border-transparent focus:border-gray-300"}`}
                                        />
                                        {errors.transferLocation && <p className="text-xs text-red-500 font-medium mt-1">{errors.transferLocation}</p>}
                                    </div>

                                    {/* Bank Details */}
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 space-y-3">
                                        <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                                            <ShieldCheck className="w-3.5 h-3.5 text-gray-500" />
                                            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Bank Payment Details</p>
                                        </div>
                                        <div className="grid grid-cols-1 gap-2">
                                            {[
                                                { label: "Bank", value: "Bank of Ceylon (BOC)" },
                                                { label: "Account Name", value: "Test User" },
                                                { label: "Account No", value: "123456789012" },
                                                { label: "Branch", value: "Colombo Main Branch" },
                                            ].map(({ label, value }) => (
                                                <div key={label} className="flex justify-between items-center text-[11px]">
                                                    <span className="text-gray-400 font-semibold uppercase tracking-wider">{label}</span>
                                                    <span className="text-gray-700 font-semibold">{value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Pay Slip Upload */}
                                    <div>
                                        <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                                            <Briefcase className="w-3 h-3" /> Payment Slip *
                                        </label>
                                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center space-y-2">
                                            <p className="text-[10px] text-gray-400 font-medium">Upload your bank deposit/transfer slip</p>
                                            <label className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-[11px] font-semibold cursor-pointer hover:bg-gray-700 hover:text-white transition-all">
                                                {paymentslip ? paymentslip.name : "Choose File"}
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    onChange={(e) => setPaymentslip(e.target.files?.[0] || null)}
                                                    accept="image/*,.pdf"
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    {submitError && (
                                        <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-lg p-3">
                                            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                            <p className="text-xs text-red-700 font-medium">{submitError}</p>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={formDisabled}
                                        className="w-full h-11 bg-gray-900 hover:bg-red-600 text-white font-semibold rounded-lg transition-all text-sm flex items-center justify-center gap-2 group active:scale-[0.98] disabled:opacity-50 disabled:hover:bg-gray-900"
                                    >
                                        {submitting ? (
                                            <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                                        ) : (
                                            <>
                                                Confirm Booking
                                                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </section>

                        {/* Info note */}
                        <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <Info className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                            <p className="text-xs text-gray-500 leading-relaxed">
                                By confirming, you agree to our terms. Booking subject to review within 60 minutes during business hours.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AirportDetailsPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen">
                    <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
                </div>
            }>
                <AirportDetailContent />
            </Suspense>
        </div>
    );
}
