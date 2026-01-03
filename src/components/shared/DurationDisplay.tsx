import { Clock } from "lucide-react"
import { formatDuration } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface DurationDisplayProps {
  seconds: number
  showIcon?: boolean
  format?: "long" | "short" // "1h 30m" vs "1:30:00"
  className?: string
}

export function DurationDisplay({ 
  seconds, 
  showIcon = true,
  format = "long",
  className 
}: DurationDisplayProps) {
  const formattedDuration = format === "long" 
    ? formatDuration(seconds)
    : formatShortDuration(seconds)
  
  return (
    <div className={cn("flex items-center gap-1.5 text-sm text-gray-400", className)}>
      {showIcon && <Clock className="h-4 w-4" />}
      <span>{formattedDuration}</span>
    </div>
  )
}

// Format as HH:MM:SS or MM:SS
function formatShortDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  if (hours > 0) {
    return `${hours}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }
  return `${mins}:${String(secs).padStart(2, '0')}`
}

