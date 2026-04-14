'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Banknote, CalendarDays, FileText, Loader2 } from 'lucide-react';
import { getWeeklyReportData } from '@/lib/actions/reportActions';
import { generateReportPDF } from '@/lib/utils/reportPdfGenerator';
import PDFViewerModal from '@/components/shared/PDFViewerModal';

export default function WeeklyReportPage() {
    // Default to last 7 days
    const [startDate, setStartDate] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() - 7);
        return d.toISOString().split('T')[0];
    });
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        const result = await getWeeklyReportData(startDate, endDate);
        if (result.success) {
            setData(result.data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [startDate, endDate]);

    const handleViewPDF = () => {
        if (!data) return;
        
        const blob = generateReportPDF({
            title: "Weekly Summary Report",
            range: data.range,
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
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin/reports/view" className="p-2 -ml-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-[#0f0f0f] transition-colors">
                        <ChevronLeft className="h-6 w-6" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-[#0f0f0f]">Weekly Report</h1>
                        <p className="text-gray-500">Analyze performance across a date range</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-400 uppercase">From</span>
                        <input 
                            type="date" 
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="rounded-xl border border-gray-200 px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-400 uppercase">To</span>
                        <input 
                            type="date" 
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="rounded-xl border border-gray-200 px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                        />
                    </div>
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
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Aggregating Weekly Insights...</p>
                </div>
            ) : data ? (
                <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="ek-card p-6 flex items-center gap-4">
                            <div className="h-12 w-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                                <CalendarDays className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Selected Range</p>
                                <p className="text-xl font-bold text-[#0f0f0f]">{data.range}</p>
                            </div>
                        </div>
                        <div className="ek-card p-6 flex items-center gap-4">
                            <div className="h-12 w-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                                <Banknote className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Range Revenue</p>
                                <p className="text-xl font-bold text-[#0f0f0f]">LKR {data.totalRevenue.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* All Bookings in Range */}
                    <div className="ek-card overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                            <h3 className="font-bold text-[#0f0f0f]">Range Bookings</h3>
                            <span className="text-xs font-bold bg-gray-200 px-2 py-1 rounded-lg">{data.reservations.length} Bookings</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100 text-left">
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Vehicle Plate</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Revenue</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {data.reservations.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-10 text-center text-gray-400 italic text-sm">
                                                No bookings found for this range.
                                            </td>
                                        </tr>
                                    ) : (
                                        data.reservations.map((res: any) => (
                                            <tr key={res.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4 text-sm font-medium text-[#0f0f0f]">#{res.id}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{new Date(res.date).toLocaleDateString()}</td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm font-medium text-[#0f0f0f]">{res.customerName}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded-md">{res.vehicleNumber || "--"}</span>
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
            ) : null}

            <PDFViewerModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                url={pdfUrl}
                title={`Weekly Report: ${startDate} to ${endDate}`}
            />
        </div>
    );
}
