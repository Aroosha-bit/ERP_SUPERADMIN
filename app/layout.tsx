import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "@/provider/Provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "PLRA ERP",
  description: "Punjab Land Records Authority ERP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
