"use client"

import { useSyncExternalStore } from "react"
import { useTheme } from "next-themes"
import { SunIcon, MoonIcon, MonitorIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const emptySubscribe = () => () => {}

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false)

  return (
    <div className="bg-muted flex w-full items-center justify-between gap-1 rounded-full p-1">
      <button
        onClick={() => setTheme("light")}
        className={cn(
          "flex-1 cursor-pointer rounded-full p-1.5 transition-colors flex justify-center",
          mounted && theme === "light"
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
          "flex-1 cursor-pointer rounded-full p-1.5 transition-colors flex justify-center",
          mounted && theme === "system"
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
          "flex-1 cursor-pointer rounded-full p-1.5 transition-colors flex justify-center",
          mounted && theme === "dark"
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
