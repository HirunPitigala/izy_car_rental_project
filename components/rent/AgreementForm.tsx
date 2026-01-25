"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    ChevronRight,
    Loader2,
    Upload,
    Phone,
    ArrowLeft,
    Check
} from "lucide-react";

export default function AgreementForm({ searchParams, user }: { searchParams: any, user: any }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    // Form state
    const [formData, setFormData] = useState({
        fullName: user?.name || "",
        address: "",
        phoneNumber: "",
        licenseNumber: "",
        nicNo: "",
        agreed: false
    });

    const [isSigned, setIsSigned] = useState(false);

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(2);
        window.scrollTo(0, 0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.agreed) return;

        setLoading(true);
        try {
            // Simulation of submitting agreement and document processing
            await new Promise(resolve => setTimeout(resolve, 2500));

            const params = new URLSearchParams(searchParams);
            router.push(`/rent/status?${params.toString()}`);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white min-h-[90vh] pb-20">
            {/* Agreement Header */}
            <header className="flex justify-between items-center mb-16 pt-6">
                <div className="flex items-center gap-4">
                    {step === 1 && (
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-1 text-gray-400 hover:text-gray-900 transition-colors text-sm font-medium"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </button>
                    )}
                    <div className="relative w-24 h-12">
                        <Image
                            src="/logo.png"
                            alt="IZI Car Rental"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white">
                        <Phone className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Contact us</p>
                        <p className="text-sm font-black text-gray-900">+94 77 308 4563</p>
                    </div>
                </div>
            </header>

            {step === 1 ? (
                /* Step 1: Customer Details */
                <form onSubmit={handleNext} className="space-y-12">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-2">Motor Vehicle Lease Agreement</h1>
                    </div>

                    <div className="space-y-8 max-w-2xl mx-auto">
                        <h2 className="text-xl font-bold text-gray-900">Customer Details</h2>

                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-600">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full h-12 border border-gray-200 rounded-xl px-4 outline-none focus:border-orange-500 transition-all font-medium text-gray-800"
                                    value={formData.fullName}
                                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-600">Address</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full h-12 border border-gray-200 rounded-xl px-4 outline-none focus:border-orange-500 transition-all font-medium text-gray-800"
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-600">Phone Number</label>
                                <input
                                    type="tel"
                                    required
                                    className="w-full h-12 border border-gray-200 rounded-xl px-4 outline-none focus:border-orange-500 transition-all font-medium text-gray-800"
                                    value={formData.phoneNumber}
                                    onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-600">Driving License Number</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full h-12 border border-gray-200 rounded-xl px-4 outline-none focus:border-orange-500 transition-all font-medium text-gray-800"
                                    value={formData.licenseNumber}
                                    onChange={e => setFormData({ ...formData, licenseNumber: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-600">NIC No</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full h-12 border border-gray-200 rounded-xl px-4 outline-none focus:border-orange-500 transition-all font-medium text-gray-800"
                                    value={formData.nicNo}
                                    onChange={e => setFormData({ ...formData, nicNo: e.target.value })}
                                />
                            </div>

                            {/* Document Upload */}
                            <div className="pt-4 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                                        <Upload className="w-4 h-4" />
                                    </div>
                                    <p className="text-xs font-bold text-gray-600">Upload Driving License & ID copy</p>
                                </div>

                                <div className="border-2 border-dashed border-gray-200 rounded-[32px] p-12 text-center hover:bg-gray-50 transition-colors cursor-pointer group">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform">
                                            <Upload className="w-8 h-8" />
                                        </div>
                                        <button type="button" className="px-6 py-2 bg-gray-100 rounded-full text-xs font-bold text-gray-600 hover:bg-gray-200 transition-colors">Browse File</button>
                                        <p className="text-xs font-bold text-gray-400">Choose a file or drag & drop it here</p>
                                        <p className="text-[10px] font-medium text-gray-300 uppercase tracking-widest leading-none">JPEG, PNG, PDF, and MP4 formats, up to 50MB</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-10 flex justify-end">
                            <button
                                type="submit"
                                className="px-16 h-14 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-xl shadow-lg shadow-orange-100 transition-all active:scale-95 text-lg"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </form>
            ) : (
                /* Step 2: Terms and Conditions */
                <form onSubmit={handleSubmit} className="space-y-12">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight leading-none uppercase">Terms and conditions</h1>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-10">
                        {/* Scrollable Terms Content */}
                        <div className="bg-gray-50/30 rounded-[40px] p-8 md:p-12 text-gray-900/80 prose prose-sm max-w-none font-medium leading-[1.8]">
                            <p>It is completely forbidden to drive the vehicle while in possession of any illegal drugs prohibited under the Poisons, Opium, and Dangerous Drugs (Amendment) Act No. 13 of 1984, or while under the influence of any type of drug.</p>
                            <p>If the vehicle is involved in an accident, you must immediately notify the nearest police station, the relevant insurance company, and our company.</p>
                            <p>If the insurance claim is rejected due to a mistake or negligence on the part of the lessee, the lessee must pay all the money required to cover the damage.</p>
                            <p>If the vehicle is involved in a sudden accident, and the garage presents the cost to repair the damage:
                                If the amount is less than Rs. 100,000, the lessee must bear the full cost.
                                If the amount is more than Rs. 100,000, the insurance company will cover the cost, but the lessee must pay all amounts deducted by the insurance company.</p>
                            <p>The lessee must pay for the repair costs of any accident as mentioned in section 15. The lessee must also pay the agreed-upon rental fee for the number of days the vehicle is in the garage for repairs. In the event of an accident, all repairs must be done at a garage designated by the lessor, and the lessee must bear the cost of transporting the vehicle to that location.</p>
                            <p>If the vehicle causes an accident or other incident resulting in bodily injury, death, or damage to any party or person, the lessee must notify the lessor in writing. The lessee must also pay and settle all legitimate claims arising from the incident and keep the lessor free and exempt from such claims. The lessor is not obligated to pay such claims.</p>
                            <p>The vehicle under this agreement should not be pledged as collateral for a loan or transferred to another party.</p>
                            <p>The lessee must maintain and use the vehicle in a manner suitable for driving. The lessee must bear all losses caused by careless driving and improper maintenance.</p>
                            <p>If the vehicle requires repairs or new parts, IZU Rent A Car & Tours must be notified.</p>
                            <p>The vehicle should only be used to transport passengers (up to the permitted amount).</p>
                            <p>It is important to note that vehicles rented from IZU Rent A Car & Tours must be returned between 8:00 AM and 6:00 PM.</p>
                            <p>If you need to keep the vehicle for more than the agreed-upon number of days, you must notify the lessor two days in advance. If the vehicle is not returned on time without prior notification, it will be considered stolen. A photo and personal details of the individual will be shared with the police island-wide, and this will continue until the vehicle is returned.</p>
                            <p>The vehicle must be returned at the agreed time and with the agreed-upon mileage on the date of return. Additional charges for extra kilometers and hours will be applied as per section 10.</p>
                        </div>

                        <div className="space-y-8 max-w-2xl mx-auto">
                            <p className="text-sm font-bold text-center text-gray-500 leading-relaxed">By signing below, I, the lessee, agree to all the terms and conditions from section 12 to 24. I have read and understood them thoroughly</p>

                            <div className="flex flex-col items-center gap-6">
                                <div className="relative flex items-center h-10 w-10">
                                    <input
                                        type="checkbox"
                                        id="agree"
                                        required
                                        className="w-10 h-10 rounded-xl border-gray-200 text-orange-500 focus:ring-orange-500 transition-all cursor-pointer"
                                        checked={formData.agreed}
                                        onChange={e => setFormData({ ...formData, agreed: e.target.checked })}
                                    />
                                    {formData.agreed && <Check className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white pointer-events-none w-6 h-6" />}
                                </div>

                                {/* Signature Pad Mock */}
                                <div className="w-full h-32 bg-gray-100 rounded-2xl flex flex-col items-center justify-center border-b-4 border-gray-300 relative overflow-hidden group cursor-crosshair">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:hidden">Sign here</p>
                                    <div className="hidden group-hover:block text-orange-400 font-serif italic text-4xl opacity-50 select-none">
                                        {formData.fullName || "Your Signature"}
                                    </div>
                                </div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Sign here</p>
                            </div>

                            <div className="pt-8">
                                <button
                                    type="submit"
                                    disabled={loading || !formData.agreed}
                                    className="w-full h-16 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-xl shadow-lg shadow-orange-100 transition-all active:scale-95 text-lg flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                            Requesting Vehicle...
                                        </>
                                    ) : (
                                        "Request a Vehicle"
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="w-full mt-4 text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors py-2"
                                >
                                    Go back and check details
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
}
