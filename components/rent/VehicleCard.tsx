import Link from "next/link";
import Image from "next/image";
import { Vehicle } from "@/lib/mockVehicles";
import { Users, Fuel, Gauge, Snowflake, ChevronRight } from "lucide-react";

interface VehicleCardProps {
    vehicle: Vehicle;
    baseUrl?: string;
}

export default function VehicleCard({ vehicle, baseUrl = "/rent" }: VehicleCardProps) {
    return (
        <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
            {/* Image Container */}
            <div className="relative h-80 w-full overflow-hidden bg-gray-100">
                <Image
                    src={vehicle.image}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-2xl font-black text-gray-900 leading-tight mb-2">
                            {vehicle.brand} <span className="text-gray-400 font-medium">{vehicle.model}</span>
                        </h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-gray-900">LKR {vehicle.ratePerDay.toLocaleString()}</span>
                            <span className="text-sm text-gray-400 font-medium">/ day</span>
                        </div>
                    </div>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="flex items-center gap-2 text-gray-600">
                        <div className="p-2.5 bg-gray-50 rounded-xl group-hover:bg-yellow-50 group-hover:text-yellow-600 transition-colors">
                            <Users className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold">{vehicle.capacity} Seats</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <div className="p-2.5 bg-gray-50 rounded-xl group-hover:bg-yellow-50 group-hover:text-yellow-600 transition-colors">
                            <Gauge className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold">{vehicle.transmissionType}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <div className="p-2.5 bg-gray-50 rounded-xl group-hover:bg-yellow-50 group-hover:text-yellow-600 transition-colors">
                            <Fuel className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold">{vehicle.fuelType}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <div className="p-2.5 bg-gray-50 rounded-xl group-hover:bg-yellow-50 group-hover:text-yellow-600 transition-colors">
                            <Snowflake className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold">A/C System</span>
                    </div>
                </div>

                {/* Action Button */}
                <Link
                    href={`${baseUrl}/${vehicle.id}`}
                    className="mt-auto group/btn bg-gray-900 hover:bg-yellow-400 hover:text-gray-900 text-white w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 shadow-lg shadow-gray-100"
                >
                    View Details
                    <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
}
