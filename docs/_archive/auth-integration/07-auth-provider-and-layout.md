# Step 07: Auth Provider & Layout Integration

## Create file: `providers/auth-provider.tsx`

```tsx
"use client";

import { SessionProvider } from "next-auth/react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider
      refetchInterval={4 * 60}
      refetchOnWindowFocus={true}
    >
      {children}
    </SessionProvider>
  );
}
```

`refetchInterval={4 * 60}` keeps the session fresh every 4 minutes (token is 1 hour, so we refresh well before expiry). `refetchOnWindowFocus` re-checks the session when the user returns to the tab.

## Modify file: `app/layout.tsx`

Add the AuthProvider wrapping the content. Your layout should become:

```tsx
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { DirectionProvider } from "@/components/ui/direction";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { DynamicBreadcrumb } from "@/components/sidebar/dynamic-breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { AuthProvider } from "@/providers/auth-provider";
import { iranSansFaNum } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Smart Cup",
    template: "%s | Smart Cup",
  },
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
            <AuthProvider>
              <TooltipProvider>
                <SidebarProvider>
                  <AppSidebar side="right" />
                  <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                      <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ms-1" />
                        <Separator
                          orientation="vertical"
                          className="me-2 data-vertical:h-4 data-vertical:self-auto"
                        />
                        <DynamicBreadcrumb />
                      </div>
                      <div className="ms-auto me-4">
                        <ModeToggle />
                      </div>
                    </header>
                    <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
                      {children}
                    </main>
                  </SidebarInset>
                </SidebarProvider>
              </TooltipProvider>
            </AuthProvider>
          </ThemeProvider>
        </DirectionProvider>
      </body>
    </html>
  );
}
```

The only change is: imported `AuthProvider` and wrapped `<TooltipProvider>` with `<AuthProvider>`.
