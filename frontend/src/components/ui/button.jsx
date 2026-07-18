import * as React from "react"
import { cn } from "@/lib/utils"

const Button = React.forwardRef(({ 
  className, 
  variant = "primary", 
  size = "default", 
  asChild = false, 
  ...props 
}, ref) => {
  const Comp = "button"
  
  const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/50 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-98"
  
  const variants = {
    primary: "bg-secondary text-white hover:bg-secondary-dark active:bg-secondary-dark/90 shadow-md rounded-lg",
    secondary: "bg-primary text-white hover:bg-primary-light active:bg-primary-light/90 shadow-md rounded-lg",
    outline: "border border-border-subtle bg-transparent text-text-primary hover:bg-surface-light hover:text-text-primary rounded-lg",
    ghost: "bg-transparent text-text-secondary hover:bg-surface-light hover:text-text-primary",
    link: "text-secondary underline-offset-4 hover:underline bg-transparent p-0 h-auto"
  }
  
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3 text-xs",
    lg: "h-11 rounded-md px-8 text-base",
    icon: "h-10 w-10"
  }
  
  return (
    <Comp
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }
