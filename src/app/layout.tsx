import type { Metadata } from "next";
import {
  Quantico,
  VT323,
  Pixelify_Sans,
  MedievalSharp,
} from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import GifCycler from "@/components/GifCycler";
import App from "./app";

const quantico = Quantico({
  subsets: ["latin"],
  weight: "400",
});

const vt323 = VT323({
  weight: "400",
});

const pixelifySans = Pixelify_Sans({
  weight: "400",
});

const medievalSharp = MedievalSharp({
  weight: "400",
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
      <body className={`${quantico.className} antialiased`}>
        <App>{children}</App>
      </body>
    </html>
  );
}
