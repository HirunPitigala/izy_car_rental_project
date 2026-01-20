
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function CustomerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    if (!session || session.role !== "customer") {
        if (session) {
            if (session.role === "admin") redirect("/admin/dashboard");
            if (session.role === "manager") redirect("/manager/dashboard");
        }
        redirect("/login");
    }

    return <>{children}</>;
}
