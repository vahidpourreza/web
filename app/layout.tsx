import type { Metadata } from "next";
import { DirectionProvider } from "@/components/ui/direction";
import { TooltipProvider } from "@/components/ui/tooltip";
import { iranSansFaNum } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "SmartCUP",
  description: "Cafe & restaurant management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={iranSansFaNum.variable}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <DirectionProvider direction="rtl" dir="rtl">
          <TooltipProvider>{children}</TooltipProvider>
        </DirectionProvider>
      </body>
    </html>
  );
}
