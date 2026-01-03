import { LucideIcon, Info } from "lucide-react"
import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface InfoCardProps {
  icon?: LucideIcon
  title?: string
  children: ReactNode
  variant?: "info" | "success" | "warning" | "error"
  className?: string
}

const variantStyles = {
  info: {
    bg: "from-blue-900/20 to-cyan-900/20",
    border: "border-blue-500/30",
    icon: "text-blue-400"
  },
  success: {
    bg: "from-green-900/20 to-emerald-900/20",
    border: "border-green-500/30",
    icon: "text-green-400"
  },
  warning: {
    bg: "from-yellow-900/20 to-orange-900/20",
    border: "border-yellow-500/30",
    icon: "text-yellow-400"
  },
  error: {
    bg: "from-red-900/20 to-pink-900/20",
    border: "border-red-500/30",
    icon: "text-red-400"
  }
}

export function InfoCard({ 
  icon: Icon = Info,
  title,
  children,
  variant = "info",
  className
}: InfoCardProps) {
  const styles = variantStyles[variant]
  
  return (
    <div className={cn(
      "p-4 rounded-lg border backdrop-blur-sm bg-gradient-to-r",
      styles.bg,
      styles.border,
      className
    )}>
      <div className="flex items-start gap-3">
        <Icon className={cn("h-5 w-5 flex-shrink-0 mt-0.5", styles.icon)} />
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className="text-sm font-semibold text-white mb-1">{title}</h4>
          )}
          <div className="text-sm text-gray-300">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

