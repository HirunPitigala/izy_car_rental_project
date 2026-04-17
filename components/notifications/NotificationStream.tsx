"use client";

import { X, Bell, CheckCheck, ArrowRight } from "lucide-react";
import { useNotifications } from "./NotificationContext";

function formatTime(date: string) {
    const d = new Date(date);
    return isNaN(d.getTime())
        ? ""
        : d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(date: string) {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    const today = new Date();
    const isToday =
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear();
    return isToday
        ? `Today ${formatTime(date)}`
        : d.toLocaleDateString([], { month: "short", day: "numeric" }) + " " + formatTime(date);
}

function serviceBadgeLabel(serviceType: string): string {
    switch (serviceType) {
        case "rent-a-car": return "Rent-a-Car";
        case "pickup": return "Pickup";
        case "airport-transfer": return "Airport";
        case "wedding": return "Wedding";
        default: return "Booking";
    }
}

function serviceBadgeColor(serviceType: string): string {
    switch (serviceType) {
        case "rent-a-car": return "bg-blue-50 text-blue-600";
        case "pickup": return "bg-emerald-50 text-emerald-600";
        case "airport-transfer": return "bg-violet-50 text-violet-600";
        case "wedding": return "bg-pink-50 text-pink-600";
        default: return "bg-gray-100 text-gray-500";
    }
}

export default function NotificationStream() {
    const {
        dbNotifications,
        showToasts,
        showPanel,
        unreadCount,
        setShowPanel,
        clearToasts,
        markAllAsRead,
        handleNotificationClick,
    } = useNotifications();

    return (
        <>
            {/* ── Toasts (top-right, real-time SSE) ─────────��──────────────── */}
            <div className="fixed top-24 right-8 z-100 flex flex-col gap-3 pointer-events-none">
                {showToasts.map((toast) => (
                    <div
                        key={toast.id}
                        className="w-80 bg-white border border-gray-100 rounded-2xl p-4 shadow-2xl flex gap-3 animate-in slide-in-from-right fade-in duration-400 pointer-events-auto cursor-pointer hover:shadow-3xl hover:scale-[1.01] transition-all"
                        onClick={() =>
                            handleNotificationClick(undefined, toast.serviceType, toast.bookingId)
                        }
                    >
                        <div className="h-10 w-10 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
                            <Bell className="h-5 w-5 text-red-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-red-600">
                                    New Notification
                                </p>
                                {toast.serviceType && (
                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${serviceBadgeColor(toast.serviceType)}`}>
                                        {serviceBadgeLabel(toast.serviceType)}
                                    </span>
                                )}
                            </div>
                            <p className="text-[11px] font-medium text-gray-600 leading-relaxed line-clamp-2">
                                {toast.message}
                            </p>
                        </div>
                        <button
                            onClick={(e) => { e.stopPropagation(); clearToasts(toast.id); }}
                            className="h-6 w-6 text-gray-300 hover:text-red-500 transition-colors shrink-0 mt-0.5"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>

            {/* ── Notification Panel (sidebar) ──────────────────────────────── */}
            {showPanel && (
                <div className="fixed inset-0 z-110 flex justify-end">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                        onClick={() => setShowPanel(false)}
                    />

                    {/* Drawer */}
                    <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/60">
                            <div>
                                <h2 className="text-lg font-black text-gray-900 tracking-tight">
                                    Notifications
                                </h2>
                                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mt-0.5">
                                    {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-emerald-600 bg-white border border-gray-100 rounded-lg transition-colors"
                                        title="Mark all as read"
                                    >
                                        <CheckCheck className="h-3.5 w-3.5" />
                                        All read
                                    </button>
                                )}
                                <button
                                    onClick={() => setShowPanel(false)}
                                    className="w-9 h-9 bg-white border border-gray-100 rounded-xl flex items-center justify-center hover:text-red-500 transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Notification List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            {dbNotifications.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center p-10">
                                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                                        <Bell className="h-8 w-8 text-gray-200" />
                                    </div>
                                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                                        No notifications yet
                                    </p>
                                    <p className="text-xs text-gray-300 mt-1">
                                        You&apos;re all caught up
                                    </p>
                                </div>
                            ) : (
                                dbNotifications.map((n) => {
                                    const isNavigable = !!(n.serviceType || n.bookingId);
                                    return (
                                        <button
                                            key={n.dbId}
                                            className={`w-full text-left p-4 rounded-xl border transition-all group ${
                                                n.isRead
                                                    ? "bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                                                    : "bg-blue-50/40 border-blue-100 hover:bg-blue-50/60"
                                            } ${isNavigable ? "cursor-pointer" : "cursor-default"}`}
                                            onClick={() =>
                                                handleNotificationClick(n.dbId, n.serviceType, n.bookingId)
                                            }
                                        >
                                            <div className="flex items-start gap-3">
                                                {/* Unread dot */}
                                                <div className="mt-1.5 shrink-0">
                                                    {n.isRead ? (
                                                        <div className="w-2 h-2 rounded-full bg-gray-200" />
                                                    ) : (
                                                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                                                    )}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    {/* Meta row */}
                                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                        {n.bookingId && (
                                                            <span className="text-[9px] font-black text-red-500 uppercase tracking-[0.15em]">
                                                                #{n.bookingId}
                                                            </span>
                                                        )}
                                                        {n.serviceType && (
                                                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${serviceBadgeColor(n.serviceType)}`}>
                                                                {serviceBadgeLabel(n.serviceType)}
                                                            </span>
                                                        )}
                                                        <span className="text-[9px] text-gray-400 ml-auto">
                                                            {formatDate(n.date)}
                                                        </span>
                                                    </div>

                                                    {/* Message */}
                                                    <p className={`text-xs leading-relaxed ${n.isRead ? "text-gray-500 font-medium" : "text-gray-800 font-semibold"}`}>
                                                        {n.message}
                                                    </p>
                                                </div>

                                                {/* Navigate arrow */}
                                                {isNavigable && (
                                                    <ArrowRight className="h-3.5 w-3.5 text-gray-300 group-hover:text-gray-500 shrink-0 mt-1 transition-colors" />
                                                )}
                                            </div>
                                        </button>
                                    );
                                })
                            )}
                        </div>

                        {/* Footer */}
                        {dbNotifications.length > 0 && (
                            <div className="px-4 py-4 border-t border-gray-100 bg-gray-50/60">
                                <p className="text-center text-[10px] text-gray-400 font-medium">
                                    Showing last {dbNotifications.length} notifications
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
