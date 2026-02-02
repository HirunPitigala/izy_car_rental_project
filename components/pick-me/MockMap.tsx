"use client";

import { MapPin, Navigation, User } from "lucide-react";

export default function MockMap() {
    return (
        <div className="relative w-full h-[400px] md:h-full bg-gray-200 rounded-[40px] overflow-hidden border border-gray-100 shadow-inner">
            {/* Mock Map Background Grid */}
            <div className="absolute inset-0 pattern-grid-lg text-gray-300/40" />

            {/* City Road Lines Mock */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-white" />
            <div className="absolute top-0 left-1/3 w-1 h-full bg-white" />
            <div className="absolute top-0 left-2/3 w-1 h-full bg-white" />
            <div className="absolute top-1/4 left-0 w-full h-1 bg-white" />

            {/* Route Line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <path
                    d="M 150 150 L 300 250 L 450 350"
                    stroke="#fbbf24"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray="10,5"
                    className="animate-pulse"
                />
            </svg>

            {/* Pickup Marker */}
            <div className="absolute top-[135px] left-[135px] z-10">
                <div className="relative flex flex-col items-center">
                    <div className="bg-red-500 text-white p-2 rounded-full shadow-lg">
                        <MapPin className="w-6 h-6" />
                    </div>
                    <div className="bg-white px-2 py-0.5 rounded shadow text-xs font-black uppercase mt-1">Pickup</div>
                </div>
            </div>

            {/* Destination Marker */}
            <div className="absolute top-[335px] left-[435px] z-10">
                <div className="relative flex flex-col items-center">
                    <div className="bg-green-500 text-white p-2 rounded-full shadow-lg">
                        <Navigation className="w-6 h-6 rotate-45" />
                    </div>
                    <div className="bg-white px-2 py-0.5 rounded shadow text-xs font-black uppercase mt-1">Drop</div>
                </div>
            </div>

            {/* Driver Icon */}
            <div className="absolute top-[200px] left-[220px] transition-all duration-1000 animate-bounce cursor-pointer z-20">
                <div className="bg-black text-white p-2 rounded-2xl shadow-2xl scale-110 border-2 border-yellow-400">
                    <User className="w-6 h-6" />
                </div>
            </div>

            {/* Labels */}
            <div className="absolute bottom-6 left-6 right-6 flex justify-between pointer-events-none">
                <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-2xl shadow border border-white/20 text-xs font-bold text-gray-500 uppercase tracking-widest">
                    Mock Map Data
                </div>
            </div>
        </div>
    );
}
