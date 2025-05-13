// src/components/theme-toggle.tsx
"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion" // Import motion
import { cn } from "@/lib/utils"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  // Values from a previous version that the user might be referring to
  const toggleWidth = 130;
  const indicatorSize = 32; // h-8 w-8 -> 32px
  const padding = 4; // p-1 -> 4px (2px on each side of the indicator in the padding visual)

  // Calculate the distance the indicator should move
  // Total width - (left padding + right padding) - indicator width
  const moveDistance = toggleWidth - (padding * 2) - indicatorSize; // 130 - 8 - 32 = 90


  if (!mounted) {
    // Render a static placeholder to avoid layout shifts and match dimensions
    return <div style={{ height: '40px', width: `${toggleWidth}px` }} className="rounded-full bg-secondary animate-pulse"></div>;
  }

  const isLight = theme === "light";
  const toggleTheme = () => setTheme(isLight ? "dark" : "light");

  return (
    <button
      onClick={toggleTheme}
      style={{ width: `${toggleWidth}px`, height: '40px' }} // Apply dimensions using style for precision
      className={cn(
        "relative flex items-center rounded-full p-1 cursor-pointer transition-all duration-500 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        // Reverted to gradient backgrounds
        isLight
          ? "bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400"
          : "bg-gradient-to-r from-slate-800 via-purple-900 to-indigo-950"
      )}
      aria-label={isLight ? "Koyu temaya geç" : "Açık temaya geç"}
    >
      {/* Sliding Indicator */}
      <motion.div
        layout // Enables smooth layout animation
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
        className={cn(
          "absolute h-8 w-8 rounded-full bg-white/90 dark:bg-slate-300/90 shadow-lg flex items-center justify-center backdrop-blur-sm",
           // Use absolute positioning with left defined by padding
           "top-1 left-1" // Corresponds to p-1
        )}
        initial={false} // Don't animate on initial load
        animate={{ x: isLight ? 0 : moveDistance }} // Move indicator based on calculated distance
      >
        {isLight ? (
          <Sun className="h-5 w-5 text-orange-500" />
        ) : (
          <Moon className="h-5 w-5 text-indigo-400" />
        )}
      </motion.div>

      {/* Labels */}
       <span style={{ left: `${padding + indicatorSize + 8}px` }} // Position relative to indicator + padding
            className={cn(
           "absolute top-1/2 -translate-y-1/2 text-xs font-semibold transition-opacity duration-300 ease-in-out pointer-events-none",
           isLight ? "text-white text-shadow-sm opacity-100" : "opacity-0" // Text shadow for better visibility on gradient
        )}>
           AÇIK TEMA
       </span>
       <span style={{ right: `${padding + indicatorSize + 8}px` }} // Position relative to indicator + padding
            className={cn(
           "absolute top-1/2 -translate-y-1/2 text-xs font-semibold transition-opacity duration-300 ease-in-out pointer-events-none",
           !isLight ? "text-white text-shadow-sm opacity-100" : "opacity-0" // Text shadow for better visibility on gradient
        )}>
          KOYU TEMA
      </span>

    </button>
  );
}
