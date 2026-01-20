import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
            <div className="text-center">
                <ShieldAlert className="mx-auto h-16 w-16 text-red-500" />
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
                    Access Denied
                </h1>
                <p className="mt-2 text-base text-gray-500">
                    You do not have permission to access this page.
                </p>
                <div className="mt-6">
                    <Link
                        href="/login"
                        className="rounded-md bg-yellow-400 px-4 py-2 text-sm font-semibold text-black shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400"
                    >
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
