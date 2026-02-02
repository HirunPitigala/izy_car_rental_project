import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { getSession, logDebug } from "@/lib/auth";
import { cookies } from "next/headers";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Premium Car Rental | Sri Lanka",
  description: "Experience the best car rental service in Sri Lanka with premium vehicles and professional service.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  logDebug("RootLayout: Fetching session...");
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll().map((c) => c.name).join(", ");
  logDebug(`RootLayout: All cookies: [${allCookies}]`);
  const session = await getSession();
  logDebug(`RootLayout: Session found: ${!!session}, Role: ${session?.role}`);

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} font-sans antialiased bg-[#fcfcfc] text-[#0f0f0f]`}
        suppressHydrationWarning
      >
        <Navbar session={session} />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
