"use client";

import { useState, useEffect } from "react";
import { getWeddingCars } from "@/lib/actions/weddingActions";
import { Heart, Loader2, Users, Fuel, Gauge, Briefcase, Search, ChevronRight, Phone, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface WeddingCar {
    vehicleId: number;
    brand: string | null;
    model: string | null;
    image: string | null;
    rentPerDay: string | null;
    seatingCapacity: number;
    luggageCapacity: number;
    status: string | null;
    transmissionType: string;
    fuelType: string;
}

const adminContact = {
    phone: '+94 77 123 4567',
    email: 'admin@carrental.com',
    address: 'No 123, Kurunegala Road, Negombo, Sri Lanka',
};

export default function WeddingAvailablePage() {
    const [cars, setCars] = useState<WeddingCar[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCars() {
            setLoading(true);
            const result = await getWeddingCars(true);
            if (result.success) {
                setCars(result.data as any);
            }
            setLoading(false);
        }
        fetchCars();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 py-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">Available Wedding Cars</h2>
                        <p className="text-sm text-gray-500">
                            Found <span className="text-red-600 font-semibold">{cars.length}</span> luxury vehicle{cars.length !== 1 ? "s" : ""} for your special day
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 sm:gap-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                                <Phone className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Call Us</p>
                                <p className="text-sm font-bold text-gray-900">{adminContact.phone}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                                <Mail className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Email Us</p>
                                <a href={`mailto:${adminContact.email}`} className="text-sm font-bold text-gray-900 hover:text-red-600 transition-colors">{adminContact.email}</a>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                                <MapPin className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Address</p>
                                <p className="text-sm font-bold text-gray-900">{adminContact.address}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 bg-white rounded-[3rem] border border-dashed border-gray-200">
                        <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-6" />
                        <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-xs">Loading Wedding Fleet...</p>
                    </div>
                ) : cars.length === 0 ? (
                    <div className="bg-white border border-gray-100 rounded-[3rem] p-16 text-center max-w-2xl mx-auto shadow-sm">
                        <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-400 mx-auto mb-8">
                            <Search className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-3 uppercase">No Wedding Cars Available</h3>
                        <p className="text-gray-500 font-medium mb-10 leading-relaxed">
                            Check back later for our premium wedding fleet.
                        </p>
                        <Link
                            href="/wedding"
                            className="inline-block bg-gray-900 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-600 transition-all shadow-xl shadow-gray-100"
                        >
                            Back to Wedding
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        {cars.map((car) => (
                            <div
                                key={car.vehicleId}
                                className="group bg-white rounded-2xl border border-gray-100 transition-all duration-300 shadow-sm overflow-hidden flex flex-col sm:flex-row hover:shadow-md hover:border-gray-200"
                            >
                                {/* Image */}
                                <div className="relative sm:w-52 sm:shrink-0 h-44 sm:h-auto bg-gray-50 overflow-hidden">
                                    {car.image ? (
                                        <Image
                                            src={car.image}
                                            alt={`${car.brand} ${car.model}`}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Heart className="w-12 h-12 text-gray-200" />
                                        </div>
                                    )}
                                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wide shadow-sm bg-white text-gray-700">
                                        Wedding Special
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="flex flex-col flex-1 p-4 sm:p-5 gap-3">
                                    {/* Title row */}
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <h3 className="text-base font-bold text-gray-900 leading-tight">
                                                {car.brand}{" "}
                                                <span className="font-medium text-gray-500">{car.model}</span>
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Specs row */}
                                    <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                                        <span className="flex items-center gap-1 text-gray-700 whitespace-nowrap">
                                            <Users className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                            <span className="text-xs font-medium">{car.seatingCapacity} Seats</span>
                                        </span>
                                        {car.luggageCapacity != null && (
                                            <span className="flex items-center gap-1 text-gray-700 whitespace-nowrap">
                                                <Briefcase className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                                <span className="text-xs font-medium">{car.luggageCapacity} Bags</span>
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1 text-gray-700 whitespace-nowrap">
                                            <Gauge className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                            <span className="text-xs font-medium">{car.transmissionType}</span>
                                        </span>
                                        <span className="flex items-center gap-1 text-gray-700 whitespace-nowrap">
                                            <Fuel className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                            <span className="text-xs font-medium">{car.fuelType}</span>
                                        </span>
                                    </div>

                                    {/* Divider */}
                                    <div className="border-t border-gray-50" />

                                    {/* CTA */}
                                    <div className="flex items-center justify-end gap-3 mt-auto">

                                        <Link
                                            href={`/wedding/${car.vehicleId}`}
                                            className="inline-flex items-center gap-1.5 px-4 h-9 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 bg-gray-900 text-white hover:bg-gray-700 active:scale-95"
                                        >
                                            View Details
                                            <ChevronRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
