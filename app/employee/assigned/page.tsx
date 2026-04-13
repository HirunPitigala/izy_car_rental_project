"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    getAssignedBookings,
} from "@/lib/actions/bookingActions";
import {
    getAssignedPickups,
} from "@/lib/actions/pickupActions";
import { getWeddingCarInquiries, getAssignedWeddingBookings } from "@/lib/actions/weddingActions";

import {
    Car,
    Info,
    ChevronRight,
    Truck,
    Key,
    Wind,
    ShieldCheck,
    Eye,
    Loader2
} from "lucide-react";

// --- Types ---
interface VehicleInfo { brand: string; model: string; plateNumber?: string; }

interface RentBooking {
    bookingId: number;
    customerName: string;
    phone: string;
    vehicle?: VehicleInfo;
    rentalDate: string | Date;
    returnDate: string | Date;
}

interface PickupBooking {
    id: number;
    customerFullName: string;
    customerPhone: string;
    pickupLocation: string;
    dropLocation: string;
    pickupTime: string | Date;
    travelers: number;
    luggageCount: number;
}

interface AirportBooking {
    id: number;
    customerName: string;
    customerPhone: string;
    pickupLocation: string;
    dropoffLocation: string;
    pickupDate: string | Date;
}

interface WeddingBooking {
    bookingId: number;
    customerName: string;
    phone: string;
    vehicle?: VehicleInfo;
    eventDate: string | Date;
    status: string;
}

// --- Categories Configuration ---
const categories = [
    {
        id: "rent-a-car",
        name: "Rent a Car",
        description: "Standard daily/monthly vehicle rentals.",
        icon: Car,
        color: "bg-blue-50 text-blue-600 border-blue-100 ring-blue-50",
    },
    {
        id: "pickups",
        name: "Pickups",
        description: "Point-to-point local pickup and drop-off requests.",
        icon: Truck,
        color: "bg-emerald-50 text-emerald-600 border-emerald-100 ring-emerald-50",
    },
    {
        id: "airport",
        name: "Airport Pickups",
        description: "Airport transfer and rental bookings pipeline.",
        icon: Key,
        color: "bg-purple-50 text-purple-600 border-purple-100 ring-purple-50",
    },
    {
        id: "wedding",
        name: "Wedding Car Rental",
        description: "Premium wedding vehicle inquiries and bookings.",
        icon: Wind,
        color: "bg-amber-50 text-amber-600 border-amber-100 ring-amber-50",
    },
];

export default function EmployeeAssignedBookingsPage() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Data states
    const [rentBookings, setRentBookings] = useState<RentBooking[]>([]);
    const [pickupBookings, setPickupBookings] = useState<PickupBooking[]>([]);
    const [airportBookings, setAirportBookings] = useState<AirportBooking[]>([]);
    const [weddingBookings, setWeddingBookings] = useState<WeddingBooking[]>([]);

    const [employeeId, setEmployeeId] = useState<number | null>(null);

    const fetchData = async (category: string, empId: number) => {
        setLoading(true);
        if (category === "rent-a-car") {
            const res = await getAssignedBookings(empId);
            if (res.success) setRentBookings((res.data ?? []) as RentBooking[]);
        } else if (category === "pickups") {
            const res = await getAssignedPickups(empId);
            if (res.success) setPickupBookings((res.data ?? []) as PickupBooking[]);
        } else if (category === "airport") {
            try {
                const res = await fetch(`/api/airport-rental/bookings?status=ACCEPTED&employeeId=${empId}`);
                const data = await res.json();
                if (res.ok && data.success) setAirportBookings((data.data as AirportBooking[]).reverse());
            } catch (e) { console.error(e); }
        } else if (category === "wedding") {
            const res = await getAssignedWeddingBookings(empId);
            if (res.success) setWeddingBookings((res.data ?? []) as WeddingBooking[]);
        }
        setLoading(false);
    };

    // Initial Fetch & URL parsing
    useEffect(() => {
        const fetchSession = async () => {
            const res = await fetch("/api/auth/session");
            const data = await res.json();
            if (data.session?.relatedId) {
                setEmployeeId(data.session.relatedId);
            }
        };
        fetchSession();

        const search = window.location.search;
        const params = new URLSearchParams(search);
        const cat = params.get("category");
        if (cat && !selectedCategory) {
            setSelectedCategory(cat);
        }
    }, []); // Run only once

    useEffect(() => {
        if (selectedCategory && employeeId) {
            fetchData(selectedCategory, employeeId);
        }
    }, [selectedCategory, employeeId]);

    // --- MAIN RENDER ---
    if (!selectedCategory) {
        return (
            <div className="min-h-screen bg-[#fcfcfc] pb-12">
                <main className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
                    <div className="mb-10">
                        <nav className="mb-3 flex items-center gap-2 text-sm text-gray-400">
                            <Link href="/employee" className="transition-colors hover:text-primary">Employee</Link>
                            <ChevronRight className="h-4 w-4" />
                            <span className="font-medium text-primary">Bookings</span>
                        </nav>
                        <h1 className="text-2xl font-bold tracking-tight text-primary">Assigned Bookings</h1>
                        <p className="mt-2 text-base text-gray-500">Access approved bookings internally to manage and conduct checklists.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {categories.map((cat) => (
                            <div key={cat.id} onClick={() => setSelectedCategory(cat.id)} className="group cursor-pointer">
                                <div className="relative flex h-full flex-col p-6 transition-all duration-300 bg-white border-2 border-transparent hover:border-red-400/50 hover:shadow-premium rounded-3xl">
                                    <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${cat.color} ring-4 transition-transform group-hover:scale-110`}>
                                        <cat.icon className="h-7 w-7" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="mb-2 text-xl font-bold text-primary">{cat.name}</h3>
                                        <p className="text-sm leading-relaxed text-gray-500">{cat.description}</p>
                                    </div>
                                    <div className="mt-8 flex items-center justify-between">
                                        <span className="text-sm font-bold text-secondary">View Pipeline</span>
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 transition-colors group-hover:bg-red-600 group-hover:text-white">
                                            <ChevronRight className="h-4 w-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-10">
            {/* Header with Back Button */}
            <div className="flex justify-between items-start">
                <div>
                    <nav className="mb-3 flex items-center gap-2 text-sm text-gray-400">
                        <Link href="/employee" className="transition-colors hover:text-primary">Employee</Link>
                        <ChevronRight className="h-4 w-4" />
                        <button onClick={() => setSelectedCategory(null)} className="transition-colors hover:text-primary">Assigned Bookings</button>
                        <ChevronRight className="h-4 w-4" />
                        <span className="font-medium text-primary">{categories.find(c => c.id === selectedCategory)?.name}</span>
                    </nav>
                    <h1 className="text-3xl font-black text-primary uppercase tracking-tight">
                        {categories.find(c => c.id === selectedCategory)?.name}
                    </h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">Assigned Tasks Pipeline</p>
                </div>
                <button
                    onClick={() => setSelectedCategory(null)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-all"
                >
                    <ChevronRight className="w-4 h-4 rotate-180" /> Back to Categories
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
                    <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
                    <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Loading assigned entries...</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* RENT-A-CAR LIST */}
                    {selectedCategory === "rent-a-car" && (
                        rentBookings.length === 0 ? <NoRequests /> : (
                            rentBookings.map((b) => (
                                <BookingCard key={b.bookingId} booking={b} category={selectedCategory} />
                            ))
                        )
                    )}

                    {/* PICKUPS LIST */}
                    {selectedCategory === "pickups" && (
                        pickupBookings.length === 0 ? <NoRequests /> : (
                            pickupBookings.map((b) => (
                                <PickupCard key={b.id} booking={b} category={selectedCategory} />
                            ))
                        )
                    )}

                    {/* AIRPORT LIST */}
                    {selectedCategory === "airport" && (
                        airportBookings.length === 0 ? <NoRequests /> : (
                            airportBookings.map((b) => (
                                <AirportCard key={b.id} booking={b} category={selectedCategory} />
                            ))
                        )
                    )}

                    {/* WEDDING LIST */}
                    {selectedCategory === "wedding" && (
                        weddingBookings.length === 0 ? <NoRequests /> : (
                            weddingBookings.map((b) => (
                                <WeddingCard key={b.bookingId} booking={b} category={selectedCategory} />
                            ))
                        )
                    )}
                </div>
            )}
        </div>
    );
}

// --- SUB-COMPONENTS ---

function NoRequests() {
    return (
        <div className="bg-gray-50 rounded-[2.5rem] border border-gray-100 p-20 text-center">
            <Info className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-black text-primary uppercase tracking-tight mb-2">No Requests Found</h2>
            <p className="text-gray-400 font-medium">There are no approved and assigned bookings for you in this category.</p>
        </div>
    );
}

function BookingCard({ booking, category }: { booking: RentBooking, category: string }) {
    return (
        <Link href={`/employee/assigned/${category}/${booking.bookingId}`} className="block bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-5 cursor-pointer hover:border-gray-300 group">
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-start border-b border-gray-50 pb-3">
                    <div>
                        <h3 className="text-base font-bold text-gray-900">{booking.customerName}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{booking.phone}</p>
                    </div>
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-[10px] font-bold uppercase tracking-wider rounded-md">Rent-A-Car</span>
                </div>
                
                <div className="flex flex-col gap-3 text-sm">
                    <div>
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Vehicle</p>
                        <p className="font-medium text-gray-800">{booking.vehicle?.brand} {booking.vehicle?.model} <span className="text-gray-400 text-xs ml-1">({booking.vehicle?.plateNumber || "TBD"})</span></p>
                    </div>
                    <div>
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Dates</p>
                        <p className="font-medium text-gray-800">{new Date(booking.rentalDate).toLocaleDateString()} - {new Date(booking.returnDate).toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="pt-2">
                    <div className="w-full py-2.5 bg-gray-50 group-hover:bg-primary group-hover:text-white text-gray-700 rounded-lg text-xs font-bold transition-colors text-center border border-gray-100 group-hover:border-primary">
                        View Workspace
                    </div>
                </div>
            </div>
        </Link>
    );
}

function PickupCard({ booking, category }: { booking: PickupBooking, category: string }) {
    return (
        <Link href={`/employee/assigned/${category}/${booking.id}`} className="block bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-5 cursor-pointer hover:border-gray-300 group">
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-start border-b border-gray-50 pb-3">
                    <div>
                        <h3 className="text-base font-bold text-gray-900">{booking.customerFullName}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{booking.customerPhone}</p>
                    </div>
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-[10px] font-bold uppercase tracking-wider rounded-md">Pickup</span>
                </div>
                
                <div className="flex flex-col gap-3 text-sm">
                    <div>
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Route</p>
                        <p className="font-medium text-gray-800 line-clamp-2">{booking.pickupLocation} → {booking.dropLocation}</p>
                    </div>
                    <div>
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Schedule & Logistics</p>
                        <p className="font-medium text-gray-800">{new Date(booking.pickupTime).toLocaleString()}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{booking.travelers} Travelers • {booking.luggageCount} Bags</p>
                    </div>
                </div>

                <div className="pt-2">
                    <div className="w-full py-2.5 bg-gray-50 group-hover:bg-primary group-hover:text-white text-gray-700 rounded-lg text-xs font-bold transition-colors text-center border border-gray-100 group-hover:border-primary">
                        View Workspace
                    </div>
                </div>
            </div>
        </Link>
    );
}

function AirportCard({ booking, category }: { booking: AirportBooking, category: string }) {
    return (
        <Link href={`/employee/assigned/${category}/${booking.id}`} className="block bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-5 cursor-pointer hover:border-gray-300 group">
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-start border-b border-gray-50 pb-3">
                    <div>
                        <h3 className="text-base font-bold text-gray-900">{booking.customerName}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{booking.customerPhone}</p>
                    </div>
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-[10px] font-bold uppercase tracking-wider rounded-md">Airport</span>
                </div>
                
                <div className="flex flex-col gap-3 text-sm">
                    <div>
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Route</p>
                        <p className="font-medium text-gray-800 line-clamp-2">{booking.pickupLocation} → {booking.dropoffLocation}</p>
                    </div>
                    <div>
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Schedule</p>
                        <p className="font-medium text-gray-800">{new Date(booking.pickupDate).toLocaleString()}</p>
                    </div>
                </div>

                <div className="pt-2">
                    <div className="w-full py-2.5 bg-gray-50 group-hover:bg-primary group-hover:text-white text-gray-700 rounded-lg text-xs font-bold transition-colors text-center border border-gray-100 group-hover:border-primary">
                        View Workspace
                    </div>
                </div>
            </div>
        </Link>
    );
}

function WeddingCard({ booking, category }: { booking: WeddingBooking, category: string }) {
    return (
        <Link href={`/employee/assigned/${category}/${booking.bookingId}`} className="block bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-5 cursor-pointer hover:border-gray-300 group">
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-start border-b border-gray-50 pb-3">
                    <div>
                        <h3 className="text-base font-bold text-gray-900">{booking.customerName}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{booking.phone}</p>
                    </div>
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-[10px] font-bold uppercase tracking-wider rounded-md">Wedding</span>
                </div>
                
                <div className="flex flex-col gap-3 text-sm">
                    <div>
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Vehicle</p>
                        <p className="font-medium text-gray-800">{booking.vehicle?.brand} {booking.vehicle?.model}</p>
                    </div>
                    <div>
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Event Date</p>
                        <p className="font-medium text-gray-800">{new Date(booking.eventDate).toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="pt-2">
                    <div className="w-full py-2.5 bg-gray-50 group-hover:bg-primary group-hover:text-white text-gray-700 rounded-lg text-xs font-bold transition-colors text-center border border-gray-100 group-hover:border-primary">
                        View Workspace
                    </div>
                </div>
            </div>
        </Link>
    );
}
