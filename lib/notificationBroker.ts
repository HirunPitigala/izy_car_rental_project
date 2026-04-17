import { EventEmitter } from "events";

class NotificationBroker extends EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(100);
    }

    public notify(userId: number, data: any) {
        this.emit(`notification:${userId}`, data);
    }

    public notifyAdmins(data: any) {
        this.emit("notification:admin", data);
    }
}

// Store on `global` so the same instance is shared across all Next.js module
// contexts (server actions, route handlers, etc.) within the same process.
// Without this, each bundle gets its own EventEmitter and events fired from a
// server action are never received by the SSE route handler.
const globalForBroker = global as typeof globalThis & {
    notificationBroker: NotificationBroker;
};

if (!globalForBroker.notificationBroker) {
    globalForBroker.notificationBroker = new NotificationBroker();
}

export const notificationBroker = globalForBroker.notificationBroker;
