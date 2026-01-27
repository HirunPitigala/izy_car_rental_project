import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { getSession } from "@/lib/auth";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
  const session = await getSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased bg-[#fcfcfc] text-[#0f0f0f]`}
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
