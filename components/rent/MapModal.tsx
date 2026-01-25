"use client";

import { useEffect, useState } from "react";
import { X, MapPin } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icon issue in Next.js
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

interface MapModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectLocation: (location: string) => void;
    title: string;
}

function LocationMarker({ onSelect }: { onSelect: (latlng: L.LatLng) => void }) {
    const [position, setPosition] = useState<L.LatLng | null>(null);

    useMapEvents({
        click(e) {
            setPosition(e.latlng);
            onSelect(e.latlng);
        },
    });

    return position === null ? null : (
        <Marker position={position} icon={icon} />
    );
}

export default function MapModal({ isOpen, onClose, onSelectLocation, title }: MapModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!isOpen || !mounted) return null;

    const handleLocationSelect = async (latlng: L.LatLng) => {
        // In a real app, we'd use reverse geocoding. 
        // For this frontend-only demo, we'll simulate the address from coordinates.
        const simulatedAddress = `Location (${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)})`;
        onSelectLocation(simulatedAddress);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-400 rounded-lg text-gray-900">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                <div className="h-[500px] relative">
                    <MapContainer
                        center={[6.9271, 79.8612]} // Colombo center
                        zoom={13}
                        style={{ height: "100%", width: "100%" }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <LocationMarker onSelect={handleLocationSelect} />
                    </MapContainer>

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 backdrop-blur px-6 py-3 rounded-full shadow-lg border border-gray-100 italic text-sm text-gray-600">
                        Click on the map to select a location
                    </div>
                </div>
            </div>
        </div>
    );
}
