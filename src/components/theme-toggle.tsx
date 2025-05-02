
"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils" // Import cn

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  // Use useEffect to avoid hydration mismatch for theme state
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  if (!mounted) {
    // Render placeholder or null during server render / hydration mismatch phase
    return (
        <div className="flex items-center space-x-1 bg-secondary p-1 rounded-full">
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full bg-background text-muted-foreground" disabled>
                <Sun className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full text-muted-foreground" disabled>
                 <Moon className="h-4 w-4" />
            </Button>
        </div>
    );
  }


  const isLight = theme === "light";

  return (
    <div className="flex items-center space-x-1 bg-secondary/70 p-1 rounded-full border border-border/30">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("light")}
        className={cn(
          "h-7 w-7 rounded-full transition-colors",
          isLight
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Sun className="h-4 w-4" />
        <span className="sr-only">Açık Tema</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("dark")}
        className={cn(
          "h-7 w-7 rounded-full transition-colors",
          !isLight
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Moon className="h-4 w-4" />
        <span className="sr-only">Koyu Tema</span>
      </Button>
    </div>
  )
}
