"use client";

import { Download, Printer, FileText, ChevronLeft, Car, Calendar, User, Mail, Phone, MapPin } from "lucide-react";
import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Link from "next/link";

export interface InvoiceData {
    invoiceId: string;
    bookingId: string;
    customerName: string;
    vehicle: string;
    dateRange: string;
    totalAmount: number;
    paymentStatus: string;
    createdAt?: string;
}

export default function InvoiceView({ data }: { data: InvoiceData }) {
    const invoiceRef = useRef<HTMLDivElement>(null);

    const handleDownloadPDF = async () => {
        if (!invoiceRef.current) return;

        try {
            const actionsDiv = document.getElementById('invoice-actions');
            if (actionsDiv) actionsDiv.style.visibility = 'hidden';
            const backBtn = document.getElementById('back-to-portal');
            if (backBtn) backBtn.style.visibility = 'hidden';

            const canvas = await html2canvas(invoiceRef.current, {
                scale: 3, // Higher scale for clarity in text
                useCORS: true,
                logging: false,
                backgroundColor: "#ffffff",
            });

            if (actionsDiv) actionsDiv.style.visibility = 'visible';
            if (backBtn) backBtn.style.visibility = 'visible';

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4"
            });

            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(`IZY-Invoice-${data.bookingId}.pdf`);
        } catch (error) {
            console.error("PDF Generation Error:", error);
            alert("Failed to generate PDF. Please try the Print option.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-6 font-sans text-gray-900">
            <Link 
                id="back-to-portal"
                href="/customer/profile/bookings" 
                className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-black transition-all mb-8 uppercase tracking-widest no-print"
            >
                <ChevronLeft className="w-4 h-4" />
                Back to Dashboard
            </Link>

            {/* Main Document Content */}
            <div ref={invoiceRef} className="bg-white p-12 border border-gray-100 shadow-sm min-h-262.5 flex flex-col print:shadow-none print:border-none print:p-0">
                {/* Header: Company Info */}
                <div className="flex flex-col md:flex-row justify-between items-start border-b-2 border-black pb-8 mb-10 gap-8">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter mb-2">IZY CAR RENTAL</h1>
                        <p className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6">Official Rental Invoice</p>
                        
                        <div className="space-y-1 text-xs font-medium text-gray-600 uppercase tracking-tight">
                            <p className="flex items-center gap-2"><MapPin className="w-3 h-3" /> No. 45, Galle Road, Colombo 03, Sri Lanka</p>
                            <p className="flex items-center gap-2"><Phone className="w-3 h-3" /> +94 11 234 5678 / +94 77 308 4563</p>
                            <p className="flex items-center gap-2"><Mail className="w-3 h-3" /> hello@izycar.com</p>
                        </div>
                    </div>
                    <div className="text-right md:w-64">
                        <div className="border border-black p-4 inline-block w-full text-center">
                            <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Invoice Number</p>
                            <p className="text-xl font-black">#INV-{data.bookingId.toString().padStart(6, '0')}</p>
                        </div>
                        <div className="mt-4 text-xs font-bold space-y-1">
                            <p>DATE: {data.createdAt ? new Date(data.createdAt).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB')}</p>
                            <p>REF: #BK-{data.bookingId}</p>
                            <p className="text-blue-600">STATUS: {data.paymentStatus === 'ACCEPTED' ? 'PAID' : 'PENDING'}</p>
                        </div>
                    </div>
                </div>

                {/* Billing Details */}
                <div className="grid grid-cols-2 gap-12 mb-12">
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-200 pb-2">Billed To</h3>
                        <div>
                            <p className="text-xl font-black uppercase">{data.customerName}</p>
                            <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase">Verified Rental Member</p>
                        </div>
                    </div>
                    <div className="space-y-4 text-right">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-200 pb-2">Vehicle Details</h3>
                        <div className="space-y-1">
                            <p className="text-xl font-black uppercase">{data.vehicle}</p>
                            <p className="text-xs font-bold text-gray-500 flex items-center justify-end gap-2">
                                <Calendar className="w-3 h-3" /> PERIOD: {data.dateRange}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Price Table */}
                <div className="flex-1">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-t border-b-2 border-black">
                                <th className="py-4 text-[10px] font-black uppercase tracking-widest">DESCRIPTION</th>
                                <th className="py-4 text-[10px] font-black uppercase tracking-widest text-right">TOTAL (LKR)</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm font-medium divide-y divide-gray-100">
                            <tr>
                                <td className="py-6 pr-6">
                                    <p className="font-bold uppercase tracking-tight">Main Rental Charge</p>
                                    <p className="text-[10px] text-gray-400 mt-1">Vehicle usage for the specified duration including base insurance.</p>
                                </td>
                                <td className="py-6 text-right font-black">
                                    {data.totalAmount.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                                </td>
                            </tr>
                            <tr>
                                <td className="py-6 pr-6">
                                    <p className="font-bold uppercase tracking-tight">Standard Service Fee</p>
                                    <p className="text-[10px] text-gray-400 mt-1">Booking processing and fleet maintenance fee.</p>
                                </td>
                                <td className="py-6 text-right font-black">
                                    0.00
                                </td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr className="border-t-2 border-black">
                                <td className="py-6 text-lg font-black uppercase">Grand Total</td>
                                <td className="py-6 text-2xl font-black text-right border-l-2 border-gray-50 pl-6">
                                    LKR {data.totalAmount.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                                </td>
                            </tr>
                        </tfoot>
                    </table>

                    <div className="mt-8 p-4 bg-gray-50 border border-gray-100 italic text-[11px] text-gray-500 leading-relaxed">
                        <p className="font-bold mb-1 uppercase tracking-wider not-italic">Notes & Conditions:</p>
                        <p>This is a computer generated document. No signature is required. Please keep this as a proof of payment for vehicle collection. Refund policy is applicable as per the signed agreement.</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-16 pt-8 border-t border-gray-200 text-center">
                    <p className="text-[9px] font-black uppercase tracking-[0.5em] text-gray-300 mb-2">Quality • Security • IZY CARS</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Thank you for choosing IZY Car Rental. Drive Safely.</p>
                </div>
            </div>

            {/* Floating Actions for web view only */}
            <div id="invoice-actions" className="flex justify-center gap-4 mt-12 no-print">
                <button
                    onClick={handleDownloadPDF}
                    className="h-14 px-10 bg-black text-white font-black rounded-lg flex items-center gap-3 transition-all hover:bg-gray-800 active:scale-95 text-xs uppercase tracking-widest shadow-xl"
                >
                    <Download className="w-4 h-4" />
                    Download PDF
                </button>
                <button
                    onClick={() => window.print()}
                    className="h-14 px-10 border-2 border-black font-black rounded-lg flex items-center gap-3 transition-all hover:bg-gray-50 active:scale-95 text-xs uppercase tracking-widest"
                >
                    <Printer className="w-4 h-4" />
                    Print
                </button>
            </div>

            <style jsx global>{`
                @media print {
                    .no-print { display: none !important; }
                    body { background: white !important; }
                }
            `}</style>
        </div>
    );
}
