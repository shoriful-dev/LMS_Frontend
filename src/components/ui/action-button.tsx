import { LucideIcon, Loader2 } from "lucide-react"
import { Button } from "./button"
import { cn } from "@/lib/utils"

interface ActionButtonProps {
  icon?: LucideIcon
  label: string
  onClick: () => void
  variant?: "default" | "outline" | "secondary" | "destructive" | "ghost"
  loading?: boolean
  disabled?: boolean
  className?: string
  size?: "default" | "sm" | "lg" | "icon"
}

export function ActionButton({ 
  icon: Icon,
  label,
  onClick,
  variant = "default",
  loading = false,
  disabled = false,
  className,
  size = "default"
}: ActionButtonProps) {
  return (
    <Button 
      onClick={onClick}
      variant={variant}
      disabled={disabled || loading}
      size={size}
      className={cn(className)}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
      ) : Icon ? (
        <Icon className="h-4 w-4 mr-2" />
      ) : null}
      {label}
    </Button>
  )
}

