import type { Metadata } from "next";
import { Quantico } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const quantico = Quantico({
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "A place belonging to Jonny",
  description: "Yeehaw",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${quantico.className} antialiased`}>
        <div className="flex flex-col md:flex-row h-screen">
          {/* Header always on top */}
          <div className="flex-shrink-0">
            <Header />
          </div>

          {/* Sidebar: visible only on md+ screens */}
          <div className="hidden md:block mr-16">
            <Sidebar />
          </div>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto h-full p-4">{children}</main>
        </div>
      </body>
    </html>
  );
}
