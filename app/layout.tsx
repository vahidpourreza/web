import type { Metadata } from 'next';
import { AuthProvider } from '@/providers/auth-provider';
import { QueryProvider } from '@/providers/query-provider';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { DirectionProvider } from '@/components/ui/direction';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import { iranSansFaNum } from '@/lib/fonts';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Smart Cup',
    template: '%s | Smart Cup',
  },
  description: 'Cafe & restaurant management system',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={iranSansFaNum.variable} suppressHydrationWarning>
      <body className="antialiased">
        <DirectionProvider direction="rtl" dir="rtl">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              <QueryProvider>
                <TooltipProvider>{children}</TooltipProvider>
                <Toaster position="bottom-center" dir="rtl" />
              </QueryProvider>
            </AuthProvider>
          </ThemeProvider>
        </DirectionProvider>
      </body>
    </html>
  );
}
