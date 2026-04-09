"use client";

import { X, Bell } from "lucide-react";
import { useNotifications } from "./NotificationContext";

export default function NotificationStream() {
    const { 
        notifications, 
        showToasts, 
        showPanel, 
        setShowPanel, 
        clearToasts, 
        clearAll 
    } = useNotifications();

    return (
        <>
            {/* Notification Toasts (Top Right) */}
            <div className="fixed top-24 right-8 z-[100] flex flex-col gap-4 pointer-events-none">
                {showToasts.map((toast) => (
                    <div 
                        key={toast.id}
                        className="w-80 bg-white border border-gray-100 rounded-2xl p-4 shadow-2xl flex gap-4 animate-in slide-in-from-right fade-in duration-500 pointer-events-auto cursor-pointer hover:scale-[1.02] transition-all"
                        onClick={() => setShowPanel(true)}
                    >
                        <div className="h-10 w-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Bell className="h-5 w-5 text-red-600" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-black uppercase tracking-widest text-[#0f0f0f] mb-1">New Notification</p>
                            <p className="text-[11px] font-medium text-gray-500 leading-relaxed">{toast.message}</p>
                        </div>
                        <button 
                            onClick={(e) => { e.stopPropagation(); clearToasts(toast.id); }}
                            className="h-6 w-6 text-gray-300 hover:text-red-600 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Notification Sidebar/Panel */}
            {showPanel && (
                <div className="fixed inset-0 z-[110] flex justify-end">
                    <div className="absolute inset-0 bg-[#0f0f0f]/40 backdrop-blur-sm" onClick={() => setShowPanel(false)} />
                    <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h2 className="text-xl font-black text-[#0f0f0f] uppercase tracking-tight">Inbox</h2>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Real-time alerts & activities</p>
                            </div>
                            <button onClick={() => setShowPanel(false)} className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center hover:text-red-600 transition-colors"><X className="h-5 w-5" /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {notifications.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center p-10">
                                    <Bell className="h-12 w-12 text-gray-200 mb-4" />
                                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No notifications yet</p>
                                </div>
                            ) : (
                                notifications.map((n) => (
                                    <div key={n.id} className="p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-gray-100 hover:bg-white transition-all space-y-2 group">
                                        <div className="flex justify-between items-start">
                                            <span className="text-[9px] font-black text-red-600 uppercase tracking-[0.2em]">{n.bookingId ? `#BOOKING ${n.bookingId}` : 'ALERT'}</span>
                                            <span className="text-[9px] font-bold text-gray-400">{new Date(n.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <p className="text-xs font-bold text-[#0f0f0f] leading-relaxed">{n.message}</p>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                            <button onClick={clearAll} className="w-full h-12 bg-white border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-red-600 transition-all">Clear All History</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
