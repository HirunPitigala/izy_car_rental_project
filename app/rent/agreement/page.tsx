import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import AgreementForm from "@/components/rent/AgreementForm";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default async function AgreementPage(props: { searchParams: Promise<any> }) {
    const searchParams = await props.searchParams;
    const session = await getSession();

    // Step 4: Authentication Gate
    if (!session) {
        const params = new URLSearchParams(searchParams);
        redirect(`/login?callbackUrl=/rent/agreement?${params.toString()}`);
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-6">
                <Suspense fallback={
                    <div className="flex flex-col items-center justify-center py-32">
                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                        <p className="text-gray-400 font-bold">Verifying session...</p>
                    </div>
                }>
                    <AgreementForm searchParams={searchParams} user={session.user} />
                </Suspense>
            </div>
        </div>
    );
}
