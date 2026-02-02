import { mockVehicles } from "@/lib/mockVehicles";
import VehicleCard from "@/components/rent/VehicleCard";

export default function WeddingAvailablePage() {
    const weddingVehicles = mockVehicles.filter(v => v.serviceCategory === "Wedding" || v.serviceCategory === "Luxury");

    return (
        <div className="bg-gray-50 min-h-screen pb-20 pt-10">
            <div className="container mx-auto px-6">
                <div className="mb-12 flex flex-col items-center">
                    <h1 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">Available Wedding Cars</h1>
                    <div className="flex items-center gap-2">
                        <p className="text-gray-500 font-medium bg-white px-4 py-1.5 rounded-full border border-gray-100 shadow-sm">
                            Found <span className="text-gray-900 font-bold">{weddingVehicles.length}</span> luxury vehicles for your special day
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {weddingVehicles.map((vehicle) => (
                        <VehicleCard key={vehicle.id} vehicle={vehicle} baseUrl="/wedding" />
                    ))}
                </div>
            </div>
        </div>
    );
}
