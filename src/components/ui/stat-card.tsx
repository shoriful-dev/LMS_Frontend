import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent } from "./card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: "blue" | "cyan" | "green" | "yellow" | "purple" | "pink"
  className?: string
}

const colorClasses = {
  blue: {
    icon: "text-blue-400",
    bg: "from-blue-600/20 to-blue-800/20",
    border: "border-blue-500/30",
    glow: "from-blue-600/30 via-blue-500/20 to-transparent"
  },
  cyan: {
    icon: "text-cyan-400",
    bg: "from-cyan-600/20 to-cyan-800/20",
    border: "border-cyan-500/30",
    glow: "from-cyan-600/30 via-cyan-500/20 to-transparent"
  },
  green: {
    icon: "text-green-400",
    bg: "from-green-600/20 to-green-800/20",
    border: "border-green-500/30",
    glow: "from-green-600/30 via-green-500/20 to-transparent"
  },
  yellow: {
    icon: "text-yellow-400",
    bg: "from-yellow-600/20 to-yellow-800/20",
    border: "border-yellow-500/30",
    glow: "from-yellow-600/30 via-yellow-500/20 to-transparent"
  },
  purple: {
    icon: "text-purple-400",
    bg: "from-purple-600/20 to-purple-800/20",
    border: "border-purple-500/30",
    glow: "from-purple-600/30 via-purple-500/20 to-transparent"
  },
  pink: {
    icon: "text-pink-400",
    bg: "from-pink-600/20 to-pink-800/20",
    border: "border-pink-500/30",
    glow: "from-pink-600/30 via-pink-500/20 to-transparent"
  }
}

export function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  trend, 
  color = "blue",
  className 
}: StatCardProps) {
  const colors = colorClasses[color]
  
  return (
    <Card className={cn("relative overflow-hidden group", className)}>
      {/* Glow effect on hover */}
      <div className={cn(
        "absolute -inset-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500",
        colors.glow
      )} />
      
      <CardContent className="relative pt-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-400 font-medium mb-1">{label}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {value}
              </p>
              {trend && (
                <div className={cn(
                  "flex items-center text-xs font-medium",
                  trend.isPositive ? "text-green-400" : "text-red-400"
                )}>
                  {trend.isPositive ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(trend.value)}%
                </div>
              )}
            </div>
          </div>
          
          <div className={cn(
            "w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center border shadow-lg",
            colors.bg,
            colors.border
          )}>
            <Icon className={cn("h-7 w-7", colors.icon)} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

