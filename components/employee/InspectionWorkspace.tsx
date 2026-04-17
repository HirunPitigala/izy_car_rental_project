"use client";

import { useState, useRef, useEffect, type Dispatch, type SetStateAction } from "react";
import { X, CheckCircle, ChevronLeft, PenTool, User, Car, FileText, ClipboardList, ShieldCheck, MapPin, Calendar, CreditCard, ExternalLink, RefreshCw } from "lucide-react";
import PDFViewerModal from "@/components/shared/PDFViewerModal";

// --- Local types ---
type DamageType = "SMALL_MARK" | "SCRATCH" | "DENT" | "CRACK";
type DamagePoint = { type: DamageType; x: number; y: number; notes?: string | null };
type ReadOnlyDamage = { damageType: string; xPosition: number; yPosition: number; notes?: string | null };
type ChecklistItemRecord = { itemId: number; status: "OK" | "NOT_OK"; remarks?: string | null };
type ChecklistItem = { itemId: number; itemName: string | null };
type SavedInspectionData = {
    overallRemarks?: string | null;
    items?: ChecklistItemRecord[];
    damages?: ReadOnlyDamage[];
};
type AssignmentData = {
    bookingId?: number;
    id?: number;
    customerFullName?: string;
    customerName?: string;
    customerPhone?: string;
    phone?: string;
    email?: string;
    nic?: string;
    customerAddress?: string;
    vehicle?: { brand?: string; model?: string; plateNumber?: string };
    rentalDate?: string | Date;
    returnDate?: string | Date;
    pickupTime?: string | Date;
    transferDate?: string;
    transferTime?: string;
    pickupLocation?: string;
    airport?: string;
    dropLocation?: string;
    transferLocation?: string;
    totalFare?: number | string;
    price?: number | string;
};
type BookingDocs = { customerID?: string | null; license?: string | null; nic?: string | null; gLicense?: string | null };
import { saveInspection } from "@/lib/actions/inspectionActions";
import Link from "next/link";
import { getBookingDocuments } from "@/lib/actions/bookingActions";
import { useRouter } from "next/navigation";

// Reuse the damage mapper logic locally since we are retiring the modal file where it lived
function DamageMapper({ damages, setDamages, readOnlyDamages = [] }: { damages: DamagePoint[]; setDamages: Dispatch<SetStateAction<DamagePoint[]>>; readOnlyDamages?: ReadOnlyDamage[] }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [popupPos, setPopupPos] = useState<{ x: number, y: number, percentX: number, percentY: number } | null>(null);

    const handleImageClick = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const rawX = e.clientX - rect.left;
        const rawY = e.clientY - rect.top;
        
        // Convert to percentages
        const percentX = (rawX / rect.width) * 100;
        const percentY = (rawY / rect.height) * 100;

        setPopupPos({ x: rawX, y: rawY, percentX, percentY });
    };

    const addDamage = (type: DamageType, notes?: string) => {
        if (!popupPos) return;
        setDamages(prev => [...prev, { type, x: popupPos.percentX, y: popupPos.percentY, notes: notes || "" }]);
        setPopupPos(null);
    };

    const DAMAGE_TYPES = [
        { id: "SMALL_MARK", label: "(A) Small Mark", color: "bg-blue-500" },
        { id: "SCRATCH", label: "(B) Small Scratch", color: "bg-amber-500" },
        { id: "DENT", label: "(C) Dent Mark", color: "bg-red-500" },
        { id: "CRACK", label: "(D) Paint Crack", color: "bg-purple-500" }
    ];

    return (
        <div className="min-h-[700px] flex flex-col bg-white rounded-3xl border border-gray-100 shadow-lg relative">
            <div className="p-6 bg-gray-50 border-b border-gray-100 rounded-t-3xl">
                <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-1">Vehicle Damage Locator</h3>
                <p className="text-xs text-gray-500">Click anywhere on the vehicle diagram to log a damage instance.</p>
                
                <div className="flex flex-wrap gap-3 mt-4">
                    {DAMAGE_TYPES.map(t => (
                        <div key={t.id} className="flex items-center gap-2">
                            <span className={`w-3 h-3 rounded-full ${t.color}`} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">{t.label}</span>
                        </div>
                    ))}
                    {readOnlyDamages.length > 0 && (
                        <div className="flex items-center gap-2 opacity-50 ml-auto">
                            <span className={`w-3 h-3 rounded-full shrink-0 border-2 border-dashed border-gray-800`} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Before Rental</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 p-8 flex items-center justify-center relative bg-[#fcfcfc] rounded-b-3xl">
                <div 
                    ref={containerRef}
                    className="relative w-full max-w-2xl aspect-square bg-white rounded-2xl border-2 border-primary/10 shadow-lg cursor-crosshair"
                    onClick={handleImageClick}
                >
                    <div className="absolute inset-0 bg-contain bg-center bg-no-repeat opacity-90 pointer-events-none transition-opacity" 
                         style={{ backgroundImage: `url('/car_diagram.png')` }} 
                    />

                    {/* Pre-Rental Damages */}
                    {readOnlyDamages.map((d, idx) => (
                        <div 
                            key={`pre-${idx}`} 
                            className="absolute z-10 w-5 h-5 -ml-2.5 -mt-2.5 border-[3px] border-gray-800 border-dashed rounded-full flex items-center justify-center opacity-40 group"
                            style={{ left: `${d.xPosition}%`, top: `${d.yPosition}%` }}
                        >
                            <span className="absolute bottom-full mb-1 whitespace-nowrap bg-gray-800 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                Pre: {d.damageType.replace("_", " ")}
                            </span>
                        </div>
                    ))}

                    {/* Active */}
                    {damages.map((d, idx) => {
                        const typeInfo = DAMAGE_TYPES.find(t => t.id === d.type);
                        return (
                            <div 
                                key={idx} 
                                className={`absolute z-20 w-5 h-5 -ml-2.5 -mt-2.5 ${typeInfo?.color || 'bg-gray-800'} rounded-full border-2 border-white shadow-md flex items-center justify-center group cursor-pointer`}
                                style={{ left: `${d.x}%`, top: `${d.y}%` }}
                                onClick={(e) => { e.stopPropagation(); setDamages(prev => prev.filter((_, i) => i !== idx)); }}
                            >
                                <span className="absolute bottom-full mb-1 whitespace-nowrap bg-black text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 z-30 transition-opacity">
                                    {typeInfo?.label} (Remove)
                                </span>
                            </div>
                        )
                    })}

                    {popupPos && (
                        <div 
                            className="absolute z-50 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-2xl rounded-2xl p-2 w-64 transition-all animate-in zoom-in-95 duration-200"
                            style={{ 
                                left: `${popupPos.percentX > 60 ? popupPos.percentX - 60 : popupPos.percentX}%`, 
                                top: `${popupPos.percentY > 70 ? popupPos.percentY - 40 : popupPos.percentY}%` 
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between px-3 pt-2 pb-3 border-b border-gray-100 mb-2">
                                <div className="text-[10px] font-black text-primary uppercase tracking-widest">Mark Damage</div>
                                <X className="w-3 h-3 text-gray-400 cursor-pointer hover:text-red-500 transition-colors" onClick={() => setPopupPos(null)} />
                            </div>
                            <div className="grid grid-cols-1 gap-1">
                                {DAMAGE_TYPES.map(t => (
                                    <button 
                                        key={t.id}
                                        onClick={() => addDamage(t.id as DamageType)}
                                        className="group w-full flex items-center gap-3 px-3 py-3 hover:bg-primary hover:text-white rounded-xl text-left transition-all duration-200"
                                    >
                                        <span className={`w-3 h-3 rounded-full ${t.color} group-hover:bg-white border border-black/5 flex-shrink-0`} />
                                        <span className="text-[11px] font-bold uppercase tracking-wide">{t.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ----------------------------------------------------

function buildStateFromSavedInspection(savedData: SavedInspectionData, items: ChecklistItem[]) {
    const itemStatus: Record<number, { status: "OK" | "NOT_OK"; remarks: string }> = {};
    items.forEach(i => {
        const saved = savedData.items?.find(s => s.itemId === i.itemId);
        itemStatus[i.itemId] = {
            status: saved?.status ?? "OK",
            remarks: saved?.remarks ?? ""
        };
    });
    // DB shape: damageType / xPosition / yPosition → component state: type / x / y
    const damages: DamagePoint[] = (savedData.damages ?? []).map(d => ({
        type: d.damageType as DamageType,
        x: d.xPosition,
        y: d.yPosition,
        notes: d.notes ?? ""
    }));
    return { itemStatus, damages, overallRemarks: savedData.overallRemarks ?? "" };
}

function buildEmptyState(items: ChecklistItem[]) {
    const itemStatus: Record<number, { status: "OK" | "NOT_OK"; remarks: string }> = {};
    items.forEach(i => { itemStatus[i.itemId] = { status: "OK", remarks: "" }; });
    return { itemStatus, damages: [] as DamagePoint[], overallRemarks: "" };
}

// ----------------------------------------------------

export default function InspectionWorkspace({
    category,
    id,
    data,
    employeeId,
    items,
    preRentalData,
    afterRentalData
}: {
    category: string;
    id: number;
    data: AssignmentData;
    employeeId: number;
    items: ChecklistItem[];
    preRentalData: SavedInspectionData | null | undefined;
    afterRentalData: SavedInspectionData | null | undefined;
}) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"DETAILS" | "PRE_RENTAL" | "AFTER_RENTAL">("DETAILS");
    
    // Checklist states
    const [itemStatus, setItemStatus] = useState<Record<number, { status: "OK" | "NOT_OK", remarks: string }>>({});
    const [damages, setDamages] = useState<DamagePoint[]>([]);
    const [overallRemarks, setOverallRemarks] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    // Docs State
    const [docs, setDocs] = useState<BookingDocs | null>(null);
    const [loadingDocs, setLoadingDocs] = useState(false);

    // PDF Viewer State
    const [pdfViewer, setPdfViewer] = useState<{ isOpen: boolean; url: string; title: string }>({
        isOpen: false,
        url: "",
        title: ""
    });

    const openPdf = (url: string, title: string) => {
        setPdfViewer({ isOpen: true, url, title });
    };

    useEffect(() => {
        if (category === "rent-a-car") {
            setLoadingDocs(true);
            getBookingDocuments(id).then(res => {
                if (res.success) setDocs(res.data ?? null);
                setLoadingDocs(false);
            });
        }
    }, [category, id]);

    // Load saved inspection data (or reset to empty) when switching tabs
    useEffect(() => {
        if (activeTab === "PRE_RENTAL") {
            const state = preRentalData
                ? buildStateFromSavedInspection(preRentalData, items)
                : buildEmptyState(items);
            setItemStatus(state.itemStatus);
            setDamages(state.damages);
            setOverallRemarks(state.overallRemarks);
        } else if (activeTab === "AFTER_RENTAL") {
            const state = afterRentalData
                ? buildStateFromSavedInspection(afterRentalData, items)
                : buildEmptyState(items);
            setItemStatus(state.itemStatus);
            setDamages(state.damages);
            setOverallRemarks(state.overallRemarks);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, preRentalData, afterRentalData]);

    const handleSaveInspection = async () => {
        setIsSaving(true);
        const submitItems = Object.keys(itemStatus).map(itemIdStr => ({
            itemId: parseInt(itemIdStr),
            status: itemStatus[parseInt(itemIdStr)].status,
            remarks: itemStatus[parseInt(itemIdStr)].remarks
        }));

        const result = await saveInspection({
            bookingId: (data.bookingId ?? data.id) as number,
            employeeId,
            inspectionType: activeTab === "PRE_RENTAL" ? "BEFORE" : "AFTER",
            overallRemarks,
            items: submitItems,
            damages
        });

        setIsSaving(false);
        if (result.success) {
            alert(`${activeTab === "PRE_RENTAL" ? "Pre-Rental" : "After-Rental"} inspection saved successfully.`);
            router.refresh();
        } else {
            alert(result.error);
        }
    };

    return (
        <div className="min-h-screen bg-[#fcfcfc] flex flex-col">
            {/* STICKY HEADER */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
                <div className="max-w-350 mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link href={`/employee/assigned?category=${category}`} className="p-3 bg-gray-50 text-gray-500 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors">
                            <ChevronLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-black text-primary tracking-tight uppercase">Workspace #{id}</h1>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                    category === 'rent-a-car' ? 'bg-blue-100 text-blue-700' : 
                                    category === 'pickups' ? 'bg-emerald-100 text-emerald-700' :
                                    category === 'airport' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                    {category.replace(/-/g, " ")}
                                </span>
                            </div>
                            <p className="text-[11px] font-bold tracking-widest text-gray-400 uppercase mt-1">Assigned Employee ID: {employeeId}</p>
                        </div>
                    </div>

                    <div className="flex bg-gray-50 border border-gray-100 rounded-2xl p-1 shadow-inner overflow-x-auto custom-scrollbar">
                        <button 
                            onClick={() => setActiveTab("DETAILS")}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === "DETAILS" ? 'bg-white text-primary shadow border border-gray-100' : 'text-gray-500 hover:text-primary'}`}
                        >
                            <FileText className="w-4 h-4" /> Details
                        </button>
                        {(category === "rent-a-car" || category === "airport" || category === "wedding") && (
                            <>
                                <button 
                                    onClick={() => setActiveTab("PRE_RENTAL")}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === "PRE_RENTAL" ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:text-primary'}`}
                                >
                                    <ClipboardList className="w-4 h-4" /> Pre-Rental
                                </button>
                                <button 
                                    onClick={() => setActiveTab("AFTER_RENTAL")}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === "AFTER_RENTAL" ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:text-primary'}`}
                                >
                                    <ShieldCheck className="w-4 h-4" /> After-Rental
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 max-w-350 w-full mx-auto px-6 py-8">
                
                {/* 1. DETAILS TAB */}
                {activeTab === "DETAILS" && (
                    <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
                        {/* CUSTOMER DETAILS */}
                        <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-8 items-start">
                            <div className="flex-1 w-full space-y-6">
                                <h3 className="text-[11px] font-black text-red-600 uppercase tracking-widest flex items-center gap-2">
                                    <User className="w-4 h-4" /> Customer Lead
                                </h3>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900 capitalize tracking-tight">{data.customerFullName || data.customerName}</p>
                                    <p className="text-sm text-gray-500 font-medium mt-1">{data.customerPhone || data.phone}</p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-gray-50">
                                    {data.email && <div><span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest block mb-1">Email</span><span className="text-sm font-bold text-gray-800 break-all">{data.email}</span></div>}
                                    {data.nic && <div><span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest block mb-1">NIC Entry</span><span className="text-sm font-bold text-gray-800 break-all">{data.nic}</span></div>}
                                    {data.customerAddress && <div><span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest block mb-1">Address</span><span className="text-sm font-bold text-gray-800 break-words">{data.customerAddress}</span></div>}
                                </div>
                            </div>
                        </section>

                        {/* VEHICLE PROVISION */}
                        <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                             <h3 className="text-[11px] font-black text-red-600 uppercase tracking-widest flex items-center gap-2">
                                <Car className="w-4 h-4" /> Vehicle Details
                            </h3>
                            {data.vehicle?.brand ? (
                                <div>
                                    <p className="text-xl font-bold text-gray-900 tracking-tight">{data.vehicle.brand} {data.vehicle.model}</p>
                                    <div className="inline-block mt-3 px-3 py-1.5 bg-red-50 text-red-700 font-bold tracking-widest rounded-lg border border-red-100 uppercase text-[11px]">
                                        {data.vehicle.plateNumber || "Plate To Be Determined"}
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-sm font-medium text-gray-500">Fleet details not established</div>
                            )}
                        </section>

                        {/* SCHEDULING DETAILS */}
                        <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                             <h3 className="text-[11px] font-black text-red-600 uppercase tracking-widest flex items-center gap-2">
                                <Calendar className="w-4 h-4" /> Rental Dates
                            </h3>
                            <div className="flex flex-col sm:flex-row gap-6">
                                {(data.rentalDate || data.transferDate) && (
                                    <div className="flex-1">
                                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest block mb-1">Dispatch / Rental Start</span>
                                        <span className="text-[13px] font-bold text-gray-800">
                                            {new Date(data.rentalDate || data.transferDate!).toLocaleString()}
                                        </span>
                                    </div>
                                )}
                                {data.returnDate && <div className="flex-1"><span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest block mb-1">Return / Rental End</span><span className="text-[13px] font-bold text-gray-800">{new Date(data.returnDate).toLocaleString()}</span></div>}
                                {data.pickupTime && <div className="flex-1"><span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest block mb-1">Pickup Time</span><span className="text-[13px] font-bold text-gray-800">{new Date(data.pickupTime).toLocaleString()}</span></div>}
                            </div>
                        </section>

                        {/* LOGISTICS */}
                        {(data.pickupLocation || data.airport) && (
                            <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                                <h3 className="text-[11px] font-black text-red-600 uppercase tracking-widest flex items-center gap-2">
                                    <MapPin className="w-4 h-4" /> Logistics & Routing
                                </h3>
                                <div className="flex flex-col gap-4">
                                    <div className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest block mb-1">Origin</span>
                                        <span className="text-sm font-bold text-gray-800">{data.pickupLocation || data.airport}</span>
                                    </div>
                                    {data.dropLocation && (
                                        <div className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100">
                                            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest block mb-1">Destination</span>
                                            <span className="text-sm font-bold text-gray-800">{data.dropLocation}</span>
                                        </div>
                                    )}
                                    {data.transferLocation && (
                                        <div className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100">
                                            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest block mb-1">Transfer Location</span>
                                            <span className="text-sm font-bold text-gray-800">{data.transferLocation}</span>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        {/* FINANCIALS */}
                        <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                            <h3 className="text-[11px] font-black text-red-600 uppercase tracking-widest flex items-center gap-2">
                                <CreditCard className="w-4 h-4" /> Cost Overview
                            </h3>
                            <div className="flex justify-between items-center bg-gray-50 p-6 rounded-xl border border-gray-100">
                                <div>
                                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest block mb-1">Total Quoted Fare</span>
                                    <span className="text-2xl font-black text-gray-900 tracking-tight">LKR {Number(data.totalFare || data.price || 0).toLocaleString()}</span>
                                </div>
                                {category === 'rent-a-car' && <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200">Payment Unverified</span>}
                            </div>
                        </section>

                        {/* DOCUMENTS */}
                        {category === "rent-a-car" && (
                            <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                                <h3 className="text-[11px] font-black text-red-600 uppercase tracking-widest flex items-center gap-2">
                                    <FileText className="w-4 h-4" /> Customer Documents
                                </h3>
                                
                                {loadingDocs ? (
                                    <div className="py-10 flex items-center justify-center">
                                        <RefreshCw className="w-5 h-5 text-gray-400 animate-spin" />
                                    </div>
                                ) : docs ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <DocumentItem title="Hirer Identification" url={docs.customerID} onOpen={(url, title) => setPdfViewer({ isOpen: true, url, title })} />
                                        <DocumentItem title="Driving License" url={docs.license} onOpen={(url, title) => setPdfViewer({ isOpen: true, url, title })} />
                                        <DocumentItem title="Guarantor NIC" url={docs.nic} onOpen={(url, title) => setPdfViewer({ isOpen: true, url, title })} />
                                        <DocumentItem title="Guarantor License" url={docs.gLicense} onOpen={(url, title) => setPdfViewer({ isOpen: true, url, title })} />
                                    </div>
                                ) : (
                                    <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl text-center">
                                        <span className="text-xs font-bold text-gray-500">No documents logged.</span>
                                    </div>
                                )}
                            </section>
                        )}
                    </div>
                )}

                {/* 2 & 3. INSPECTION TABS */}
                {(activeTab === "PRE_RENTAL" || activeTab === "AFTER_RENTAL") && (
                    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-500 max-w-4xl mx-auto w-full pb-10">
                        {/* 1. Comparative Notice */}
                        {activeTab === "AFTER_RENTAL" && (preRentalData?.damages?.length ?? 0) > 0 && (
                            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 shadow-sm">
                                <p className="text-sm font-bold text-amber-900 leading-snug">
                                    <span className="font-black uppercase tracking-widest block mb-2 text-amber-700 text-[10px]">Comparative Data Active</span>
                                    {preRentalData?.damages?.length} exterior damage markers and prior component statuses were recorded in the Pre-Rental assessment. They are visible for verification.
                                </p>
                            </div>
                        )}

                        {/* 2. Inventory & Conditions */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col overflow-hidden w-full">
                            <div className="p-6 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="text-[11px] font-black text-red-600 uppercase tracking-widest flex items-center gap-2">
                                    <ClipboardList className="w-4 h-4" /> Inventory & Conditions
                                </h3>
                            </div>
                            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar relative">
                                <div className="absolute inset-0 pointer-events-none shadow-[inset_0_-40px_20px_-20px_rgba(255,255,255,1)] z-10 bottom-0" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {items.map((item, idx) => {
                                    const stat = itemStatus[item.itemId] || { status: "OK", remarks: "" };
                                    const preItem = preRentalData?.items?.find(i => i.itemId === item.itemId);

                                    return (
                                        <div key={item.itemId} className="flex flex-col p-5 rounded-2xl bg-gray-50 border border-gray-100 gap-3 group hover:border-gray-300 transition-colors">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <span className="text-xs font-black text-primary uppercase tracking-tight leading-none block">{idx + 1}. {item.itemName}</span>
                                                    {activeTab === "AFTER_RENTAL" && preItem && (
                                                        <span className={`text-[9px] font-bold uppercase tracking-widest inline-block mt-2 px-2 py-0.5 rounded-md ${preItem.status === 'OK' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                            Pre-Assigned: {preItem.status.replace("_", " ")} {preItem.remarks && `- ${preItem.remarks}`}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex bg-white rounded-lg p-1 border border-gray-200 shrink-0">
                                                    <button 
                                                        onClick={() => setItemStatus(prev => ({...prev, [item.itemId]: { ...stat, status: "OK" }}))}
                                                        className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${stat.status === 'OK' ? 'bg-emerald-500 text-white shadow-sm' : 'text-gray-400 hover:text-gray-700'}`}
                                                    >
                                                        Ok
                                                    </button>
                                                    <button 
                                                        onClick={() => setItemStatus(prev => ({...prev, [item.itemId]: { ...stat, status: "NOT_OK" }}))}
                                                        className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${stat.status === 'NOT_OK' ? 'bg-red-500 text-white shadow-sm' : 'text-gray-400 hover:text-gray-700'}`}
                                                    >
                                                        Defect
                                                    </button>
                                                </div>
                                            </div>
                                            <input 
                                                type="text" 
                                                placeholder="Specify details or notes..." 
                                                value={stat.remarks}
                                                onChange={e => setItemStatus(prev => ({...prev, [item.itemId]: { ...stat, remarks: e.target.value }}))}
                                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-[11px] font-medium focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-gray-300"
                                            />
                                        </div>
                                    );
                                })}
                                </div>
                            </div>
                        </div>

                        {/* 3. Damage Locator Section */}
                        <div className="w-full flex flex-col relative">
                            <DamageMapper 
                                damages={damages} 
                                setDamages={setDamages} 
                                readOnlyDamages={activeTab === "AFTER_RENTAL" ? preRentalData?.damages : []} 
                            />
                        </div>

                        {/* 4. Inspector Remarks */}
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm w-full">
                            <h3 className="text-[11px] font-black text-red-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <PenTool className="w-4 h-4" /> Inspector Overall Remarks
                            </h3>
                            <textarea
                                value={overallRemarks}
                                onChange={e => setOverallRemarks(e.target.value)}
                                placeholder="Enter holistic vehicle condition notes, odor, or general findings..."
                                className="w-full h-24 bg-gray-50 rounded-2xl border border-gray-200 p-5 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none resize-none transition-all placeholder:text-gray-400"
                            />
                        </div>

                        {/* 5. Save & Reset Buttons */}
                        <div className="mt-4 flex flex-col sm:flex-row justify-end gap-4 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm w-full">
                            <button
                                onClick={() => {
                                    const savedData = activeTab === "PRE_RENTAL" ? preRentalData : afterRentalData;
                                    const state = savedData
                                        ? buildStateFromSavedInspection(savedData, items)
                                        : buildEmptyState(items);
                                    setItemStatus(state.itemStatus);
                                    setDamages(state.damages);
                                    setOverallRemarks(state.overallRemarks);
                                }}
                                className="h-12 px-8 border-2 border-gray-100 bg-white text-gray-500 font-bold rounded-xl hover:bg-gray-50 transition-all text-[11px] uppercase tracking-widest w-full sm:w-auto text-center"
                            >
                                Reset Details
                            </button>
                            <button 
                                onClick={handleSaveInspection}
                                disabled={isSaving}
                                className="h-12 px-10 bg-primary text-white font-black rounded-xl hover:bg-primary/90 transition-all text-[11px] uppercase tracking-widest shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2 w-full sm:w-auto"
                            >
                                {isSaving ? (
                                    <><RefreshCw className="w-4 h-4 animate-spin" /> Committing...</>
                                ) : (
                                    <><CheckCircle className="w-4 h-4" /> Save {activeTab === "PRE_RENTAL" ? "Pre-Rental" : "After-Rental"} Report</>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
            
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #f1f5f9; border-radius: 20px; }
            `}</style>
            
            <PDFViewerModal 
                isOpen={pdfViewer.isOpen}
                url={pdfViewer.url}
                title={pdfViewer.title}
                onClose={() => setPdfViewer(prev => ({ ...prev, isOpen: false }))}
            />
        </div>
    );
}

function DocumentItem({ title, url, onOpen }: { title: string, url?: string | null, onOpen: (url: string, title: string) => void }) {
    if (!url) return (
         <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 grayscale opacity-60">
             <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-200"><X className="w-4 h-4 text-gray-300" /></div>
                 <div><p className="text-xs font-black text-gray-400 tracking-tight">{title}</p><p className="text-[9px] uppercase tracking-widest text-gray-400 mt-0.5">Missing required file</p></div>
             </div>
         </div>
    );

    return (
        <button 
            onClick={() => onOpen(url, title)} 
            className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-200 hover:border-red-400 hover:shadow-md transition-all group cursor-pointer w-full text-left"
        >
             <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center transition-colors"><FileText className="w-4 h-4" /></div>
                 <div><p className="text-xs font-black text-primary tracking-tight">{title}</p><p className="text-[9px] font-bold uppercase tracking-widest text-primary/40 mt-0.5">Verified Document Upload</p></div>
             </div>
             <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors text-gray-400"><ExternalLink className="w-3 h-3" /></div>
        </button>
    );
}
