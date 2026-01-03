import { CheckCircle, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

interface CompletionBadgeProps {
  isCompleted: boolean
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  className?: string
}

export function CompletionBadge({ 
  isCompleted, 
  size = "md",
  showLabel = false,
  className 
}: CompletionBadgeProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6"
  }
  
  if (showLabel) {
    return (
      <div className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium",
        isCompleted 
          ? "bg-green-900/30 text-green-400 border border-green-500/30"
          : "bg-gray-800/50 text-gray-400 border border-gray-700/50",
        className
      )}>
        {isCompleted ? (
          <>
            <CheckCircle className={sizeClasses[size]} />
            <span>Completed</span>
          </>
        ) : (
          <>
            <Circle className={sizeClasses[size]} />
            <span>Not Started</span>
          </>
        )}
      </div>
    )
  }
  
  return isCompleted ? (
    <CheckCircle className={cn(
      sizeClasses[size], 
      "text-green-400",
      className
    )} />
  ) : (
    <Circle className={cn(
      sizeClasses[size], 
      "text-gray-600",
      className
    )} />
  )
}

