import type React from "react";
import type { Metadata } from "next";
import { Toaster } from "sonner";
// import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Inter, DM_Sans } from "next/font/google";
import LenisProvider from "@/components/LenisProvider";
import { AuthProvider } from "@/lib/auth-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "AI UMKM Autopilot - Strategi Marketing Otomatis",
  description:
    "Dashboard AI untuk UMKM Indonesia yang menghasilkan strategi marketing otomatis dari satu foto produk menggunakan Gemini AI",
  generator: "TSPJT",
  icons: {
    icon: [
      {
        url: "/hero/logo/logo.svg",
      },
      {
        url: "/hero/logo/logo.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/hero/logo/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${inter.variable} ${dmSans.variable} font-inter antialiased`}
      >
        <AuthProvider>
          <LenisProvider>
            {children}
            <Toaster richColors position="top-center" />
            {/* <Analytics /> */}
          </LenisProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
