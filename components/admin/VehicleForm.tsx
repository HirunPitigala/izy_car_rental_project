"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Upload, X } from "lucide-react";

interface VehicleFormProps {
    mode: "add" | "edit";
    defaultValues?: any;
}

export default function VehicleForm({ mode, defaultValues }: VehicleFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(
        defaultValues || {
            brand: "",
            model: "",
            plateNumber: "",
            seatingCapacity: "4",
            transmissionType: "AUTO",
            fuelType: "PETROL",
            luggageCapacity: "2",
            ratePerDay: "",
            ratePerMonth: "",
            status: "AVAILABLE",
            serviceCategory: "NORMAL",
            description: "",
            image: "",
        }
    );

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData({ ...formData, image: reader.result as string });
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = mode === "add"
                ? "/api/admin/vehicles"
                : `/api/admin/vehicles/${defaultValues.vehicleId}`;

            const res = await fetch(url, {
                method: mode === "add" ? "POST" : "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                alert(data.message || "Success!");
                router.push("/admin/vehicles");
                router.refresh();
            } else {
                alert(data.error || "Something went wrong");
            }
        } catch (error) {
            console.error("Form submission error:", error);
            alert("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Left Column: Form Fields */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="ek-card border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">General Information</h3>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Brand</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full ek-input outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                                    placeholder="e.g. Toyota"
                                    value={formData.brand}
                                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Model</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full ek-input outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                                    placeholder="e.g. Corolla"
                                    value={formData.model}
                                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Plate Number</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full ek-input outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                                    placeholder="e.g. CAS-1234"
                                    value={formData.plateNumber}
                                    onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Service Category</label>
                                <select
                                    required
                                    className="w-full ek-input outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                                    value={formData.serviceCategory}
                                    onChange={(e) => setFormData({ ...formData, serviceCategory: e.target.value })}
                                >
                                    <option value="NORMAL">Normal</option>
                                    <option value="PICKME">PickMe</option>
                                    <option value="WEDDING">Wedding</option>
                                    <option value="AIRPORT">Airport</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Pricing Information (Base Rates)</h3>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Rate Per Day (LKR)</label>
                                <input
                                    type="number"
                                    required
                                    className="w-full ek-input outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                                    value={formData.ratePerDay}
                                    onChange={(e) => setFormData({ ...formData, ratePerDay: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Rate Per Month (LKR)</label>
                                <input
                                    type="number"
                                    required
                                    className="w-full ek-input outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                                    value={formData.ratePerMonth}
                                    onChange={(e) => setFormData({ ...formData, ratePerMonth: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Specifications</h3>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Seating Capacity</label>
                                <input
                                    type="number"
                                    required
                                    className="w-full ek-input outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                                    value={formData.seatingCapacity}
                                    onChange={(e) => setFormData({ ...formData, seatingCapacity: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Luggage Capacity</label>
                                <input
                                    type="number"
                                    required
                                    className="w-full ek-input outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                                    value={formData.luggageCapacity}
                                    onChange={(e) => setFormData({ ...formData, luggageCapacity: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Transmission</label>
                                <select
                                    className="w-full ek-input outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                                    value={formData.transmissionType}
                                    onChange={(e) => setFormData({ ...formData, transmissionType: e.target.value })}
                                >
                                    <option value="AUTO">Auto</option>
                                    <option value="MANUAL">Manual</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Fuel Type</label>
                                <select
                                    className="w-full ek-input outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                                    value={formData.fuelType}
                                    onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                                >
                                    <option value="PETROL">Petrol</option>
                                    <option value="DIESEL">Diesel</option>
                                    <option value="HYBRID">Hybrid</option>
                                    <option value="ELECTRIC">Electric</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-6 space-y-2">
                            <label className="text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                rows={4}
                                className="w-full ek-input outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                                placeholder="Describe the vehicle's features and condition..."
                                value={formData.description || ""}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column: Image and Status */}
                <div className="space-y-6">
                    <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Vehicle Image</h3>

                        {formData.image ? (
                            <div className="group relative aspect-video w-full overflow-hidden rounded-xl bg-gray-100 border border-gray-200">
                                <img
                                    src={formData.image.startsWith('data:') ? formData.image : `data:image/jpeg;base64,${formData.image}`}
                                    alt="Vehicle preview"
                                    className="h-full w-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, image: "" })}
                                    className="absolute right-2 top-2 rounded-full bg-red-500 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 shadow-sm"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                                    onChange={handleImageUpload}
                                />
                                <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center transition-colors hover:border-yellow-500">
                                    <div className="rounded-full bg-white p-3 shadow-sm mb-4">
                                        <Upload className="h-6 w-6 text-gray-400" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">Upload vehicle photo</p>
                                    <p className="mt-1 text-xs text-gray-500">PNG, JPG or WEBP up to 5MB</p>
                                    <span className="mt-4 text-xs font-semibold text-yellow-600 underline underline-offset-4">
                                        Select File
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Availability Status</h3>
                        <select
                            className={`w-full ek-input outline-none font-medium transition-colors focus:ring-1 ${formData.status === "AVAILABLE"
                                ? "bg-green-50 text-green-700 border-green-200 focus:border-green-500 focus:ring-green-500"
                                : formData.status === "MAINTENANCE"
                                    ? "bg-yellow-50 text-yellow-700 border-yellow-200 focus:border-yellow-500 focus:ring-yellow-500"
                                    : "bg-red-50 text-red-700 border-red-200 focus:border-red-500 focus:ring-red-500"
                                }`}
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                            <option value="AVAILABLE">Available</option>
                            <option value="UNAVAILABLE">Unavailable</option>
                            <option value="MAINTENANCE">Maintenance</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full ek-button bg-yellow-400 text-black shadow-md transition-all hover:bg-yellow-500 hover:shadow-lg active:scale-[0.98] disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
                                    Saving...
                                </div>
                            ) : (
                                mode === "add" ? "Save Vehicle" : "Update Vehicle"
                            )}
                        </button>
                        <button
                            type="button"
                            disabled={loading}
                            onClick={() => router.push("/admin/vehicles")}
                            className="w-full ek-button border border-gray-200 bg-white text-gray-700 transition-all hover:bg-gray-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}
