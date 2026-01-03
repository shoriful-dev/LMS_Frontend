import { LucideIcon } from "lucide-react"
import { ReactNode } from "react"

interface SectionHeaderProps {
  icon?: LucideIcon
  title: string
  description?: string
  actions?: ReactNode
  className?: string
}

export function SectionHeader({ 
  icon: Icon, 
  title, 
  description, 
  actions,
  className = ""
}: SectionHeaderProps) {
  return (
    <div className={`flex items-start justify-between mb-4 ${className}`}>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          {Icon && (
            <Icon className="h-5 w-5 text-blue-400" />
          )}
          <h2 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {title}
          </h2>
        </div>
        {description && (
          <p className="text-sm text-gray-400">
            {description}
          </p>
        )}
      </div>
      
      {actions && (
        <div className="flex gap-2">
          {actions}
        </div>
      )}
    </div>
  )
}

