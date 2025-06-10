
// src/components/theme-toggle.tsx
"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  // Dimensions for the expanded state (lg and up)
  const expandedButtonWidth = 120;
  const indicatorSize = 28; // h-7 w-7 -> 28px
  const padding = 4; // p-1 -> 4px (2px on each side of the indicator)

  const moveDistance = expandedButtonWidth - (padding * 2) - indicatorSize;


  if (!mounted) {
    // Render a static placeholder for the small icon-only button to avoid layout shifts
    return <div style={{ height: '36px', width: '36px' }} className="rounded-full bg-secondary animate-pulse"></div>;
  }

  const isLight = theme === "light";
  const toggleTheme = () => setTheme(isLight ? "dark" : "light");

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "h-9 w-9 lg:w-[120px]", // Icon-only by default, expands at lg
        isLight
          ? "bg-muted hover:bg-muted/80"
          : "bg-slate-700 hover:bg-slate-600"
      )}
      aria-label={isLight ? "Koyu temaya geç" : "Açık temaya geç"}
    >
      {/* Sliding Indicator */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
        className={cn(
          "absolute h-7 w-7 rounded-full bg-background shadow-md flex items-center justify-center",
           "top-1 left-1"
        )}
        initial={false}
        animate={{ x: isLight ? 0 : moveDistance }}
      >
        {isLight ? (
          <Sun className="h-[18px] w-[18px] text-slate-600" />
        ) : (
          <Moon className="h-[18px] w-[18px] text-slate-300" />
        )}
      </motion.div>

      {/* Labels - Now visible only at lg breakpoint */}
       <span style={{ left: `${padding + indicatorSize + 6}px` }}
            className={cn(
           "absolute top-1/2 -translate-y-1/2 text-[10px] font-semibold uppercase tracking-wider transition-opacity duration-300 ease-in-out pointer-events-none",
           "hidden lg:inline-block", // Changed from sm:inline-block
           isLight ? "text-slate-500 opacity-100" : "opacity-0"
        )}>
           LIGHT MODE
       </span>
       <span style={{ right: `${padding + indicatorSize + 6}px` }}
            className={cn(
           "absolute top-1/2 -translate-y-1/2 text-[10px] font-semibold uppercase tracking-wider transition-opacity duration-300 ease-in-out pointer-events-none",
           "hidden lg:inline-block", // Changed from sm:inline-block
           !isLight ? "text-slate-300 opacity-100" : "opacity-0"
        )}>
          DARK MODE
      </span>
    </button>
  );
}
