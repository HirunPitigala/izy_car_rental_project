
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    if (!session || session.role !== "admin") {
        if (session) {
            // Logged in but not admin -> redirect to their dashboard
            if (session.role === "manager") redirect("/manager/dashboard");
            if (session.role === "customer") redirect("/customer/dashboard");
            if (session.role === "employee") redirect("/unauthorized"); // No dashboard for employee
        }
        redirect("/login");
    }

    return <>{children}</>;
}
