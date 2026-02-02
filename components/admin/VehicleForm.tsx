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
        <form onSubmit={handleSubmit} className="space-y-10 pb-20">
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">

                {/* Left Column: Form Fields (8/12) */}
                <div className="lg:col-span-8 space-y-10">

                    {/* Section 1: Basic Identity */}
                    <div className="rounded-[2.5rem] bg-white p-8 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-1.5 w-6 bg-yellow-400 rounded-full" />
                            <h3 className="text-xl font-black text-gray-900 tracking-tight">Identity & Category</h3>
                        </div>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            <FormGroup label="Vehicle Brand">
                                <input
                                    type="text"
                                    required
                                    className="ek-input-modern"
                                    placeholder="e.g. Mercedes-Benz"
                                    value={formData.brand}
                                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                />
                            </FormGroup>
                            <FormGroup label="Vehicle Model">
                                <input
                                    type="text"
                                    required
                                    className="ek-input-modern"
                                    placeholder="e.g. S-Class"
                                    value={formData.model}
                                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                />
                            </FormGroup>
                            <FormGroup label="Plate Number">
                                <input
                                    type="text"
                                    required
                                    className="ek-input-modern font-mono font-bold"
                                    placeholder="e.g. CAB-9988"
                                    value={formData.plateNumber}
                                    onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                                />
                            </FormGroup>
                            <FormGroup label="Service Category">
                                <select
                                    required
                                    className="ek-input-modern appearance-none"
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
                    </div>

                    {/* Section 2: Technical Specifications */}
                    <div className="rounded-[2.5rem] bg-white p-8 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-1.5 w-6 bg-indigo-400 rounded-full" />
                            <h3 className="text-xl font-black text-gray-900 tracking-tight">Technical Specifications</h3>
                        </div>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            <FormGroup label="Seating Capacity">
                                <input
                                    type="number"
                                    required
                                    className="ek-input-modern"
                                    value={formData.seatingCapacity}
                                    onChange={(e) => setFormData({ ...formData, seatingCapacity: parseInt(e.target.value) })}
                                />
                            </FormGroup>
                            <FormGroup label="Passenger Capacity">
                                <input
                                    type="number"
                                    required
                                    className="ek-input-modern"
                                    value={formData.passengerCapacity}
                                    onChange={(e) => setFormData({ ...formData, passengerCapacity: parseInt(e.target.value) })}
                                />
                            </FormGroup>
                            <FormGroup label="Luggage (Items)">
                                <input
                                    type="number"
                                    required
                                    className="ek-input-modern"
                                    value={formData.luggageCapacity}
                                    onChange={(e) => setFormData({ ...formData, luggageCapacity: parseInt(e.target.value) })}
                                />
                            </FormGroup>
                            <FormGroup label="Transmission">
                                <select
                                    className="ek-input-modern appearance-none"
                                    value={formData.transmissionType}
                                    onChange={(e) => setFormData({ ...formData, transmissionType: e.target.value })}
                                >
                                    <option value="Automatic">Automatic (AMT/DCT)</option>
                                    <option value="Manual">Manual (Synced)</option>
                                </select>
                            </FormGroup>
                            <FormGroup label="Fuel Source">
                                <select
                                    className="ek-input-modern appearance-none"
                                    value={formData.fuelType}
                                    onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                                >
                                    <option value="Petrol">Petrol (Octane 92/95)</option>
                                    <option value="Diesel">Diesel (Super/V-Power)</option>
                                    <option value="Hybrid">Hybrid (Electric/Gas)</option>
                                    <option value="Electric">Electric (BEV)</option>
                                </select>
                            </FormGroup>
                            <FormGroup label="Vehicle Description (Optional)">
                                <textarea
                                    className="ek-input-modern h-14 resize-none py-3"
                                    placeholder="Add notes..."
                                    value={formData.description || ""}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </FormGroup>
                        </div>
                    </div>

                    {/* Section 3: Pricing & Usage Limits */}
                    <div className="rounded-[2.5rem] bg-white p-8 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-1.5 w-6 bg-emerald-400 rounded-full" />
                            <h3 className="text-xl font-black text-gray-900 tracking-tight">Pricing & Usage Limits</h3>
                        </div>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            <div className="space-y-6">
                                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Standard Rental Rates</h4>
                                <div className="grid grid-cols-1 gap-4">
                                    <FormGroup label="Rent Per Hour (LKR)" icon={Clock}>
                                        <input
                                            type="number"
                                            required
                                            className="ek-input-modern pl-10"
                                            value={formData.rentPerHour}
                                            onChange={(e) => setFormData({ ...formData, rentPerHour: e.target.value })}
                                        />
                                    </FormGroup>
                                    <FormGroup label="Rent Per Day (LKR)" icon={Calendar}>
                                        <input
                                            type="number"
                                            required
                                            className="ek-input-modern pl-10 font-bold text-[#0f0f0f]"
                                            value={formData.rentPerDay}
                                            onChange={(e) => setFormData({ ...formData, rentPerDay: e.target.value })}
                                        />
                                    </FormGroup>
                                    <FormGroup label="Rent Per Month (LKR)" icon={Info}>
                                        <input
                                            type="number"
                                            required
                                            className="ek-input-modern pl-10"
                                            value={formData.rentPerMonth}
                                            onChange={(e) => setFormData({ ...formData, rentPerMonth: e.target.value })}
                                        />
                                    </FormGroup>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Kilometer & Period Limits</h4>
                                <div className="grid grid-cols-1 gap-4">
                                    <FormGroup label="Max KMs Per Day" icon={Gauge}>
                                        <input
                                            type="number"
                                            required
                                            className="ek-input-modern pl-10"
                                            value={formData.maxMileagePerDay}
                                            onChange={(e) => setFormData({ ...formData, maxMileagePerDay: e.target.value })}
                                        />
                                    </FormGroup>
                                    <FormGroup label="Extra KM Charge (LKR)" icon={Coins}>
                                        <input
                                            type="number"
                                            required
                                            className="ek-input-modern pl-10"
                                            value={formData.extraMileageCharge}
                                            onChange={(e) => setFormData({ ...formData, extraMileageCharge: e.target.value })}
                                        />
                                    </FormGroup>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormGroup label="Min Days">
                                            <input
                                                type="number"
                                                required
                                                className="ek-input-modern"
                                                value={formData.minRentalPeriod}
                                                onChange={(e) => setFormData({ ...formData, minRentalPeriod: parseInt(e.target.value) })}
                                            />
                                        </FormGroup>
                                        <FormGroup label="Max Days">
                                            <input
                                                type="number"
                                                required
                                                className="ek-input-modern"
                                                value={formData.maxRentalPeriod}
                                                onChange={(e) => setFormData({ ...formData, maxRentalPeriod: parseInt(e.target.value) })}
                                            />
                                        </FormGroup>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Visuals & Actions (4/12) */}
                <div className="lg:col-span-4 space-y-10">

                    {/* Media Upload */}
                    <div className="rounded-[2.5rem] bg-white p-8 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-1.5 w-6 bg-amber-400 rounded-full" />
                            <h3 className="text-xl font-black text-gray-900 tracking-tight">Vehicle Media</h3>
                        </div>

                        {formData.image ? (
                            <div className="group relative aspect-video w-full overflow-hidden rounded-[2rem] bg-gray-50 border border-gray-100 shadow-inner">
                                <img
                                    src={formData.image.startsWith('data:') ? formData.image : `data:image/jpeg;base64,${formData.image}`}
                                    alt="Vehicle preview"
                                    className="h-full w-full object-cover transition-transform group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, image: "" })}
                                        className="h-12 w-12 rounded-full bg-white text-rose-500 shadow-xl flex items-center justify-center active:scale-95 transition-all"
                                    >
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="relative group">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                                    onChange={handleImageUpload}
                                />
                                <div className="flex flex-col items-center justify-center rounded-[2.5rem] border-4 border-dashed border-gray-100 bg-gray-50 p-12 text-center transition-all group-hover:bg-white group-hover:border-yellow-400 group-hover:shadow-xl group-hover:shadow-yellow-500/10">
                                    <div className="rounded-3xl bg-white p-5 shadow-lg mb-6 group-hover:scale-110 transition-transform">
                                        <Upload className="h-8 w-8 text-gray-400 group-hover:text-yellow-500" />
                                    </div>
                                    <p className="text-sm font-black text-gray-900">Drop your photo here</p>
                                    <p className="mt-2 text-xs uppercase font-black text-gray-400 tracking-wider">High-Res PNG or JPG</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Operational Status */}
                    <div className="rounded-[2.5rem] bg-white p-8 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-1.5 w-6 bg-slate-400 rounded-full" />
                            <h3 className="text-xl font-black text-gray-900 tracking-tight">Fleet Status</h3>
                        </div>

                        <div className="space-y-4">
                            <StatusRadio
                                checked={formData.status === "AVAILABLE"}
                                value="AVAILABLE"
                                label="Operational"
                                description="Active and ready for rental"
                                color="bg-emerald-500"
                                onClick={(val) => setFormData({ ...formData, status: val })}
                            />
                            <StatusRadio
                                checked={formData.status === "MAINTENANCE"}
                                value="MAINTENANCE"
                                label="Maintenance"
                                description="Currently in workshop"
                                color="bg-amber-500"
                                onClick={(val) => setFormData({ ...formData, status: val })}
                            />
                            <StatusRadio
                                checked={formData.status === "UNAVAILABLE"}
                                value="UNAVAILABLE"
                                label="Grounded"
                                description="Permanently or temporarily out"
                                color="bg-rose-500"
                                onClick={(val) => setFormData({ ...formData, status: val })}
                            />
                        </div>
                    </div>

                    {/* Submission Actions */}
                    <div className="space-y-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-16 rounded-[2rem] bg-[#0f0f0f] text-white font-black text-sm uppercase tracking-widest shadow-2xl shadow-gray-200 transition-all hover:bg-[#262626] hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-3">
                                    <div className="h-5 w-5 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
                                    Syncing...
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2">
                                    <Save className="h-5 w-5" />
                                    {mode === "add" ? "Enroll Vehicle" : "Apply Changes"}
                                </div>
                            )}
                        </button>
                        <button
                            type="button"
                            disabled={loading}
                            onClick={() => router.push(redirectPath)}
                            className="w-full h-16 rounded-[2rem] border-2 border-gray-100 bg-white text-gray-400 font-bold text-sm uppercase tracking-widest transition-all hover:bg-gray-50 hover:text-gray-900 active:scale-95 disabled:opacity-50"
                        >
                            Abandon Changes
                        </button>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .ek-input-modern {
                    width: 100%;
                    height: 54px;
                    padding: 0 1.25rem;
                    background-color: #f9f9f9;
                    border: 2px solid #f1f1f1;
                    border-radius: 1rem;
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: #0f0f0f;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    outline: none;
                }
                .ek-input-modern:focus {
                    background-color: #ffffff;
                    border-color: #fbbf24;
                    box-shadow: 0 10px 15px -3px rgba(251, 191, 36, 0.1);
                }
                .ek-input-modern::placeholder {
                    color: #9ca3af;
                    font-weight: 500;
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
        <div className="space-y-2.5 relative">
            <label className="text-xs font-black tracking-[0.15em] text-gray-400 uppercase ml-1">
                {label}
            </label>
            <div className="relative">
                {Icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-gray-400">
                        <Icon className="h-4 w-4" />
                    </div>
                )}
                {children}
            </div>
        </div>
    );
}

interface StatusRadioProps {
    checked: boolean;
    value: string;
    label: string;
    description: string;
    color: string;
    onClick: (value: string) => void;
}

function StatusRadio({ checked, value, label, description, color, onClick }: StatusRadioProps) {
    return (
        <div
            onClick={() => onClick(value)}
            className={`cursor-pointer group flex items-start gap-4 p-5 rounded-3xl border transition-all duration-300 ${checked
                ? "bg-white border-transparent shadow-xl ring-2 ring-gray-100"
                : "bg-gray-50/50 border-gray-100 hover:bg-white"
                }`}
        >
            <div className={`mt-1.5 h-3 w-3 rounded-full flex-shrink-0 ${checked ? color : "bg-gray-200"}`} />
            <div className="flex-1">
                <p className={`text-sm font-black tracking-tight ${checked ? "text-gray-900" : "text-gray-400"}`}>{label}</p>
                <p className={`text-xs font-medium leading-none mt-1 ${checked ? "text-gray-500" : "text-gray-300"}`}>{description}</p>
            </div>
        </div>
    );
}
