import { Card, CardContent } from "./card"
import { Loader2 } from "lucide-react"

interface LoadingCardProps {
  message?: string
  className?: string
}

export function LoadingCard({ 
  message = "Loading...",
  className = ""
}: LoadingCardProps) {
  return (
    <Card className={`bg-gradient-to-br from-gray-900 via-[#0a0d14] to-gray-900 border-gray-800 ${className}`}>
      <CardContent className="py-16 text-center">
        <div className="relative inline-block mb-4">
          {/* Spinning glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full blur-xl opacity-30 animate-pulse" />
          <Loader2 className="relative h-12 w-12 text-blue-400 animate-spin" />
        </div>
        <p className="text-gray-400 font-medium">{message}</p>
      </CardContent>
    </Card>
  )
}

