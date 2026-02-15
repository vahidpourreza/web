import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { DirectionProvider } from "@/components/ui/direction";
import { TooltipProvider } from "@/components/ui/tooltip";
import { iranSansFaNum } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart CUP",
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
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider>{children}</TooltipProvider>
          </ThemeProvider>
        </DirectionProvider>
      </body>
    </html>
  );
}
