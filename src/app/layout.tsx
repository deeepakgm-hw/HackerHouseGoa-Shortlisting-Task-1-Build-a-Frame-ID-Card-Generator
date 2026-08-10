import type { Metadata } from "next";
import { Playfair_Display, Geist_Mono, VT323 } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

const vt323 = VT323({
  variable: "--font-vt323",
  weight: "400",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HH Goa 2026 — Frame Your Build",
  description: "Generate your official HH Goa 2026 profile picture frame or builder ID card. Crop your photo, get your developer title, and share to X.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${vt323.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="bg-[#0b4f30] text-[#faf8f0] min-h-screen flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}

