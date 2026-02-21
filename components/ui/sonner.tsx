"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast font-[family-name:var(--font-sans)]",
          success:
            "[&>[data-icon]]:text-green-600 dark:[&>[data-icon]]:text-green-400",
          error:
            "[&>[data-icon]]:text-red-600 dark:[&>[data-icon]]:text-red-400",
          warning:
            "[&>[data-icon]]:text-amber-600 dark:[&>[data-icon]]:text-amber-400",
          info:
            "[&>[data-icon]]:text-blue-600 dark:[&>[data-icon]]:text-blue-400",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
