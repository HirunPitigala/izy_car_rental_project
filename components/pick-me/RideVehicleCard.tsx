import Link from "next/link";
import Image from "next/image";
import { RideVehicle } from "@/lib/mockPickMe";
import { Star, Clock, ChevronRight, MapPin } from "lucide-react";

interface RideVehicleCardProps {
    vehicle: RideVehicle;
}

export default function RideVehicleCard({ vehicle }: RideVehicleCardProps) {
    // Fallback image if missing
    const displayImage = vehicle.image || "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000";

    return (
        <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
            {/* Image Container */}
            <div className="relative h-64 w-full overflow-hidden bg-gray-100">
                <Image
                    src={displayImage}
                    alt={vehicle.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-gray-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-white">
                    {vehicle.type}
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-2xl font-black text-gray-900 leading-tight mb-2">
                            {vehicle.name}
                        </h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-gray-900">LKR {(vehicle.pricePerKm * 10).toLocaleString()}</span>
                            <span className="text-sm text-gray-400 font-medium italic">/ est.</span>
                        </div>
                    </div>
                </div>

                {/* Specs/Info Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="flex items-center gap-2 text-gray-600">
                        <div className="p-2.5 bg-gray-50 rounded-xl group-hover:bg-yellow-50 group-hover:text-yellow-600 transition-colors">
                            <Clock className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold">{vehicle.estimatedTime} away</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <div className="p-2.5 bg-gray-50 rounded-xl group-hover:bg-yellow-50 group-hover:text-yellow-600 transition-colors">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 border-none" />
                        </div>
                        <span className="text-xs font-bold">4.8 Rating</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 col-span-2">
                        <div className="p-2.5 bg-gray-50 rounded-xl group-hover:bg-yellow-50 group-hover:text-yellow-600 transition-colors">
                            <MapPin className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold">LKR {vehicle.pricePerKm} / km</span>
                    </div>
                </div>

                {/* Action Button */}
                <Link
                    href={`/pick-me/trip-details?v=${vehicle.id}`}
                    className="mt-auto group/btn bg-gray-900 hover:bg-yellow-400 hover:text-gray-900 text-white w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 shadow-lg shadow-gray-100"
                >
                    Select Ride
                    <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
}
