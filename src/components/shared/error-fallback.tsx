import Link from "next/link"

/**
 * Reusable Error Fallback Component
 * Use this in specific error boundaries if needed
 */

interface ErrorFallbackProps {
  error: Error & { digest?: string }
  reset?: () => void
  title?: string
  message?: string
  showHomeButton?: boolean
}

export function ErrorFallback({ 
  error, 
  reset, 
  title = "Something went wrong!",
  message,
  showHomeButton = true 
}: ErrorFallbackProps) {
  return (
    <div className="min-h-screen bg-[#03050a] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-900/50 border border-gray-800 rounded-xl p-8 text-center">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
        <p className="text-gray-400 mb-6">
          {message || error.message || "We encountered an unexpected error."}
        </p>
        
        {process.env.NODE_ENV === 'development' && error.digest && (
          <div className="mb-6 p-4 bg-gray-800 rounded-lg text-left">
            <p className="text-xs text-gray-500 mb-2">Error ID:</p>
            <p className="text-xs text-gray-400 font-mono break-all">{error.digest}</p>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {reset && (
            <button
              onClick={reset}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Try again
            </button>
          )}
          {showHomeButton && (
            <Link
              href="/"
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Go home
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

