"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface Notification {
    id: string;
    message: string;
    date: string;
    bookingId?: number;
}

interface NotificationContextType {
    notifications: Notification[];
    showToasts: Notification[];
    showPanel: boolean;
    setShowPanel: (show: boolean) => void;
    clearToasts: (id: string) => void;
    clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children, session }: { children: ReactNode, session: any }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showToasts, setShowToasts] = useState<Notification[]>([]);
    const [showPanel, setShowPanel] = useState(false);

    useEffect(() => {
        if (!session) return;

        let retryDelay = 1000;
        let retryTimeout: ReturnType<typeof setTimeout> | null = null;
        let es: EventSource | null = null;

        const connect = () => {
            es = new EventSource("/api/notifications/stream");

            es.onopen = () => {
                retryDelay = 1000; // reset backoff on successful connection
            };

            es.onmessage = (event) => {
                const data = JSON.parse(event.data);
                const newNotif = {
                    id: Math.random().toString(36).substr(2, 9),
                    ...data
                };

                setNotifications(prev => [newNotif, ...prev].slice(0, 20));
                setShowToasts(prev => [...prev, newNotif]);

                setTimeout(() => {
                    setShowToasts(prev => prev.filter(t => t.id !== newNotif.id));
                }, 5000);
            };

            // Exponential backoff on error — prevents reconnection storms that
            // exhaust the DB connection pool when the server is under load.
            es.onerror = () => {
                es?.close();
                retryTimeout = setTimeout(() => {
                    retryDelay = Math.min(retryDelay * 2, 30000); // cap at 30 s
                    connect();
                }, retryDelay);
            };
        };

        connect();

        return () => {
            es?.close();
            if (retryTimeout) clearTimeout(retryTimeout);
        };
    }, [session]);

    const clearToasts = (id: string) => setShowToasts(prev => prev.filter(t => t.id !== id));
    const clearAll = () => setNotifications([]);

    return (
        <NotificationContext.Provider value={{ 
            notifications, 
            showToasts, 
            showPanel, 
            setShowPanel, 
            clearToasts, 
            clearAll 
        }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error("useNotifications must be used within a NotificationProvider");
    }
    return context;
}
