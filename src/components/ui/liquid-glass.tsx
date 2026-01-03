import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const liquidGlassVariants = cva(
  "liquid-transition",
  {
    variants: {
      variant: {
        default: "glass",
        sm: "glass-sm",
        lg: "glass-lg",
        hover: "glass glass-hover",
      },
      animation: {
        none: "",
        float: "liquid-float",
        shimmer: "liquid-shimmer",
      },
      rounded: {
        default: "rounded-xl",
        sm: "rounded-lg",
        lg: "rounded-2xl",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      animation: "none",
      rounded: "default",
    },
  }
)

export interface LiquidGlassProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof liquidGlassVariants> {}

const LiquidGlass = React.forwardRef<HTMLDivElement, LiquidGlassProps>(
  ({ className, variant, animation, rounded, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(liquidGlassVariants({ variant, animation, rounded }), className)}
        {...props}
      />
    )
  }
)
LiquidGlass.displayName = "LiquidGlass"

// Liquid Glass Background Container
export interface LiquidGlassBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  gradient?: "1" | "2" | "3" | "4" | "5" | "blue" | "purple" | "animated"
}

const LiquidGlassBackground = React.forwardRef<HTMLDivElement, LiquidGlassBackgroundProps>(
  ({ className, gradient = "animated", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "min-h-screen relative overflow-hidden",
          gradient === "animated" && "liquid-gradient-animated",
          gradient === "1" && "liquid-gradient-1",
          gradient === "2" && "liquid-gradient-2",
          gradient === "3" && "liquid-gradient-3",
          gradient === "4" && "liquid-gradient-4",
          gradient === "5" && "liquid-gradient-5",
          gradient === "blue" && "liquid-gradient-blue",
          gradient === "purple" && "liquid-gradient-purple",
          className
        )}
        {...props}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl animate-pulse delay-500" />
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    )
  }
)
LiquidGlassBackground.displayName = "LiquidGlassBackground"

export { LiquidGlass, LiquidGlassBackground, liquidGlassVariants }

