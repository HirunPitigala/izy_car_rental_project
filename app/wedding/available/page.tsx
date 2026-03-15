"use client";

import { useState, useEffect } from "react";
import { getWeddingCars } from "@/lib/actions/weddingActions";
import { Heart, Loader2, ArrowRight, Users, Fuel, Car } from "lucide-react";
import Link from "next/link";

interface WeddingCar {
    vehicleId: number;
    brand: string | null;
    model: string | null;
    image: string | null;
    rentPerDay: string | null;
    seatingCapacity: number;
    status: string | null;
    transmissionType: string;
    fuelType: string;
}

export default function WeddingAvailablePage() {
    const [cars, setCars] = useState<WeddingCar[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCars() {
            setLoading(true);
            const result = await getWeddingCars();
            if (result.success) {
                setCars(result.data as any);
            }
            setLoading(false);
        }
        fetchCars();
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen pb-20 pt-10">
            <div className="container mx-auto px-6">
                <div className="mb-12 flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-full text-sm font-bold mb-4 border border-amber-100">
                        <Heart className="h-4 w-4 fill-amber-500" />
                        Wedding Collection
                    </div>
                    <h1 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">Available Wedding Cars</h1>
                    <div className="flex items-center gap-2">
                        <p className="text-gray-500 font-medium bg-white px-4 py-1.5 rounded-full border border-gray-100 shadow-sm">
                            Found <span className="text-gray-900 font-bold">{cars.length}</span> luxury vehicles for your special day
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="h-10 w-10 text-amber-500 animate-spin mb-4" />
                        <p className="text-gray-400 font-medium">Loading wedding fleet...</p>
                    </div>
                ) : cars.length === 0 ? (
                    <div className="text-center py-20">
                        <Heart className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-400 mb-2">No Wedding Cars Available</h2>
                        <p className="text-gray-400 mb-6">Check back later for our premium wedding fleet.</p>
                        <Link href="/wedding" className="ek-button ek-button-primary">
                            Back to Wedding Page
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {cars.map((car) => (
                            <div key={car.vehicleId} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all group border border-gray-100">
                                {/* Image */}
                                <div className="relative h-56 bg-gray-100">
                                    {car.image ? (
                                        <img
                                            src={car.image}
                                            alt={`${car.brand} ${car.model}`}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-gray-300">
                                            <Car className="h-12 w-12" />
                                        </div>
                                    )}
                                    <div className="absolute top-3 left-3 bg-amber-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1">
                                        <Heart className="h-3 w-3 fill-white" />
                                        Wedding Special
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{car.brand} {car.model}</h3>
                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                        <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {car.seatingCapacity}</span>
                                        <span className="flex items-center gap-1"><Fuel className="h-4 w-4" /> {car.fuelType}</span>
                                    </div>
                                    {car.rentPerDay && (
                                        <p className="text-lg font-extrabold text-amber-600 mb-4">LKR {Number(car.rentPerDay).toLocaleString()} <span className="text-sm font-normal text-gray-400">/ day</span></p>
                                    )}
                                    <Link
                                        href={`/wedding/${car.vehicleId}`}
                                        className="w-full h-12 bg-[#0f0f0f] text-white rounded-2xl flex items-center justify-center gap-2 font-bold text-sm hover:bg-amber-600 transition-all"
                                    >
                                        View Details <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
