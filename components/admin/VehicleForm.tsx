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
    const [formData, setFormData] = useState(
        defaultValues || {
            name: "",
            brand: "",
            model: "",
            year: new Date().getFullYear(),
            type: "Sedan",
            transmission: "Auto",
            fuelType: "Petrol",
            pricePerDay: "",
            description: "",
            status: "Available",
        }
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Backend logic pending
        console.log("Saving vehicle:", formData);
        router.push("/admin/vehicles");
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Left Column: Form Fields */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">General Information</h3>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Vehicle Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                                    placeholder="e.g. Toyota Camry"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Brand</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
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
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                                    placeholder="e.g. V70"
                                    value={formData.model}
                                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Year</label>
                                <input
                                    type="number"
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                                    value={formData.year}
                                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Price Per Day (LKR)</label>
                                <input
                                    type="number"
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                                    placeholder="e.g. 5000"
                                    value={formData.pricePerDay}
                                    onChange={(e) => setFormData({ ...formData, pricePerDay: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Vehicle Type</label>
                                <select
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option>Sedan</option>
                                    <option>SUV</option>
                                    <option>Van</option>
                                    <option>Luxury</option>
                                    <option>Minibus</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Specifications</h3>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Transmission</label>
                                <div className="flex gap-4">
                                    {["Auto", "Manual"].map((t) => (
                                        <label key={t} className="flex flex-1 items-center justify-center rounded-lg border border-gray-300 px-4 py-2.5 cursor-pointer has-[:checked]:border-yellow-500 has-[:checked]:bg-yellow-50 transition-all">
                                            <input
                                                type="radio"
                                                name="transmission"
                                                className="hidden"
                                                checked={formData.transmission === t}
                                                onChange={() => setFormData({ ...formData, transmission: t })}
                                            />
                                            <span className="text-sm font-medium">{t}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Fuel Type</label>
                                <select
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                                    value={formData.fuelType}
                                    onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                                >
                                    <option>Petrol</option>
                                    <option>Diesel</option>
                                    <option>Hybrid</option>
                                    <option>Electric</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-6 space-y-2">
                            <label className="text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                rows={4}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                                placeholder="Describe the vehicle's features and condition..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column: Image and Status */}
                <div className="space-y-6">
                    <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Vehicle Image</h3>
                        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center transition-colors hover:border-yellow-500">
                            <div className="rounded-full bg-white p-3 shadow-sm mb-4">
                                <Upload className="h-6 w-6 text-gray-400" />
                            </div>
                            <p className="text-sm font-medium text-gray-900">Upload vehicle photo</p>
                            <p className="mt-1 text-xs text-gray-500">PNG, JPG or WEBP up to 5MB</p>
                            <button type="button" className="mt-4 text-xs font-semibold text-yellow-600 hover:text-yellow-700 underline underline-offset-4">
                                Select File
                            </button>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Availability Status</h3>
                        <select
                            className={`w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:ring-1 ${formData.status === "Available"
                                    ? "bg-green-50 text-green-700 border-green-200 focus:border-green-500 focus:ring-green-500"
                                    : "bg-red-50 text-red-700 border-red-200 focus:border-red-500 focus:ring-red-500"
                                }`}
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                            <option value="Available">Available</option>
                            <option value="Unavailable">Unavailable</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            type="submit"
                            className="w-full rounded-xl bg-yellow-400 px-6 py-3.5 text-sm font-bold text-black shadow-md transition-all hover:bg-yellow-500 hover:shadow-lg disabled:opacity-50"
                        >
                            {mode === "add" ? "Save Vehicle" : "Update Vehicle"}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.push("/admin/vehicles")}
                            className="w-full rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}
