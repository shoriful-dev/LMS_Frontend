import Link from "next/link"
import { Users, BookOpen, Tag } from "lucide-react"

export function QuickActions() {
  const actions = [
    {
      href: "/admin/users",
      icon: Users,
      title: "Manage Users",
      description: "View and manage all users",
      gradient: "from-rose-500/10 to-orange-500/10",
      border: "border-rose-500/30",
      iconGradient: "from-rose-500 to-orange-500",
      hoverBorder: "hover:border-rose-500/50",
    },
    {
      href: "/admin/courses",
      icon: BookOpen,
      title: "Manage Courses",
      description: "View and manage all courses",
      gradient: "from-blue-500/10 to-cyan-500/10",
      border: "border-blue-500/30",
      iconGradient: "from-blue-500 to-cyan-500",
      hoverBorder: "hover:border-blue-500/50",
    },
    {
      href: "/admin/coupons",
      icon: Tag,
      title: "Manage Coupons",
      description: "Create and manage coupons",
      gradient: "from-violet-500/10 to-purple-500/10",
      border: "border-violet-500/30",
      iconGradient: "from-violet-500 to-purple-500",
      hoverBorder: "hover:border-violet-500/50",
    },
  ]

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Link
              key={action.href}
              href={action.href}
              className={`
                bg-gradient-to-br ${action.gradient} 
                border ${action.border} rounded-xl p-6 
                ${action.hoverBorder} transition-all duration-300 group
              `}
            >
              <div className="flex items-center gap-4">
                <div className={`
                  w-12 h-12 rounded-xl bg-gradient-to-br ${action.iconGradient} 
                  flex items-center justify-center 
                  group-hover:scale-110 transition-transform
                `}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{action.title}</h3>
                  <p className="text-gray-400 text-sm">{action.description}</p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

