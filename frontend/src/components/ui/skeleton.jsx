import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-surface-light shimmer-bg", className)}
      {...props}
    />
  )
}

export { Skeleton }
