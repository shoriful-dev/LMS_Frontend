"use client"

import { useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"

/**
 * Session Monitor Component
 * Only monitors authenticated sessions on protected routes
 */
export function SessionMonitor() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  // Check if current route requires authentication
  const isProtectedRoute = useCallback(() => {
    const protectedPaths = [
      '/dashboard',
      '/profile',
      '/instructor',
      '/admin',
      '/courses/.+/learn', // Regex pattern for dynamic routes
    ]
    
    return protectedPaths.some(path => {
      if (path.includes('/.+/')) {
        // Handle regex patterns
        const regex = new RegExp(`^${path.replace('/.+/', '/[^/]+/')}`)
        return regex.test(pathname)
      }
      return pathname.startsWith(path)
    })
  }, [pathname])

  useEffect(() => {
    // Only monitor if user is authenticated AND on a protected route
    if (status !== "authenticated" || !session || !isProtectedRoute()) {
      return
    }

    // Check session every 5 minutes
    const intervalId = setInterval(() => {
      // Check if session has error flag
      if (session.error) {
        console.error("⚠️ Session error detected:", session.error)
        router.push("/signin?error=SessionError")
        return
      }

      // Check if access token is missing
      if (!session.accessToken) {
        console.error("⚠️ Access token missing from session")
        router.push("/signin?error=NoAccessToken")
        return
      }

    }, 5 * 60 * 1000) // Check every 5 minutes

    // Cleanup on unmount
    return () => clearInterval(intervalId)
  }, [session, status, router, pathname, isProtectedRoute])

  // Initial check on mount (only for protected routes)
  useEffect(() => {
    if (status === "authenticated" && session && isProtectedRoute()) {
      if (session.error) {
        console.error("⚠️ Session error on mount:", session.error)
        router.push("/signin?error=SessionError")
      } else if (!session.accessToken) {
        console.error("⚠️ Access token missing on mount")
        router.push("/signin?error=NoAccessToken")
      }
    }
  }, [session, status, router, pathname, isProtectedRoute])

  // This component doesn't render anything
  return null
}

