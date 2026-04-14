'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Banknote, Calendar, FileText, Loader2 } from 'lucide-react';
import { getDailyReportData } from '@/lib/actions/reportActions';
import { generateReportPDF } from '@/lib/utils/reportPdfGenerator';
import PDFViewerModal from '@/components/shared/PDFViewerModal';

export default function DailyReportPage() {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        const result = await getDailyReportData(selectedDate);
        if (result.success) {
            setData(result.data);
        } else {
            console.error(result.error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [selectedDate]);

    const handleViewPDF = () => {
        if (!data) return;
        
        const blob = generateReportPDF({
            title: "Daily Transaction Report",
            range: data.date,
            totalRevenue: data.totalRevenue,
            totalBookings: data.reservations.length,
            reservations: data.reservations
        });
        
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
        setIsModalOpen(true);
    };

    return (
        <div className="container-custom py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin/reports/view" className="p-2 -ml-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-[#0f0f0f] transition-colors">
                        <ChevronLeft className="h-6 w-6" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-[#0f0f0f]">Daily Report</h1>
                        <p className="text-gray-500">View performance for a specific day</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <input 
                        type="date" 
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="rounded-xl border border-gray-200 px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                    />
                    <button 
                        onClick={handleViewPDF}
                        disabled={loading || !data?.reservations.length}
                        className="flex items-center gap-2 bg-[#0f0f0f] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-gray-200 hover:bg-[#262626] transition-all disabled:opacity-50"
                    >
                        <FileText className="h-4 w-4" />
                        View PDF Report
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Daily Data...</p>
                </div>
            ) : data ? (
                <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="ek-card p-6 flex items-center gap-4">
                            <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                <Calendar className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Report Date</p>
                                <p className="text-xl font-bold text-[#0f0f0f]">{data.date}</p>
                            </div>
                        </div>
                        <div className="ek-card p-6 flex items-center gap-4">
                            <div className="h-12 w-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                                <Banknote className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Daily Revenue</p>
                                <p className="text-xl font-bold text-[#0f0f0f]">LKR {data.totalRevenue.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Reservations Table */}
                    <div className="ek-card overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                            <h3 className="font-bold text-[#0f0f0f]">Daily Bookings</h3>
                            <span className="text-xs font-bold bg-gray-200 px-2 py-1 rounded-lg">{data.reservations.length} Bookings</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100 text-left">
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Vehicle</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Revenue</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {data.reservations.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-10 text-center text-gray-400 italic text-sm">
                                                No bookings found for this day.
                                            </td>
                                        </tr>
                                    ) : (
                                        data.reservations.map((res: any) => (
                                            <tr key={res.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4 text-sm font-medium text-[#0f0f0f]">#{res.id}</td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm font-medium text-[#0f0f0f]">{res.customerName}</p>
                                                    <p className="text-xs text-gray-500">{res.phoneNumber}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm text-[#0f0f0f]">{res.vehicleName || "Unassigned"}</p>
                                                    <p className="text-xs text-gray-500">{res.vehicleNumber || "--"}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                                                        res.status === 'ACCEPTED' ? 'bg-green-50 text-green-700 border-green-100' : 
                                                        res.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                        'bg-gray-50 text-gray-700 border-gray-100'
                                                    }`}>
                                                        {res.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-bold text-[#0f0f0f] text-right">
                                                    LKR {parseFloat(res.revenue || "0").toLocaleString()}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                <div className="text-center py-20 text-gray-400">
                    Failed to load report data. Please try again.
                </div>
            )}

            <PDFViewerModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                url={pdfUrl}
                title={`Daily Report - ${selectedDate}`}
            />
        </div>
    );
}
