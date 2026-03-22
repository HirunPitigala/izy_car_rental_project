
import { getSession, logDebug } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    logDebug("AdminLayout: Checking session...");
    const session = await getSession();
    logDebug(`AdminLayout: Session found: ${!!session}, Role: ${session?.role}`);

    if (!session || session.role !== "admin") {
        logDebug(`AdminLayout: Redirecting to login. Reason: ${!session ? "No session" : "Wrong role: " + session.role}`);
        if (session) {
            // Logged in but not admin -> redirect to their dashboard
            if (session.role === "manager") redirect("/manager/dashboard");
            if (session.role === "customer") redirect("/customer/dashboard");
            if (session.role === "employee") redirect("/employee/dashboard");
        }
        redirect("/login");
    }

    return <>{children}</>;
}
