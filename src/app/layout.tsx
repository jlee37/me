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
        <div className="flex h-screen">
          <div className="mr-16">
            <Header />
            <Sidebar />
          </div>
          <main className="flex-1 overflow-y-auto h-screen">{children}</main>
        </div>
      </body>
    </html>
  );
}
