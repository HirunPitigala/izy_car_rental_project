"use client";

import Link from "next/link";
import { use } from "react";
import { ChevronRight, ArrowLeft } from "lucide-react";
import VehicleForm from "@/components/admin/VehicleForm";

// Mock data fetching (simulated)
const getMockVehicle = (id: string) => {
    return {
        id,
        name: "Toyota Axio",
        brand: "Toyota",
        model: "Axio",
        year: 2018,
        type: "Sedan",
        transmission: "Auto",
        fuelType: "Hybrid",
        pricePerDay: 8500,
        description: "A very fuel-efficient and comfortable sedan for daily travel.",
        status: "Available",
    };
};

export default function EditVehiclePage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const vehicle = getMockVehicle(resolvedParams.id);

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <main className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
                {/* Breadcrumbs */}
                <div className="mb-8">
                    <nav className="mb-4 flex items-center gap-2 text-sm text-gray-500">
                        <Link href="/admin/dashboard" className="hover:text-yellow-600">Admin</Link>
                        <ChevronRight className="h-4 w-4" />
                        <Link href="/admin/vehicles" className="hover:text-yellow-600">Vehicles</Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-gray-900 font-medium">Edit Vehicle</span>
                    </nav>

                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/vehicles"
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm transition-colors hover:bg-gray-50"
                        >
                            <ArrowLeft className="h-5 w-5 text-gray-600" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Edit Vehicle</h1>
                            <p className="mt-1 text-sm text-gray-500">Update the vehicle information below.</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <VehicleForm mode="edit" defaultValues={vehicle} />
            </main>
        </div>
    );
}
