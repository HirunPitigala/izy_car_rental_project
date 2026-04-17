'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Calendar, FileText, Download, TrendingUp, Filter } from 'lucide-react';
import { getDailyReportData } from '@/lib/actions/reportActions';
import { generateReportPDF } from '@/lib/utils/reportPdfGenerator';
import PDFViewerModal from '@/components/shared/PDFViewerModal';

export default function DailyReportPage() {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [reportData, setReportData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    useEffect(() => {
        fetchReportData();
    }, [selectedDate]);

    const fetchReportData = async () => {
        setLoading(true);
        const result = await getDailyReportData(selectedDate);
        if (result.success) {
            setReportData(result.data);
        }
        setLoading(false);
    };

    const handleViewPdf = () => {
        if (!reportData) return;
        
        const blob = generateReportPDF({
            title: "Daily Business Report",
            range: reportData.date,
            totalRevenue: reportData.totalRevenue,
            totalBookings: reportData.reservations.length,
            reservations: reportData.reservations
        });
        
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
        setIsPdfModalOpen(true);
    };

    return (
        <div className="container-custom py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/manager/reports/view" className="p-2 -ml-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-[#0f0f0f] transition-colors">
                        <ChevronLeft className="h-6 w-6" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-[#0f0f0f]">Daily Report</h1>
                        <p className="text-gray-500 text-sm">Detailed overview of operations for a specific day</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    <button 
                        onClick={handleViewPdf}
                        disabled={loading || !reportData || reportData.reservations.length === 0}
                        className="flex items-center gap-2 bg-[#0f0f0f] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FileText className="h-4 w-4" />
                        View PDF Report
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
                </div>
            ) : reportData ? (
                <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="ek-card p-6 border-l-4 border-l-red-100">
                            <p className="text-sm font-medium text-gray-500 mb-1">Total Revenue</p>
                            <h3 className="text-2xl font-bold text-[#0f0f0f]">LKR {reportData.totalRevenue.toLocaleString()}</h3>
                            <div className="flex items-center gap-1 mt-2 text-green-600 text-xs font-semibold">
                                <TrendingUp className="h-3 w-3" />
                                <span>Sales Summary</span>
                            </div>
                        </div>
                        <div className="ek-card p-6 border-l-4 border-l-blue-100">
                            <p className="text-sm font-medium text-gray-500 mb-1">Total Bookings</p>
                            <h3 className="text-2xl font-bold text-[#0f0f0f]">{reportData.reservations.length}</h3>
                            <p className="text-xs text-gray-400 mt-2">Transactions for the day</p>
                        </div>
                        <div className="ek-card p-6 border-l-4 border-l-gray-100">
                            <p className="text-sm font-medium text-gray-500 mb-1">Report Date</p>
                            <h3 className="text-xl font-bold text-[#0f0f0f]">{new Date(selectedDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</h3>
                            <p className="text-xs text-gray-400 mt-2">Daily breakdown</p>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="ek-card overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-bold text-[#0f0f0f]">Transaction Details</h3>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Filter className="h-3 w-3" />
                                <span>Recent first</span>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-500 text-xs font-medium uppercase">
                                    <tr>
                                        <th className="px-6 py-4">ID</th>
                                        <th className="px-6 py-4">Customer</th>
                                        <th className="px-6 py-4">Vehicle</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Revenue</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {reportData.reservations.length > 0 ? (
                                        reportData.reservations.map((res: any) => (
                                            <tr key={res.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 text-sm font-medium text-[#0f0f0f]">#{res.id}</td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-[#0f0f0f]">{res.customerName}</div>
                                                    <div className="text-xs text-gray-400">{res.phoneNumber}</div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{res.vehicleNumber}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                        res.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                                                        res.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                        {res.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-bold text-[#0f0f0f] text-right">
                                                    LKR {parseFloat(res.revenue || "0").toLocaleString()}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-gray-400 text-sm italic">
                                                No transactions found for this date.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-gray-500">Failed to load report data. Please try again.</p>
                </div>
            )}

            {isPdfModalOpen && pdfUrl && (
                <PDFViewerModal 
                    isOpen={isPdfModalOpen}
                    onClose={() => {
                        setIsPdfModalOpen(false);
                        if (pdfUrl) URL.revokeObjectURL(pdfUrl);
                        setPdfUrl(null);
                    }}
                    url={pdfUrl}
                    title="Daily Business Report"
                />
            )}
        </div>
    );
}
