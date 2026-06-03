import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/context/app-context";
import { PRODUCT_NAME } from "@/data/constants";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${PRODUCT_NAME} | B2B Commerce Platform`,
  description: "European B2B commerce and distribution platform for procurement, finance, and partner networks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-white text-slate-900 antialiased">
        <TooltipProvider>
          <AppProvider>{children}</AppProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
