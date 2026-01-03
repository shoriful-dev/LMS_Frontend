import * as React from "react"
import { Eye, EyeOff } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex w-full px-4 py-2.5 text-sm placeholder:text-gray-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
  {
    variants: {
      variant: {
        default: "h-10 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 focus:ring-1 focus:ring-violet-500 focus:border-violet-500",
        glass: "h-12 rounded-xl glass focus:ring-1 focus:ring-purple-500/50 focus:border-white/60 text-gray-900 dark:text-white placeholder:text-gray-600/80 dark:placeholder:text-gray-300/70 shadow-lg focus:shadow-xl",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  label?: string
  error?: string
  showPasswordToggle?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, showPasswordToggle, variant, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const isPassword = type === "password"
    const inputType = isPassword && showPasswordToggle ? (showPassword ? "text" : "password") : type
    const isGlassVariant = variant === "glass"

    return (
      <div className="w-full">
        {label && (
          <label className={cn(
            "block text-sm font-semibold mb-2",
            isGlassVariant ? "text-gray-800 dark:text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]" : "text-gray-300"
          )}>
            {label}
          </label>
        )}
        <div className="relative">
          <input
            type={inputType}
            className={cn(
              inputVariants({ variant }),
              error && "border-red-500 focus:ring-red-500",
              isPassword && showPasswordToggle && "pr-12",
              className
            )}
            ref={ref}
            {...props}
          />
          {isPassword && showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={cn(
                "absolute right-4 top-1/2 -translate-y-1/2 focus:outline-none transition-all duration-200",
                isGlassVariant 
                  ? "text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:scale-110" 
                  : "text-gray-400 hover:text-gray-200"
              )}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
        {error && (
          <p className={cn(
            "mt-2 text-sm",
            isGlassVariant ? "text-red-200 drop-shadow-md" : "text-red-400"
          )}>
            {error}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }

