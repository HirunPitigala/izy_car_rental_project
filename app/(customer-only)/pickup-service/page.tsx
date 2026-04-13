"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    MapPin, Navigation, Calendar, Clock, Users, Briefcase,
    RotateCcw, Search, ChevronRight, CheckCircle2, Loader2,
    Truck, Fuel, Settings, X, Phone, User, ArrowRight
} from "lucide-react";

// ──────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────

interface Vehicle {
    vehicleId: number;
    brand: string | null;
    model: string | null;
    plateNumber: string;
    seatingCapacity: number;
    luggageCapacity: number;
    transmission: string;
    fuelType: string;
    pricePerKm: string | null;
    image: string | null;
    description: string | null;
}

interface SearchForm {
    pickupLocation: string;
    dropLocation: string;
    pickupDatetime: string;
    isReturnTrip: boolean;
    returnDatetime: string;
    travelers: number;
    luggageCount: number;
}

interface BookingForm {
    customerFullName: string;
    customerPhone: string;
}

type Step = "search" | "results" | "confirm" | "success";

// ──────────────────────────────────────────────────────────────
// Utility
// ──────────────────────────────────────────────────────────────

function formatPrice(p: number) {
    return `LKR ${p.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// ──────────────────────────────────────────────────────────────
// Main Page
// ──────────────────────────────────────────────────────────────

export default function PickupServicePage() {
    const router = useRouter();

    const [step, setStep] = useState<Step>("search");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [searchForm, setSearchForm] = useState<SearchForm>({
        pickupLocation: "",
        dropLocation: "",
        pickupDatetime: "",
        isReturnTrip: false,
        returnDatetime: "",
        travelers: 1,
        luggageCount: 0,
    });

    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
    const [estimatedDistance, setEstimatedDistance] = useState<number>(0);
    const [estimatedPrice, setEstimatedPrice] = useState<number>(0);
    const [bookingId, setBookingId] = useState<number | null>(null);

    const [bookingForm, setBookingForm] = useState<BookingForm>({
        customerFullName: "",
        customerPhone: "",
    });
    const [paymentslip, setPaymentslip] = useState<File | null>(null);

    // ── Step 1: Search ─────────────────────────────────────────

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await fetch("/api/pickup/search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    travelers: searchForm.travelers,
                    luggage: searchForm.luggageCount,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error ?? "Failed to search vehicles.");

            setVehicles(data.data ?? []);
            setStep("results");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ── Step 2: Select vehicle & pre-calc fare ─────────────────

    const handleSelectVehicle = (v: Vehicle) => {
        setSelectedVehicle(v);

        // Client-side fare preview (same formula as server)
        const pricePerKm = parseFloat(v.pricePerKm ?? "100");
        // Simple stub distance: will be recalculated server-side
        const dist = Math.abs(
            (searchForm.pickupLocation + searchForm.dropLocation)
                .split("")
                .reduce((acc, c) => acc + c.charCodeAt(0), 0) % 145
        ) + 5;

        const base = dist * pricePerKm;
        const total = searchForm.isReturnTrip ? base * 2 : base;

        setEstimatedDistance(dist);
        setEstimatedPrice(total);
        setStep("confirm");
    };

    // ── Step 3: Confirm & Book ─────────────────────────────────

    const handleConfirm = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedVehicle) return;

        if (!paymentslip) {
            setError("Payment slip is required. Please upload your bank payment slip to proceed.");
            return;
        }

        setError(null);
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("vehicle_id", selectedVehicle.vehicleId.toString());
            formData.append("pickup_location", searchForm.pickupLocation);
            formData.append("drop_location", searchForm.dropLocation);
            formData.append("pickup_datetime", searchForm.pickupDatetime);
            formData.append("return_datetime", searchForm.isReturnTrip ? searchForm.returnDatetime : "");
            formData.append("is_return_trip", searchForm.isReturnTrip.toString());
            formData.append("travelers", searchForm.travelers.toString());
            formData.append("luggage_count", searchForm.luggageCount.toString());
            formData.append("customer_full_name", bookingForm.customerFullName);
            formData.append("customer_phone", bookingForm.customerPhone);
            formData.append("price_per_km", (selectedVehicle.pricePerKm ?? "100"));
            formData.append("distance_km", estimatedDistance.toString());
            formData.append("price", estimatedPrice.toString());
            formData.append("paymentslip", paymentslip);

            const res = await fetch("/api/pickup/book", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) {
                const msg =
                    data.details
                        ? data.details.map((d: any) => d.message).join(" • ")
                        : data.error ?? "Booking failed.";
                throw new Error(msg);
            }

            setBookingId(data.bookingId);
            setEstimatedDistance(data.distanceKm ?? estimatedDistance);
            setEstimatedPrice(data.price ?? estimatedPrice);
            setStep("success");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ── Render ─────────────────────────────────────────────────

    return (
        <div className="min-h-screen bg-[#fcfcfc]">
            {/* Page Header */}
            <header className="bg-gray-950 text-white px-6 py-14 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 to-transparent" />
                <div className="container mx-auto relative z-10 max-w-4xl">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-emerald-500 rounded-xl">
                            <Truck className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Point-to-Point</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter mb-2">Pickup Service</h1>
                    <p className="text-white/50 font-medium">Book a dedicated driver for your journey.</p>

                    {/* Step indicator */}
                    <div className="flex items-center gap-2 mt-8">
                        {(["search", "results", "confirm"] as const).map((s, i) => (
                            <div key={s} className="flex items-center gap-2">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all
                                    ${step === s || (step === "success" && s === "confirm")
                                        ? "bg-emerald-500 text-white"
                                        : ["results", "confirm", "success"].indexOf(step) > i
                                            ? "bg-emerald-900 text-emerald-400"
                                            : "bg-white/10 text-white/30"
                                    }`}>
                                    {["results", "confirm", "success"].indexOf(step) > i ? "✓" : i + 1}
                                </div>
                                <span className={`text-xs font-bold uppercase tracking-wider hidden sm:block
                                    ${step === s ? "text-white" : "text-white/30"}`}>
                                    {s === "search" ? "Search" : s === "results" ? "Select" : "Confirm"}
                                </span>
                                {i < 2 && <ChevronRight className="h-3 w-3 text-white/20" />}
                            </div>
                        ))}
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-10 max-w-4xl">

                {/* ── Error Banner ─── */}
                {error && (
                    <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-100 rounded-2xl p-4 text-red-700">
                        <X className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <p className="text-sm font-medium">{error}</p>
                        <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">
                            <X className="w-4 w-4" />
                        </button>
                    </div>
                )}

                {/* ══════════════════════════════════════════════
                    STEP 1 — Search Form
                ══════════════════════════════════════════════ */}
                {step === "search" && (
                    <form onSubmit={handleSearch} className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-100 p-8 md:p-12 space-y-8">
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Where are you going?</h2>
                            <p className="text-gray-400 text-sm mt-1 font-medium">Enter place names — e.g. "Negombo Hospital", "Katunayake Airport".</p>
                        </div>

                        {/* Locations */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Pickup Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-500" />
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Negombo Bus Stand"
                                        className="w-full h-14 bg-gray-50 border border-transparent rounded-2xl pl-14 pr-4 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-gray-900"
                                        value={searchForm.pickupLocation}
                                        onChange={(e) => setSearchForm({ ...searchForm, pickupLocation: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Drop-Off Location</label>
                                <div className="relative">
                                    <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Katunayake Airport"
                                        className="w-full h-14 bg-gray-50 border border-transparent rounded-2xl pl-14 pr-4 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-gray-900"
                                        value={searchForm.dropLocation}
                                        onChange={(e) => setSearchForm({ ...searchForm, dropLocation: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Datetime */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Pickup Date & Time</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-500" />
                                    <input
                                        type="datetime-local"
                                        required
                                        className="w-full h-14 bg-gray-50 border border-transparent rounded-2xl pl-14 pr-4 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-gray-900"
                                        value={searchForm.pickupDatetime}
                                        onChange={(e) => setSearchForm({ ...searchForm, pickupDatetime: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Return trip toggle */}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Return Trip</label>
                                <div
                                    onClick={() => setSearchForm({ ...searchForm, isReturnTrip: !searchForm.isReturnTrip })}
                                    className={`flex items-center gap-4 h-14 px-5 rounded-2xl border-2 cursor-pointer transition-all select-none
                                        ${searchForm.isReturnTrip
                                            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                            : "border-gray-100 bg-gray-50 text-gray-500"}`}
                                >
                                    <RotateCcw className="h-5 w-5" />
                                    <span className="font-bold text-sm">
                                        {searchForm.isReturnTrip ? "Return trip included" : "One-way trip"}
                                    </span>
                                    <div className={`ml-auto w-10 h-6 rounded-full transition-all relative flex-shrink-0
                                        ${searchForm.isReturnTrip ? "bg-emerald-500" : "bg-gray-200"}`}>
                                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all
                                            ${searchForm.isReturnTrip ? "left-5" : "left-1"}`} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Return datetime (conditional) */}
                        {searchForm.isReturnTrip && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Return Date & Time</label>
                                    <div className="relative">
                                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="datetime-local"
                                            required
                                            min={searchForm.pickupDatetime || undefined}
                                            className="w-full h-14 bg-gray-50 border border-transparent rounded-2xl pl-14 pr-4 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-gray-900"
                                            value={searchForm.returnDatetime}
                                            onChange={(e) => setSearchForm({ ...searchForm, returnDatetime: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Travelers & Luggage */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Travelers</label>
                                <div className="relative">
                                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-500" />
                                    <input
                                        type="number"
                                        min={1}
                                        max={20}
                                        required
                                        className="w-full h-14 bg-gray-50 border border-transparent rounded-2xl pl-14 pr-4 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-gray-900"
                                        value={searchForm.travelers}
                                        onChange={(e) => setSearchForm({ ...searchForm, travelers: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Luggage Pieces</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="number"
                                        min={0}
                                        max={20}
                                        className="w-full h-14 bg-gray-50 border border-transparent rounded-2xl pl-14 pr-4 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-gray-900"
                                        value={searchForm.luggageCount}
                                        onChange={(e) => setSearchForm({ ...searchForm, luggageCount: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-16 bg-gray-950 hover:bg-emerald-600 text-white font-black rounded-2xl transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-3 text-lg group active:scale-[0.98] disabled:opacity-60"
                        >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Search className="w-6 h-6 group-hover:scale-110 transition-transform" />}
                            {loading ? "Searching..." : "Find Available Vehicles"}
                        </button>
                    </form>
                )}

                {/* ══════════════════════════════════════════════
                    STEP 2 — Vehicle Results
                ══════════════════════════════════════════════ */}
                {step === "results" && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Available Vehicles</h2>
                                <p className="text-gray-400 text-sm mt-1">{vehicles.length} vehicle{vehicles.length !== 1 ? "s" : ""} for {searchForm.travelers} traveler{searchForm.travelers !== 1 ? "s" : ""}</p>
                            </div>
                            <button
                                onClick={() => { setStep("search"); setVehicles([]); }}
                                className="text-xs font-black text-gray-400 hover:text-gray-700 flex items-center gap-1 uppercase tracking-widest transition-colors"
                            >
                                <X className="h-3.5 w-3.5" /> Change Search
                            </button>
                        </div>

                        {vehicles.length === 0 ? (
                            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-16 text-center">
                                <Truck className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                                <h3 className="text-xl font-black text-gray-400 mb-2">No vehicles found</h3>
                                <p className="text-gray-400 text-sm">Try reducing the number of travelers or check back later.</p>
                                <button
                                    onClick={() => setStep("search")}
                                    className="mt-6 px-8 py-3 bg-gray-950 text-white rounded-2xl font-bold text-sm hover:bg-emerald-600 transition-all"
                                >
                                    Modify Search
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {vehicles.map((v) => {
                                    const ppm = parseFloat(v.pricePerKm ?? "100");
                                    const dist = Math.abs(
                                        (searchForm.pickupLocation + searchForm.dropLocation)
                                            .split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 145
                                    ) + 5;
                                    const est = searchForm.isReturnTrip ? dist * ppm * 2 : dist * ppm;

                                    return (
                                        <div key={v.vehicleId} className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col">
                                            {/* Vehicle image */}
                                            <div className="h-48 bg-gray-100 relative flex-shrink-0">
                                                {v.image ? (
                                                    <img src={v.image} alt={`${v.brand} ${v.model}`} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                ) : (
                                                    <div className="h-full flex items-center justify-center">
                                                        <Truck className="h-16 w-16 text-gray-200" />
                                                    </div>
                                                )}
                                                <div className="absolute top-3 right-3 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-black">
                                                    LKR {ppm}/km
                                                </div>
                                            </div>

                                            {/* Info */}
                                            <div className="p-6 flex flex-col flex-1">
                                                <h3 className="text-xl font-black text-gray-900 mb-1">{v.brand} {v.model}</h3>
                                                <p className="text-xs font-bold text-gray-400 font-mono mb-4">{v.plateNumber}</p>

                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    <span className="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-full text-xs font-bold text-gray-600">
                                                        <Users className="h-3 w-3" />{v.seatingCapacity} seats
                                                    </span>
                                                    <span className="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-full text-xs font-bold text-gray-600">
                                                        <Settings className="h-3 w-3" />{v.transmission}
                                                    </span>
                                                    <span className="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-full text-xs font-bold text-gray-600">
                                                        <Fuel className="h-3 w-3" />{v.fuelType}
                                                    </span>
                                                </div>

                                                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                                                    <div>
                                                        <p className="text-xs font-bold text-gray-400">Est. fare (~{dist} km)</p>
                                                        <p className="text-xl font-black text-gray-900">{formatPrice(est)}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleSelectVehicle(v)}
                                                        className="flex items-center gap-2 bg-gray-950 hover:bg-emerald-600 text-white px-5 py-3 rounded-2xl text-sm font-black transition-all active:scale-95"
                                                    >
                                                        Select <ArrowRight className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* ══════════════════════════════════════════════
                    STEP 3 — Confirm Booking
                ══════════════════════════════════════════════ */}
                {step === "confirm" && selectedVehicle && (
                    <form onSubmit={handleConfirm} className="space-y-6">
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setStep("results")}
                                className="p-3 rounded-2xl bg-white border border-gray-100 text-gray-400 hover:text-gray-900 shadow-sm transition-all"
                            >
                                <X className="h-5 w-5" />
                            </button>
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Confirm Booking</h2>
                                <p className="text-gray-400 text-sm">Review details and enter your contact info.</p>
                            </div>
                        </div>

                        {/* Summary card */}
                        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 space-y-4">
                            <div className="flex items-center gap-4 pb-4 border-b border-gray-50">
                                {selectedVehicle.image ? (
                                    <img src={selectedVehicle.image} alt="" className="h-16 w-24 object-cover rounded-xl" />
                                ) : (
                                    <div className="h-16 w-24 bg-gray-100 rounded-xl flex items-center justify-center">
                                        <Truck className="h-8 w-8 text-gray-300" />
                                    </div>
                                )}
                                <div>
                                    <p className="text-xl font-black text-gray-900">{selectedVehicle.brand} {selectedVehicle.model}</p>
                                    <p className="text-xs font-bold text-gray-400 font-mono">{selectedVehicle.plateNumber}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">From</p>
                                    <p className="font-bold text-gray-900">{searchForm.pickupLocation}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">To</p>
                                    <p className="font-bold text-gray-900">{searchForm.dropLocation}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Pickup</p>
                                    <p className="font-bold text-gray-900">{new Date(searchForm.pickupDatetime).toLocaleString()}</p>
                                </div>
                                {searchForm.isReturnTrip && searchForm.returnDatetime && (
                                    <div>
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Return</p>
                                        <p className="font-bold text-gray-900">{new Date(searchForm.returnDatetime).toLocaleString()}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Travelers</p>
                                    <p className="font-bold text-gray-900">{searchForm.travelers} pax</p>
                                </div>
                                <div>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Luggage</p>
                                    <p className="font-bold text-gray-900">{searchForm.luggageCount} pieces</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between bg-emerald-50 rounded-2xl p-4 mt-2">
                                <div>
                                    <p className="text-xs font-black text-emerald-700 uppercase tracking-widest">Estimated Total</p>
                                    <p className="text-2xl font-black text-emerald-700">{formatPrice(estimatedPrice)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-emerald-600">~{estimatedDistance} km</p>
                                    {searchForm.isReturnTrip && <p className="text-[10px] font-bold text-emerald-500 uppercase">Return Trip ×2</p>}
                                </div>
                            </div>
                        </div>

                        {/* Customer details */}
                        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 space-y-5">
                            <h3 className="font-black text-gray-900">Your Details</h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            required
                                            placeholder="Your full name"
                                            className="w-full h-14 bg-gray-50 border border-transparent rounded-2xl pl-14 pr-4 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-gray-900"
                                            value={bookingForm.customerFullName}
                                            onChange={(e) => setBookingForm({ ...bookingForm, customerFullName: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="tel"
                                            required
                                            placeholder="+94 77 XXX XXXX"
                                            className="w-full h-14 bg-gray-50 border border-transparent rounded-2xl pl-14 pr-4 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-gray-900"
                                            value={bookingForm.customerPhone}
                                            onChange={(e) => setBookingForm({ ...bookingForm, customerPhone: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bank Details */}
                        <div className="bg-emerald-50 rounded-[2rem] p-8 space-y-6">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                                <h3 className="font-black text-emerald-900">Bank Transfer Details</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {[
                                    { label: "Bank Name", value: "Bank of Ceylon (BOC)" },
                                    { label: "Account Name", value: "Test User" },
                                    { label: "Account Number", value: "123456789012" },
                                    { label: "Branch", value: "Colombo Main Branch" },
                                    { label: "Branch Code", value: "001" },
                                    { label: "SWIFT Code", value: "BCEYLKLX" },
                                ].map(({ label, value }) => (
                                    <div key={label}>
                                        <p className="text-[10px] font-black text-emerald-600/60 uppercase tracking-widest mb-1">{label}</p>
                                        <p className="font-bold text-emerald-900">{value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment Slip Upload */}
                        <div className="bg-white rounded-[2rem] border-2 border-dashed border-gray-100 p-8 text-center space-y-4">
                            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto text-gray-400">
                                {paymentslip ? <CheckCircle2 className="w-8 h-8 text-emerald-500" /> : <Settings className="w-8 h-8" />}
                            </div>
                            <div>
                                <h3 className="font-black text-gray-900">{paymentslip ? paymentslip.name : "Upload Payment Slip"}</h3>
                                <p className="text-sm text-gray-400 mt-1 font-medium italic">
                                    Please upload a photo of your bank transfer slip.
                                </p>
                            </div>
                            <label className="inline-block px-8 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm cursor-pointer hover:bg-emerald-600 transition-all">
                                {paymentslip ? "Change File" : "Choose File"}
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    onChange={(e) => setPaymentslip(e.target.files?.[0] || null)}
                                    accept="image/*,.pdf"
                                />
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-16 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-emerald-200 flex items-center justify-center gap-3 text-lg active:scale-[0.98] disabled:opacity-60"
                        >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <CheckCircle2 className="w-6 h-6" />}
                            {loading ? "Submitting..." : "Confirm & Book Pickup"}
                        </button>
                    </form>
                )}

                {/* ══════════════════════════════════════════════
                    STEP 4 — Success
                ══════════════════════════════════════════════ */}
                {step === "success" && (
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-16 text-center space-y-6">
                        <div className="w-24 h-24 bg-emerald-50 rounded-[2rem] flex items-center justify-center mx-auto">
                            <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Booking Confirmed!</h2>
                            <p className="text-gray-400 font-medium">
                                Your booking #{bookingId} has been submitted and is <span className="font-black text-yellow-600">pending approval</span>.
                            </p>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-5 inline-block text-left space-y-2 min-w-[280px]">
                            <p className="text-sm font-medium text-gray-700"><span className="font-black">From:</span> {searchForm.pickupLocation}</p>
                            <p className="text-sm font-medium text-gray-700"><span className="font-black">To:</span> {searchForm.dropLocation}</p>
                            <p className="text-sm font-medium text-gray-700"><span className="font-black">Distance:</span> ~{estimatedDistance} km</p>
                            <p className="text-sm font-bold text-emerald-700"><span className="font-black">Est. Fare:</span> {formatPrice(estimatedPrice)}</p>
                        </div>
                        <div className="flex gap-4 justify-center flex-wrap">
                            <button
                                onClick={() => { setStep("search"); setSelectedVehicle(null); setVehicles([]); setBookingId(null); }}
                                className="px-8 py-4 bg-gray-950 text-white rounded-2xl font-black text-sm hover:bg-emerald-600 transition-all active:scale-95"
                            >
                                Book Another
                            </button>
                            <button
                                onClick={() => router.push("/customer/dashboard")}
                                className="px-8 py-4 border-2 border-gray-100 text-gray-700 rounded-2xl font-black text-sm hover:border-gray-300 transition-all"
                            >
                                Go to Dashboard
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
