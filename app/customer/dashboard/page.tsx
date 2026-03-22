"use client";

import { Car, CreditCard, ChevronRight, ArrowRight, Sparkles, Navigation } from "lucide-react";
import Link from "next/link";

export default function CustomerDashboard() {
    return (
        <div className="min-h-screen bg-[#fcfcfc] pb-20">
            {/* High-Impact Header */}
            <header className="bg-gray-950 text-white px-8 py-16 md:px-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full -mr-48 -mt-48 blur-[100px]" />
                <div className="container mx-auto relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <Sparkles className="w-5 h-5 text-yellow-400" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Member Exclusive</span>
                        </div>
                        <h1 className="text-5xl font-black tracking-tighter mb-2">My Command Center</h1>
                        <p className="text-white/40 font-bold uppercase tracking-widest text-xs">Premium Mobility Dashboard</p>
                    </div>

                    <div className="flex gap-4">
                        <Link href="/rent" className="px-8 py-4 bg-yellow-400 text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-yellow-500 transition-all shadow-xl shadow-yellow-400/10 active:scale-95">
                            Rent a Car
                        </Link>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 -mt-10 md:px-12 relative z-20">
                {/* Stats Grid - Glassmorphism cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 flex items-center justify-between group">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Active Rentals</p>
                            <p className="text-4xl font-black text-gray-900 tracking-tighter">0</p>
                        </div>
                        <div className="h-14 w-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-900 group-hover:scale-110 transition-transform">
                            <Navigation className="h-7 w-7" />
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 flex items-center justify-between group">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Miles</p>
                            <p className="text-4xl font-black text-gray-900 tracking-tighter">
                                0 <span className="text-lg text-gray-300">KM</span>
                            </p>
                        </div>
                        <div className="h-14 w-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-900 group-hover:scale-110 transition-transform">
                            <Car className="h-7 w-7" />
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 flex items-center justify-between group">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Loyalty Tier</p>
                            <p className="text-4xl font-black text-yellow-500 tracking-tighter italic">GOLD</p>
                        </div>
                        <div className="h-14 w-14 rounded-2xl bg-yellow-50 flex items-center justify-center text-yellow-500 group-hover:scale-110 transition-transform">
                            <Sparkles className="h-7 w-7" />
                        </div>
                    </div>
                </div>

                {/* Rental History Section */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Rental History</h2>
                        <div className="h-0.5 flex-1 bg-gray-100 mx-8 hidden md:block" />
                        <Link href="/rent" className="text-xs font-black text-yellow-600 hover:text-yellow-700 flex items-center gap-2 uppercase tracking-widest transition-colors">
                            Rent Now <ChevronRight className="h-4 w-4" />
                        </Link>
                    </div>

                    <div className="bg-white rounded-[3.5rem] border border-gray-100 shadow-sm p-16 text-center group">
                        <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 transition-transform group-hover:scale-110 duration-500">
                            <Car className="h-10 w-10 text-gray-200" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">Your fleet is waiting</h3>
                        <p className="text-gray-400 font-medium mb-10 max-w-sm mx-auto">
                            You haven't rented any cars yet.
                            Ready to experience premium mobility?
                        </p>
                        <Link href="/rent" className="inline-flex items-center gap-3 rounded-2xl bg-gray-950 px-10 py-5 text-xs font-black text-white hover:bg-black transition-all active:scale-95 shadow-2xl shadow-gray-300 uppercase tracking-widest">
                            Rent Now <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>

                {/* Secondary Actions */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Link href="/rent" className="bg-white p-10 rounded-[3rem] border border-gray-100 flex items-center gap-8 group hover:shadow-2xl transition-all">
                        <div className="h-16 w-16 rounded-[1.5rem] bg-gray-900 flex items-center justify-center text-yellow-400 shadow-xl shadow-gray-200 group-hover:scale-110 transition-transform">
                            <Car className="h-8 w-8" />
                        </div>
                        <div>
                            <h4 className="text-xl font-black text-gray-900 tracking-tight">Luxury Fleet Rental</h4>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Self-drive or chauffeured</p>
                        </div>
                        <ChevronRight className="h-6 w-6 text-gray-300 ml-auto group-hover:translate-x-2 transition-transform" />
                    </Link>
                    <div className="bg-yellow-400 p-10 rounded-[3rem] shadow-xl shadow-yellow-100 flex items-center gap-8 group cursor-pointer hover:bg-yellow-500 transition-all">
                        <div className="h-16 w-16 rounded-[1.5rem] bg-gray-900 flex items-center justify-center text-white shadow-xl shadow-gray-200 group-hover:scale-110 transition-transform">
                            <CreditCard className="h-8 w-8" />
                        </div>
                        <div>
                            <h4 className="text-xl font-black text-gray-900 tracking-tight">Payment Portal</h4>
                            <p className="text-xs font-black text-gray-900/40 uppercase tracking-widest mt-1">Manage billing & invoices</p>
                        </div>
                        <ChevronRight className="h-6 w-6 text-gray-900/20 ml-auto group-hover:translate-x-2 transition-transform" />
                    </div>
                </div>
            </main>
        </div>
    );
}
