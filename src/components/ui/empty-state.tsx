import { LucideIcon } from "lucide-react"
import { Button } from "./button"
import { ReactNode } from "react"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    variant?: "default" | "outline" | "secondary"
  } | ReactNode
  className?: string
}

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action,
  className = ""
}: EmptyStateProps) {
  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      <div className="relative inline-block mb-6">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-full blur-2xl opacity-50" />
        <div className="relative w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 flex items-center justify-center">
          <Icon className="h-10 w-10 text-gray-500" />
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-white mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-gray-400 mb-6 max-w-md mx-auto">
          {description}
        </p>
      )}
      
      {action && (
        <>
          {typeof action === 'object' && 'label' in action ? (
            <Button 
              onClick={action.onClick}
              variant={action.variant || "default"}
              className="mt-2"
            >
              {action.label}
            </Button>
          ) : (
            <div className="mt-2">{action}</div>
          )}
        </>
      )}
    </div>
  )
}

