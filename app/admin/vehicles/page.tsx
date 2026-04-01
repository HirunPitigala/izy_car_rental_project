"use client";

import Link from "next/link";
import { ChevronRight, Car, Truck, Key, Wind } from "lucide-react";

const categories = [
    {
        name: "Rent a Car",
        description: "Standard daily, weekly, and monthly vehicle rentals.",
        icon: Car,
        href: "/admin/vehicles/rent-a-car",
        active: true,
        color: "bg-blue-50 text-blue-600 border-blue-100 ring-blue-50",
    },
    {
        name: "Pickups",
        description: "Point-to-point pickup and drop-off services.",
        icon: Truck,
        href: "/admin/vehicles/pickup-service",
        active: true,
        color: "bg-emerald-50 text-emerald-600 border-emerald-100 ring-emerald-50",
    },
    {
        name: "Airport pickups",
        description: "Airport pickup and drop-off vehicle rental services.",
        icon: Key,
        href: "/admin/vehicles/airport-rental",
        active: true,
        color: "bg-purple-50 text-purple-600 border-purple-100 ring-purple-50",
    },
    {
        name: "Wedding Car Rental",
        description: "Premium and luxury vehicle rental services.",
        icon: Wind,
        href: "/admin/vehicles/wedding-cars",
        active: true,
        color: "bg-amber-50 text-amber-600 border-amber-100 ring-amber-50",
    },
];

export default function AdminVehiclesPage() {
    return (
        <div className="min-h-screen bg-[#fcfcfc] pb-12">
            <main className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-10">
                    <nav className="mb-3 flex items-center gap-2 text-sm text-gray-400">
                        <Link href="/admin/dashboard" className="transition-colors hover:text-[#0f0f0f]">Admin</Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="font-medium text-[#0f0f0f]">Vehicles</span>
                    </nav>
                    <h1 className="text-2xl font-bold tracking-tight text-[#0f0f0f]">Service Category</h1>
                    <p className="mt-2 text-base text-gray-500">Select a service category to manage vehicles.</p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {categories.map((category) => (
                        <CategoryCard key={category.name} category={category} />
                    ))}
                </div>
            </main>
        </div>
    );
}

function CategoryCard({ category }: { category: any }) {
    const Icon = category.icon;

    const CardContent = (
        <div className={`relative flex h-full flex-col p-6 transition-all duration-300 ${category.active
            ? "bg-white border-2 border-transparent hover:border-yellow-400/50 hover:shadow-premium cursor-pointer"
            : "bg-gray-50/50 border-2 border-gray-100 grayscale-[0.5] opacity-80 cursor-not-allowed"
            } rounded-3xl border`}>
            {/* Icon Wrapper */}
            <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${category.color} ring-4 transition-transform group-hover:scale-110`}>
                <Icon className="h-7 w-7" />
            </div>

            <div className="flex-1">
                <h3 className="mb-2 text-xl font-bold text-[#0f0f0f]">{category.name}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{category.description}</p>
            </div>

            <div className="mt-8 flex items-center justify-between">
                <span className={`text-sm font-bold ${category.active ? "text-[#dc2626]" : "text-gray-400"}`}>
                    {category.active ? "Manage Now" : "Coming Soon"}
                </span>
                {category.active && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 transition-colors group-hover:bg-yellow-400 group-hover:text-black">
                        <ChevronRight className="h-4 w-4" />
                    </div>
                )}
            </div>

            {!category.active && (
                <div className="absolute inset-0 z-10 rounded-3xl" />
            )}
        </div>
    );

    if (category.active) {
        return (
            <Link href={category.href} className="group h-full">
                {CardContent}
            </Link>
        );
    }

    return <div className="group h-full">{CardContent}</div>;
}
