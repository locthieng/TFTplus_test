import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TFTPlus — Set 18 Enchanted Wilds Meta Comps, Builder & Stats",
    template: "%s | TFTPlus",
  },
  description:
    "Master TFT Set 18 Enchanted Wilds (Patch 18.3). Real-time meta team comps, interactive Hex Builder, full champion database, item recipes, and augments tier list.",
  openGraph: {
    title: "TFTPlus — Set 18 Enchanted Wilds Meta Comps, Builder & Stats",
    description:
      "Master TFT Set 18 Enchanted Wilds with meta comps, hex board builder, champion stats, and craftable item recipes.",
    url: "https://tf-tplus-test.vercel.app",
    siteName: "TFTPlus",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TFTPlus — Set 18 Enchanted Wilds Meta Comps & Builder",
    description:
      "TFT Set 18 Enchanted Wilds companion: interactive Hex Builder, meta tier lists, and complete game stats.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#090c10] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
