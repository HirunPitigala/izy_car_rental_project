"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    ChevronRight,
    Loader2,
    Upload,
    Phone,
    ArrowLeft,
    Check,
    ShieldCheck,
    CheckCircle2,
    AlertCircle,
    User,
    Shield,
    ClipboardCheck,
    Car,
    ChevronDown,
    XCircle,
} from "lucide-react";
import { createBooking } from "@/lib/actions/bookingActions";
import { getVehicleById } from "@/lib/actions/vehicleActions";
import { validateNIC, validateAddress } from "@/lib/validation";
import { uploadFileToCloudinary } from "@/lib/utils/cloudinaryClient";
import { unlockVehicle } from "@/lib/actions/lockActions";
import { Clock } from "lucide-react";

// ─── Country data ──────────────────────────────────────────────────────────────
interface Country {
    code: string;
    name: string;
    flag: string;
    dialCode: string;
    minLen: number;
    maxLen: number;
}

const COUNTRIES: Country[] = [
    { code: "LK", name: "Sri Lanka",    flag: "🇱🇰", dialCode: "+94",  minLen: 9,  maxLen: 9  },
    { code: "IN", name: "India",        flag: "🇮🇳", dialCode: "+91",  minLen: 10, maxLen: 10 },
    { code: "US", name: "United States",flag: "🇺🇸", dialCode: "+1",   minLen: 10, maxLen: 10 },
    { code: "GB", name: "United Kingdom",flag:"🇬🇧", dialCode: "+44",  minLen: 10, maxLen: 11 },
    { code: "AU", name: "Australia",    flag: "🇦🇺", dialCode: "+61",  minLen: 9,  maxLen: 9  },
    { code: "AE", name: "UAE",          flag: "🇦🇪", dialCode: "+971", minLen: 9,  maxLen: 9  },
    { code: "SG", name: "Singapore",    flag: "🇸🇬", dialCode: "+65",  minLen: 8,  maxLen: 8  },
    { code: "MY", name: "Malaysia",     flag: "🇲🇾", dialCode: "+60",  minLen: 9,  maxLen: 11 },
    { code: "PK", name: "Pakistan",     flag: "🇵🇰", dialCode: "+92",  minLen: 10, maxLen: 10 },
    { code: "BD", name: "Bangladesh",   flag: "🇧🇩", dialCode: "+880", minLen: 10, maxLen: 10 },
];

// ─── Phone Input component ─────────────────────────────────────────────────────
interface PhoneInputFieldProps {
    id: string;
    value: string;
    onChange: (fullNumber: string) => void;
    required?: boolean;
}

function PhoneInputField({ id, value, onChange, required }: PhoneInputFieldProps) {
    const [country, setCountry] = useState<Country>(COUNTRIES[0]);
    const [localNumber, setLocalNumber] = useState("");
    const [touched, setTouched] = useState(false);

    // Sync internal state → parent via full number string
    useEffect(() => {
        onChange(localNumber ? `${country.dialCode}${localNumber}` : "");
    }, [country, localNumber]);

    const isValid =
        localNumber.length >= country.minLen && localNumber.length <= country.maxLen;
    const showError = touched && localNumber.length > 0 && !isValid;
    const showSuccess = touched && localNumber.length > 0 && isValid;

    const borderClass = showError
        ? "border-red-400"
        : showSuccess
        ? "border-emerald-400"
        : "border-gray-200";

    return (
        <div className="space-y-1.5">
            <div className={`flex items-stretch border rounded-xl overflow-hidden bg-gray-50 transition-colors ${borderClass}`}>
                {/* Country select */}
                <div className="relative shrink-0">
                    <select
                        value={country.code}
                        onChange={e => {
                            const c = COUNTRIES.find(c => c.code === e.target.value)!;
                            setCountry(c);
                            setLocalNumber("");
                        }}
                        className="appearance-none h-full pl-3 pr-8 bg-transparent text-sm font-semibold text-gray-700 outline-none cursor-pointer border-r border-gray-200"
                        aria-label="Country code"
                    >
                        {COUNTRIES.map(c => (
                            <option key={c.code} value={c.code}>
                                {c.flag} {c.dialCode}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                </div>

                {/* Number input — no native `required` so browser doesn't block submit */}
                <input
                    id={id}
                    type="tel"
                    inputMode="numeric"
                    value={localNumber}
                    placeholder={`${country.minLen} digits`}
                    onChange={e => {
                        const digits = e.target.value.replace(/\D/g, "").slice(0, country.maxLen);
                        setLocalNumber(digits);
                    }}
                    onBlur={() => setTouched(true)}
                    className="flex-1 h-12 px-4 bg-transparent outline-none text-sm font-semibold text-gray-800 placeholder:text-gray-300"
                />

                {/* Status icon */}
                {touched && localNumber.length > 0 && (
                    <div className="flex items-center pr-3">
                        {isValid
                            ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            : <XCircle className="w-4 h-4 text-red-400" />
                        }
                    </div>
                )}
            </div>

            {/* Validation message */}
            {showError && (
                <p className="text-xs text-red-500 font-medium pl-1">
                    Enter {country.minLen}{country.minLen !== country.maxLen ? `–${country.maxLen}` : ""} digits for {country.name}
                </p>
            )}
        </div>
    );
}

// ─── License validation ────────────────────────────────────────────────────────
function validateLicense(value: string): { valid: boolean; error?: string } {
    if (!value) return { valid: false, error: "Driving license number is required" };
    const trimmed = value.trim();
    if (!/^[A-Za-z0-9]+$/.test(trimmed))
        return { valid: false, error: "Only letters and numbers are allowed" };
    if (trimmed.length < 5)
        return { valid: false, error: "License number is too short (min 5 characters)" };
    if (trimmed.length > 15)
        return { valid: false, error: "License number is too long (max 15 characters)" };
    return { valid: true };
}

// ─── Inline field component for consistent form rows ──────────────────────────
function FormField({
    label,
    children,
    hint,
}: {
    label: string;
    children: React.ReactNode;
    hint?: string;
}) {
    return (
        <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700 tracking-wide">
                {label}
            </label>
            {children}
            {hint && (
                <p className="text-[11px] text-gray-400 pl-0.5">{hint}</p>
            )}
        </div>
    );
}

// ─── Inline validation text ───────────────────────────────────────────────────
function FieldError({ message }: { message?: string }) {
    if (!message) return null;
    return <p className="text-xs text-red-500 font-medium pl-0.5 mt-1">{message}</p>;
}

function FieldSuccess({ message }: { message?: string }) {
    if (!message) return null;
    return <p className="text-xs text-emerald-600 font-medium pl-0.5 mt-1">{message}</p>;
}

// ─── Step indicator ───
const renderStepIndicatorChild = (step: number) => (
    <div className="flex items-center justify-between max-w-lg mx-auto mb-10 relative">
        <div className="absolute left-0 top-5 w-full h-px bg-gray-100 -z-10" />
        {STEPS.map(s => (
            <div key={s.n} className="flex flex-col items-center gap-2">
                <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 border text-sm ${
                        step >= s.n
                            ? "bg-gray-900 text-white border-gray-900"
                            : "bg-white text-gray-300 border-gray-200"
                    }`}
                >
                    {step > s.n ? <Check className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
                </div>
                <span
                    className={`text-[9px] font-bold uppercase tracking-widest ${
                        step >= s.n ? "text-gray-800" : "text-gray-300"
                    }`}
                >
                    {s.label}
                </span>
            </div>
        ))}
    </div>
);

// ─── Shared continue button ───
const ContinueButton = ({
    label = "Continue",
    disabled = false,
}: {
    label?: string;
    disabled?: boolean;
}) => (
    <button
        type="submit"
        disabled={disabled}
        className="inline-flex items-center gap-2 px-8 h-10 bg-gray-900 hover:bg-red-600 text-white font-semibold rounded-xl transition-all active:scale-95 text-sm disabled:opacity-40 disabled:cursor-not-allowed group"
    >
        {label}
        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
    </button>
);

// ─── File upload tile ───
const FileUploadTile = ({
    label,
    file,
    type,
    onFileChange,
}: {
    label: string;
    file: File | null;
    type: string;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>, type: any) => void;
}) => (
    <label className="block border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-gray-400 hover:bg-gray-50 transition-all cursor-pointer group">
        <input
            type="file"
            className="hidden"
            onChange={e => onFileChange(e, type)}
            accept=".pdf,.png,.jpg,.jpeg"
        />
        <div className="flex flex-col items-center gap-3">
            <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    file ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400 group-hover:scale-110"
                }`}
            >
                {file ? <Check className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
            </div>
            <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    {file ? file.name : label}
                </p>
                {!file && (
                    <p className="text-[10px] text-gray-400 mt-0.5">PDF, PNG, JPG</p>
                )}
            </div>
        </div>
    </label>
);

// ─── Section heading ───
const SectionHeading = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center gap-3 mb-6">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight">{children}</h2>
        <div className="h-px flex-1 bg-gray-100" />
    </div>
);

// ─── Shared input class ───────────────────────────────────────────────────────
function inputClass(error?: boolean, success?: boolean) {
    const base =
        "w-full h-12 bg-gray-50 border rounded-xl px-4 outline-none transition-all text-sm font-semibold text-gray-800 placeholder:text-gray-300 placeholder:font-normal";
    if (error) return `${base} border-red-400 focus:border-red-500`;
    if (success) return `${base} border-emerald-400 focus:border-emerald-500`;
    return `${base} border-gray-200 focus:border-gray-400 focus:bg-white`;
}

// ─── Step indicator ───────────────────────────────────────────────────────────
const STEPS = [
    { n: 1, label: "Customer", icon: User },
    { n: 2, label: "Guarantee", icon: Shield },
    { n: 3, label: "Terms", icon: ClipboardCheck },
    { n: 4, label: "Overview", icon: CheckCircle2 },
];

// ─── Date formatter ───────────────────────────────────────────────────────────
function formatDate(dateStr: string): string {
    if (!dateStr) return "—";
    const d = new Date(dateStr + "T00:00:00");
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function formatTime(timeStr: string): string {
    if (!timeStr) return "";
    const [h, m] = timeStr.split(":").map(Number);
    if (isNaN(h) || isNaN(m)) return timeStr;
    const ampm = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
}

// ─── Main component ───────────────────────────────────────────────────────────
interface BookingFormProps {
    searchParams: any;
    user: any;
}

export default function BookingForm({ searchParams, user }: BookingFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [step, setStep] = useState(1);
    const [error, setError] = useState<string | null>(null);
    const [vehicle, setVehicle] = useState<any>(null);
    
    // 10-minute countdown for vehicle lock
    const [timeLeft, setTimeLeft] = useState(600);

    useEffect(() => {
        if (timeLeft <= 0) {
            // Timer expired
            if (searchParams.vehicleId) {
                unlockVehicle(parseInt(searchParams.vehicleId)).finally(() => {
                    alert("Booking time expired. The vehicle is no longer locked.");
                    router.push(`/rent/results?${new URLSearchParams(searchParams).toString()}`);
                });
            }
            return;
        }

        const timerId = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft, searchParams, router]);

    // Format mm:ss
    const formatTimeLeft = () => {
        const m = Math.floor(timeLeft / 60);
        const s = timeLeft % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    // Form state — fullName always starts empty (no "New Customer" default)
    const [formData, setFormData] = useState({
        fullName: "",
        address: "",
        phoneNumber: "",
        licenseNumber: "",
        nicNo: "",

        guaranteeFullname: "",
        guaranteeAddress: "",
        guaranteePhone1: "",
        guaranteeNicNo: "",

        agreed: false,
    });

    // Touch tracking for inline validation
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const touch = (field: string) =>
        setTouched(prev => ({ ...prev, [field]: true }));

    // File state
    const [files, setFiles] = useState<{
        license: File | null;
        idDocument: File | null;
        guaranteeNic: File | null;
        guaranteeLicense: File | null;
        paymentslip: File | null;
    }>({
        license: null,
        idDocument: null,
        guaranteeNic: null,
        guaranteeLicense: null,
        paymentslip: null,
    });

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        type: keyof typeof files
    ) => {
        if (e.target.files && e.target.files[0]) {
            setFiles(prev => ({ ...prev, [type]: e.target.files![0] }));
        }
    };

    useEffect(() => {
        const fetchVehicle = async () => {
            if (searchParams.vehicleId) {
                const result = await getVehicleById(parseInt(searchParams.vehicleId));
                if (result.success) setVehicle(result.data);
            }
        };
        fetchVehicle();
    }, [searchParams.vehicleId]);

    // ── Derived validation ──
    const hirerAddressV = validateAddress(formData.address);
    const guaranteeAddressV = validateAddress(formData.guaranteeAddress);
    const nicV = formData.nicNo ? validateNIC(formData.nicNo) : null;
    const gNicV = formData.guaranteeNicNo ? validateNIC(formData.guaranteeNicNo) : null;
    const licenseV = formData.licenseNumber ? validateLicense(formData.licenseNumber) : null;

    // ── Navigation ──
    const nextStep = () => {
        if (step === 1) {
            // Required field checks
            if (!formData.fullName.trim()) { setError("Full legal name is required."); return; }
            if (!formData.address.trim()) { setError("Permanent address is required."); return; }
            if (!formData.phoneNumber) { setError("Contact number is required."); return; }
            if (!formData.nicNo.trim()) { setError("NIC number is required."); return; }
            if (!formData.licenseNumber.trim()) { setError("Driving license number is required."); return; }
            // Format validation
            if (nicV && !nicV.valid) { setError(`NIC: ${nicV.error}`); return; }
            if (licenseV && !licenseV.valid) { setError(`License: ${licenseV.error}`); return; }
            if (!hirerAddressV.valid) { setError(`Address: ${hirerAddressV.error}`); return; }
        }
        if (step === 2) {
            // Required field checks
            if (!formData.guaranteeFullname.trim()) { setError("Guarantor full name is required."); return; }
            if (!formData.guaranteeAddress.trim()) { setError("Guarantor address is required."); return; }
            if (!formData.guaranteePhone1) { setError("Guarantor contact number is required."); return; }
            if (!formData.guaranteeNicNo.trim()) { setError("Guarantor NIC number is required."); return; }
            // Format validation
            if (gNicV && !gNicV.valid) { setError(`Guarantor NIC: ${gNicV.error}`); return; }
            if (!guaranteeAddressV.valid) { setError(`Guarantor Address: ${guaranteeAddressV.error}`); return; }
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

        if (!files.paymentslip) {
            setError("Payment slip check: Please upload your bank payment slip to proceed.");
            setLoading(false);
            return;
        }

        try {
            setUploading(true);
            
            // 1. Upload files to Cloudinary from client-side
            const uploadPromises = [];
            const fileFields: string[] = [];

            if (files.license) {
                uploadPromises.push(uploadFileToCloudinary(files.license, "bookings/license"));
                fileFields.push("customerLicensePdf");
            }
            if (files.idDocument) {
                uploadPromises.push(uploadFileToCloudinary(files.idDocument, "bookings/id"));
                fileFields.push("customerIdPdf");
            }
            if (files.guaranteeNic) {
                uploadPromises.push(uploadFileToCloudinary(files.guaranteeNic, "bookings/guarantor-nic"));
                fileFields.push("guaranteeNicPdf");
            }
            if (files.guaranteeLicense) {
                uploadPromises.push(uploadFileToCloudinary(files.guaranteeLicense, "bookings/guarantor-license"));
                fileFields.push("guaranteeLicensePdf");
            }
            if (files.paymentslip) {
                uploadPromises.push(uploadFileToCloudinary(files.paymentslip, "bookings/paymentslip"));
                fileFields.push("paymentslip");
            }

            const urls = await Promise.all(uploadPromises);
            setUploading(false);

            // 2. Build FormData with URLs instead of Files
            const data = new FormData();
            data.append("vehicleId", searchParams.vehicleId);
            data.append("serviceCategoryId", "1");
            data.append(
                "rental_date",
                `${searchParams.rental_start_date} ${searchParams.rental_start_time || "08:00"}:00`
            );
            data.append(
                "return_date",
                `${searchParams.rental_end_date} ${searchParams.rental_end_time || "18:00"}:00`
            );
            data.append("totalPrice", searchParams.totalPrice);

            data.append("customerFullName", formData.fullName);
            data.append("customerAddress", formData.address);
            data.append("customerPhone1", formData.phoneNumber);
            data.append("customerLicenseNo", formData.licenseNumber);
            data.append("customerNicNo", formData.nicNo);

            data.append("guaranteeFullname", formData.guaranteeFullname);
            data.append("guaranteeAddress", formData.guaranteeAddress);
            data.append("guaranteePhone1", formData.guaranteePhone1);
            data.append("guaranteeNicNo", formData.guaranteeNicNo);

            // Append the uploaded URLs
            fileFields.forEach((field, index) => {
                data.append(field, urls[index]);
            });

            const result = await createBooking(data);

            if (result.success) {
                router.push(
                    `/rent/status?bookingId=${result.bookingId}&${new URLSearchParams(searchParams).toString()}`
                );
            } else {
                setError(result.error || "Submission failed");
            }
        } catch (err) {
            console.error(err);
            setError("An unexpected error occurred during document upload. Please try again.");
            setUploading(false);
        } finally {
            setLoading(false);
        }
    };

    // ── Step indicator ──
    const renderStepIndicator = () => renderStepIndicatorChild(step);

    return (
        <div className="max-w-3xl mx-auto bg-white min-h-[90vh] pb-16 pt-8">
            {/* Header */}
            <header className="flex justify-between items-center mb-8">
                <button
                    onClick={() => (step === 1 ? router.back() : prevStep())}
                    className="flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-all text-xs font-semibold uppercase tracking-widest group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    {step === 1 ? "Cancel" : "Back"}
                </button>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center text-red-600">
                        <Phone className="w-4 h-4" />
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-0.5">
                            Help Line
                        </p>
                        <p className="text-sm font-bold text-gray-900">+94 77 308 4563</p>
                    </div>
                </div>
            </header>

            {/* Timer Banner */}
            <div className="mb-6 flex items-center justify-center gap-2 bg-red-50 border border-red-100 py-2 px-4 rounded-full max-w-max mx-auto shadow-sm">
                <Clock className="w-4 h-4 text-red-600 animate-pulse" />
                <span className="text-xs font-bold text-red-700">
                    Vehicle held for <span className="font-mono text-sm tracking-widest">{formatTimeLeft()}</span>
                </span>
            </div>

            {renderStepIndicator()}

            {/* Error banner */}
            {error && (
                <div className="mb-5 px-4 py-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <p className="text-xs font-semibold">{error}</p>
                </div>
            )}

            {/* ── STEP 1: Customer Details ── */}
            {step === 1 && (
                <form
                    onSubmit={e => { e.preventDefault(); nextStep(); }}
                    className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-400"
                >
                    <SectionHeading>Hirer Information</SectionHeading>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Full Legal Name */}
                        <FormField label="Full Legal Name">
                            <input
                                type="text"
                                required
                                className={inputClass()}
                                value={formData.fullName}
                                onChange={e =>
                                    setFormData({ ...formData, fullName: e.target.value })
                                }
                                placeholder="Enter full legal name"
                            />
                        </FormField>

                        {/* Permanent Address */}
                        <FormField label="Permanent Address">
                            <input
                                type="text"
                                required
                                className={inputClass(
                                    touched.address && formData.address ? !hirerAddressV.valid : false,
                                    touched.address && formData.address ? hirerAddressV.valid : false
                                )}
                                value={formData.address}
                                onChange={e =>
                                    setFormData({ ...formData, address: e.target.value })
                                }
                                onBlur={() => touch("address")}
                                placeholder="Current residential address"
                            />
                            {touched.address && formData.address && !hirerAddressV.valid && (
                                <FieldError message={hirerAddressV.error} />
                            )}
                        </FormField>

                        {/* Contact Number */}
                        <FormField
                            label="Contact Number"
                            hint="Select your country, then enter number without country code"
                        >
                            <PhoneInputField
                                id="customer-phone"
                                value={formData.phoneNumber}
                                onChange={v => setFormData({ ...formData, phoneNumber: v })}
                            />
                        </FormField>

                        {/* NIC Number */}
                        <FormField
                            label="NIC / ID Card Number"
                            hint="Old: 123456789V · New: 200012345678"
                        >
                            <input
                                type="text"
                                required
                                className={inputClass(
                                    touched.nicNo && nicV ? !nicV.valid : false,
                                    touched.nicNo && nicV ? nicV.valid : false
                                )}
                                value={formData.nicNo}
                                onChange={e =>
                                    setFormData({ ...formData, nicNo: e.target.value.toUpperCase() })
                                }
                                onBlur={() => touch("nicNo")}
                                placeholder="123456789V or 200012345678"
                            />
                            {touched.nicNo && nicV && !nicV.valid && (
                                <FieldError message={nicV.error} />
                            )}
                            {touched.nicNo && nicV && nicV.valid && (
                                <FieldSuccess message="Valid NIC format" />
                            )}
                        </FormField>

                        {/* Driving License */}
                        <FormField label="Driving License Number" hint="5–15 alphanumeric characters">
                            <input
                                type="text"
                                required
                                className={inputClass(
                                    touched.licenseNumber && licenseV ? !licenseV.valid : false,
                                    touched.licenseNumber && licenseV ? licenseV.valid : false
                                )}
                                value={formData.licenseNumber}
                                onChange={e =>
                                    setFormData({ ...formData, licenseNumber: e.target.value })
                                }
                                onBlur={() => touch("licenseNumber")}
                                placeholder="Enter driving license number"
                            />
                            {touched.licenseNumber && licenseV && !licenseV.valid && (
                                <FieldError message={licenseV.error} />
                            )}
                            {touched.licenseNumber && licenseV && licenseV.valid && (
                                <FieldSuccess message="Valid license number" />
                            )}
                        </FormField>
                    </div>

                    {/* Document Upload */}
                    <div className="pt-2 space-y-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Required Verification Documents
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FileUploadTile
                                label="ID Document (NIC / Passport)"
                                file={files.idDocument}
                                type="idDocument"
                                onFileChange={handleFileChange}
                            />
                            <FileUploadTile
                                label="Driving License"
                                file={files.license}
                                type="license"
                                onFileChange={handleFileChange}
                            />
                        </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                        <ContinueButton label="Continue" />
                    </div>
                </form>
            )}

            {/* ── STEP 2: Guarantor Details ── */}
            {step === 2 && (
                <form
                    onSubmit={e => { e.preventDefault(); nextStep(); }}
                    className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-400"
                >
                    <SectionHeading>Guarantor Information</SectionHeading>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Guarantor Name */}
                        <FormField label="Full Legal Name">
                            <input
                                type="text"
                                required
                                className={inputClass()}
                                value={formData.guaranteeFullname}
                                onChange={e =>
                                    setFormData({ ...formData, guaranteeFullname: e.target.value })
                                }
                                placeholder="Enter guarantor's full name"
                            />
                        </FormField>

                        {/* Guarantor Address */}
                        <FormField label="Permanent Address">
                            <input
                                type="text"
                                required
                                className={inputClass(
                                    touched.guaranteeAddress && formData.guaranteeAddress
                                        ? !guaranteeAddressV.valid
                                        : false,
                                    touched.guaranteeAddress && formData.guaranteeAddress
                                        ? guaranteeAddressV.valid
                                        : false
                                )}
                                value={formData.guaranteeAddress}
                                onChange={e =>
                                    setFormData({ ...formData, guaranteeAddress: e.target.value })
                                }
                                onBlur={() => touch("guaranteeAddress")}
                                placeholder="Guarantor's residential address"
                            />
                            {touched.guaranteeAddress &&
                                formData.guaranteeAddress &&
                                !guaranteeAddressV.valid && (
                                    <FieldError message={guaranteeAddressV.error} />
                                )}
                        </FormField>

                        {/* Guarantor Phone */}
                        <FormField
                            label="Contact Number"
                            hint="Select country, then enter number without country code"
                        >
                            <PhoneInputField
                                id="guarantor-phone"
                                value={formData.guaranteePhone1}
                                onChange={v => setFormData({ ...formData, guaranteePhone1: v })}
                                required
                            />
                        </FormField>

                        {/* Guarantor NIC */}
                        <FormField
                            label="NIC / ID Card Number"
                            hint="Old: 123456789V · New: 200012345678"
                        >
                            <input
                                type="text"
                                required
                                className={inputClass(
                                    touched.guaranteeNicNo && gNicV ? !gNicV.valid : false,
                                    touched.guaranteeNicNo && gNicV ? gNicV.valid : false
                                )}
                                value={formData.guaranteeNicNo}
                                onChange={e =>
                                    setFormData({
                                        ...formData,
                                        guaranteeNicNo: e.target.value.toUpperCase(),
                                    })
                                }
                                onBlur={() => touch("guaranteeNicNo")}
                                placeholder="123456789V or 200012345678"
                            />
                            {touched.guaranteeNicNo && gNicV && !gNicV.valid && (
                                <FieldError message={gNicV.error} />
                            )}
                            {touched.guaranteeNicNo && gNicV && gNicV.valid && (
                                <FieldSuccess message="Valid NIC format" />
                            )}
                        </FormField>
                    </div>

                    {/* Guarantor Document Uploads */}
                    <div className="pt-2 space-y-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Guarantor Verification Documents
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FileUploadTile
                                label="Guarantor NIC Copy"
                                file={files.guaranteeNic}
                                type="guaranteeNic"
                                onFileChange={handleFileChange}
                            />
                            <FileUploadTile
                                label="Guarantor Driving License"
                                file={files.guaranteeLicense}
                                type="guaranteeLicense"
                                onFileChange={handleFileChange}
                            />
                        </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                        <ContinueButton label="Next Step" />
                    </div>
                </form>
            )}

            {/* ── STEP 3: Terms ── */}
            {step === 3 && (
                <form
                    onSubmit={e => { e.preventDefault(); nextStep(); }}
                    className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-400"
                >
                    <SectionHeading>Rental Agreement &amp; Terms</SectionHeading>

                    {/* IZY Terms heading */}
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                            IZY Rental Terms and Conditions
                        </p>

                        {/* Scrollable terms box */}
                        <div className="bg-gray-50 border border-gray-200 rounded-2xl h-80 overflow-y-auto p-5 space-y-4 text-sm text-gray-600 leading-relaxed">
                            {/* Vehicle-specific conditions */}
                            {vehicle && (
                                <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-1.5">
                                    <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                                        Rental Conditions for This Vehicle
                                    </p>
                                    <p className="text-gray-800 font-medium">
                                        Maximum running distance per day:{" "}
                                        <span className="font-bold">{vehicle.maxMileagePerDay || "100"} km</span>
                                    </p>
                                    <p className="text-gray-800 font-medium">
                                        Extra kilometer charge:{" "}
                                        <span className="font-bold">
                                            Rs. {Number(vehicle.extraMileageCharge || 0).toLocaleString()}
                                        </span>
                                    </p>
                                    <p className="text-gray-800 font-medium">
                                        Late return charge:{" "}
                                        <span className="font-bold">
                                            Rs. {Number(vehicle.rentPerHour || 0).toLocaleString()} per hour
                                        </span>
                                    </p>
                                </div>
                            )}

                            <p>
                                It is completely forbidden to drive the vehicle while in possession of any
                                illegal drugs prohibited under the Poisons, Opium, and Dangerous Drugs
                                (Amendment) Act No. 13 of 1984, or while under the influence of any type
                                of drug.
                            </p>
                            <p>
                                If the vehicle is involved in an accident, you must immediately notify
                                the nearest police station, the relevant insurance company, and our
                                company.
                            </p>
                            <p>
                                If the insurance claim is rejected due to a mistake or negligence on the
                                part of the lessee, the lessee must pay all the money required to cover
                                the damage.
                            </p>
                            <div className="space-y-1">
                                <p>
                                    If the vehicle is involved in a sudden accident, and the garage
                                    presents the cost to repair the damage:
                                </p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>
                                        If the amount is less than Rs. 100,000, the lessee must bear the
                                        full cost.
                                    </li>
                                    <li>
                                        If the amount is more than Rs. 100,000, the insurance company will
                                        cover the cost, but the lessee must pay all amounts deducted by the
                                        insurance company.
                                    </li>
                                </ul>
                            </div>
                            <p>
                                The lessee must pay for the repair costs of any accident as mentioned
                                above. All repairs must be done at a garage designated by the lessor, and
                                the lessee must bear the cost of transporting the vehicle to that
                                location.
                            </p>
                            <p>
                                If the vehicle causes an accident or other incident resulting in bodily
                                injury, death, or damage, the lessee must notify the lessor in writing
                                and settle all legitimate claims, keeping the lessor free from such
                                claims.
                            </p>
                            <p>
                                The vehicle under this agreement should not be pledged as collateral for
                                a loan or transferred to another party.
                            </p>
                            <p>
                                The lessee must maintain and use the vehicle in a manner suitable for
                                driving. The lessee must bear all losses caused by careless driving and
                                improper maintenance.
                            </p>
                            <p>
                                If the vehicle requires repairs or new parts, IZU Rent A Car &amp; Tours
                                must be notified.
                            </p>
                            <p>
                                The vehicle should only be used to transport passengers (up to the
                                permitted amount).
                            </p>
                            <p>
                                Vehicles rented from IZU Rent A Car &amp; Tours must be returned between
                                8:00 AM and 6:00 PM.
                            </p>
                            <p>
                                If you need to keep the vehicle for more than the agreed-upon number of
                                days, notify the lessor two days in advance. Failure to return without
                                notice will be treated as vehicle theft.
                            </p>
                            <p>
                                The vehicle must be returned at the agreed time and mileage. Additional
                                charges for extra kilometers and hours will apply as specified above.
                            </p>
                            <p className="font-semibold text-gray-800">
                                "By proceeding, I, the lessee, agree to all the terms and conditions
                                from section 12 to 24. I have read and understood them thoroughly."
                            </p>
                        </div>
                    </div>

                    {/* Agreement checkbox — compact, horizontal */}
                    <label className="flex items-center gap-3 cursor-pointer group select-none mt-4">
                        <div className="relative shrink-0 w-5 h-5">
                            <input
                                type="checkbox"
                                required
                                className="w-5 h-5 appearance-none border-2 border-gray-300 rounded-md checked:bg-red-600 checked:border-red-600 transition-all cursor-pointer"
                                checked={formData.agreed}
                                onChange={e =>
                                    setFormData({ ...formData, agreed: e.target.checked })
                                }
                            />
                            {formData.agreed && (
                                <Check className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white w-3 h-3 pointer-events-none" />
                            )}
                        </div>
                        <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors leading-snug">
                            I accept all <span className="font-semibold text-gray-800">IZY Rental Terms and Conditions</span> and confirm I have read and understood them.
                        </span>
                    </label>

                    <div className="flex justify-end pt-2">
                        <ContinueButton label="Final Review" disabled={!formData.agreed} />
                    </div>
                </form>
            )}

            {/* ── STEP 4: Booking Overview ── */}
            {step === 4 && (
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 animate-in fade-in zoom-in-95 duration-400"
                >
                    <SectionHeading>Booking Overview</SectionHeading>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Customer Details */}
                        <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 space-y-3">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                Customer
                            </p>
                            {[
                                { label: "Name", value: formData.fullName },
                                { label: "Phone", value: formData.phoneNumber },
                                { label: "NIC", value: formData.nicNo },
                                { label: "License", value: formData.licenseNumber },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex justify-between items-baseline gap-4">
                                    <span className="text-xs font-medium text-gray-400 shrink-0">
                                        {label}
                                    </span>
                                    <span className="text-sm font-semibold text-gray-900 text-right break-all">
                                        {value || "—"}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Guarantor Details */}
                        <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 space-y-3">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                Guarantor
                            </p>
                            {[
                                { label: "Name", value: formData.guaranteeFullname },
                                { label: "Phone", value: formData.guaranteePhone1 },
                                { label: "NIC", value: formData.guaranteeNicNo },
                                { label: "Address", value: formData.guaranteeAddress },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex justify-between items-baseline gap-4">
                                    <span className="text-xs font-medium text-gray-400 shrink-0">
                                        {label}
                                    </span>
                                    <span className="text-sm font-semibold text-gray-900 text-right break-all">
                                        {value || "—"}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Vehicle + Booking Summary */}
                        <div className="md:col-span-2 bg-gray-900 rounded-xl p-5 relative overflow-hidden">
                            <Car className="absolute -right-6 -bottom-6 w-32 h-32 text-white/5" />
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
                                {/* Vehicle */}
                                <div>
                                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">
                                        Vehicle
                                    </p>
                                    <p className="text-sm font-bold text-white">
                                        {vehicle
                                            ? `${vehicle.brand} ${vehicle.model}`
                                            : "—"}
                                    </p>
                                    {vehicle?.plateNumber && (
                                        <p className="text-xs text-white/50 mt-0.5">
                                            {vehicle.plateNumber}
                                        </p>
                                    )}
                                </div>

                                {/* Duration */}
                                <div>
                                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">
                                        Rental Period
                                    </p>
                                    <p className="text-sm font-bold text-white whitespace-nowrap">
                                        <span className="whitespace-nowrap">
                                            {formatDate(searchParams.rental_start_date)}
                                        </span>
                                        {" "}–{" "}
                                        <span className="whitespace-nowrap">
                                            {formatDate(searchParams.rental_end_date)}
                                        </span>
                                    </p>
                                    <p className="text-xs text-white/50 mt-0.5">
                                        <span className="whitespace-nowrap">
                                            {formatTime(searchParams.rental_start_time || "08:00")}
                                        </span>
                                        {" to "}
                                        <span className="whitespace-nowrap">
                                            {formatTime(searchParams.rental_end_time || "18:00")}
                                        </span>
                                    </p>
                                </div>

                                {/* Price */}
                                <div className="sm:text-right">
                                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">
                                        Total Estimated
                                    </p>
                                    <p className="text-2xl font-bold text-white">
                                        LKR {Number(searchParams.totalPrice).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bank Payment Details */}
                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 space-y-4">
                        <div className="flex items-center gap-3 border-b border-emerald-100 pb-3">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-emerald-900 leading-none">Bank Payment Details</h3>
                                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-1">Please pay to the following account</p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                            {[
                                { label: "Bank Name", value: "Bank of Ceylon (BOC)" },
                                { label: "Account Name", value: "Test User" },
                                { label: "Account Number", value: "123456789012" },
                                { label: "Branch", value: "Colombo Main Branch" },
                                { label: "Branch Code", value: "001" },
                                { label: "SWIFT Code", value: "BCEYLKLX" },
                            ].map(({ label, value }) => (
                                <div key={label} className="space-y-0.5">
                                    <p className="text-[9px] font-black text-emerald-600/60 uppercase tracking-widest">{label}</p>
                                    <p className="text-sm font-bold text-emerald-900">{value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payment Slip Upload */}
                    <div className="pt-2">
                        <SectionHeading>Payment Slip Upload</SectionHeading>
                        <p className="text-xs text-gray-500 mb-4 italic">
                            After making the bank transfer, please upload a photo or PDF of your payment slip below to confirm your booking.
                        </p>
                        <FileUploadTile
                            label="Upload Payment Slip"
                            file={files.paymentslip}
                            type="paymentslip"
                            onFileChange={handleFileChange}
                        />
                        {!files.paymentslip && error && error.includes("Payment slip") && (
                            <FieldError message="Please upload your payment slip to continue." />
                        )}
                    </div>

                    {/* Authorization notice */}
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                        <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-gray-800 mb-0.5">
                                Final Authorization
                            </p>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                By clicking below, you authorize IZ Rent-A-Car to verify your
                                documents and create a pending reservation. You will be notified via
                                phone upon approval.
                            </p>
                        </div>
                    </div>

                    {/* Submit button — professional size */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-gray-900 hover:bg-red-600 text-white font-semibold rounded-xl shadow-sm transition-all active:scale-[0.99] text-sm flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    Confirm &amp; Reserve
                                    <ChevronRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
