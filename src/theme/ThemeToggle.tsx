"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()

    const isDark = theme === "dark"

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label="Toggle theme"
            className="relative flex h-8 w-16 cursor-pointer items-center rounded-full border border-border bg-muted p-1 transition-colors duration-300"
        >
            <span
                className={`absolute inset-0 rounded-full transition-colors duration-300 ${isDark ? "bg--gray-900" : "bg-primary/10"
                    }`}
            />
            <span
                className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full shadow-md transition-all duration-300 ${isDark
                        ? "translate-x-8 bg-slate-900"
                        : "translate-x-0 bg-white"
                    }`}
            >
                {isDark ? (
                    <Moon className="h-3.5 w-3.5 text-sky-300" />
                ) : (
                    <Sun className="h-3.5 w-3.5 text-amber-500" />
                )}
            </span>
        </button>
    )
}
