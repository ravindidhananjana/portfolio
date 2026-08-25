import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ravindi-gunasekara.vercel.app"),
  title: "Ravindi Gunasekara | AI & Computer Vision Engineer",
  description:
    "Portfolio of Ravindi Gunasekara, AI and Computer Vision Engineer specializing in Deep Learning, Multimodal AI, and Generative AI applied to healthcare, remote sensing, and autonomous systems.",
  openGraph: {
    title: "Ravindi Gunasekara | AI & Computer Vision Engineer",
    description:
      "Portfolio of Ravindi Gunasekara, AI and Computer Vision Engineer specializing in Deep Learning, Multimodal AI, and Generative AI applied to healthcare, remote sensing, and autonomous systems.",
    url: "https://ravindi-gunasekara.vercel.app/",
    siteName: "Ravindi Gunasekara Portfolio",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-background text-foreground antialiased`}
      >
        <main className="min-h-screen flex flex-col pt-16">
          <Navbar />
          <div className="flex-grow">
            {children}
          </div>
          <Footer />
        </main>
        <Analytics />
      </body>
    </html>
  );
}
