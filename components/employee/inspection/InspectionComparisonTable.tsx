
"use client";

import React from "react";
import { ArrowRight, CheckCircle2, XCircle } from "lucide-react";

interface ComparisonItem {
  itemId: number;
  itemName: string;
  beforeStatus: "OK" | "NOT_OK";
  beforeRemarks: string | null;
  afterStatus: "OK" | "NOT_OK";
  afterRemarks: string;
}

interface InspectionComparisonTableProps {
  items: ComparisonItem[];
  onItemsChange: (index: number, status: "OK" | "NOT_OK", remarks: string) => void;
  readOnly?: boolean;
}

export default function InspectionComparisonTable({
  items,
  onItemsChange,
  readOnly = false,
}: InspectionComparisonTableProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {items.map((item, idx) => (
          <div key={item.itemId} className={`bg-gray-50 border-2 border-gray-100 rounded-[2rem] p-6 space-y-4 transition-all ${
            item.afterStatus === "NOT_OK" ? "border-red-100" : ""
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest">{item.itemName}</h4>
              <div className="flex items-center gap-3">
                {/* Before Status */}
                <div className="flex flex-col items-end">
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Before</span>
                    <span className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${
                      item.beforeStatus === "OK" ? "text-emerald-600" : "text-red-400"
                    }`}>
                      {item.beforeStatus === "OK" ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {item.beforeStatus}
                    </span>
                </div>
                
                <ArrowRight className="w-4 h-4 text-gray-300" />

                {/* After Status (Editable) */}
                <div className="flex flex-col items-start min-w-[120px]">
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">After</span>
                    {!readOnly ? (
                         <div className="flex bg-white/50 p-1 rounded-xl border border-white/80">
                            <button
                              onClick={() => onItemsChange(idx, "OK", item.afterRemarks)}
                              type="button"
                              className={`p-1.5 rounded-lg transition-all text-[9px] font-black uppercase tracking-widest ${
                                item.afterStatus === "OK" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-400"
                              }`}
                            >
                              OK
                            </button>
                            <button
                              onClick={() => onItemsChange(idx, "NOT_OK", item.afterRemarks)}
                              type="button"
                              className={`p-1.5 rounded-lg transition-all text-[9px] font-black uppercase tracking-widest ${
                                item.afterStatus === "NOT_OK" ? "bg-red-600 text-white shadow-sm" : "text-gray-400"
                              }`}
                            >
                              NOT OK
                            </button>
                          </div>
                    ) : (
                        <span className={`px-2 py-1 rounded-lg flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${
                            item.afterStatus === "OK" ? "text-emerald-600 bg-emerald-50" : "text-red-600 bg-red-100"
                          }`}>
                            {item.afterStatus === "OK" ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            {item.afterStatus}
                          </span>
                    )}
                </div>
              </div>
            </div>
            
            {/* Remarks Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-white/60">
                 <div className="space-y-1">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic opacity-60">Before Remarks</p>
                    <p className="text-[10px] font-bold text-gray-500 line-clamp-2">{item.beforeRemarks || "No previous remarks"}</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic opacity-60">After Remarks</p>
                    <textarea 
                        className={`w-full p-3 rounded-xl text-[10px] font-bold outline-none transition-all resize-none ${
                            readOnly 
                                ? "bg-transparent border-transparent text-gray-500" 
                                : "bg-white border-2 border-transparent focus:border-gray-200 text-gray-900"
                          }`}
                        placeholder="Add updates..."
                        rows={1}
                        value={item.afterRemarks}
                        disabled={readOnly}
                        onChange={(e) => onItemsChange(idx, item.afterStatus, e.target.value)}
                    />
                 </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
