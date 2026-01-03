"use client"
import Image from "next/image"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MessageSquare, BookOpen, ChevronLeft, ChevronRight, Send, X, ChevronDown, ChevronUp } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { Discussion, DiscussionAnswer } from "@/lib/types"
import { postDiscussionReply } from "@/app/(public)/dashboard/discussions/[id]/actions"

interface DiscussionsListProps {
  initialDiscussions: Discussion[]
  initialPagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  initialTab: "my" | "all"
}

export function DiscussionsList({ 
  initialDiscussions, 
  initialPagination,
  initialTab 
}: DiscussionsListProps) {
  const router = useRouter()
  const [discussions, setDiscussions] = useState<Discussion[]>(initialDiscussions)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const handleTabChange = (tab: "my" | "all") => {
    router.push(`/dashboard/discussions?tab=${tab}&page=1`)
  }

  const handlePageChange = (newPage: number) => {
    router.push(`/dashboard/discussions?tab=${initialTab}&page=${newPage}`)
  }

  const toggleExpand = (discussionId: string) => {
    if (expandedId === discussionId) {
      setExpandedId(null)
      setReplyText("")
      setErrorMessage("")
      setSuccessMessage("")
    } else {
      setExpandedId(discussionId)
      setErrorMessage("")
      setSuccessMessage("")
    }
  }

  const handleSubmitReply = async (discussionId: string, e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")
    setSuccessMessage("")

    if (!replyText.trim()) {
      setErrorMessage("Reply cannot be empty")
      return
    }

    setIsSubmitting(true)

    try {
      const result = await postDiscussionReply(discussionId, replyText)
      
      if (!result.success) {
        setErrorMessage(result.error || "Failed to submit reply")
        setIsSubmitting(false)
        return
      }
      
      
      // Optimistically update the discussion with the new reply
      if (result.data) {
        const updatedDiscussion = result.data as Discussion
        
        setDiscussions(prev => prev.map(discussion => 
          discussion._id === discussionId 
            ? updatedDiscussion
            : discussion
        ))
      }
      
      setReplyText("")
      setSuccessMessage("Reply posted successfully!")
      
      setTimeout(() => {
        setSuccessMessage("")
        setExpandedId(null)
      }, 2000)

      // Background refresh to ensure consistency
      setTimeout(() => {
        router.refresh()
      }, 2000)
    } catch (error) {
      console.error("Failed to submit reply:", error)
      setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Safe date formatting helper
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return 'Date unavailable'
      }
      return date.toLocaleDateString()
    } catch {
      return 'Date unavailable'
      }
    }
 
  return (
    <div className="w-full max-w-6xl py-6 sm:py-8 lg:py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent mb-2">
          Discussions
        </h1>
        <p className="text-gray-400">
          View and participate in course discussions
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-800">
        <button
          onClick={() => handleTabChange("my")}
          className={`px-6 py-3 font-medium transition-colors relative ${
            initialTab === "my"
              ? "text-violet-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          My Questions
          {initialTab === "my" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-600 to-purple-600" />
          )}
        </button>
        <button
          onClick={() => handleTabChange("all")}
          className={`px-6 py-3 font-medium transition-colors relative ${
            initialTab === "all"
              ? "text-violet-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          All Discussions
          {initialTab === "all" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-600 to-purple-600" />
          )}
        </button>
      </div>

      {/* Content */}
      {discussions.length === 0 ? (
        <div className="text-center py-12 px-4">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-purple-600/20 rounded-full blur-2xl opacity-50" />
            <div className="relative w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 flex items-center justify-center">
              <MessageSquare className="h-10 w-10 text-gray-500" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {initialTab === "my" ? "No questions asked yet" : "No discussions available"}
          </h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            {initialTab === "my" 
              ? "Start learning and ask your first question in any course" 
              : "No discussions in your enrolled courses yet"}
          </p>
          <button 
            onClick={() => router.push("/courses")}
            className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all"
          >
            <BookOpen className="inline h-5 w-5 mr-2" />
            Browse Courses
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {discussions.map((discussion) => {
              const user = typeof discussion.user === 'object' ? discussion.user : null
              const userName = user?.name || discussion.userName || 'Unknown User'
              const userAvatar = user?.avatar?.url || null
              const course = typeof discussion.course === 'object' ? discussion.course : null
              const courseTitle = course?.title || 'Unknown Course'
              const lecture = typeof discussion.lecture === 'object' ? discussion.lecture : null
              const lectureTitle = lecture?.title || 'Unknown Lecture'
              const answerCount = discussion.answers?.length || 0
              const isExpanded = expandedId === discussion._id
              
              return (
                <Card key={discussion._id} className="bg-gray-900/50 border-gray-800 hover:border-violet-500/30 transition-all p-6">
                  <div className="flex items-start gap-4 mb-4">
                    {/* Avatar */}
                    {userAvatar ? (
                      <Image 
                        src={userAvatar} 
                        alt={userName}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0 border-2 border-violet-500/30"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {userName[0]?.toUpperCase() || '?'}
                      </div>
                    )}
                    
                    <div className="flex-1">
                      {/* User and Date */}
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-white">{userName}</h3>
                        <span className="text-xs text-gray-500">
                          {formatDate(discussion.createdAt)}
                        </span>
                      </div>
                      
                      {/* Course and Lecture */}
                      <p className="text-gray-400 text-sm mb-2">
                        {courseTitle} • {lectureTitle}
                      </p>
                      
                      {/* Question */}
                      <p className={`text-white ${!isExpanded ? 'line-clamp-2' : ''}`}>
                        {discussion.question || 'No question content'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Footer - Answers Count and Reply Button */}
                  <div className="ml-14 pl-4 border-l-2 border-gray-700 flex items-center justify-between">
                    <p className="text-sm text-gray-400">
                      {answerCount > 0 ? (
                        <>{answerCount} answer{answerCount > 1 ? 's' : ''}</>
                      ) : (
                        'No answers yet'
                      )}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpand(discussion._id)}
                        className="text-violet-400 hover:text-violet-300 hover:bg-violet-500/10"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="h-4 w-4 mr-1" />
                            Collapse
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4 mr-1" />
                            Reply
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Expanded Reply Section */}
                  {isExpanded && (
                    <div className="ml-14 pl-4 border-l-2 border-gray-700 mt-4 space-y-4">
                      {/* Existing Answers */}
                      {discussion.answers && discussion.answers.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold text-gray-300">Answers:</h4>
                          {discussion.answers.map((answer: DiscussionAnswer, idx: number) => {
                            const answerUser = typeof answer.user === 'object' ? answer.user : null
                            const answerUserName = answerUser?.name || answer.userName || 'Unknown User'
                            const answerUserAvatar = answerUser?.avatar?.url || null
                            
                            return (
                              <div key={answer._id || idx} className={`bg-gray-800/30 rounded-lg p-4 ${answer.isInstructorAnswer ? 'border-l-2 border-violet-500' : ''}`}>
                                <div className="flex items-center gap-2 mb-2">
                                  {answerUserAvatar ? (
                                    <Image 
                                      src={answerUserAvatar} 
                                      alt={answerUserName}
                                      width={24}
                                      height={24}
                                      className="w-6 h-6 rounded-full object-cover flex-shrink-0 border border-violet-500/30"
                                    />
                                  ) : (
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                                      {answerUserName[0]?.toUpperCase() || '?'}
                                    </div>
                                  )}
                                  <span className="text-sm font-medium text-white">{answerUserName}</span>
                                  {answer.isInstructorAnswer && (
                                    <span className="px-2 py-0.5 bg-violet-500/20 text-violet-300 text-xs font-medium rounded-full">
                                      Instructor
                                    </span>
                                  )}
                                  <span className="text-xs text-gray-500 ml-auto">
                                    {formatDate(answer.createdAt)}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-300">{answer.text}</p>
                              </div>
                            )
                          })}
                        </div>
                      )}

                      {/* Reply Form */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-300 mb-3">Add Your Answer:</h4>
                        
                        {/* Success Message */}
                        {successMessage && expandedId === discussion._id && (
                          <div className="mb-3 p-3 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400 text-sm">
                            {successMessage}
                          </div>
                        )}
                        
                        {/* Error Message */}
                        {errorMessage && expandedId === discussion._id && (
                          <div className="mb-3 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                            {errorMessage}
                          </div>
                        )}

                        <form onSubmit={(e) => handleSubmitReply(discussion._id, e)}>
                          <Textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Share your knowledge or ask for clarification..."
                            className="min-h-[100px] bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-violet-500 mb-3 resize-none"
                            disabled={isSubmitting}
                          />
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-500">
                              {replyText.length}/2000 characters
                            </p>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleExpand(discussion._id)}
                                disabled={isSubmitting}
                                className="text-gray-400 hover:text-white"
                              >
                                <X className="h-4 w-4 mr-1" />
                                Cancel
                              </Button>
                              <Button
                                type="submit"
                                size="sm"
                                disabled={isSubmitting || !replyText.trim()}
                                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
                              >
                                {isSubmitting ? (
                                  <>
                                    <div className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Posting...
                                  </>
                                ) : (
                                  <>
                                    <Send className="h-4 w-4 mr-1" />
                                    Post Reply
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </Card>
              )
            })}
          </div>

          {/* Pagination */}
          {initialPagination.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between bg-gray-900/50 border border-gray-800 rounded-xl px-6 py-4">
              <p className="text-gray-400 text-sm">
                Page {initialPagination.page} of {initialPagination.totalPages} ({initialPagination.total} total)
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(initialPagination.page - 1)}
                  disabled={initialPagination.page === 1}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(initialPagination.page + 1)}
                  disabled={initialPagination.page === initialPagination.totalPages}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

