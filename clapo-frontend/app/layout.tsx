import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Clapo Game - Stake. Strategize. Dominate.",
  description: "Head-to-head NFT prediction duels powered by Pyth price feeds",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 min-h-screen`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
