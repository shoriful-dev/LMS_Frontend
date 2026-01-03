import { cn } from "@/lib/utils"

interface ProgressBarProps {
  value: number // 0-100
  showLabel?: boolean
  size?: "sm" | "md" | "lg"
  variant?: "default" | "success" | "warning"
  className?: string
}

const sizeClasses = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-3"
}

const variantClasses = {
  default: "from-blue-600 via-cyan-600 to-blue-600",
  success: "from-green-600 via-emerald-600 to-green-600",
  warning: "from-yellow-600 via-orange-600 to-yellow-600"
}

export function ProgressBar({ 
  value, 
  showLabel = false,
  size = "md",
  variant = "default",
  className 
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value))
  
  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-400">
            Progress
          </span>
          <span className="text-sm font-bold text-white">
            {Math.round(clampedValue)}%
          </span>
        </div>
      )}
      
      <div className={cn(
        "w-full bg-gray-800 rounded-full overflow-hidden border border-gray-700/50",
        sizeClasses[size]
      )}>
        <div 
          className={cn(
            "h-full bg-gradient-to-r transition-all duration-500 ease-out relative overflow-hidden",
            variantClasses[variant]
          )}
          style={{ width: `${clampedValue}%` }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>
      </div>
    </div>
  )
}

