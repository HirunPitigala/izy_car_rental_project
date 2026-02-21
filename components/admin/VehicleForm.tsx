"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Upload, X, Save, ArrowLeft, Info, Gauge, Zap, Coins, Clock, Calendar, Scale } from "lucide-react";
import { saveVehicle } from "@/lib/actions/vehicleActions";

interface VehicleFormProps {
    mode: "add" | "edit";
    defaultValues?: any;
    redirectPath?: string;
}

export default function VehicleForm({ mode, defaultValues, redirectPath = "/admin/vehicles/rent-a-car" }: VehicleFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(
        defaultValues || {
            brand: "",
            model: "",
            plateNumber: "",
            seatingCapacity: 4,
            passengerCapacity: 4,
            transmissionType: "Automatic",
            fuelType: "Petrol",
            luggageCapacity: 2,
            rentPerHour: "",
            rentPerDay: "",
            rentPerMonth: "",
            maxMileagePerDay: "",
            extraMileageCharge: "",
            minRentalPeriod: 1,
            maxRentalPeriod: 30,
            status: "AVAILABLE",
            serviceCategory: "Rent a Car",
            description: "",
            image: "",
            chassisNumber: "",
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
            const result = await saveVehicle(formData);

            if (result.success) {
                router.push(redirectPath);
                router.refresh();
            } else {
                alert(result.error || "Something went wrong");
            }
        } catch (error) {
            console.error("Form submission error:", error);
            alert("An error occurred during save");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-12 pb-20 pt-6">

            {/* 1. Identity & Category */}
            <section className="space-y-6">
                <div className="border-b border-gray-200 pb-2">
                    <h3 className="text-xl font-medium text-[#0f0f0f]">Identity & Category</h3>
                </div>

                <div className="space-y-6">
                    <FormGroup label="Vehicle Brand">
                        <input
                            type="text"
                            required
                            className="ek-input-primary"
                            placeholder="e.g. Mercedes-Benz"
                            value={formData.brand}
                            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        />
                    </FormGroup>

                    <FormGroup label="Vehicle Model">
                        <input
                            type="text"
                            required
                            className="ek-input-primary"
                            placeholder="e.g. S-Class"
                            value={formData.model}
                            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                        />
                    </FormGroup>

                    <FormGroup label="Plate Number">
                        <input
                            type="text"
                            required
                            className="ek-input-primary font-mono"
                            placeholder="e.g. CAB-9988"
                            value={formData.plateNumber}
                            onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                        />
                    </FormGroup>

                    <FormGroup label="Chassis Number">
                        <input
                            type="text"
                            className="ek-input-primary font-mono"
                            placeholder="e.g. 1HGCM82633A004352"
                            value={formData.chassisNumber || ""}
                            onChange={(e) => setFormData({ ...formData, chassisNumber: e.target.value })}
                        />
                    </FormGroup>

                    <FormGroup label="Service Category">
                        <select
                            required
                            className="ek-input-primary appearance-none"
                            value={formData.serviceCategory}
                            onChange={(e) => setFormData({ ...formData, serviceCategory: e.target.value })}
                        >
                            <option value="Rent a Car">Rent a Car</option>
                            <option value="Pickups" disabled>Pickups (Coming Soon)</option>
                            <option value="Trental" disabled>Trental (Coming Soon)</option>
                            <option value="Wind Car Rental" disabled>Wind Car Rental (Coming Soon)</option>
                        </select>
                    </FormGroup>
                </div>
            </section>

            {/* 2. Media Upload */}
            <section className="space-y-6">
                <div className="border-b border-gray-200 pb-2">
                    <h3 className="text-xl font-medium text-[#0f0f0f]">Vehicle Image</h3>
                </div>

                <div className="space-y-6">
                    {formData.image ? (
                        <div className="relative aspect-video w-full overflow-hidden rounded-xl border-2 border-[#0f0f0f]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={
                                    formData.image.startsWith('http')
                                        ? formData.image
                                        : formData.image.startsWith('data:')
                                            ? formData.image
                                            : `data:image/jpeg;base64,${formData.image}`
                                }
                                alt="Vehicle preview"
                                className="h-full w-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, image: "" })}
                                className="absolute top-4 right-4 h-10 w-10 rounded-full bg-[#0f0f0f] text-white flex items-center justify-center hover:bg-[#dc2626] transition-colors"
                            >
                                <X className="h-5 w-5" />
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
                            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#0f0f0f] bg-gray-50 p-10 text-center transition-colors hover:bg-gray-100">
                                <Upload className="h-10 w-10 text-[#0f0f0f] mb-3" />
                                <p className="text-base font-medium text-[#0f0f0f]">Click to upload vehicle image</p>
                                <p className="mt-1 text-sm text-gray-500">High-res PNG or JPG recommended</p>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* 3. Technical Specifications */}
            <section className="space-y-6">
                <div className="border-b border-gray-200 pb-2">
                    <h3 className="text-xl font-medium text-[#0f0f0f]">Technical Specifications</h3>
                </div>

                <div className="space-y-6">
                    {/* Capacity - Stacked */}
                    <FormGroup label="Seating Capacity">
                        <input
                            type="number"
                            required
                            className="ek-input-primary"
                            value={formData.seatingCapacity}
                            onChange={(e) => setFormData({ ...formData, seatingCapacity: parseInt(e.target.value) })}
                        />
                    </FormGroup>


                    <FormGroup label="Luggage Capacity">
                        <input
                            type="number"
                            required
                            className="ek-input-primary"
                            value={formData.luggageCapacity}
                            onChange={(e) => setFormData({ ...formData, luggageCapacity: parseInt(e.target.value) })}
                        />
                    </FormGroup>

                    <FormGroup label="Transmission">
                        <select
                            className="ek-input-primary appearance-none"
                            value={formData.transmissionType}
                            onChange={(e) => setFormData({ ...formData, transmissionType: e.target.value })}
                        >
                            <option value="Automatic">Automatic (AMT/DCT)</option>
                            <option value="Manual">Manual (Synced)</option>
                        </select>
                    </FormGroup>

                    <FormGroup label="Fuel Source">
                        <select
                            className="ek-input-primary appearance-none"
                            value={formData.fuelType}
                            onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                        >
                            <option value="Petrol">Petrol (Octane 92/95)</option>
                            <option value="Diesel">Diesel (Super/V-Power)</option>
                            <option value="Hybrid">Hybrid (Electric/Gas)</option>
                            <option value="Electric">Electric (BEV)</option>
                        </select>
                    </FormGroup>

                    <FormGroup label="Description (Optional)">
                        <textarea
                            className="ek-input-primary h-32 py-3 resize-y"
                            placeholder="Vehicle features and notes..."
                            value={formData.description || ""}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </FormGroup>
                </div>
            </section>

            {/* 4. Pricing & Limits */}
            <section className="space-y-6">
                <div className="border-b border-gray-200 pb-2">
                    <h3 className="text-xl font-medium text-[#0f0f0f]">Pricing & Limits</h3>
                </div>

                <div className="space-y-6">
                    <FormGroup label="Rent Per Hour (LKR)">
                        <input
                            type="number"
                            required
                            className="ek-input-primary"
                            value={formData.rentPerHour}
                            onChange={(e) => setFormData({ ...formData, rentPerHour: e.target.value })}
                        />
                    </FormGroup>

                    <FormGroup label="Rent Per Day (LKR)">
                        <input
                            type="number"
                            required
                            className="ek-input-primary"
                            value={formData.rentPerDay}
                            onChange={(e) => setFormData({ ...formData, rentPerDay: e.target.value })}
                        />
                    </FormGroup>

                    <FormGroup label="Rent Per Month (LKR)">
                        <input
                            type="number"
                            required
                            className="ek-input-primary"
                            value={formData.rentPerMonth}
                            onChange={(e) => setFormData({ ...formData, rentPerMonth: e.target.value })}
                        />
                    </FormGroup>

                    <FormGroup label="Max KMs Per Day">
                        <input
                            type="number"
                            required
                            className="ek-input-primary"
                            value={formData.maxMileagePerDay}
                            onChange={(e) => setFormData({ ...formData, maxMileagePerDay: e.target.value })}
                        />
                    </FormGroup>

                    <FormGroup label="Extra KM Charge (LKR)">
                        <input
                            type="number"
                            required
                            className="ek-input-primary"
                            value={formData.extraMileageCharge}
                            onChange={(e) => setFormData({ ...formData, extraMileageCharge: e.target.value })}
                        />
                    </FormGroup>

                    {/* Min/Max Days - separate inputs */}
                    <FormGroup label="Minimum Days">
                        <input
                            type="number"
                            required
                            className="ek-input-primary"
                            value={formData.minRentalPeriod}
                            onChange={(e) => setFormData({ ...formData, minRentalPeriod: parseInt(e.target.value) })}
                        />
                    </FormGroup>

                    <FormGroup label="Maximum Days">
                        <input
                            type="number"
                            required
                            className="ek-input-primary"
                            value={formData.maxRentalPeriod}
                            onChange={(e) => setFormData({ ...formData, maxRentalPeriod: parseInt(e.target.value) })}
                        />
                    </FormGroup>
                </div>
            </section>

            {/* 5. Fleet Status */}
            <section className="space-y-6">
                <div className="border-b border-gray-200 pb-2">
                    <h3 className="text-xl font-medium text-[#0f0f0f]">Fleet Status</h3>
                </div>

                <div className="space-y-4">
                    <StatusRadio
                        checked={formData.status === "AVAILABLE"}
                        value="AVAILABLE"
                        label="Operational"
                        description="Active and ready for rental"
                        onClick={(val) => setFormData({ ...formData, status: val })}
                    />
                    <StatusRadio
                        checked={formData.status === "MAINTENANCE"}
                        value="MAINTENANCE"
                        label="Maintenance"
                        description="Currently in workshop"
                        onClick={(val) => setFormData({ ...formData, status: val })}
                    />
                    <StatusRadio
                        checked={formData.status === "UNAVAILABLE"}
                        value="UNAVAILABLE"
                        label="Grounded"
                        description="Permanently or temporarily out"
                        onClick={(val) => setFormData({ ...formData, status: val })}
                    />
                </div>
            </section>

            {/* Action Buttons */}
            <div className="pt-8 space-y-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 rounded-xl bg-[#0f0f0f] text-white font-bold text-base transition-all hover:bg-[#dc2626] disabled:opacity-50 disabled:hover:bg-[#0f0f0f]"
                >
                    {loading ? "Processing..." : (mode === "add" ? "Enroll Vehicle" : "Save Changes")}
                </button>

                <button
                    type="button"
                    disabled={loading}
                    onClick={() => router.push(redirectPath)}
                    className="w-full h-14 rounded-xl border-2 border-[#0f0f0f] bg-transparent text-[#0f0f0f] font-bold text-base transition-all hover:bg-gray-50 disabled:opacity-50"
                >
                    Cancel
                </button>
            </div>

            <style jsx global>{`
                .ek-input-primary {
                    width: 100%;
                    height: 52px;
                    padding: 0 1rem;
                    background-color: #ffffff;
                    border: 1px solid #0f0f0f;
                    border-radius: 0.75rem;
                    font-size: 1rem;
                    color: #0f0f0f;
                    transition: all 0.2s ease;
                    outline: none;
                }
                .ek-input-primary:focus {
                    border-color: #dc2626;
                    box-shadow: 0 0 0 1px #dc2626;
                }
                .ek-input-primary::placeholder {
                    color: #6b7280;
                }
            `}</style>
        </form>
    );
}

interface FormGroupProps {
    label: string;
    children: React.ReactNode;
    icon?: React.ElementType;
}

function FormGroup({ label, children, icon: Icon }: FormGroupProps) {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-[#0f0f0f]">
                {label}
            </label>
            <div className="relative">
                {children}
                {Icon && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                        <Icon className="h-5 w-5" />
                    </div>
                )}
            </div>
        </div>
    );
}

interface StatusRadioProps {
    checked: boolean;
    value: string;
    label: string;
    description: string;
    onClick: (value: string) => void;
}

function StatusRadio({ checked, value, label, description, onClick }: StatusRadioProps) {
    return (
        <div
            onClick={() => onClick(value)}
            className={`cursor-pointer flex items-center gap-4 p-4 rounded-xl border transition-all ${checked
                ? "border-[#dc2626] bg-red-50/10 ring-1 ring-[#dc2626]"
                : "border-gray-200 hover:border-gray-300"
                }`}
        >
            <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${checked ? "border-[#dc2626]" : "border-gray-300"}`}>
                {checked && <div className="h-2.5 w-2.5 rounded-full bg-[#dc2626]" />}
            </div>
            <div>
                <p className="text-base font-bold text-[#0f0f0f]">{label}</p>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
        </div>
    );
}
