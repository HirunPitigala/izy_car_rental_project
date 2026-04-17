"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import InvoiceView, { InvoiceData } from "@/components/rent/InvoiceView";
import { Loader2, AlertCircle } from "lucide-react";

function InvoiceContent() {
    const searchParams = useSearchParams();
    const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInvoice = async () => {
            const bookingId = searchParams.get("bookingId");
            if (!bookingId) {
                setError("Missing booking reference");
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`/api/customer/bookings/${bookingId}/invoice`);
                if (!res.ok) throw new Error("Could not retrieve billing information");
                
                const result = await res.json();
                if (result.success) {
                    const d = result.data;
                    setInvoiceData({
                        invoiceId: d.bookingId.toString(),
                        bookingId: d.bookingId.toString(),
                        customerName: d.customerName || "Authorized Customer",
                        vehicle: `${d.vehicle.brand} ${d.vehicle.model} (${d.vehicle.plateNumber})`,
                        dateRange: `${new Date(d.rentalDate).toLocaleDateString('en-GB')} - ${new Date(d.returnDate).toLocaleDateString('en-GB')}`,
                        totalAmount: Number(d.totalFare) || 0,
                        paymentStatus: d.status,
                        createdAt: d.createdAt
                    });
                } else {
                    throw new Error(result.error || "Failed to fetch invoice");
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchInvoice();
    }, [searchParams]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Generating Secure Billing Statement...</p>
            </div>
        );
    }

    if (error || !invoiceData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
                <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6">
                    <AlertCircle className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Billing Error</h2>
                <p className="text-gray-500 max-w-sm">{error || "The requested invoice could not be found."}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto">
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
