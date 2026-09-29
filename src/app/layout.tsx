import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/animations/SmoothScroll";

// Using Inter calibrated to look like Apple's San Francisco
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "StampNow | Digitale Stempelkarten für dein Geschäft",
  applicationName: "StampNow",
  description: "Mach aus Besuchern Stammkunden. Digitale Stempelkarten für Cafés, Läden und Salons – mit deinem Logo, deinen Belohnungen und Übersicht für dein Team.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={`${inter.variable} font-sans bg-[#ffffff] text-[#111111] antialiased selection:bg-amber-500 selection:text-black relative`}>
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
