"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Send, Reply, CheckCircle } from "lucide-react"
import { apiClient } from "@/lib/api-client"

interface Discussion {
  _id: string
  user: {
    _id: string
    name: string
    avatar?: {
      url: string
    }
  }
  lecture: string
  course: string
  question: string
  answers: Array<{
    _id: string
    user: {
      _id: string
      name: string
      avatar?: {
        url: string
      }
    }
    text: string
    isInstructorAnswer: boolean
    createdAt: string
  }>
  createdAt: string
  updatedAt: string
}

interface DiscussionsSectionProps {
  lectureId: string
  accessToken: string
}

export function DiscussionsSection({ lectureId, accessToken }: DiscussionsSectionProps) {
  
  const [discussions, setDiscussions] = useState<Discussion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newQuestion, setNewQuestion] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")
  const [isSubmittingReply, setIsSubmittingReply] = useState(false)
  const [questionError, setQuestionError] = useState("")
  const [replyError, setReplyError] = useState("")

  useEffect(() => {
    // Fetch discussions when component mounts
  }, [])

  // Fetch discussions for this lecture
  const fetchDiscussions = async () => {
    if (!lectureId || !accessToken) {
      setDiscussions([])
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      const response = await apiClient.getLectureDiscussions(lectureId, accessToken)
      
      // Handle different response structures
      if (response && response.data) {
        setDiscussions(Array.isArray(response.data) ? response.data : [])
      } else if (Array.isArray(response)) {
        setDiscussions(response)
      } else {
        setDiscussions([])
      }
    } catch (error) {
      console.error("Failed to fetch discussions for lectureId:", lectureId, error)
      // Set empty array on error instead of leaving it undefined
      setDiscussions([])
      
      // Show user-friendly error if it's a server error
      if (error instanceof Error && error.message.includes('500')) {
        console.warn('Server error fetching discussions - this lecture may not exist in the database')
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (lectureId && accessToken) {
      fetchDiscussions()
    } else {
      setDiscussions([])
      setIsLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lectureId, accessToken])

  // Create new discussion
  const handleSubmitQuestion = async () => {
    setQuestionError("")
    
    if (!lectureId) {
      setQuestionError("Lecture ID is required.")
      return
    }
    
    const trimmedQuestion = newQuestion.trim()
    
    // Client-side validation
    if (!trimmedQuestion) {
      setQuestionError("Question cannot be empty")
      return
    }
    
    if (trimmedQuestion.length < 10) {
      setQuestionError("Question must be at least 10 characters")
      return
    }
    
    if (trimmedQuestion.length > 1000) {
      setQuestionError("Question cannot exceed 1000 characters")
      return
    }

    try {
      setIsSubmitting(true)
      await apiClient.createDiscussion(
        {
          lecture: lectureId,
          question: trimmedQuestion,
        },
        accessToken
      )
      setNewQuestion("")
      setQuestionError("")
      await fetchDiscussions()
    } catch (error) {
      console.error("Failed to create discussion:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to post question"
      setQuestionError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Reply to discussion
  const handleSubmitReply = async (discussionId: string) => {
    setReplyError("")
    
    const trimmedReply = replyText.trim()
    
    // Client-side validation
    if (!trimmedReply) {
      setReplyError("Reply cannot be empty")
      return
    }
    
    if (trimmedReply.length < 5) {
      setReplyError("Reply must be at least 5 characters")
      return
    }
    
    if (trimmedReply.length > 2000) {
      setReplyError("Reply cannot exceed 2000 characters")
      return
    }

    try {
      setIsSubmittingReply(true)
      await apiClient.answerDiscussion(
        discussionId,
        { text: trimmedReply },
        accessToken
      )
      setReplyText("")
      setReplyingTo(null)
      setReplyError("")
      await fetchDiscussions()
    } catch (error) {
      console.error("Failed to reply to discussion:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to post reply"
      setReplyError(errorMessage)
    } finally {
      setIsSubmittingReply(false)
    }
  }



  // Ensure discussions is always an array
  const safeDiscussions = Array.isArray(discussions) ? discussions : []

  return (
    <div className="space-y-6">
        {/* Section Title */}
        <div className="flex items-center gap-2 pb-2 border-b border-gray-800">
          <MessageSquare className="h-5 w-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">
            Discussions {lectureId && `(${safeDiscussions.length})`}
          </h3>
        </div>

        {/* New Question Form */}
        {lectureId && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-300">
            Ask a Question
          </label>
          <Textarea
            placeholder="What would you like to know about this lecture? (min 10 characters)"
            value={newQuestion}
            onChange={(e) => {
              setNewQuestion(e.target.value)
              setQuestionError("")
            }}
            className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-500 resize-none"
            rows={3}
          />
          {questionError && (
            <p className="text-sm text-red-400">{questionError}</p>
          )}
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              {newQuestion.length}/1000 characters (minimum 10)
            </p>
            <Button
              onClick={handleSubmitQuestion}
              disabled={isSubmitting || newQuestion.trim().length < 10}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? "Posting..." : "Post Question"}
            </Button>
          </div>
        </div>
        )}

        {/* Discussions List */}
        {lectureId && (
        <div className="space-y-4 border-t border-gray-800 pt-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : safeDiscussions.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No discussions yet. Be the first to ask a question!</p>
            </div>
          ) : (
            safeDiscussions.map((discussion) => (
              <div
                key={discussion._id}
                className="border border-gray-800 rounded-lg p-4 space-y-3 hover:border-gray-700 transition-colors"
              >
                {/* Question */}
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    {discussion.user?.avatar?.url ? (
                      <Image
                        src={discussion.user.avatar.url}
                        alt={discussion.user?.name || "User"}
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center text-white text-sm font-medium">
                        {discussion.user?.name?.charAt(0).toUpperCase() || "?"}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-white font-medium text-sm">
                        {discussion.user?.name || "Anonymous"}
                      </p>
                      <span className="text-xs text-gray-500">
                        {new Date(discussion.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">{discussion.question}</p>
                  </div>
                </div>

                {/* Answers */}
                {discussion.answers && discussion.answers.length > 0 && (
                  <div className="ml-11 space-y-2">
                    {discussion.answers.map((answer) => (
                      <div key={answer._id} className="bg-gray-900/50 border border-gray-800 rounded-lg p-3 space-y-2">
                        <div className="flex items-start gap-2">
                          <div className="flex-shrink-0">
                            {answer.user?.avatar?.url ? (
                              <Image
                                src={answer.user.avatar.url}
                                alt={answer.user?.name || "User"}
                                width={24}
                                height={24}
                                className="h-6 w-6 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-6 w-6 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center text-white text-xs font-medium">
                                {answer.user?.name?.charAt(0).toUpperCase() || "?"}
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              <p className="text-green-400 text-xs font-medium">{answer.user?.name || "Anonymous"}</p>
                              {answer.isInstructorAnswer && (
                                <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-600/30">
                                  Instructor
                                </span>
                              )}
                              <span className="text-xs text-gray-500">
                                {new Date(answer.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-300 text-sm">{answer.text}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Form */}
                <div className="ml-11">
                  {replyingTo === discussion._id ? (
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Write your answer... (min 5 characters)"
                        value={replyText}
                        onChange={(e) => {
                          setReplyText(e.target.value)
                          setReplyError("")
                        }}
                        className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-500 resize-none"
                        rows={3}
                      />
                      {replyError && (
                        <p className="text-sm text-red-400">{replyError}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                          {replyText.length}/2000 characters (minimum 5)
                        </p>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleSubmitReply(discussion._id)}
                            disabled={isSubmittingReply || replyText.trim().length < 5}
                            size="sm"
                            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                          >
                            {isSubmittingReply ? "Sending..." : "Send Reply"}
                          </Button>
                          <Button
                            onClick={() => {
                              setReplyingTo(null)
                              setReplyText("")
                              setReplyError("")
                            }}
                            variant="outline"
                            size="sm"
                            className="border-gray-700 text-gray-300 hover:bg-gray-800"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setReplyingTo(discussion._id)}
                      variant="outline"
                      size="sm"
                      className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                    >
                      <Reply className="h-3 w-3 mr-2" />
                      Reply
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        )}
    </div>
  )
}

