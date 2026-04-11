"use client";

import { Bell } from "lucide-react";
import { useNotifications } from "./NotificationContext";

export default function NotificationBadge() {
    const { unreadCount, showPanel, setShowPanel } = useNotifications();

    return (
        <button
            onClick={() => setShowPanel(!showPanel)}
            className="relative w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-all group"
            title="Notifications"
        >
            <Bell
                className={`h-5 w-5 ${unreadCount > 0 ? "text-red-600" : "text-gray-400"} transition-colors group-hover:scale-110`}
            />
            {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-0.5 bg-red-600 text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white animate-pulse">
                    {unreadCount > 99 ? "99+" : unreadCount}
                </span>
            )}
        </button>
    );
}
