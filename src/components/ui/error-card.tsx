import { Card, CardContent } from "./card"
import { Button } from "./button"
import { AlertCircle, RefreshCw } from "lucide-react"

interface ErrorCardProps {
  title?: string
  error: string | Error
  onRetry?: () => void
  className?: string
}

export function ErrorCard({ 
  title = "Something went wrong",
  error, 
  onRetry,
  className = ""
}: ErrorCardProps) {
  const errorMessage = typeof error === 'string' ? error : error.message
  
  return (
    <Card className={`bg-gradient-to-br from-red-900/10 to-red-800/5 border-red-500/30 ${className}`}>
      <CardContent className="py-12 text-center">
        <div className="relative inline-block mb-6">
          {/* Error glow */}
          <div className="absolute inset-0 bg-red-600/20 rounded-full blur-2xl opacity-50" />
          <div className="relative w-16 h-16 mx-auto rounded-full bg-red-900/30 border border-red-500/30 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-red-400" />
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-white mb-2">
          {title}
        </h3>
        <p className="text-gray-400 mb-6 max-w-md mx-auto">
          {errorMessage}
        </p>
        
        {onRetry && (
          <Button 
            onClick={onRetry}
            variant="outline"
            className="border-red-500/50 text-red-400 hover:bg-red-900/20 hover:border-red-500"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

