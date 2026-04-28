import type { Metadata } from "next";
import { Geist, Nunito, DM_Mono } from "next/font/google";
import NavBar from "@/components/NavBar";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito", display: "swap" });
const dmMono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-dm-mono", display: "swap" });

export const metadata: Metadata = {
  title: "EdAccelerator",
  description: "Personalised maths lessons for selective school preparation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geist.className} ${nunito.variable} ${dmMono.variable} text-slate-900 min-h-screen`}>
        <NavBar />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
