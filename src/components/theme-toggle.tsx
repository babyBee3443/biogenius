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

  // New dimensions for a more minimalistic button
  const toggleWidth = 120; // Reduced width
  const indicatorSize = 28; // h-7 w-7 -> 28px, slightly smaller indicator
  const padding = 4; // p-1 -> 4px (2px on each side of the indicator)

  const moveDistance = toggleWidth - (padding * 2) - indicatorSize;


  if (!mounted) {
    // Render a static placeholder to avoid layout shifts and match dimensions
    return <div style={{ height: '36px', width: `${toggleWidth}px` }} className="rounded-full bg-secondary animate-pulse"></div>;
  }

  const isLight = theme === "light";
  const toggleTheme = () => setTheme(isLight ? "dark" : "light");

  return (
    <button
      onClick={toggleTheme}
      style={{ width: `${toggleWidth}px`, height: '36px' }} // Apply new dimensions
      className={cn(
        "relative flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        // Updated background colors to match the minimalistic design
        isLight
          ? "bg-muted hover:bg-muted/80" // Light gray background for light mode
          : "bg-slate-700 hover:bg-slate-600" // Dark gray background for dark mode
      )}
      aria-label={isLight ? "Koyu temaya geç" : "Açık temaya geç"}
    >
      {/* Sliding Indicator */}
      <motion.div
        layout 
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
        className={cn(
          "absolute h-7 w-7 rounded-full bg-background shadow-md flex items-center justify-center", // Use background for indicator, simpler shadow
           "top-1 left-1" 
        )}
        initial={false} 
        animate={{ x: isLight ? 0 : moveDistance }} 
      >
        {isLight ? (
          <Sun className="h-[18px] w-[18px] text-slate-600" /> // Smaller icon, adjusted color
        ) : (
          <Moon className="h-[18px] w-[18px] text-slate-300" /> // Smaller icon, adjusted color
        )}
      </motion.div>

      {/* Labels */}
       <span style={{ left: `${padding + indicatorSize + 6}px` }} // Adjusted spacing
            className={cn(
           "absolute top-1/2 -translate-y-1/2 text-[10px] font-semibold uppercase tracking-wider transition-opacity duration-300 ease-in-out pointer-events-none",
           isLight ? "text-slate-500 opacity-100" : "opacity-0" 
        )}>
           LIGHT MODE
       </span>
       <span style={{ right: `${padding + indicatorSize + 6}px` }} // Adjusted spacing
            className={cn(
           "absolute top-1/2 -translate-y-1/2 text-[10px] font-semibold uppercase tracking-wider transition-opacity duration-300 ease-in-out pointer-events-none",
           !isLight ? "text-slate-300 opacity-100" : "opacity-0" 
        )}>
          DARK MODE
      </span>

    </button>
  );
}
