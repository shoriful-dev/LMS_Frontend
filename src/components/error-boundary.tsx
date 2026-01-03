'use client'

import { Component, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCcw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  showDetails?: boolean
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 * and displays a fallback UI instead of crashing the whole app
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error)
      console.error('Error info:', errorInfo)
    }

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo)

    // Update state with error info
    this.setState({
      errorInfo,
    })

    // TODO: Send to error tracking service (e.g., Sentry)
    // logErrorToService(error, errorInfo)
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI
      return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <div className="max-w-lg w-full">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-start mb-4">
                <AlertCircle className="h-6 w-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-900 mb-2">
                    Oops! Something went wrong
                  </h3>
                  <p className="text-sm text-red-700 mb-4">
                    {this.state.error?.message || 'An unexpected error occurred'}
                  </p>

                  {/* Show error details in development */}
                  {this.props.showDetails && process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                    <details className="mt-4 text-xs bg-red-100 rounded p-3 overflow-auto max-h-40">
                      <summary className="cursor-pointer font-medium text-red-900 mb-2">
                        Error Details
                      </summary>
                      <pre className="whitespace-pre-wrap text-red-800">
                        {this.state.error?.stack}
                      </pre>
                      <pre className="whitespace-pre-wrap text-red-800 mt-2">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}

                  <div className="flex gap-3 mt-6">
                    <Button
                      onClick={this.handleReset}
                      variant="outline"
                      size="sm"
                      className="flex items-center"
                    >
                      <RefreshCcw className="h-4 w-4 mr-2" />
                      Try Again
                    </Button>
                    <Button
                      onClick={this.handleReload}
                      size="sm"
                      variant="default"
                    >
                      Reload Page
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Async Error Boundary for handling async errors
 * Usage: Wrap async components that might throw
 */
export function AsyncErrorBoundary({ children, ...props }: Props) {
  return <ErrorBoundary {...props}>{children}</ErrorBoundary>
}

