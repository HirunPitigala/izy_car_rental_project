import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function CustomerOnlyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    // If an employee attempts to access customer booking routes, redirect to dashboard
    if (session?.role === "employee") {
        redirect("/employee/dashboard");
    }

    return <>{children}</>;
}
