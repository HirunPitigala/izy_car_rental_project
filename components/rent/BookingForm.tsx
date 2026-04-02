"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    ChevronRight,
    Loader2,
    Upload,
    Phone,
    ArrowLeft,
    Check,
    Briefcase,
    ShieldCheck,
    CheckCircle2,
    AlertCircle,
    User,
    Shield,
    ClipboardCheck,
    Car
} from "lucide-react";
import { createBooking } from "@/lib/actions/bookingActions";
import { getVehicleById } from "@/lib/actions/vehicleActions";
import { validateNIC, validateAddress } from "@/lib/validation";

interface BookingFormProps {
    searchParams: any;
    user: any;
}

export default function BookingForm({ searchParams, user }: BookingFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [error, setError] = useState<string | null>(null);
    const [vehicle, setVehicle] = useState<any>(null);

    // Form state
    const [formData, setFormData] = useState({
        fullName: user?.name || "",
        address: "",
        phoneNumber: user?.phone || "",
        licenseNumber: "",
        nicNo: "",

        guaranteeFullname: "",
        guaranteeAddress: "",
        guaranteePhone1: "",
        guaranteeNicNo: "",

        agreed: false
    });

    // File state
    const [files, setFiles] = useState<{
        license: File | null;
        idDocument: File | null;
        guaranteeNic: File | null;
        guaranteeLicense: File | null;
    }>({
        license: null,
        idDocument: null,
        guaranteeNic: null,
        guaranteeLicense: null
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: keyof typeof files) => {
        if (e.target.files && e.target.files[0]) {
            setFiles(prev => ({ ...prev, [type]: e.target.files![0] }));
        }
    };

    useEffect(() => {
        const fetchVehicle = async () => {
            if (searchParams.vehicleId) {
                const result = await getVehicleById(parseInt(searchParams.vehicleId));
                if (result.success) {
                    setVehicle(result.data);
                }
            }
        };
        fetchVehicle();
    }, [searchParams.vehicleId]);

    const hirerAddressValidation = validateAddress(formData.address);
    const guaranteeAddressValidation = validateAddress(formData.guaranteeAddress);

    const nextStep = () => {
        if (step === 1) {
            if (formData.nicNo) {
                const nicResult = validateNIC(formData.nicNo);
                if (!nicResult.valid) {
                    setError(`Hirer NIC: ${nicResult.error}`);
                    return;
                }
            }
            if (!hirerAddressValidation.valid) {
                setError(`Hirer Address: ${hirerAddressValidation.error}`);
                return;
            }
        }
        if (step === 2) {
            if (formData.guaranteeNicNo) {
                const gNicResult = validateNIC(formData.guaranteeNicNo);
                if (!gNicResult.valid) {
                    setError(`Guarantor NIC: ${gNicResult.error}`);
                    return;
                }
            }
            if (!guaranteeAddressValidation.valid) {
                setError(`Guarantor Address: ${guaranteeAddressValidation.error}`);
                return;
            }
        }
        setError(null);
        setStep(prev => prev + 1);
        window.scrollTo(0, 0);
    };

    const prevStep = () => {
        setStep(prev => prev - 1);
        window.scrollTo(0, 0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.agreed) return;

        setLoading(true);
        setError(null);

        try {
            const data = new FormData();
            // Basic details
            data.append("vehicleId", searchParams.vehicleId);
            data.append("serviceCategoryId", "1"); // Assuming 1 is Rent a Car, should ideally fetch
            data.append("rental_date", `${searchParams.rental_start_date} ${searchParams.rental_start_time || "08:00"}:00`);
            data.append("return_date", `${searchParams.rental_end_date} ${searchParams.rental_end_time || "18:00"}:00`);
            data.append("totalPrice", searchParams.totalPrice);

            // Customer
            data.append("customerFullName", formData.fullName);
            data.append("customerPhone1", formData.phoneNumber);
            data.append("customerLicenseNo", formData.licenseNumber);
            data.append("customerNicNo", formData.nicNo);

            // Guarantee
            data.append("guaranteeFullname", formData.guaranteeFullname);
            data.append("guaranteeAddress", formData.guaranteeAddress);
            data.append("guaranteePhone1", formData.guaranteePhone1);
            data.append("guaranteeNicNo", formData.guaranteeNicNo);

            // Files
            if (files.license) data.append("customerLicensePdf", files.license);
            if (files.idDocument) data.append("customerIdPdf", files.idDocument);
            if (files.guaranteeNic) data.append("guaranteeNicPdf", files.guaranteeNic);
            if (files.guaranteeLicense) data.append("guaranteeLicensePdf", files.guaranteeLicense);

            const result = await createBooking(data);

            if (result.success) {
                router.push(`/rent/status?bookingId=NEW&${new URLSearchParams(searchParams).toString()}`);
            } else {
                setError(result.error || "Submission failed");
            }
        } catch (err) {
            console.error(err);
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const renderStepIndicator = () => (
        <div className="flex items-center justify-between max-w-2xl mx-auto mb-20 relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-px bg-gray-100 -z-10" />
            {[
                { n: 1, label: "Customer", icon: User },
                { n: 2, label: "Guarantee", icon: Shield },
                { n: 3, label: "Terms", icon: ClipboardCheck },
                { n: 4, label: "Overview", icon: CheckCircle2 }
            ].map((s) => (
                <div key={s.n} className="flex flex-col items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border ${step >= s.n
                        ? "bg-[#0f0f0f] text-white border-[#0f0f0f] shadow-xl shadow-gray-200"
                        : "bg-white text-gray-300 border-gray-100"
                        }`}>
                        {step > s.n ? <Check className="w-6 h-6" /> : <s.icon className="w-5 h-5" />}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${step >= s.n ? "text-[#0f0f0f]" : "text-gray-300"
                        }`}>{s.label}</span>
                </div>
            ))}
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto bg-white min-h-[90vh] pb-20 pt-10">
            {/* Header */}
            <header className="flex justify-between items-center mb-16">
                <button
                    onClick={() => step === 1 ? router.back() : prevStep()}
                    className="flex items-center gap-3 text-gray-400 hover:text-[#0f0f0f] transition-all text-[10px] font-black uppercase tracking-widest group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    {step === 1 ? "Cancel" : "Back"}
                </button>
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
                        <Phone className="w-5 h-5" />
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Help Line</p>
                        <p className="text-sm font-black text-[#0f0f0f] tracking-tight">+94 77 308 4563</p>
                    </div>
                </div>
            </header>

            {renderStepIndicator()}

            {error && (
                <div className="mb-10 p-6 bg-red-50 border border-red-100 rounded-3xl flex items-center gap-4 text-red-600">
                    <AlertCircle className="w-6 h-6 flex-shrink-0" />
                    <p className="text-sm font-bold uppercase tracking-wide">{error}</p>
                </div>
            )}

            {step === 1 && (
                /* Step 1: Customer Details */
                <form onSubmit={(e) => { e.preventDefault(); nextStep(); }} className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="space-y-10">
                        <div className="flex items-center gap-4 mb-4">
                            <h2 className="text-2xl font-black text-[#0f0f0f] uppercase tracking-tight">Hirer Information</h2>
                            <div className="h-px flex-1 bg-gray-100" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Legal Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full h-16 bg-gray-50 border border-gray-100 rounded-2xl px-6 outline-none focus:border-red-600 focus:bg-white transition-all font-bold text-[#0f0f0f] placeholder:text-gray-300"
                                    value={formData.fullName}
                                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                    placeholder="Enter full name"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Permanent Address</label>
                                <input
                                    type="text"
                                    required
                                    className={`w-full h-16 bg-gray-50 border rounded-2xl px-6 outline-none focus:bg-white transition-all font-bold text-[#0f0f0f] placeholder:text-gray-300 ${formData.address && !hirerAddressValidation.valid ? "border-red-400 focus:border-red-600" : "border-gray-100 focus:border-red-600"}`}
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    placeholder="Current residential address"
                                />
                                {formData.address && !hirerAddressValidation.valid && (
                                    <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mt-2 ml-1">{hirerAddressValidation.error}</p>
                                )}
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contact Number</label>
                                <input
                                    type="tel"
                                    required
                                    className="w-full h-16 bg-gray-50 border border-gray-100 rounded-2xl px-6 outline-none focus:border-red-600 focus:bg-white transition-all font-bold text-[#0f0f0f] placeholder:text-gray-300"
                                    value={formData.phoneNumber}
                                    onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    placeholder="+94 XX XXX XXXX"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">NIC / ID Card Number</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full h-16 bg-gray-50 border border-gray-100 rounded-2xl px-6 outline-none focus:border-red-600 focus:bg-white transition-all font-bold text-[#0f0f0f] placeholder:text-gray-300"
                                    value={formData.nicNo}
                                    onChange={e => setFormData({ ...formData, nicNo: e.target.value })}
                                    placeholder="XXXXXXXV or 20XXXXXXXXXX"
                                />
                                {formData.nicNo && !validateNIC(formData.nicNo).valid && (
                                    <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mt-2 ml-1">{validateNIC(formData.nicNo).error}</p>
                                )}
                            </div>
                            <div className="space-y-3 md:col-span-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Driving License Number</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full h-16 bg-gray-50 border border-gray-100 rounded-2xl px-6 outline-none focus:border-red-600 focus:bg-white transition-all font-bold text-[#0f0f0f] placeholder:text-gray-300"
                                    value={formData.licenseNumber}
                                    onChange={e => setFormData({ ...formData, licenseNumber: e.target.value })}
                                    placeholder="Enter license number"
                                />
                            </div>
                        </div>

                        {/* Document Upload */}
                        <div className="pt-6 space-y-8">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Required Verification Documents</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">1. ID Document (PDF/Image)</label>
                                    <label className="block border-2 border-dashed border-gray-100 rounded-[2.5rem] p-8 text-center hover:border-red-600 hover:bg-gray-50 transition-all cursor-pointer group">
                                        <input type="file" className="hidden" onChange={e => handleFileChange(e, "idDocument")} accept=".pdf,.png,.jpg,.jpeg" required />
                                        <div className="flex flex-col items-center gap-4">
                                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${files.idDocument ? "bg-green-50 text-green-600" : "bg-gray-50 text-gray-400 group-hover:scale-110"}`}>
                                                {files.idDocument ? <Check className="w-8 h-8" /> : <Upload className="w-8 h-8" />}
                                            </div>
                                            <p className="font-black text-[#0f0f0f] uppercase tracking-widest text-[10px]">
                                                {files.idDocument ? files.idDocument.name : "Upload ID"}
                                            </p>
                                        </div>
                                    </label>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">2. Driving License (PDF/Image)</label>
                                    <label className="block border-2 border-dashed border-gray-100 rounded-[2.5rem] p-8 text-center hover:border-red-600 hover:bg-gray-50 transition-all cursor-pointer group">
                                        <input type="file" className="hidden" onChange={e => handleFileChange(e, "license")} accept=".pdf,.png,.jpg,.jpeg" required />
                                        <div className="flex flex-col items-center gap-4">
                                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${files.license ? "bg-green-50 text-green-600" : "bg-gray-50 text-gray-400 group-hover:scale-110"}`}>
                                                {files.license ? <Check className="w-8 h-8" /> : <Upload className="w-8 h-8" />}
                                            </div>
                                            <p className="font-black text-[#0f0f0f] uppercase tracking-widest text-[10px]">
                                                {files.license ? files.license.name : "Upload License"}
                                            </p>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-10 flex justify-end">
                        <button
                            type="submit"
                            className="px-16 h-16 bg-[#0f0f0f] hover:bg-red-600 text-white font-black rounded-2xl shadow-xl shadow-gray-200 transition-all active:scale-95 text-xs uppercase tracking-[0.2em] flex items-center gap-4 group"
                        >
                            Continue
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </form>
            )}

            {step === 2 && (
                /* Step 2: Guarantee Details */
                <form onSubmit={(e) => { e.preventDefault(); nextStep(); }} className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="space-y-10">
                        <div className="flex items-center gap-4 mb-4">
                            <h2 className="text-2xl font-black text-[#0f0f0f] uppercase tracking-tight">Guarantor Information</h2>
                            <div className="h-px flex-1 bg-gray-100" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Guarantor Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full h-16 bg-gray-50 border border-gray-100 rounded-2xl px-6 outline-none focus:border-red-600 focus:bg-white transition-all font-bold text-[#0f0f0f] placeholder:text-gray-300"
                                    value={formData.guaranteeFullname}
                                    onChange={e => setFormData({ ...formData, guaranteeFullname: e.target.value })}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Guarantor Phone</label>
                                <input
                                    type="tel"
                                    required
                                    className="w-full h-16 bg-gray-50 border border-gray-100 rounded-2xl px-6 outline-none focus:border-red-600 focus:bg-white transition-all font-bold text-[#0f0f0f] placeholder:text-gray-300"
                                    value={formData.guaranteePhone1}
                                    onChange={e => setFormData({ ...formData, guaranteePhone1: e.target.value })}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">NIC Number</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full h-16 bg-gray-50 border border-gray-100 rounded-2xl px-6 outline-none focus:border-red-600 focus:bg-white transition-all font-bold text-[#0f0f0f] placeholder:text-gray-300"
                                    value={formData.guaranteeNicNo}
                                    onChange={e => setFormData({ ...formData, guaranteeNicNo: e.target.value })}
                                />
                                {formData.guaranteeNicNo && !validateNIC(formData.guaranteeNicNo).valid && (
                                    <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mt-2 ml-1">{validateNIC(formData.guaranteeNicNo).error}</p>
                                )}
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Guarantee Address</label>
                                <input
                                    type="text"
                                    required
                                    className={`w-full h-16 bg-gray-50 border rounded-2xl px-6 outline-none focus:bg-white transition-all font-bold text-[#0f0f0f] placeholder:text-gray-300 ${formData.guaranteeAddress && !guaranteeAddressValidation.valid ? "border-red-400 focus:border-red-600" : "border-gray-100 focus:border-red-600"}`}
                                    value={formData.guaranteeAddress}
                                    onChange={e => setFormData({ ...formData, guaranteeAddress: e.target.value })}
                                    placeholder="Enter guarantor's address"
                                />
                                {formData.guaranteeAddress && !guaranteeAddressValidation.valid && (
                                    <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mt-2 ml-1">{guaranteeAddressValidation.error}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                            <label className="block border-2 border-dashed border-gray-100 rounded-[2.5rem] p-10 text-center hover:border-red-600 hover:bg-gray-50 transition-all cursor-pointer group">
                                <input type="file" className="hidden" onChange={e => handleFileChange(e, "guaranteeNic")} />
                                <div className="flex flex-col items-center gap-3">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${files.guaranteeNic ? "bg-green-50 text-green-600" : "bg-gray-50 text-gray-400"}`}>
                                        <Upload className="w-6 h-6" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest">
                                        {files.guaranteeNic ? "Guarantor NIC Saved" : "Guarantor NIC Copy"}
                                    </p>
                                </div>
                            </label>
                            <label className="block border-2 border-dashed border-gray-100 rounded-[2.5rem] p-10 text-center hover:border-red-600 hover:bg-gray-50 transition-all cursor-pointer group">
                                <input type="file" className="hidden" onChange={e => handleFileChange(e, "guaranteeLicense")} />
                                <div className="flex flex-col items-center gap-3">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${files.guaranteeLicense ? "bg-green-50 text-green-600" : "bg-gray-50 text-gray-400"}`}>
                                        <Upload className="w-6 h-6" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest">
                                        {files.guaranteeLicense ? "License Saved" : "Guarantor License"}
                                    </p>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="pt-10 flex justify-end">
                        <button
                            type="submit"
                            className="px-16 h-16 bg-[#0f0f0f] hover:bg-red-600 text-white font-black rounded-2xl shadow-xl shadow-gray-200 transition-all active:scale-95 text-xs uppercase tracking-[0.2em] flex items-center gap-4 group"
                        >
                            Next Step
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </form>
            )}

            {step === 3 && (
                /* Step 3: Terms */
                <form onSubmit={(e) => { e.preventDefault(); nextStep(); }} className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="space-y-10">
                        <div className="flex items-center gap-4 mb-4">
                            <h2 className="text-2xl font-black text-[#0f0f0f] uppercase tracking-tight">Rental Agreement Terms</h2>
                            <div className="h-px flex-1 bg-gray-100" />
                        </div>

                        <div className="bg-gray-50 p-8 md:p-12 rounded-[2.5rem] border border-gray-100 h-[400px] overflow-y-auto custom-scrollbar text-sm font-medium text-gray-600 leading-relaxed space-y-6">
                            <div className="space-y-4">
                                <p className="font-bold text-[#0f0f0f]">Rental Conditions:</p>
                                <div className="bg-white p-6 rounded-2xl border border-gray-200">
                                    <p className="text-gray-900 font-bold mb-2">Maximum running distance per day: {vehicle?.maxMileagePerDay || "100"} km.</p>
                                    <p className="text-gray-900 font-bold mb-2">For each additional kilometer, Rs. {Number(vehicle?.extraMileageCharge || 0).toLocaleString()} will be charged.</p>
                                    <p className="text-gray-900 font-bold">If the vehicle is not returned at the scheduled time, Rs. {Number(vehicle?.rentPerHour || 0).toLocaleString()} per starting hour will be charged.</p>
                                </div>
                            </div>

                            <p>It is completely forbidden to drive the vehicle while in possession of any illegal drugs prohibited under the Poisons, Opium, and Dangerous Drugs (Amendment) Act No. 13 of 1984, or while under the influence of any type of drug.</p>
                            <p>If the vehicle is involved in an accident, you must immediately notify the nearest police station, the relevant insurance company, and our company.</p>
                            <p>If the insurance claim is rejected due to a mistake or negligence on the part of the lessee, the lessee must pay all the money required to cover the damage.</p>
                            <div className="space-y-2">
                                <p>If the vehicle is involved in a sudden accident, and the garage presents the cost to repair the damage:</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>If the amount is less than Rs. 100,000, the lessee must bear the full cost.</li>
                                    <li>If the amount is more than Rs. 100,000, the insurance company will cover the cost, but the lessee must pay all amounts deducted by the insurance company.</li>
                                </ul>
                            </div>
                            <p>The lessee must pay for the repair costs of any accident as mentioned in section 15. The lessee must also pay the agreed-upon rental fee for the number of days the vehicle is in the garage for repairs. In the event of an accident, all repairs must be done at a garage designated by the lessor, and the lessee must bear the cost of transporting the vehicle to that location.</p>
                            <p>If the vehicle causes an accident or other incident resulting in bodily injury, death, or damage to any party or person, the lessee must notify the lessor in writing. The lessee must also pay and settle all legitimate claims arising from the incident and keep the lessor free and exempt from such claims. The lessor is not obligated to pay such claims.</p>
                            <p>The vehicle under this agreement should not be pledged as collateral for a loan or transferred to another party.</p>
                            <p>The lessee must maintain and use the vehicle in a manner suitable for driving. The lessee must bear all losses caused by careless driving and improper maintenance.</p>
                            <p>If the vehicle requires repairs or new parts, IZU Rent A Car & Tours must be notified.</p>
                            <p>The vehicle should only be used to transport passengers (up to the permitted amount).</p>
                            <p>Vehicles rented from IZU Rent A Car & Tours must be returned between 8:00 AM and 6:00 PM.</p>
                            <p>If you need to keep the vehicle for more than the agreed-upon number of days, notify the lessor two days in advance. Failure to return without notice will be treated as vehicle theft and reported to police island-wide until returned.</p>
                            <p>The vehicle must be returned at the agreed time and mileage. Additional charges for extra kilometers and hours will apply as per section 10.</p>
                            <p className="font-bold text-[#0f0f0f]">"By signing below, I, the lessee, agree to all the terms and conditions from section 12 to 24. I have read and understood them thoroughly."</p>
                        </div>

                        <div className="flex flex-col items-center gap-8 pt-6">
                            <label className="flex items-center gap-4 cursor-pointer group">
                                <div className="relative w-8 h-8">
                                    <input
                                        type="checkbox"
                                        required
                                        className="w-8 h-8 appearance-none border-2 border-gray-200 rounded-xl checked:bg-red-600 checked:border-red-600 transition-all"
                                        checked={formData.agreed}
                                        onChange={e => setFormData({ ...formData, agreed: e.target.checked })}
                                    />
                                    {formData.agreed && <Check className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white w-5 h-5" />}
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-[#0f0f0f] transition-colors">I accept all rental terms and conditions</span>
                            </label>

                            <div className="w-full max-w-md bg-gray-50 rounded-[2rem] p-8 border-b-4 border-gray-200 relative overflow-hidden group">
                                <div className="text-center py-4">
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-2">Digital Signature</p>
                                    <p className="font-serif italic text-3xl text-red-600/50 select-none">
                                        {formData.fullName || "Your Full Name"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-10 flex justify-end">
                        <button
                            type="submit"
                            disabled={!formData.agreed}
                            className="px-16 h-16 bg-[#0f0f0f] hover:bg-red-600 text-white font-black rounded-2xl shadow-xl shadow-gray-200 transition-all active:scale-95 text-xs uppercase tracking-[0.2em] flex items-center gap-4 group disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            Final Review
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </form>
            )}

            {step === 4 && (
                /* Step 4: Overview */
                <form onSubmit={handleSubmit} className="space-y-12 animate-in fade-in zoom-in-95 duration-500">
                    <div className="space-y-10">
                        <div className="flex items-center gap-4 mb-4">
                            <h2 className="text-2xl font-black text-[#0f0f0f] uppercase tracking-tight">Booking Overview</h2>
                            <div className="h-px flex-1 bg-gray-100" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Customer Details</p>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Name</span>
                                        <span className="text-sm font-black text-[#0f0f0f]">{formData.fullName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone</span>
                                        <span className="text-sm font-black text-[#0f0f0f]">{formData.phoneNumber}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">NIC No</span>
                                        <span className="text-sm font-black text-[#0f0f0f]">{formData.nicNo}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Guarantor Details</p>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Name</span>
                                        <span className="text-sm font-black text-[#0f0f0f]">{formData.guaranteeFullname}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone</span>
                                        <span className="text-sm font-black text-[#0f0f0f]">{formData.guaranteePhone1}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">NIC No</span>
                                        <span className="text-sm font-black text-[#0f0f0f]">{formData.guaranteeNicNo}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-2 bg-[#0f0f0f] p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                                <Car className="absolute -right-10 -bottom-10 w-64 h-64 text-white/5" />
                                <div className="flex justify-between items-center relative z-10">
                                    <div>
                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-2">Total Estimated Rent</p>
                                        <h3 className="text-4xl font-black text-white">LKR {Number(searchParams.totalPrice).toLocaleString()}</h3>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Duration</p>
                                        <p className="text-xl font-black text-white">{searchParams.rental_start_date} - {searchParams.rental_end_date}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-red-50 p-8 rounded-[2rem] border border-red-100 flex items-start gap-5">
                            <ShieldCheck className="w-8 h-8 text-red-600 flex-shrink-0" />
                            <div>
                                <h4 className="font-black text-[#0f0f0f] uppercase tracking-tight text-sm mb-1">Final Authorization</h4>
                                <p className="text-xs font-bold text-gray-500 leading-relaxed uppercase tracking-widest">
                                    By clicking below, you authorize IZ Rent-A-Car to verify your documents and create a pending reservation. You will be notified via phone upon approval.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-10">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-24 bg-[#0f0f0f] hover:bg-red-600 text-white font-black rounded-[2rem] shadow-2xl shadow-gray-200 transition-all active:scale-[0.98] text-xl uppercase tracking-[0.2em] flex items-center justify-center gap-6 disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-8 h-8 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    Confirm & Reserve
                                    <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
