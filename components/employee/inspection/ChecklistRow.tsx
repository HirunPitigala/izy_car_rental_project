
"use client";

import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";

interface Item {
  itemId: number;
  itemName: string;
}

interface ChecklistRowProps {
  item: Item;
  status: "OK" | "NOT_OK";
  remarks: string;
  onChange: (status: "OK" | "NOT_OK", remarks: string) => void;
  readOnly?: boolean;
}

export default function ChecklistRow({
  item,
  status,
  remarks,
  onChange,
  readOnly = false,
}: ChecklistRowProps) {
  return (
    <div className={`p-4 rounded-2xl border transition-all flex flex-col gap-3 ${
      status === "NOT_OK" ? "bg-red-50 border-red-100" : "bg-white border-gray-100"
    }`}>
      <div className="flex items-center justify-between">
        <h5 className="text-xs font-black text-gray-900 uppercase tracking-widest">{item.itemName}</h5>
        {!readOnly && (
          <div className="flex bg-gray-100/50 p-1 rounded-xl">
            <button
              onClick={() => onChange("OK", remarks)}
              type="button"
              className={`p-2 rounded-lg transition-all flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${
                status === "OK" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <CheckCircle2 className="w-3 h-3" /> OK
            </button>
            <button
              onClick={() => onChange("NOT_OK", remarks)}
              type="button"
              className={`p-2 rounded-lg transition-all flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${
                status === "NOT_OK" ? "bg-red-600 text-white shadow-sm" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <XCircle className="w-3 h-3" /> NOT OK
            </button>
          </div>
        )}
        {readOnly && (
           <span className={`px-2 py-1 rounded-lg flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${
             status === "OK" ? "text-emerald-600 bg-emerald-50" : "text-red-600 bg-red-100"
           }`}>
             {status === "OK" ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
             {status}
           </span>
        )}
      </div>

      {(!readOnly || (readOnly && remarks)) && (
        <textarea
            placeholder="Add remarks for this item... (required if NOT OK)"
            value={remarks}
            onChange={(e) => onChange(status, e.target.value)}
            disabled={readOnly}
            className={`w-full p-3 rounded-xl text-[10px] font-bold outline-none transition-all resize-none ${
              readOnly 
                ? "bg-transparent border-transparent text-gray-500 italic" 
                : "bg-white border-2 border-transparent focus:border-gray-200 text-gray-900"
            }`}
            rows={1}
        />
      )}
    </div>
  );
}
