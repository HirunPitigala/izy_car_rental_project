
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ManagerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    if (!session || session.role !== "manager") {
        if (session) {
            if (session.role === "admin") redirect("/admin/dashboard");
            if (session.role === "customer") redirect("/customer/dashboard");
        }
        redirect("/login");
    }

    return <>{children}</>;
}
