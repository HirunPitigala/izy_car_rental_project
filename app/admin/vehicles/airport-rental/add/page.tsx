"use client";

import Link from "next/link";
import { ChevronRight, PlaneTakeoff } from "lucide-react";
import VehicleForm from "@/components/admin/VehicleForm";

export default function AddAirportRentalVehiclePage() {
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
                        <Link href="/admin/vehicles/airport-rental" className="transition-colors hover:text-[#0f0f0f]">Airport Rental</Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="font-medium text-[#0f0f0f]">Enroll Vehicle</span>
                    </nav>

                    <div className="flex items-center gap-4">
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-500 rounded-lg">
                                    <PlaneTakeoff className="h-4 w-4 text-white" />
                                </div>
                                <h1 className="text-2xl font-black tracking-tight text-[#0f0f0f]">Add new airport rental vehicle</h1>
                            </div>
                            <p className="mt-2 text-gray-500 font-medium">Add a dedicated vehicle for the Airport Rental service.</p>
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <VehicleForm
                    mode="add"
                    redirectPath="/admin/vehicles/airport-rental"
                    defaultCategory="Airport Rental"
                />
            </main>
        </div>
    );
}
