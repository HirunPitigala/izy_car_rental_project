"use client";

import { Download, Printer, CheckCircle2, Car, Calendar, User, FileText } from "lucide-react";

export interface InvoiceData {
    invoiceId: string;
    bookingId: string;
    customerName: string;
    vehicle: string;
    dateRange: string;
    totalAmount: number;
    paymentStatus: string;
}

export default function InvoiceView({ data }: { data: InvoiceData }) {
    return (
        <div className="bg-white rounded-[40px] border border-gray-100 shadow-[0_32px_100px_rgba(0,0,0,0.06)] overflow-hidden max-w-4xl mx-auto my-12">
            {/* Header Section */}
            <div className="bg-gray-900 p-12 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-600 text-xs font-black uppercase tracking-[0.2em] mb-4">Official Receipt</span>
                    <h1 className="text-2xl font-black uppercase tracking-tighter mb-1">Invoice</h1>
                    <p className="text-gray-400 font-bold text-sm flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        NO: #INV-{data.invoiceId}
                    </p>
                </div>
                <div className="text-left md:text-right">
                    <div className="w-20 h-20 bg-green-500 rounded-[24px] flex items-center justify-center ml-auto mb-4 shadow-lg shadow-green-500/20">
                        <CheckCircle2 className="w-12 h-12 text-white" />
                    </div>
                    <p className="text-2xl font-black tracking-widest text-green-400 uppercase">{data.paymentStatus}</p>
                </div>
            </div>

            {/* Invoice Content */}
            <div className="p-12 space-y-16">
                {/* Meta Data Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
                    <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Booking Reference</p>
                        <p className="font-black text-gray-900">#BK-{data.bookingId}</p>
                    </div>
                    <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Issue Date</p>
                        <p className="font-black text-gray-900">{new Date().toLocaleDateString('en-GB')}</p>
                    </div>
                    <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Payment Type</p>
                        <p className="font-black text-gray-900">Online Card</p>
                    </div>
                    <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Currency</p>
                        <p className="font-black text-gray-900">LKR (Lankan Rupee)</p>
                    </div>
                </div>

                <div className="h-px bg-gray-50" />

                {/* Details Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div className="space-y-6">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-3">
                            <User className="w-4 h-4 text-blue-600" /> Billed To
                        </h3>
                        <div>
                            <p className="text-2xl font-black text-gray-900 mb-1">{data.customerName}</p>
                            <p className="text-sm font-bold text-gray-400 leading-relaxed uppercase tracking-tighter">Verified Member • Premium Tier</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-3">
                            <Car className="w-4 h-4 text-blue-600" /> Vehicle & Journey
                        </h3>
                        <div>
                            <p className="text-2xl font-black text-gray-900 mb-1">{data.vehicle}</p>
                            <div className="flex items-center gap-2 text-gray-500 font-bold text-xs uppercase tracking-tight">
                                <Calendar className="w-4 h-4 text-gray-300" />
                                {data.dateRange}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Financials Table */}
                <div className="rounded-[28px] border border-gray-100 overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-widest font-mono">Item Description</th>
                                <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-widest font-mono text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            <tr>
                                <td className="p-6 font-bold text-gray-700">
                                    <p className="text-sm">Standard Vehicle Rental Fee</p>
                                    <p className="text-xs text-gray-400 mt-1 uppercase tracking-tight font-black">Daily Subscription Model</p>
                                </td>
                                <td className="p-6 text-sm font-black text-gray-900 text-right">LKR {data.totalAmount.toLocaleString()}</td>
                            </tr>
                            <tr>
                                <td className="p-6 font-bold text-gray-700">
                                    <p className="text-sm">Full Insurance Coverage (Waiver)</p>
                                    <p className="text-xs text-gray-400 mt-1 uppercase tracking-tight font-black">Complimentary</p>
                                </td>
                                <td className="p-6 text-sm font-black text-gray-900 text-right font-mono">0.00</td>
                            </tr>
                        </tbody>
                        <tfoot className="bg-gray-50/80">
                            <tr className="border-t-2 border-gray-900">
                                <td className="p-8 text-xl font-black text-gray-900">TOTAL PAID AMOUNT</td>
                                <td className="p-8 text-2xl font-black text-blue-600 text-right">LKR {data.totalAmount.toLocaleString()}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-6">
                    <button
                        onClick={() => window.print()}
                        className="flex-1 h-16 bg-gray-900 text-white font-black rounded-2xl flex items-center justify-center gap-4 transition-all hover:bg-black hover:shadow-2xl active:scale-95 text-sm uppercase tracking-widest"
                    >
                        <Download className="w-5 h-5" />
                        Download Receipt
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="flex-1 h-16 bg-white border-2 border-gray-100 text-gray-900 font-black rounded-2xl flex items-center justify-center gap-4 transition-all hover:bg-gray-50 active:scale-95 text-sm uppercase tracking-widest"
                    >
                        <Printer className="w-5 h-5" />
                        Print Document
                    </button>
                </div>
            </div>

            <div className="bg-gray-50/50 p-8 text-center border-t border-gray-50">
                <p className="text-xs text-gray-400 font-black uppercase tracking-[0.4em]">Generated automatically by Car Rental & Transportation System</p>
            </div>
        </div>
    );
}
