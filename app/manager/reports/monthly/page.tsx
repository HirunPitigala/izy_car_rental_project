'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, CalendarRange, FileText, TrendingUp, Filter } from 'lucide-react';
import { getMonthlyReportData } from '@/lib/actions/reportActions';
import { generateReportPDF } from '@/lib/utils/reportPdfGenerator';
import PDFViewerModal from '@/components/shared/PDFViewerModal';

export default function MonthlyReportPage() {
    const now = new Date();
    const [selectedYear, setSelectedYear] = useState(now.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
    const [reportData, setReportData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - i);
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    useEffect(() => {
        fetchReportData();
    }, [selectedYear, selectedMonth]);

    const fetchReportData = async () => {
        setLoading(true);
        const result = await getMonthlyReportData(selectedYear, selectedMonth);
        if (result.success) {
            setReportData(result.data);
        }
        setLoading(false);
    };

    const handleViewPdf = () => {
        if (!reportData) return;
        
        const blob = generateReportPDF({
            title: "Monthly Business Review",
            range: reportData.month,
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
                        <h1 className="text-2xl font-bold text-[#0f0f0f]">Monthly Report</h1>
                        <p className="text-gray-500 text-sm">Comprehensive overview of monthly performance</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        {months.map((name, index) => (
                            <option key={name} value={index + 1}>{name}</option>
                        ))}
                    </select>
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                    <button 
                        onClick={handleViewPdf}
                        disabled={loading || !reportData || reportData.reservations.length === 0}
                        className="flex items-center gap-2 bg-[#0f0f0f] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FileText className="h-4 w-4" />
                        Generate PDF
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="ek-card p-10 bg-gray-950 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full -mr-32 -mt-32 blur-3xl transition-transform" />
                            <p className="text-xs font-black uppercase tracking-[0.3em] text-white/40 mb-2">Monthly Revenue</p>
                            <h3 className="text-4xl font-black tracking-tight">LKR {reportData.totalRevenue.toLocaleString()}</h3>
                            <div className="flex items-center gap-2 mt-4 text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                                <TrendingUp className="h-4 w-4" />
                                <span>High Productivity Month</span>
                            </div>
                        </div>
                        <div className="ek-card p-10 bg-white border border-gray-100 shadow-premium-sm">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Total Deployments</p>
                            <h3 className="text-4xl font-black text-[#0f0f0f] tracking-tight">{reportData.reservations.length}</h3>
                            <p className="text-xs font-bold text-gray-400 mt-4 italic">Total business volume for {reportData.month}</p>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-premium-sm overflow-hidden">
                        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Monthly Ledger</h3>
                            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-full">
                                <Filter className="h-3 w-3" />
                                <span>Sorted by Date</span>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                                    <tr>
                                        <th className="px-8 py-5">Transaction ID</th>
                                        <th className="px-8 py-5">Client Information</th>
                                        <th className="px-8 py-5">Rental Date</th>
                                        <th className="px-8 py-5">Operational Status</th>
                                        <th className="px-8 py-5 text-right">Net Revenue</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {reportData.reservations.length > 0 ? (
                                        reportData.reservations.map((res: any) => (
                                            <tr key={res.id} className="hover:bg-gray-50/30 transition-all cursor-default group">
                                                <td className="px-8 py-5">
                                                    <span className="text-xs font-black text-gray-950 px-2 py-1 bg-gray-50 rounded-lg">#{res.id}</span>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className="text-sm font-black text-gray-900 group-hover:text-red-700 transition-colors">{res.customerName}</div>
                                                    <div className="text-[10px] font-bold text-gray-400 mt-0.5 tracking-wider">{res.vehicleNumber}</div>
                                                </td>
                                                <td className="px-8 py-5 text-xs font-bold text-gray-500 italic">
                                                    {new Date(res.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                                        res.status === 'confirmed' || res.status === 'ACCEPTED' ? 'bg-emerald-50 text-emerald-600' : 
                                                        res.status === 'pending' || res.status === 'PENDING' ? 'bg-amber-50 text-amber-600' : 'bg-gray-50 text-gray-400'
                                                    }`}>
                                                        <span className={`h-1 w-1 rounded-full ${
                                                            res.status === 'confirmed' || res.status === 'ACCEPTED' ? 'bg-emerald-400' : 'bg-amber-400'
                                                        }`} />
                                                        {res.status}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5 text-sm font-black text-gray-900 text-right">
                                                    LKR {parseFloat(res.revenue || "0").toLocaleString()}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-8 py-20 text-center text-gray-400 text-xs font-black uppercase tracking-widest">
                                                No historical data located for this monthly cycle.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                <div className="bg-gray-50 rounded-[2rem] border border-dashed border-gray-200 py-32 flex flex-col items-center justify-center">
                    <CalendarRange className="h-10 w-10 text-gray-200 mb-4" />
                    <p className="text-gray-400 text-xs font-black uppercase tracking-[0.2em]">Synchronization Required</p>
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
                    title="Monthly Business Review"
                />
            )}
        </div>
    );
}
