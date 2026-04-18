import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Merijans Turizm Danışmanlık | Ankara",
  description: "2023 yılından bu yana Ankara merkezli turizm danışmanlığı. Seyahat planlama, otel rezervasyonu, kurumsal seyahat ve daha fazlası.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="bg-white text-slate-900 antialiased">
        <Navbar />
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
