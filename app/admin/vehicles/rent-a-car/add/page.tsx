"use client";

import Link from "next/link";
import { ChevronRight, ArrowLeft, Car } from "lucide-react";
import VehicleForm from "@/components/admin/VehicleForm";

export default function AddRentACarPage() {
    return (
        <div className="min-h-screen bg-[#fcfcfc] pb-12">
            <main className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 lg:px-8">
                {/* Breadcrumbs & Header */}
                <div className="mb-10">
                    <nav className="mb-4 flex items-center gap-2 text-sm text-gray-400">
                        <Link href="/admin/dashboard" className="transition-colors hover:text-[#0f0f0f]">Admin</Link>
                        <ChevronRight className="h-4 w-4" />
                        <Link href="/admin/vehicles" className="transition-colors hover:text-[#0f0f0f]">Vehicles</Link>
                        <ChevronRight className="h-4 w-4" />
                        <Link href="/admin/vehicles/rent-a-car" className="transition-colors hover:text-[#0f0f0f]">Rent a Car</Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="font-medium text-[#0f0f0f]">Enroll Vehicle</span>
                    </nav>

                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/vehicles/rent-a-car"
                            className="p-3 rounded-2xl bg-white border border-gray-100 text-gray-400 hover:text-gray-900 shadow-sm transition-all active:scale-95"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-yellow-400 rounded-lg">
                                    <Car className="h-4 w-4 text-black" />
                                </div>
                                <h1 className="text-2xl font-black tracking-tight text-[#0f0f0f]">New Fleet Enrollment</h1>
                            </div>
                            <p className="mt-2 text-gray-500 font-medium">Add a premium vehicle to your Rent-a-Car inventory.</p>
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <VehicleForm mode="add" />
            </main>
        </div>
    );
}
