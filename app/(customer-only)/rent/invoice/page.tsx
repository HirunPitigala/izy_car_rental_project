"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import InvoiceView, { InvoiceData } from "@/components/rent/InvoiceView";
import { Loader2 } from "lucide-react";
import { mockVehicles } from "@/lib/mockVehicles";

function InvoiceContent() {
    const searchParams = useSearchParams();
    const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);

    useEffect(() => {
        const vehicleId = searchParams.get("vehicleId") || "";
        // Attempt to find the vehicle to display its name in the invoice
        const mock = mockVehicles.find(v => v.id === vehicleId);

        // Simulation of mapping step 8 invoice fields
        setInvoiceData({
            invoiceId: Math.floor(Math.random() * 900000) + 100000 + "",
            bookingId: Math.floor(Math.random() * 90000) + 10000 + "",
            customerName: "Authorized Customer", // Fallback for demonstration
            vehicle: mock ? `${mock.brand} ${mock.model} (${mock.plateNumber})` : "Premium Car Rental",
            dateRange: `${searchParams.get("rental_start_date")} - ${searchParams.get("rental_end_date")}`,
            totalAmount: Number(searchParams.get("totalPrice")) || 0,
            paymentStatus: "Completed"
        });
    }, [searchParams]);

    if (!invoiceData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-400 font-bold">Generating secure invoice...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-12">
            <InvoiceView data={invoiceData} />
        </div>
    );
}

export default function RentInvoicePage() {
    return (
        <div className="min-h-screen bg-[#fafafa]">
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                </div>
            }>
                <InvoiceContent />
            </Suspense>
        </div>
    );
}
