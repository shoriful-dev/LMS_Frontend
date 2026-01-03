"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Star, Search } from "lucide-react"
import Image from "next/image"
import { EmptyState } from "@/components/ui"
import type { PopulatedReview } from "@/lib/types"

// Type for instructor reviews where course is populated
type InstructorPopulatedReview = PopulatedReview

interface ReviewsData {
  reviews: InstructorPopulatedReview[]
  totalReviews: number
  averageRating: number
  ratingDistribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
}

interface InstructorReviewsClientProps {
  reviewsData: ReviewsData | InstructorPopulatedReview[]
}

export function InstructorReviewsClient({ reviewsData }: InstructorReviewsClientProps) {
  // Check if reviewsData is an array or an object with reviews property
  const reviews: InstructorPopulatedReview[] = Array.isArray(reviewsData) 
    ? reviewsData 
    : reviewsData?.reviews || []
  
  const totalReviews = Array.isArray(reviewsData) 
    ? reviews.length 
    : reviewsData?.totalReviews || reviews.length
  
  const averageRating = Array.isArray(reviewsData) 
    ? 0 
    : reviewsData?.averageRating || 0
  
  const ratingDistribution = Array.isArray(reviewsData) 
    ? { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    : reviewsData?.ratingDistribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  
  const [searchQuery, setSearchQuery] = useState("")
  const [ratingFilter, setRatingFilter] = useState<number | "all">("all")

  if (reviews.length === 0) {
    return (
      <div className="w-full max-w-7xl py-10">
        <div className="text-center py-12 px-4">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/20 to-amber-600/20 rounded-full blur-2xl opacity-50" />
            <div className="relative w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 flex items-center justify-center">
              <Star className="h-10 w-10 text-gray-500" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No reviews yet</h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Reviews from students will appear here
          </p>
        </div>
      </div>
    )
  }

  // Filter reviews
  const filteredReviews = reviews.filter((review: InstructorPopulatedReview) => {
    const courseTitle = typeof review.course === 'object' && review.course !== null 
      ? review.course.title 
      : ''
    
    const matchesSearch = review.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.user.name.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (ratingFilter === "all") return matchesSearch
    return matchesSearch && review.rating === ratingFilter
  })

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? "fill-yellow-500 text-yellow-500" : "text-gray-600"}`}
      />
    ))
  }

  return (
    <div className="w-full max-w-7xl py-6 sm:py-8 lg:py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Course Reviews</h1>
        <p className="text-gray-400">Student feedback on your courses</p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl text-white">{totalReviews}</CardTitle>
            <CardDescription className="text-gray-400">Total Reviews</CardDescription>
          </CardHeader>
        </Card>
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className="text-2xl text-white">{averageRating.toFixed(1)}</CardTitle>
              <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
            </div>
            <CardDescription className="text-gray-400">Average Rating</CardDescription>
          </CardHeader>
        </Card>
        {/* Rating Distribution */}
        {[5, 4].map(rating => (
          <Card key={rating} className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <div className="flex items-center gap-1 mb-1">
                {renderStars(rating)}
              </div>
              <CardTitle className="text-xl text-white">{ratingDistribution[rating as keyof typeof ratingDistribution]}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <Input
            placeholder="Search reviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-900/50 border-gray-800 text-white placeholder:text-gray-500"
          />
        </div>
        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value === "all" ? "all" : parseInt(e.target.value))}
          className="px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-violet-500"
        >
          <option value="all">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
      </div>

      {/* Reviews List */}
      {filteredReviews.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No reviews found"
          description="Try adjusting your search or filters"
        />
      ) : (
          <div className="space-y-4">
          {filteredReviews.map((review: InstructorPopulatedReview) => (
            <Card key={review._id} className="bg-gray-900/50 border-gray-800 hover:border-violet-500/50 transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {review.user.avatar?.url ? (
                      <Image
                        src={review.user.avatar.url}
                        alt={review.user.name}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                        {review.user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-white font-semibold">{review.user.name}</p>
                      <p className="text-gray-500 text-sm">
                        {typeof review.course === 'object' && review.course !== null 
                          ? review.course.title 
                          : 'Course'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {renderStars(review.rating)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">{review.comment}</p>
                <p className="text-gray-500 text-sm mt-2">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

