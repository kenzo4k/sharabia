import * as React from "react"
import { cn } from "@/lib/utils"

function Badge({ className, variant = "default", ...props }) {
  const variants = {
    default: "border-transparent bg-primary text-text-primary",
    secondary: "border-transparent bg-secondary text-text-primary",
    outline: "border-border-subtle text-text-secondary",
    success: "border-transparent bg-green-500/20 text-green-400 border border-green-500/30",
    warning: "border-transparent bg-amber-500/20 text-amber-400 border border-amber-500/30",
    error: "border-transparent bg-red-500/20 text-red-400 border border-red-500/30"
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
