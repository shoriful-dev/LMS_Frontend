'use client'

import { useState, useEffect, useTransition } from "react"
import Image from "next/image"
import { Star, Edit2, Trash2, X, Check } from "lucide-react"
import { EmptyState, LoadingCard } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { createReviewAction, updateReviewAction, deleteReviewAction } from "@/app/actions/review-actions"
import { getCourseReviews } from "@/lib/api-client"
import type { PopulatedReview } from "@/lib/types"

interface ReviewsTabClientProps {
  courseId: string
  accessToken?: string
  currentUserId?: string
}

export function ReviewsTabClient({ 
  courseId, 
  accessToken, 
  currentUserId
}: ReviewsTabClientProps) {
  const [reviews, setReviews] = useState<PopulatedReview[]>([])
  const [loadingReviews, setLoadingReviews] = useState(true)
  const [averageRating, setAverageRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editComment, setEditComment] = useState("")
  const [editRating, setEditRating] = useState(5)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  
  // New review form state
  const [newRating, setNewRating] = useState(5)
  const [newComment, setNewComment] = useState("")
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch reviews on mount
  useEffect(() => {
    if (courseId && accessToken) {
      fetchReviews()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, accessToken])

  const fetchReviews = async (showLoading = true) => {
    if (!courseId || !accessToken) {
      return
    }

    try {
      if (showLoading) {
        setLoadingReviews(true)
      }
      
      // Use API client for consistent error handling
      const response = await getCourseReviews(courseId, accessToken, { cache: 'no-store' })
      
      // Backend returns reviews in 'data' property
      const reviewsData = response.data || []
      
      // Update state with fresh reviews
      setReviews(reviewsData)
      setTotalReviews(reviewsData.length)
      
      // Calculate average rating
      if (reviewsData.length > 0) {
        const avg = reviewsData.reduce((sum, r) => sum + r.rating, 0) / reviewsData.length
        setAverageRating(avg)
      } else {
        setAverageRating(0)
      }
    } catch (error) {
      console.error("Error fetching reviews:", error)
    } finally {
      if (showLoading) {
        setLoadingReviews(false)
      }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays < 1) return "Today"
    if (diffInDays === 1) return "Yesterday"
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`
    return date.toLocaleDateString()
  }

  const handleEdit = (review: PopulatedReview) => {
    setEditingId(review._id)
    setEditComment(review.comment)
    setEditRating(review.rating)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditComment("")
    setEditRating(5)
  }

  const handleUpdateReview = (reviewId: string) => {
    if (!courseId || !editComment.trim()) {
      console.error("Cannot update review: missing courseId or comment")
      return
    }

    setError(null)
    startTransition(async () => {
      try {
        const result = await updateReviewAction(reviewId, courseId, editRating, editComment)
        
        if (result.success) {
          
          // Optimistically update the local state
          if (result.data) {
            const updatedReview = result.data as PopulatedReview
            
            setReviews(prev => prev.map(r => 
              r._id === reviewId ? updatedReview : r
            ))
            
            // Recalculate average rating
            const updatedReviews = reviews.map(r => 
              r._id === reviewId ? updatedReview : r
            )
            const avg = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length
            setAverageRating(avg)
          }
          
      // Clear editing state
      setEditingId(null)
      setEditComment("")
      setEditRating(5)
      
    } else {
          console.error('Failed to update review:', result.error)
          setError(result.error || "Failed to update review")
        }
      } catch (error) {
        console.error('Error updating review:', error)
        setError("An unexpected error occurred")
      }
    })
  }

  const handleDeleteReview = (reviewId: string) => {
    if (!courseId) {
      console.error("Cannot delete review: missing courseId")
      return
    }

    setError(null)
    startTransition(async () => {
      try {
        const result = await deleteReviewAction(reviewId, courseId)
        
        if (result.success) {
          // Remove from local state immediately
          setReviews(reviews.filter(r => r._id !== reviewId))
          setTotalReviews(totalReviews - 1)
          
          // Recalculate average rating
          const remainingReviews = reviews.filter(r => r._id !== reviewId)
          if (remainingReviews.length > 0) {
            const avg = remainingReviews.reduce((sum, r) => sum + r.rating, 0) / remainingReviews.length
            setAverageRating(avg)
          } else {
            setAverageRating(0)
          }
          
          setDeleteConfirm(null)
          
        } else {
          console.error('Failed to delete review:', result.error)
          setError(result.error || "Failed to delete review")
        }
      } catch (error) {
        console.error('Error deleting review:', error)
        setError("An unexpected error occurred")
      }
    })
  }

  const handleSubmitReview = async () => {
    if (!courseId || !newComment.trim()) {
      console.error("Cannot submit review: missing courseId or comment")
      setError("Please write a review comment")
      return
    }

    if (newComment.trim().length < 10) {
      console.error("Comment too short")
      setError("Comment must be at least 10 characters long")
      return
    }

    setError(null)
    setIsSubmitting(true)
    
    try {
      const formData = new FormData()
      formData.append('rating', newRating.toString())
      formData.append('comment', newComment)
      
      const result = await createReviewAction(courseId, formData)
      
      if (result.success) {
        
        // Clear form state immediately
        setShowReviewForm(false)
        setNewComment("")
        setNewRating(5)
        
        // Optimistically add the new review to local state
        if (result.data) {
          const newReview = result.data as PopulatedReview
          setReviews(prev => [newReview, ...prev])
          setTotalReviews(prev => prev + 1)
          
          // Recalculate average rating
          const updatedReviews = [newReview, ...reviews]
          const avg = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length
          setAverageRating(avg)
        }
        
      } else {
        console.error('Failed to submit review:', result.error)
        setError(result.error || "Failed to submit review")
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      setError("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Check if current user has already reviewed
  const hasUserReviewed = reviews.some(review => 
    currentUserId && review.user._id === currentUserId
  )

  if (loadingReviews) {
    return <LoadingCard message="Loading reviews..." />
  }

  // If no reviews at all
  if (reviews.length === 0) {
    // If user is logged in but hasn't reviewed, show the review form
    if (!hasUserReviewed && currentUserId) {
    return (
      <div className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Rating Summary - Empty State */}
        <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                <span className="text-3xl font-bold text-white">0.0</span>
              </div>
              <p className="text-sm text-gray-400">Course Rating</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">0</p>
              <p className="text-sm text-gray-400">Reviews</p>
            </div>
          </div>
        </div>

        {/* New Review Form */}
        <div className="bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 border border-gray-800 rounded-xl p-6">
          {!showReviewForm ? (
            <div className="text-center py-4">
              <Button
                onClick={() => setShowReviewForm(true)}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
              >
                <Star className="h-4 w-4 mr-2" />
                Write a Review
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Write Your Review</h3>
                <button
                  onClick={() => {
                    setShowReviewForm(false)
                    setNewComment("")
                    setNewRating(5)
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Close review form"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Rating Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= newRating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-600"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-400">
                    {newRating} out of 5
                  </span>
                </div>
              </div>

              {/* Comment Textarea */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Your Review</label>
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts about this course... (minimum 10 characters)"
                  className="min-h-[120px] bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
                />
                {newComment.length > 0 && newComment.length < 10 && (
                  <p className="text-xs text-yellow-400">
                    {10 - newComment.length} more characters required
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleSubmitReview}
                  disabled={isSubmitting || !newComment.trim() || newComment.trim().length < 10}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </Button>
                <Button
                  onClick={() => {
                    setShowReviewForm(false)
                    setNewComment("")
                    setNewRating(5)
                  }}
                  disabled={isSubmitting}
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
    }
    
    // If no reviews and user is not logged in, show empty state
    return (
      <EmptyState 
        icon={Star}
        title="No Reviews Yet"
        description="Be the first to review this course"
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Rating Summary */}
      <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
              <span className="text-3xl font-bold text-white">{averageRating.toFixed(1)}</span>
            </div>
            <p className="text-sm text-gray-400">Course Rating</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">{totalReviews}</p>
            <p className="text-sm text-gray-400">
              {totalReviews === 1 ? 'Review' : 'Reviews'}
            </p>
          </div>
        </div>
      </div>

      {/* New Review Form - Show if user hasn't reviewed yet */}
      {!hasUserReviewed && currentUserId && (
        <div className="bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 border border-gray-800 rounded-xl p-6">
          {!showReviewForm ? (
            <div className="text-center py-4">
              <Button
                onClick={() => setShowReviewForm(true)}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
              >
                <Star className="h-4 w-4 mr-2" />
                Write a Review
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Write Your Review</h3>
                <button
                  onClick={() => {
                    setShowReviewForm(false)
                    setNewComment("")
                    setNewRating(5)
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Close review form"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Rating Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= newRating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-600"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-400">
                    {newRating} out of 5
                  </span>
                </div>
              </div>

              {/* Comment Textarea */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Your Review</label>
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts about this course... (minimum 10 characters)"
                  className="min-h-[120px] bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
                />
                {newComment.length > 0 && newComment.length < 10 && (
                  <p className="text-xs text-yellow-400">
                    {10 - newComment.length} more characters required
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleSubmitReview}
                  disabled={isSubmitting || !newComment.trim() || newComment.trim().length < 10}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </Button>
                <Button
                  onClick={() => {
                    setShowReviewForm(false)
                    setNewComment("")
                    setNewRating(5)
                  }}
                  disabled={isSubmitting}
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => {
          const isCurrentUserReview = currentUserId && review.user._id === currentUserId
          const isEditing = editingId === review._id

          return (
            <div
              key={review._id}
              className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 sm:p-6 hover:border-gray-700 transition-colors"
            >
              <div className="flex items-start gap-4">
                {/* User Avatar */}
                <div className="flex-shrink-0">
                  <Image
                    src={review.user.avatar.url}
                    alt={review.user.name}
                    width={40}
                    height={40}
                    className="rounded-full ring-2 ring-blue-600/30 object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  {/* User Name and Date */}
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{review.user.name}</span>
                      {isCurrentUserReview && (
                        <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-600/30">
                          Your Review
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {/* Rating Display */}
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= (isEditing ? editRating : review.rating)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-600"
                            }`}
                          />
                        ))}
                      </div>

                      {/* Edit/Delete Buttons */}
                      {isCurrentUserReview && !isEditing && (
                        <div className="flex items-center gap-1 ml-2">
                          <button
                            onClick={() => handleEdit(review)}
                            className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors group"
                            aria-label="Edit review"
                          >
                            <Edit2 className="h-4 w-4 text-gray-400 group-hover:text-blue-400" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(review._id)}
                            className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors group"
                            aria-label="Delete review"
                          >
                            <Trash2 className="h-4 w-4 text-gray-400 group-hover:text-red-400" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Review Content */}
                  {isEditing ? (
                    <div className="space-y-3">
                      {/* Editable Rating */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">Rating:</span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setEditRating(star)}
                              className="transition-transform hover:scale-110"
                            >
                              <Star
                                className={`h-5 w-5 ${
                                  star <= editRating
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-600"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Editable Comment */}
                      <Textarea
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        placeholder="Write your review..."
                        className="min-h-[100px] bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
                      />

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => handleUpdateReview(review._id)}
                          disabled={isPending || !editComment.trim()}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          {isPending ? "Saving..." : "Save"}
                        </Button>
                        <Button
                          onClick={handleCancelEdit}
                          disabled={isPending}
                          size="sm"
                          variant="outline"
                          className="border-gray-700 text-gray-300 hover:bg-gray-800"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-300 text-sm leading-relaxed">{review.comment}</p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white">Delete Review</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete this review? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              onClick={() => setDeleteConfirm(null)}
              disabled={isPending}
              variant="outline"
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={() => deleteConfirm && handleDeleteReview(deleteConfirm)}
              disabled={isPending}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

