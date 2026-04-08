
"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { AlertCircle, X, Check } from "lucide-react";

export type DamageType = "SMALL_MARK" | "SCRATCH" | "DENT" | "CRACK";

export interface Damage {
  damageId?: number;
  damageType: DamageType;
  xPosition: number;
  yPosition: number;
  notes?: string;
  isNew?: boolean;
}

interface DamageCanvasProps {
  damages: Damage[];
  onAddDamage?: (damage: Damage) => void;
  onRemoveDamage?: (index: number) => void;
  readOnly?: boolean;
}

const DAMAGE_TYPES = [
  { id: "SMALL_MARK", label: "Small Mark", color: "bg-yellow-500" },
  { id: "SCRATCH", label: "Scratch", color: "bg-orange-500" },
  { id: "DENT", label: "Dent", color: "bg-red-500" },
  { id: "CRACK", label: "Crack", color: "bg-purple-500" },
];

export default function DamageCanvas({
  damages,
  onAddDamage,
  onRemoveDamage,
  readOnly = false,
}: DamageCanvasProps) {
  const [clickPos, setClickPos] = useState<{ x: number, y: number } | null>(null);
  const [selectedType, setSelectedType] = useState<DamageType>("SMALL_MARK");
  const [notes, setNotes] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (readOnly || !onAddDamage) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setClickPos({ x, y });
  };

  const confirmDamage = () => {
    if (!clickPos || !onAddDamage) return;

    onAddDamage({
      damageType: selectedType,
      xPosition: clickPos.x,
      yPosition: clickPos.y,
      notes,
      isNew: true,
    });

    setClickPos(null);
    setNotes("");
  };

  return (
    <div className="space-y-4">
      <div 
        ref={containerRef}
        className="relative bg-white border border-gray-100 rounded-[2rem] overflow-hidden cursor-crosshair touch-none"
        style={{ aspectRatio: "16/10" }}
        onClick={handleImageClick}
      >
        {/* Car Diagram */}
        <div className="absolute inset-0 flex items-center justify-center p-8">
            <img 
                src="/car_diagram.png" 
                alt="Car Diagram" 
                className="w-full h-full object-contain pointer-events-none opacity-80"
            />
        </div>

        {/* Existing Markers */}
        {damages.map((damage, idx) => (
          <div
            key={idx}
            className={`absolute w-4 h-4 -ml-2 -mt-2 rounded-full border-2 border-white shadow-sm flex items-center justify-center group z-10 ${
              damage.isNew ? "bg-red-600 animate-pulse" : "bg-gray-400"
            }`}
            style={{ left: `${damage.xPosition}%`, top: `${damage.yPosition}%` }}
            title={`${damage.damageType}: ${damage.notes || ""}`}
          >
             <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 p-2 bg-[#0f0f0f] text-white text-[10px] rounded-lg font-bold z-20">
                <span className="block border-b border-white/20 pb-1 mb-1 uppercase tracking-widest">{damage.damageType.replace('_', ' ')}</span>
                {damage.notes && <p className="font-medium text-gray-300">{damage.notes}</p>}
                {!readOnly && damage.isNew && onRemoveDamage && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); onRemoveDamage(idx); }}
                        className="mt-2 text-red-400 hover:text-red-300 flex items-center gap-1"
                    >
                        <X className="w-2 h-2" /> Remove
                    </button>
                )}
             </div>
          </div>
        ))}

        {/* Temp Click Marker */}
        {clickPos && (
          <div
            className="absolute w-6 h-6 -ml-3 -mt-3 rounded-full bg-red-600 border-2 border-white shadow-lg flex items-center justify-center z-20"
            style={{ left: `${clickPos.x}%`, top: `${clickPos.y}%` }}
          />
        )}
      </div>

      {/* Damage Selection Modal/UI */}
      {clickPos && (
        <div className="bg-gray-50 border-2 border-gray-100 p-6 rounded-[2rem] animate-in slide-in-from-bottom-2 duration-300">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Mark New Damage</h4>
            <button onClick={() => setClickPos(null)} className="p-2 hover:bg-gray-100 rounded-full transition-all">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {DAMAGE_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id as DamageType)}
                className={`p-3 rounded-2xl border-2 transition-all text-left flex flex-col gap-1 ${
                  selectedType === type.id 
                    ? "bg-white border-gray-900 shadow-sm" 
                    : "bg-transparent border-transparent hover:bg-white/50"
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${type.color}`} />
                <span className="text-[10px] font-black text-gray-900 uppercase tracking-tighter">{type.label}</span>
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <textarea
              placeholder="Add notes about the damage (optional)..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-white border-2 border-gray-100 rounded-2xl p-4 text-xs font-bold text-gray-900 outline-none focus:border-red-200 transition-all resize-none"
              rows={2}
            />
            <button
              onClick={confirmDamage}
              className="w-full h-12 bg-[#0f0f0f] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" /> Save Marker
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
