"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
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
          success: "!text-green-700 dark:!text-green-400 [&>[data-icon]]:text-green-700 dark:[&>[data-icon]]:text-green-400",
          error: "!text-red-700 dark:!text-red-400 [&>[data-icon]]:text-red-700 dark:[&>[data-icon]]:text-red-400",
          warning: "!text-amber-700 dark:!text-amber-400 [&>[data-icon]]:text-amber-700 dark:[&>[data-icon]]:text-amber-400",
          info: "!text-blue-700 dark:!text-blue-400 [&>[data-icon]]:text-blue-700 dark:[&>[data-icon]]:text-blue-400",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
