import * as React from "react"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50"
    
    const variants = {
      primary: "bg-accent text-white hover:bg-accent-hover shadow-lg shadow-accent/20",
      secondary: "bg-surface-light text-foreground hover:bg-surface-border",
      outline: "border border-surface-border bg-transparent hover:bg-surface-light text-foreground",
      ghost: "hover:bg-surface-light hover:text-foreground text-foreground/70",
    }
    
    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 py-2 text-sm",
      lg: "h-12 px-8 text-base",
    }

    const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className || ""}`

    return (
      <button
        className={classes}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
