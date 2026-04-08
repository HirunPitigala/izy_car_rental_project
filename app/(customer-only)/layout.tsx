import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function CustomerOnlyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    if (session?.role === "employee") {
        redirect("/employee");
    }

    return <>{children}</>;
}
