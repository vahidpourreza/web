"use client"

import { useTheme } from "next-themes"
import { SunIcon, MoonIcon, MonitorIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="bg-muted flex items-center gap-1 rounded-full p-1">
      <button
        onClick={() => setTheme("light")}
        className={cn(
          "cursor-pointer rounded-full p-1.5 transition-colors",
          theme === "light"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
        aria-label="حالت روشن"
      >
        <SunIcon className="size-4" />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={cn(
          "cursor-pointer rounded-full p-1.5 transition-colors",
          theme === "system"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
        aria-label="سیستم"
      >
        <MonitorIcon className="size-4" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={cn(
          "cursor-pointer rounded-full p-1.5 transition-colors",
          theme === "dark"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
        aria-label="حالت تیره"
      >
        <MoonIcon className="size-4" />
      </button>
    </div>
  )
}
