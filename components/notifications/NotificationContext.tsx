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

        const eventSource = new EventSource("/api/notifications/stream");

        eventSource.onmessage = (event) => {
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

        return () => eventSource.close();
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
