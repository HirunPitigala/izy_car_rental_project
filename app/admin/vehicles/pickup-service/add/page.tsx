"use client";

import Link from "next/link";
import { ChevronRight, ArrowLeft, Truck } from "lucide-react";
import VehicleForm from "@/components/admin/VehicleForm";

export default function AddPickupVehiclePage() {
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
                        <Link href="/admin/vehicles/pickup-service" className="transition-colors hover:text-[#0f0f0f]">Pickup Service</Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="font-medium text-[#0f0f0f]">Enroll Vehicle</span>
                    </nav>

                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/vehicles/pickup-service"
                            className="p-3 rounded-2xl bg-white border border-gray-100 text-gray-400 hover:text-gray-900 shadow-sm transition-all active:scale-95"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-500 rounded-lg">
                                    <Truck className="h-4 w-4 text-white" />
                                </div>
                                <h1 className="text-2xl font-black tracking-tight text-[#0f0f0f]">Add pickup vehicle</h1>
                            </div>
                            <p className="mt-2 text-gray-500 font-medium">Register a new vehicle for point-to-point pickup services.</p>
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <VehicleForm
                    mode="add"
                    redirectPath="/admin/vehicles/pickup-service"
                    defaultValues={{
                        brand: "",
                        model: "",
                        plateNumber: "",
                        seatingCapacity: 4,
                        passengerCapacity: 4,
                        transmissionType: "Automatic",
                        fuelType: "Petrol",
                        luggageCapacity: 2,
                        rentPerHour: "0",
                        rentPerDay: "0",
                        rentPerMonth: "0",
                        maxMileagePerDay: "0",
                        extraMileageCharge: "0",
                        minRentalPeriod: 1,
                        maxRentalPeriod: 30,
                        status: "AVAILABLE",
                        serviceCategory: "Pickups",
                        description: "",
                        image: "",
                        chassisNumber: "",
                        pricePerKm: "",
                    }}
                />
            </main>
        </div>
    );
}
