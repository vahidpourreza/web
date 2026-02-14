import type { Metadata } from "next";
import { DirectionProvider } from "@/components/ui/direction";
import { iranSansFaNum } from "@/lib/fonts";
import "./globals.css";

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
    <html lang="fa" dir="rtl" className={iranSansFaNum.variable} suppressHydrationWarning>
      <body className="antialiased">
        <DirectionProvider dir="rtl">
          {children}
        </DirectionProvider>
      </body>
    </html>
  );
}
