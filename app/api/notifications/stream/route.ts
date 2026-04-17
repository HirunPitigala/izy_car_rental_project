import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { notificationBroker } from "@/lib/notificationBroker";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    const session = await getSession();
    if (!session) {
        return new Response("Unauthorized", { status: 401 });
    }

    const userId = session.userId;
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        async start(controller) {
            // Heartbeat to keep connection alive
            const heartbeatInterval = setInterval(() => {
                controller.enqueue(encoder.encode(": heartbeat\n\n"));
            }, 30000);

            const sendNotification = (data: any) => {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
            };

            // Listen for user-specific notifications
            notificationBroker.on(`notification:${userId}`, sendNotification);
            
            // If admin, also listen for admin-wide notifications (e.g. new bookings)
            if (session.role === "admin" || session.role === "manager") {
                notificationBroker.on("notification:admin", sendNotification);
            }

            req.signal.addEventListener("abort", () => {
                clearInterval(heartbeatInterval);
                notificationBroker.off(`notification:${userId}`, sendNotification);
                notificationBroker.off("notification:admin", sendNotification);
                controller.close();
            });
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive",
        },
    });
}
