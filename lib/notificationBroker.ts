import { EventEmitter } from "events";

class NotificationBroker extends EventEmitter {
    private static instance: NotificationBroker;

    private constructor() {
        super();
        this.setMaxListeners(100);
    }

    public static getInstance(): NotificationBroker {
        if (!NotificationBroker.instance) {
            NotificationBroker.instance = new NotificationBroker();
        }
        return NotificationBroker.instance;
    }

    public notify(userId: number, data: any) {
        this.emit(`notification:${userId}`, data);
        // Also emit to admins if needed, but usually we target a specific ID
    }

    public notifyAdmins(data: any) {
        this.emit("notification:admin", data);
    }
}

export const notificationBroker = NotificationBroker.getInstance();
