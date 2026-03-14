"use client";

import Link from "next/link";
import { ChevronRight, ArrowLeft, Edit3, Truck } from "lucide-react";
import VehicleForm from "@/components/admin/VehicleForm";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { getVehicleById } from "@/lib/actions/vehicleActions";

export default function EditPickupVehiclePage() {
    const params = useParams();
    const [vehicle, setVehicle] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVehicle = async () => {
            if (!params.id) return;
            try {
                const result = await getVehicleById(parseInt(params.id as string));
                if (result.success) {
                    setVehicle(result.data);
                }
            } catch (error) {
                console.error("Error fetching vehicle for edit:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVehicle();
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fcfcfc] flex flex-col items-center justify-center p-8 text-center">
                <div className="relative">
                    <div className="h-16 w-16 rounded-full border-4 border-gray-50"></div>
                    <div className="absolute top-0 h-16 w-16 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin"></div>
                </div>
                <p className="mt-6 text-gray-400 font-bold tracking-tight">Retrieving Configuration...</p>
            </div>
        );
    }

    if (!vehicle) {
        return (
            <div className="min-h-screen bg-[#fcfcfc] flex flex-col items-center justify-center p-8 text-center">
                <h1 className="text-2xl font-black text-gray-900 mb-4">Vehicle Not Found</h1>
                <p className="text-gray-500 mb-8">The vehicle you're trying to edit doesn't exist or has been removed.</p>
                <Link
                    href="/admin/vehicles/pickup-service"
                    className="h-12 px-8 rounded-2xl bg-[#0f0f0f] text-white font-bold flex items-center gap-2 transition-all hover:bg-gray-800 active:scale-95"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to Fleet
                </Link>
            </div>
        );
    }

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
                        <span className="font-medium text-[#0f0f0f]">Modify Config</span>
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
                                <div className="p-2 bg-indigo-500 rounded-lg shadow-lg shadow-indigo-500/20">
                                    <Edit3 className="h-4 w-4 text-white" />
                                </div>
                                <h1 className="text-2xl font-black tracking-tight text-[#0f0f0f]">Update Configuration</h1>
                            </div>
                            <p className="mt-2 text-gray-500 font-medium">Modifying details for <span className="text-indigo-600 font-bold">{vehicle.brand} {vehicle.model}</span> • {vehicle.plateNumber}</p>
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <VehicleForm
                    mode="edit"
                    defaultValues={vehicle}
                    redirectPath="/admin/vehicles/pickup-service"
                />
            </main>
        </div>
    );
}
