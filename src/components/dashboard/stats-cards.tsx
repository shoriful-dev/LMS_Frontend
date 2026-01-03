import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, TrendingUp, Award } from "lucide-react"

interface StatsCardsProps {
  totalCourses: number
  inProgress: number
  completed: number
}

/**
 * Stats Cards - Server Component
 * Displays user's learning statistics with modern design
 */
export function StatsCards({ totalCourses, inProgress, completed }: StatsCardsProps) {
  const stats = [
    {
      title: "Total Courses",
      value: totalCourses,
      description: "Enrolled courses",
      icon: BookOpen,
      gradient: "from-blue-600/20 via-cyan-600/20 to-blue-600/20",
      iconBg: "from-blue-500 to-cyan-500",
      iconColor: "text-blue-400",
      border: "border-blue-500/30",
      shadow: "shadow-blue-500/20",
      hoverBorder: "hover:border-blue-500/50",
    },
    {
      title: "In Progress",
      value: inProgress,
      description: "Keep learning",
      icon: TrendingUp,
      gradient: "from-violet-600/20 via-purple-600/20 to-violet-600/20",
      iconBg: "from-violet-500 to-purple-500",
      iconColor: "text-violet-400",
      border: "border-violet-500/30",
      shadow: "shadow-violet-500/20",
      hoverBorder: "hover:border-violet-500/50",
    },
    {
      title: "Completed",
      value: completed,
      description: "Courses finished",
      icon: Award,
      gradient: "from-emerald-600/20 via-green-600/20 to-emerald-600/20",
      iconBg: "from-emerald-500 to-green-500",
      iconColor: "text-emerald-400",
      border: "border-emerald-500/30",
      shadow: "shadow-emerald-500/20",
      hoverBorder: "hover:border-emerald-500/50",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card 
            key={stat.title}
            className={`
              relative overflow-hidden
              bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 
              border-gray-800/50 ${stat.hoverBorder}
              transition-all duration-300
              group shadow-lg hover:shadow-xl
              hover:scale-[1.02]
            `}
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            {/* Decorative gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
            
            <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-xs sm:text-sm font-semibold text-gray-300 uppercase tracking-wider">
                {stat.title}
              </CardTitle>
              <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${stat.iconBg} p-0.5 shadow-lg ${stat.shadow} group-hover:scale-110 transition-transform duration-300`}>
                <div className="w-full h-full bg-[#0a0d14] rounded-[11px] flex items-center justify-center">
                  <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.iconColor}`} />
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="relative z-10">
              <div className={`text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-br ${stat.iconBg} bg-clip-text text-transparent mb-1 sm:mb-2`}>
                {stat.value}
              </div>
              <p className="text-xs sm:text-sm text-gray-400 font-medium">
                {stat.description}
              </p>
              
              {/* Progress indicator line */}
              <div className="mt-3 sm:mt-4 h-1 bg-gray-800/50 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${stat.iconBg} rounded-full transition-all duration-1000 ease-out`}
                  style={{
                    width: `${Math.min((stat.value / Math.max(totalCourses, 1)) * 100, 100)}%`,
                  }}
                />
              </div>
            </CardContent>

            {/* Subtle shine effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent"></div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

