import type { Metadata } from "next";
import { Noto_Sans_Arabic, Geist_Mono } from "next/font/google";
import { DirectionProvider } from "@/components/ui/direction";
import "./globals.css";

const fontSans = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ساخت اپلیکیشن Next",
  description: "ساخته شده با create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={fontSans.variable}>
      <body
        className={`${geistMono.variable} antialiased`}
      >
        <DirectionProvider dir="rtl">
          {children}
        </DirectionProvider>
      </body>
    </html>
  );
}
