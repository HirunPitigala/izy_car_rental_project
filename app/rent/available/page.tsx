import { mockVehicles } from "@/lib/mockVehicles";
import VehicleCard from "@/components/rent/VehicleCard";

export default function AvailableVehiclesPage() {
    return (
        <div className="bg-gray-50 min-h-screen pb-20 pt-10">
            <div className="container mx-auto px-6">
                {/* Header Section */}
                <div className="mb-12">
                    <h1 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">Available Vehicles</h1>
                    <div className="flex items-center gap-2">
                        <p className="text-gray-500 font-medium bg-white px-4 py-1.5 rounded-full border border-gray-100 shadow-sm">
                            Found <span className="text-gray-900 font-bold">{mockVehicles.length}</span> premium vehicles matching your search
                        </p>
                    </div>
                </div>

                {/* Vehicles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {mockVehicles.map((vehicle) => (
                        <VehicleCard key={vehicle.id} vehicle={vehicle} />
                    ))}
                </div>
            </div>
        </div>
    );
}
