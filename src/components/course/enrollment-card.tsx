"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert } from "@/components/ui/alert"
import { CheckCircle, Tag } from "lucide-react"
import { enrollInCourse, validateCoupon, checkEnrollment } from "@/lib/api-client"
import { Input } from "@/components/ui/input"

interface EnrollmentCardProps {
  courseId: string
  price: number
  discount?: number
}

export function EnrollmentCard({
  courseId,
  price,
  discount = 0,
}: EnrollmentCardProps) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isEnrolling, setIsEnrolling] = useState(false)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [isCheckingEnrollment, setIsCheckingEnrollment] = useState(true)
  const [error, setError] = useState("")
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null)
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false)
  const [couponError, setCouponError] = useState("")

  const isAuthenticated = status === "authenticated"
  const accessToken = session?.accessToken

  // Check enrollment status when authenticated
  useEffect(() => {
    const checkEnrollmentStatus = async () => {
      if (isAuthenticated && accessToken) {
        try {
          const result = await checkEnrollment(courseId, accessToken)
          setIsEnrolled(result.isEnrolled)
        } catch (err) {
          console.error("Failed to check enrollment:", err)
          setIsEnrolled(false)
        } finally {
          setIsCheckingEnrollment(false)
        }
      } else {
        setIsCheckingEnrollment(false)
      }
    }

    checkEnrollmentStatus()
  }, [isAuthenticated, accessToken, courseId])

  // Calculate final price with discount and coupon
  let finalPrice = price

  // Apply course discount first
  if (discount > 0) {
    finalPrice = price * (1 - discount / 100)
  }

  // Apply coupon discount on top of course discount
  if (appliedCoupon?.discountValue) {
    const couponDiscount = appliedCoupon.discountValue
    finalPrice = finalPrice * (1 - couponDiscount / 100)
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code")
      return
    }

    setIsValidatingCoupon(true)
    setCouponError("")

    try {
      const result = await validateCoupon(courseId, couponCode.trim())
      setAppliedCoupon(result.coupon)
      setCouponError("")
    } catch (err) {
      const error = err as Error
      setCouponError(error.message || "Invalid coupon code")
      setAppliedCoupon(null)
    } finally {
      setIsValidatingCoupon(false)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode("")
    setCouponError("")
  }

  const handleEnroll = async () => {
    // Prevent double enrollment attempts
    if (isEnrolling) {
      return
    }

    // If already enrolled, go to learning page
    if (isEnrolled) {
      router.push(`/courses/${courseId}/learn`)
      return
    }

    if (!isAuthenticated) {
      router.push(`/signin?callbackUrl=/courses/${courseId}`)
      return
    }

    if (!accessToken) {
      setError("Please sign in to enroll")
      return
    }

    setIsEnrolling(true)
    setError("")

    try {
      // Pass the applied coupon code if available
      const couponCodeToSend = appliedCoupon?.code || undefined
      
      const response = await enrollInCourse(courseId, accessToken, couponCodeToSend)
      
      // If there's a checkout URL, redirect to Stripe for payment
      if (response.checkoutUrl) {
        window.location.href = response.checkoutUrl
      } else {
        // Free course - navigate to learning page
        // Don't call router.refresh() to avoid race conditions
        router.push(`/courses/${courseId}/learn`)
      }
    } catch (err) {
      const error = err as Error
      console.error("Enrollment error:", error)
      setError(error.message || "Failed to enroll in course")
      setIsEnrolling(false)
    }
    // Note: Don't set isEnrolling to false if successful - user is navigating away
  }

  return (
    <Card className="bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 backdrop-blur-sm border-gray-800/50 sticky top-24 shadow-xl">
      <CardHeader>
        <div className="space-y-3">
          {(discount > 0 || appliedCoupon) && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xl text-gray-500 line-through">${price.toFixed(2)}</span>
              {discount > 0 && (
                <span className="text-xs font-bold text-white bg-gradient-to-r from-blue-500 to-cyan-600 px-2.5 py-1 rounded-lg shadow-lg shadow-cyan-500/50">
                  {discount}% OFF
                </span>
              )}
              {appliedCoupon && (
                <span className="text-xs font-bold text-white bg-gradient-to-r from-blue-500 to-cyan-500 px-2.5 py-1 rounded-lg shadow-lg shadow-cyan-500/50">
                  Coupon: {appliedCoupon.discountValue}% OFF
                </span>
              )}
            </div>
          )}
          <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            ${finalPrice.toFixed(2)}
          </div>
          {appliedCoupon && (
            <p className="text-sm text-cyan-400 font-medium">
              You save ${(price - finalPrice).toFixed(2)}!
            </p>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <Alert variant="error" className="bg-red-900/20 border-red-500/50 text-red-400">{error}</Alert>}
        
        {/* Coupon Section - Only show if not enrolled */}
        {!isEnrolled && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <div className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <Tag className="h-3.5 w-3.5 text-cyan-400" />
              </div>
              <span>Have a coupon code?</span>
            </div>
            
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3 bg-cyan-900/20 border border-cyan-500/30 rounded-lg backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-cyan-400" />
                  <span className="text-sm font-medium text-cyan-300">
                    Coupon &quot;{appliedCoupon.code}&quot; applied!
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveCoupon}
                  className="text-cyan-300 hover:text-cyan-200 hover:bg-cyan-900/30"
                >
                  Remove
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value.toUpperCase())
                      setCouponError("")
                    }}
                    className="flex-1 bg-gray-800/30 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                    disabled={isValidatingCoupon}
                  />
                  <Button
                    variant="outline"
                    onClick={handleApplyCoupon}
                    disabled={isValidatingCoupon || !couponCode.trim()}
                    className="border-gray-700 text-gray-300 hover:bg-gray-800/50 hover:text-white"
                  >
                    {isValidatingCoupon ? "Applying..." : "Apply"}
                  </Button>
                </div>
                {couponError && (
                  <p className="text-sm text-red-400">{couponError}</p>
                )}
              </div>
            )}
          </div>
        )}

        <Button 
          className={`w-full ${
            isEnrolled 
              ? 'bg-gray-700 hover:bg-gray-600' 
              : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-blue-500/25 hover:shadow-blue-500/40'
          } text-white border-0 shadow-lg transition-all duration-200`}
          size="lg"
          onClick={handleEnroll}
          disabled={isEnrolling || isCheckingEnrollment}
        >
          {isCheckingEnrollment
            ? "Checking..." 
            : isEnrolling 
            ? "Enrolling..." 
            : isEnrolled 
            ? "Continue Learning" 
            : "Enroll Now"}
        </Button>

        <div className="space-y-2.5 text-sm text-gray-300">
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-2 text-cyan-400" />
            <span>Full lifetime access</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-2 text-cyan-400" />
            <span>Certificate of completion</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-2 text-cyan-400" />
            <span>Access on mobile and desktop</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

