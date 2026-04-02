"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect, Suspense } from "react";
import {
    ArrowLeft, Users, Fuel, Gauge, Plane, Shield, Briefcase,
    MapPin, Clock, ShieldCheck, CheckCircle2, AlertCircle,
    Phone, Mail, User as UserIcon, Loader2
} from "lucide-react";
import { validateAddress } from "@/lib/validation";
import Link from "next/link";

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
    customerEmail: string;
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

    // Search context from previous page
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
        customerEmail: "",
        transferLocation: "",
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // Fetch vehicle details
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

    const validateForm = (): boolean => {
        const e: FormErrors = {};
        if (!booking.customerFullName.trim()) e.customerFullName = "Full name is required.";
        if (!booking.customerPhone.trim()) e.customerPhone = "Phone number is required.";
        
        const addressVal = validateAddress(booking.transferLocation);
        if (!addressVal.valid) {
            e.transferLocation = addressVal.error;
        }
        
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm() || !vehicle) return;

        setSubmitting(true);
        setSubmitError(null);

        try {
            const res = await fetch("/api/airport-rental/book", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    vehicle_id: vehicle.vehicleId,
                    transfer_type: transferType,
                    airport,
                    pickupDate,
                    pickupTime,
                    dropDate,
                    dropTime,
                    passengers: parseInt(passengers, 10),
                    luggage_count: parseInt(luggage, 10),
                    customer_full_name: booking.customerFullName,
                    customer_phone: booking.customerPhone,
                    customer_email: booking.customerEmail || undefined,
                    transfer_location: booking.transferLocation,
                }),
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
            <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
                <div className="relative">
                    <div className="h-16 w-16 rounded-full border-4 border-gray-100" />
                    <div className="absolute top-0 h-16 w-16 rounded-full border-4 border-yellow-400 border-t-transparent animate-spin" />
                </div>
            </div>
        );
    }

    if (!vehicle) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
                <div className="text-center">
                    <Plane className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                    <h1 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">Vehicle Not Found</h1>
                    <Link href="/airport/available" className="text-yellow-600 font-bold hover:underline">
                        Back to Airport Fleet
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#f8fafc] min-h-screen pb-20">
            <div className="container mx-auto px-6 pt-10">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-bold mb-8 transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to airport fleet
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left: Vehicle Info */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Vehicle Photo + Main Info */}
                        <div className="bg-white rounded-[40px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100">
                            <div className="relative h-[380px]">
                                {vehicle.image ? (
                                    <Image
                                        src={vehicle.image}
                                        alt={`${vehicle.brand} ${vehicle.model}`}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-yellow-50 to-gray-100 flex items-center justify-center">
                                        <Plane className="w-24 h-24 text-yellow-200" />
                                    </div>
                                )}
                                <div className="absolute top-6 left-6 bg-gray-900/80 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-white flex items-center gap-2">
                                    <Plane className="w-4 h-4" /> Airport Service
                                </div>
                            </div>

                            <div className="p-8 md:p-10">
                                <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-4">
                                    <div>
                                        <h1 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">
                                            {vehicle.brand} <span className="text-gray-400">{vehicle.model}</span>
                                        </h1>
                                        <span className="bg-gray-100 px-3 py-1 rounded-lg text-sm text-gray-500 font-mono">
                                            {vehicle.plateNumber}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-black text-gray-900 leading-none">
                                            LKR {parseFloat(vehicle.rentPerDay).toLocaleString()}
                                        </p>
                                        <p className="text-gray-400 font-black uppercase tracking-widest text-[10px] mt-1 italic">
                                            Fixed Transfer Rate
                                        </p>
                                    </div>
                                </div>

                                {vehicle.description && (
                                    <p className="text-gray-600 text-base leading-relaxed mb-8 border-l-4 border-yellow-400 pl-6 italic font-medium">
                                        "{vehicle.description}"
                                    </p>
                                )}

                                {/* Specs */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[
                                        { icon: <Users className="w-8 h-8 mx-auto mb-3 text-yellow-500" />, label: "Capacity", value: `${vehicle.seatingCapacity} Seats` },
                                        { icon: <Gauge className="w-8 h-8 mx-auto mb-3 text-yellow-500" />, label: "Gearbox", value: vehicle.transmission },
                                        { icon: <Fuel className="w-8 h-8 mx-auto mb-3 text-yellow-500" />, label: "Fuel", value: vehicle.fuelType },
                                        { icon: <Briefcase className="w-8 h-8 mx-auto mb-3 text-yellow-500" />, label: "Luggage", value: `${vehicle.luggageCapacity} Bags` },
                                    ].map((s) => (
                                        <div key={s.label} className="bg-gray-50 p-5 rounded-3xl text-center hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100">
                                            {s.icon}
                                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{s.label}</p>
                                            <p className="text-base font-black text-gray-900">{s.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Service Inclusions */}
                        <div className="bg-white rounded-[40px] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100">
                            <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                <Shield className="w-6 h-6 text-yellow-500" /> Service Inclusions
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {["Professional Driver", "60 Min Free Wait", "Flight Tracking", "Fixed Pricing", "Door-to-Door Service", "Luggage Assistance"].map(item => (
                                    <div key={item} className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50">
                                        <CheckCircle2 className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                                        <span className="font-bold text-gray-700 text-sm">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Booking Sidebar */}
                    <div className="space-y-6">
                        {/* Transfer Summary */}
                        <div className="bg-white rounded-[40px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100">
                            <h3 className="text-lg font-black text-gray-900 mb-5 tracking-tight">Transfer Summary</h3>
                            <div className="space-y-3">
                                {[
                                    { icon: <Plane className="w-4 h-4 text-gray-400" />, label: "Type", value: `Airport ${transferType}` },
                                    { icon: <MapPin className="w-4 h-4 text-gray-400" />, label: "Airport", value: airportLabel },
                                    { 
                                        icon: <Clock className="w-4 h-4 text-gray-400" />, 
                                        label: "Date & Time", 
                                        value: transferType === "pickup" ? `${pickupDate} at ${pickupTime}` : `${dropDate} at ${dropTime}`
                                    },
                                    { icon: <Users className="w-4 h-4 text-gray-400" />, label: "Passengers", value: `${passengers} pax` },
                                    { icon: <Briefcase className="w-4 h-4 text-gray-400" />, label: "Luggage", value: `${luggage} bags` },
                                    { icon: <ShieldCheck className="w-4 h-4 text-gray-400" />, label: "Rate", value: `LKR ${parseFloat(vehicle.rentPerDay).toLocaleString()}` },
                                ].map((row) => (
                                    <div key={row.label} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50">
                                        <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest">
                                            {row.icon} {row.label}
                                        </div>
                                        <span className="font-bold text-gray-900 text-sm text-right max-w-[140px]">{row.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Booking Form */}
                        <div className="bg-white rounded-[40px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border-t-8 border-yellow-400">
                            <h3 className="text-lg font-black text-gray-900 mb-6 tracking-tight">Your Details</h3>

                            {submitSuccess ? (
                                <div className="text-center py-8">
                                    <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto mb-4" />
                                    <h4 className="text-lg font-black text-gray-900 mb-2">Booking Submitted!</h4>
                                    <p className="text-sm text-gray-500">Redirecting to your bookings...</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Full Name */}
                                    <div>
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                                            <UserIcon className="w-3.5 h-3.5" /> Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="John Perera"
                                            value={booking.customerFullName}
                                            onChange={e => { setBooking(p => ({ ...p, customerFullName: e.target.value })); setErrors(p => ({ ...p, customerFullName: undefined })); }}
                                            className={`w-full h-12 bg-gray-50 border-2 rounded-2xl px-4 text-sm font-bold text-gray-900 outline-none transition-all ${errors.customerFullName ? "border-red-400" : "border-transparent focus:border-yellow-400"}`}
                                        />
                                        {errors.customerFullName && <p className="text-xs text-red-500 font-semibold mt-1">{errors.customerFullName}</p>}
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                                            <Phone className="w-3.5 h-3.5" /> Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            placeholder="+94 77 123 4567"
                                            value={booking.customerPhone}
                                            onChange={e => { setBooking(p => ({ ...p, customerPhone: e.target.value })); setErrors(p => ({ ...p, customerPhone: undefined })); }}
                                            className={`w-full h-12 bg-gray-50 border-2 rounded-2xl px-4 text-sm font-bold text-gray-900 outline-none transition-all ${errors.customerPhone ? "border-red-400" : "border-transparent focus:border-yellow-400"}`}
                                        />
                                        {errors.customerPhone && <p className="text-xs text-red-500 font-semibold mt-1">{errors.customerPhone}</p>}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                                            <Mail className="w-3.5 h-3.5" /> Email (optional)
                                        </label>
                                        <input
                                            type="email"
                                            placeholder="john@example.com"
                                            value={booking.customerEmail}
                                            onChange={e => setBooking(p => ({ ...p, customerEmail: e.target.value }))}
                                            className="w-full h-12 bg-gray-50 border-2 border-transparent focus:border-yellow-400 rounded-2xl px-4 text-sm font-bold text-gray-900 outline-none transition-all"
                                        />
                                    </div>

                                    {/* Pickup/Drop Address */}
                                    <div>
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                                            <MapPin className="w-3.5 h-3.5" /> {transferType === "pickup" ? "Drop-off" : "Pickup"} Address *
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
                                            className={`w-full h-12 bg-gray-50 border-2 rounded-2xl px-4 text-sm font-bold text-gray-900 outline-none transition-all ${errors.transferLocation ? "border-red-400 focus:border-red-600" : "border-transparent focus:border-yellow-400"}`}
                                        />
                                        {errors.transferLocation && <p className="text-xs text-red-500 font-semibold mt-1">{errors.transferLocation}</p>}
                                    </div>

                                    {submitError && (
                                        <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-2xl p-4">
                                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                            <p className="text-sm text-red-700 font-semibold">{submitError}</p>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full h-13 py-3 bg-gray-900 hover:bg-yellow-400 hover:text-gray-900 text-white rounded-2xl font-black transition-all hover:translate-y-[-2px] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {submitting ? (
                                            <><Loader2 className="w-5 h-5 animate-spin" /> Confirming...</>
                                        ) : (
                                            "Confirm Booking"
                                        )}
                                    </button>

                                    <p className="text-center text-xs text-gray-400 font-medium">
                                        By confirming, you agree to our terms. Booking subject to employee review.
                                    </p>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AirportDetailsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="h-12 w-12 rounded-full border-4 border-yellow-400 border-t-transparent animate-spin" />
            </div>
        }>
            <AirportDetailContent />
        </Suspense>
    );
}
