
"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { 
  ChevronLeft, ClipboardList, AlertCircle, 
  CheckCircle2, Loader2, Save
} from "lucide-react";
import ChecklistRow from "@/components/employee/inspection/ChecklistRow";
import DamageCanvas, { Damage } from "@/components/employee/inspection/DamageCanvas";
import InspectionComparisonTable from "@/components/employee/inspection/InspectionComparisonTable";

function InspectionContent() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const bookingId = params.id as string;
    const type = searchParams.get("type") as "BEFORE" | "AFTER";
    
    // View mode logic can be added later if needed
    // const viewOnly = searchParams.get("view");

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [booking, setBooking] = useState<any>(null);
    const [items, setItems] = useState<any[]>([]);
    const [inspections, setInspections] = useState<any[]>([]);
    const [step, setStep] = useState<"checklist" | "damages" | "summary">("checklist");

    // Form State
    const [checklistState, setChecklistState] = useState<any[]>([]);
    const [damages, setDamages] = useState<Damage[]>([]);
    const [remarks, setRemarks] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [bookingRes, itemsRes, inspectionRes] = await Promise.all([
                    fetch(`/api/inspection/booking/${bookingId}/details`),
                    fetch(`/api/inspection/items`),
                    fetch(`/api/inspection/booking/${bookingId}`)
                ]);

                const [b, it, ins] = await Promise.all([
                    bookingRes.json(),
                    itemsRes.json(),
                    inspectionRes.json()
                ]);

                if (!b.success || !it.success || !ins.success) {
                    throw new Error("Failed to fetch necessary data");
                }

                setBooking(b.data);
                setItems(it.data);
                setInspections(ins.data);

                // Initialize checklist state
                if (type === "BEFORE") {
                    setChecklistState(it.data.map((item: any) => ({
                        itemId: item.itemId,
                        itemName: item.itemName,
                        status: "OK",
                        remarks: ""
                    })));
                } else if (type === "AFTER") {
                    const beforeIns = ins.data.find((i: any) => i.inspectionType === "BEFORE");
                    if (beforeIns) {
                        setChecklistState(it.data.map((item: any) => {
                            const beforeItem = beforeIns.items.find((bi: any) => bi.itemId === item.itemId);
                            return {
                                itemId: item.itemId,
                                itemName: item.itemName,
                                beforeStatus: beforeItem?.status || "OK",
                                beforeRemarks: beforeItem?.remarks || "",
                                afterStatus: "OK",
                                afterRemarks: ""
                            };
                        }));
                        // Load previous damages as grey markers
                        setDamages(beforeIns.damageReports.map((d: any) => ({ ...d, isNew: false })));
                    } else {
                        // Fallback if no BEFORE was found (shouldn't happen with strict rules)
                        setChecklistState(it.data.map((item: any) => ({
                            itemId: item.itemId,
                            itemName: item.itemName,
                            beforeStatus: "OK",
                            beforeRemarks: "",
                            afterStatus: "OK",
                            afterRemarks: ""
                        })));
                    }
                }

                setLoading(false);
            } catch (error) {
                console.error("Fetch error:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, [bookingId, type]);

    const handleChecklistChange = (idx: number, status: "OK" | "NOT_OK", r: string) => {
        const newState = [...checklistState];
        if (type === "BEFORE") {
            newState[idx] = { ...newState[idx], status, remarks: r };
        } else {
            newState[idx] = { ...newState[idx], afterStatus: status, afterRemarks: r };
        }
        setChecklistState(newState);
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const body = {
                bookingId: parseInt(bookingId),
                inspectionType: type,
                overallRemarks: remarks,
                items: type === "BEFORE" 
                    ? checklistState.map(i => ({ itemId: i.itemId, status: i.status, remarks: i.remarks }))
                    : checklistState.map(i => ({ itemId: i.itemId, status: i.afterStatus, remarks: i.afterRemarks })),
                damages: damages.filter(d => d.isNew)
            };

            const res = await fetch("/api/inspection", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                router.push("/employee");
                router.refresh();
            } else {
                const err = await res.json();
                alert(err.message || "Failed to submit inspection");
            }
        } catch (error) {
            console.error("Submission error:", error);
            alert("An error occurred while submitting. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc]">
            <div className="text-center space-y-4">
                <Loader2 className="w-12 h-12 text-[#0f0f0f] animate-spin mx-auto" />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Preparing Inspection Tools...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#fcfcfc] pb-32">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.back()} className="p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all">
                            <ChevronLeft className="w-5 h-5 text-gray-900" />
                        </button>
                        <div>
                             <h1 className="text-lg font-black text-gray-900 tracking-tight">
                                {type === "BEFORE" ? "Before Rental" : "After Rental"} Inspection
                             </h1>
                             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Booking #{bookingId} • {booking?.vehicle?.brand} {booking?.vehicle?.model}</p>
                        </div>
                    </div>
                    <div className="hidden sm:flex bg-gray-100 p-1 rounded-2xl">
                         {["checklist", "damages", "summary"].map((s) => (
                             <button
                                key={s}
                                onClick={() => setStep(s as any)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                    step === s ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
                                }`}
                             >
                                {s}
                             </button>
                         ))}
                    </div>
                </div>
                {/* Mobile Tabbed View (Optional) */}
                <div className="flex sm:hidden bg-white border-t border-gray-50 p-2 overflow-x-auto gap-2">
                     {["checklist", "damages", "summary"].map((s) => (
                         <button
                            key={s}
                            onClick={() => setStep(s as any)}
                            className={`flex-none px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${
                                step === s ? "bg-[#0f0f0f] text-white" : "bg-gray-50 text-gray-400"
                            }`}
                         >
                            {s}
                         </button>
                     ))}
                </div>
            </div>

            <div className="container mx-auto px-6 mt-10 max-w-4xl">
                {/* Step 1: Checklist */}
                {step === "checklist" && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                                <ClipboardList className="w-5 h-5" /> Inspection Checklist
                            </h2>
                            <span className="px-3 py-1 bg-gray-100 rounded-lg text-[10px] font-black text-gray-500 uppercase tracking-widest">{checklistState.length} Items</span>
                        </div>
                        
                        {type === "BEFORE" ? (
                             <div className="grid grid-cols-1 gap-4">
                                {checklistState.map((item, idx) => (
                                    <ChecklistRow
                                        key={item.itemId}
                                        item={item}
                                        status={item.status}
                                        remarks={item.remarks}
                                        onChange={(s, r) => handleChecklistChange(idx, s, r)}
                                    />
                                ))}
                             </div>
                        ) : (
                             <InspectionComparisonTable
                                items={checklistState}
                                onItemsChange={handleChecklistChange}
                             />
                        )}

                        <button 
                            onClick={() => { window.scrollTo(0,0); setStep("damages"); }}
                            className="w-full h-16 bg-[#0f0f0f] text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 mt-8 active:scale-95 transition-all"
                        >
                            Continue to Damage Marking
                        </button>
                    </div>
                )}

                {/* Step 2: Damages */}
                {step === "damages" && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                                <AlertCircle className="w-5 h-5" /> Vehicle Damage Map
                            </h2>
                            <div className="flex gap-2">
                                <span className="px-3 py-1 bg-gray-100 rounded-lg text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full bg-gray-400" /> Existing
                                </span>
                                <span className="px-3 py-1 bg-red-50 rounded-lg text-[10px] font-black text-red-600 uppercase tracking-widest flex items-center gap-1 border border-red-100">
                                    <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" /> New Damage
                                </span>
                            </div>
                        </div>

                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            Tap anywhere on the diagram below to mark a new area of damage.
                        </p>

                        <DamageCanvas
                            damages={damages}
                            onAddDamage={(d) => setDamages([...damages, d])}
                            onRemoveDamage={(idx) => setDamages(damages.filter((_, i) => i !== idx))}
                        />

                        <div className="flex gap-4">
                             <button 
                                onClick={() => { window.scrollTo(0,0); setStep("checklist"); }}
                                className="flex-1 h-16 bg-white border-2 border-gray-100 rounded-[2rem] font-black text-xs text-gray-400 uppercase tracking-widest hover:bg-gray-50 transition-all mt-8 active:scale-95"
                             >
                                Previous
                             </button>
                             <button 
                                onClick={() => { window.scrollTo(0,0); setStep("summary"); }}
                                className="flex-1 h-16 bg-[#0f0f0f] text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 mt-8 active:scale-95"
                             >
                                Finalize Summary
                             </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Summary */}
                {step === "summary" && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Review & Submit
                            </h2>
                        </div>

                        <div className="bg-white border-2 border-gray-100 rounded-[2.5rem] p-8 space-y-8 shadow-sm">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="p-6 bg-gray-50 rounded-[1.5rem]">
                                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest block mb-1">Checklist Issues</span>
                                    <p className="text-2xl font-black text-gray-900">
                                        {checklistState.filter(i => (type === "BEFORE" ? i.status : i.afterStatus) === "NOT_OK").length}
                                    </p>
                                    <p className="text-[9px] font-bold text-gray-400 mt-1 italic">Total components with issues</p>
                                </div>
                                <div className="p-6 bg-red-50 rounded-[1.5rem] border border-red-100">
                                    <span className="text-[10px] font-black text-red-300 uppercase tracking-widest block mb-1">New Damages</span>
                                    <p className="text-2xl font-black text-red-600">
                                        {damages.filter(d => d.isNew).length}
                                    </p>
                                    <p className="text-[9px] font-bold text-red-400 mt-1 italic">Visual markings added</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Overall Inspection Remarks</label>
                                <textarea
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-gray-200 focus:bg-white rounded-[1.5rem] p-6 text-sm font-bold text-gray-900 outline-none transition-all resize-none shadow-inner"
                                    rows={5}
                                    placeholder="Write any overall notes about the vehicle condition for this session..."
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                />
                                <p className="text-[10px] text-gray-300 font-bold italic ml-1">This will be shared in the official report.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                             <button 
                                onClick={() => { window.scrollTo(0,0); setStep("damages"); }}
                                className="flex-1 h-16 bg-white border-2 border-gray-100 rounded-[2rem] font-black text-xs text-gray-300 uppercase tracking-widest hover:bg-gray-50 transition-all mt-8 active:scale-95"
                             >
                                Back
                             </button>
                             <button 
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="flex-1 h-16 bg-emerald-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-200 mt-8 flex items-center justify-center gap-2 active:scale-95"
                             >
                                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                {submitting ? "Submitting..." : `Submit ${type} Inspection`}
                             </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function InspectionPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc]">
                <Loader2 className="w-12 h-12 text-[#0f0f0f] animate-spin" />
            </div>
        }>
            <InspectionContent />
        </Suspense>
    );
}
