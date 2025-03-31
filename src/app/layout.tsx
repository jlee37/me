import type { Metadata } from "next";
import { Monda } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Providers from "@/components/Providers";
import { Analytics } from "@vercel/analytics/react";
// Yatra_One

const monda = Monda({
  subsets: ["latin"],
  weight: "500",
});

export const metadata: Metadata = {
  title: "jonny.lee", // Browser tab label
  description: "Yeehaw",
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "A place belonging to Jonny", // iMessage/social preview title
    description: "Yeehaw",
    url: "https://jonnylee.net",
    // siteName: "jonny.lee",
    // images: [
    //   {
    //     url: "/og-image.png", // Optional but helpful
    //     width: 1200,
    //     height: 630,
    //     alt: "Alt text",
    //   },
    // ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${monda.className} antialiased`}>
        <Providers>
          {/* Desktop Layout */}
          <div className="hidden md:flex h-[100dvh]">
            <div className="mr-16">
              <Header />
              <Sidebar />
            </div>
            <main className="flex-1 overflow-y-auto h-[100dvh] w-full">
              {children}
            </main>
          </div>

          {/* Mobile Layout */}
          <div className="flex flex-col md:hidden h-[100dvh] overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto">{children}</main>
            <Sidebar showFullscreen={true} />{" "}
            {/* Triggered by button in Header */}
          </div>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
