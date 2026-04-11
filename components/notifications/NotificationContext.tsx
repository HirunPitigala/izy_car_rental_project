"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
    ReactNode,
} from "react";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

/** A notification loaded from the database (has a real dbId for mark-as-read). */
export interface DbNotification {
    dbId: number;
    message: string;
    date: string;
    bookingId?: number;
    serviceType: string;
    isRead: boolean;
}

/** A real-time toast notification delivered via SSE (no dbId yet). */
export interface ToastNotification {
    id: string;
    message: string;
    date: string;
    bookingId?: number;
    serviceType?: string;
}

interface NotificationContextType {
    dbNotifications: DbNotification[];
    showToasts: ToastNotification[];
    showPanel: boolean;
    unreadCount: number;
    role: string;
    setShowPanel: (show: boolean) => void;
    clearToasts: (id: string) => void;
    markAsRead: (dbId: number) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    refreshNotifications: () => Promise<void>;
    getNavigationUrl: (serviceType: string | undefined, bookingId: number | undefined) => string;
    handleNotificationClick: (
        dbId: number | undefined,
        serviceType: string | undefined,
        bookingId: number | undefined
    ) => Promise<void>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Extract service type keyword from a notification message.
 * Used for DB-loaded notifications where serviceType is not stored explicitly.
 */
export function parseServiceType(message: string): string {
    const lower = message.toLowerCase();
    if (lower.includes("rent-a-car") || lower.includes("rent a car")) return "rent-a-car";
    if (lower.includes("airport")) return "airport-transfer";
    if (lower.includes("pickup")) return "pickup";
    if (lower.includes("wedding")) return "wedding";
    return "";
}

/**
 * Build the destination URL for a notification based on role, serviceType, and bookingId.
 *
 * Employee  → /employee/assigned/[serviceType]/[bookingId]
 * Admin/Mgr → existing admin booking pages with optional ?highlight param
 * Customer  → relevant status page or dashboard
 */
export function buildNavigationUrl(
    role: string,
    serviceType: string | undefined,
    bookingId: number | undefined
): string {
    if (!serviceType && !bookingId) return "";

    if (role === "employee") {
        const hl = bookingId ? `&highlight=${bookingId}` : "";
        if (serviceType) return `/employee/assigned?category=${serviceType === "pickup" ? "pickups" : serviceType}${hl}`;
        return "/employee/assigned";
    }

    if (role === "admin" || role === "manager") {
        const hl = bookingId ? `&highlight=${bookingId}` : "";
        switch (serviceType) {
            case "rent-a-car":
                return `/admin/bookings/requested?category=rent-a-car${hl}`;
            case "pickup":
                return `/admin/bookings/requested?category=pickups${hl}`;
            case "airport-transfer":
                // Map to the unified requested dashboard for consistent UI
                return `/admin/bookings/requested?category=airport${hl}`;
            case "wedding":
                return `/admin/bookings/requested?category=wedding${hl}`;
            default:
                return "/admin/bookings/requested";
        }
    }

    if (role === "customer") {
        if (serviceType === "rent-a-car") return "/rent/status";
        if (serviceType === "airport-transfer") return "/airport/bookings";
        if (serviceType === "pickup") return "/pickup-service";
        return "/customer/dashboard";
    }

    return "";
}

// ─── Context ──────────────────────────────────────────────────────────────────

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({
    children,
    session,
}: {
    children: ReactNode;
    session: any;
}) {
    const [dbNotifications, setDbNotifications] = useState<DbNotification[]>([]);
    const [showToasts, setShowToasts] = useState<ToastNotification[]>([]);
    const [showPanel, setShowPanel] = useState(false);
    const router = useRouter();

    const role: string = session?.role ?? "";

    // ── Load from DB ──────────────────────────────────────────────────────────
    const fetchFromDb = useCallback(async () => {
        if (!session) return;
        try {
            const res = await fetch("/api/notifications");
            const data = await res.json();
            if (data.success && Array.isArray(data.data)) {
                const notifs: DbNotification[] = data.data.slice(0, 30).map((n: any) => ({
                    dbId: n.notificationId,
                    message: n.message ?? "",
                    date: n.notificationDate ?? new Date().toISOString(),
                    bookingId: n.bookingId ?? undefined,
                    serviceType: parseServiceType(n.message ?? ""),
                    isRead: n.status === "READ",
                }));
                setDbNotifications(notifs);
            }
        } catch (err) {
            console.error("[NotificationContext] Failed to load from DB:", err);
        }
    }, [session]);

    useEffect(() => {
        fetchFromDb();
    }, [fetchFromDb]);

    // ── SSE real-time stream ───────────────────────────────────────────────────
    useEffect(() => {
        if (!session) return;

        let retryDelay = 1000;
        let retryTimeout: ReturnType<typeof setTimeout> | null = null;
        let es: EventSource | null = null;

        const connect = () => {
            es = new EventSource("/api/notifications/stream");

            es.onopen = () => {
                retryDelay = 1000;
            };

            es.onmessage = (event) => {
                const data = JSON.parse(event.data);

                // Show toast immediately — use serviceType from SSE payload
                const toast: ToastNotification = {
                    id: Math.random().toString(36).substring(2, 11),
                    message: data.message ?? "",
                    date: data.date ?? new Date().toISOString(),
                    bookingId: data.bookingId,
                    serviceType: data.serviceType || parseServiceType(data.message ?? ""),
                };

                setShowToasts((prev) => [...prev, toast]);
                setTimeout(() => {
                    setShowToasts((prev) => prev.filter((t) => t.id !== toast.id));
                }, 5000);

                // Reload from DB after short delay to pick up the new notification's dbId
                setTimeout(fetchFromDb, 800);
            };

            // Exponential backoff to avoid hammering the server on disconnect
            es.onerror = () => {
                es?.close();
                retryTimeout = setTimeout(() => {
                    retryDelay = Math.min(retryDelay * 2, 30000);
                    connect();
                }, retryDelay);
            };
        };

        connect();

        return () => {
            es?.close();
            if (retryTimeout) clearTimeout(retryTimeout);
        };
    }, [session, fetchFromDb]);

    // ── Actions ───────────────────────────────────────────────────────────────
    const markAsRead = useCallback(async (dbId: number) => {
        try {
            await fetch(`/api/notifications/${dbId}`, { method: "PATCH" });
            setDbNotifications((prev) =>
                prev.map((n) => (n.dbId === dbId ? { ...n, isRead: true } : n))
            );
        } catch (err) {
            console.error("[NotificationContext] Failed to mark as read:", err);
        }
    }, []);

    const markAllAsRead = useCallback(async () => {
        const unread = dbNotifications.filter((n) => !n.isRead);
        await Promise.allSettled(
            unread.map((n) => fetch(`/api/notifications/${n.dbId}`, { method: "PATCH" }))
        );
        setDbNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    }, [dbNotifications]);

    const getNavigationUrl = useCallback(
        (serviceType: string | undefined, bookingId: number | undefined) =>
            buildNavigationUrl(role, serviceType, bookingId),
        [role]
    );

    /**
     * Unified click handler: mark as read + navigate + close panel.
     * Shared by panel items (have dbId) and toasts (no dbId yet).
     */
    const handleNotificationClick = useCallback(
        async (
            dbId: number | undefined,
            serviceType: string | undefined,
            bookingId: number | undefined
        ) => {
            if (dbId) await markAsRead(dbId);
            setShowPanel(false);
            const url = buildNavigationUrl(role, serviceType, bookingId);
            if (url) router.push(url);
        },
        [markAsRead, role, router]
    );

    const unreadCount = dbNotifications.filter((n) => !n.isRead).length;

    const clearToasts = (id: string) =>
        setShowToasts((prev) => prev.filter((t) => t.id !== id));

    return (
        <NotificationContext.Provider
            value={{
                dbNotifications,
                showToasts,
                showPanel,
                unreadCount,
                role,
                setShowPanel,
                clearToasts,
                markAsRead,
                markAllAsRead,
                refreshNotifications: fetchFromDb,
                getNavigationUrl,
                handleNotificationClick,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
    return ctx;
}
