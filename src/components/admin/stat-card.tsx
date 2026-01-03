import Link from "next/link"
import { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  color: string
  subtitle?: string
  link?: string
}

export function StatCard({ title, value, icon: Icon, color, subtitle, link }: StatCardProps) {
  const content = (
    <div className={`
      bg-gradient-to-br from-gray-900/50 to-gray-800/30 
      border border-gray-800/50 rounded-xl p-6
      hover:border-${color.split(' ')[1]}/30 transition-all duration-300
      ${link ? 'cursor-pointer hover:scale-[1.02]' : ''}
    `}>
      <div className="flex items-start justify-between mb-4">
        <div className={`
          w-12 h-12 rounded-xl bg-gradient-to-br ${color} 
          flex items-center justify-center
          shadow-lg
        `}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
      <p className="text-white text-3xl font-bold mb-1">{value}</p>
      {subtitle && (
        <p className="text-gray-500 text-xs">{subtitle}</p>
      )}
    </div>
  )

  return link ? <Link href={link}>{content}</Link> : content
}

