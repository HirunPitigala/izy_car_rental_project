"use client";

import Link from "next/link";
import { use, useState, useEffect } from "react";
import { ChevronRight, ArrowLeft, Loader2 } from "lucide-react";
import VehicleForm from "@/components/admin/VehicleForm";

export default function EditVehiclePage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                const res = await fetch(`/api/vehicles/${resolvedParams.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setVehicle(data);
                }
            } catch (error) {
                console.error("Error fetching vehicle:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVehicle();
    }, [resolvedParams.id]);

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
                            <h1 className="text-2xl font-bold text-gray-900">Edit Vehicle</h1>
                            <p className="mt-1 text-sm text-gray-500">Update the vehicle information below.</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                        <Loader2 className="h-10 w-10 animate-spin text-yellow-500" />
                        <p className="mt-4 text-gray-500 font-medium">Loading vehicle details...</p>
                    </div>
                ) : vehicle ? (
                    <VehicleForm mode="edit" defaultValues={vehicle} />
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl border border-gray-300">
                        <p className="text-gray-500">Vehicle not found.</p>
                        <Link href="/admin/vehicles" className="mt-4 inline-block text-yellow-600 font-semibold underline">Back to list</Link>
                    </div>
                )}
            </main>
        </div>
    );
}
