"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { MessageSquare, Send, Reply, CheckCircle, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { createDiscussion, answerDiscussion } from "@/lib/api-client"

interface Discussion {
  _id: string
  user: {
    _id: string
    name: string
    avatar?: {
      url: string
    }
  }
  question: string
  createdAt: string
  answers?: Array<{
    _id: string
    user: {
      _id: string
      name: string
      avatar?: {
        url: string
      }
    }
    text: string
    createdAt: string
    isInstructorAnswer?: boolean
  }>
}

interface DiscussionsTabProps {
  lectureId: string | null
  lectureTitle?: string
  accessToken: string
}

export function DiscussionsTab({ lectureId, lectureTitle, accessToken }: DiscussionsTabProps) {
  const [discussions, setDiscussions] = useState<Discussion[]>([])
  const [loading, setLoading] = useState(true)
  const [newQuestion, setNewQuestion] = useState("")
  const [submittingQuestion, setSubmittingQuestion] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")
  const [submittingReply, setSubmittingReply] = useState(false)

  const fetchDiscussions = useCallback(async () => {
    if (!lectureId) return
    
    try {
      setLoading(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/discussions/lecture/${lectureId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Failed to fetch discussions:", response.status, errorData)
        setDiscussions([])
        return
      }

      const data = await response.json()
      // sendPaginated returns { success, message, data: [...], meta: {...} }
      // But some responses might have { discussions: [...], pagination: {...} }
      setDiscussions(data.data || data.discussions || [])
    } catch (error) {
      console.error("Error fetching discussions:", error)
      setDiscussions([])
    } finally {
      setLoading(false)
    }
  }, [lectureId, accessToken])

  // Fetch discussions for the selected lecture
  useEffect(() => {
    if (lectureId) {
      fetchDiscussions()
    } else {
      setDiscussions([])
      setLoading(false)
    }
  }, [lectureId, fetchDiscussions])

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newQuestion.trim() || submittingQuestion || !lectureId) return

    try {
      setSubmittingQuestion(true)
      await createDiscussion(
        { lecture: lectureId, question: newQuestion.trim() },
        accessToken
      )
      setNewQuestion("")
      await fetchDiscussions()
    } catch (error) {
      console.error("Error posting question:", error)
    } finally {
      setSubmittingQuestion(false)
    }
  }

  const handleSubmitReply = async (discussionId: string) => {
    if (!replyText.trim() || submittingReply) return

    try {
      setSubmittingReply(true)
      await answerDiscussion(discussionId, { text: replyText.trim() }, accessToken)
      setReplyText("")
      setReplyingTo(null)
      await fetchDiscussions()
    } catch (error) {
      console.error("Error posting reply:", error)
    } finally {
      setSubmittingReply(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return "Yesterday"
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-800" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-800 rounded w-1/4" />
                <div className="h-3 bg-gray-800 rounded w-full" />
                <div className="h-3 bg-gray-800 rounded w-3/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // If no lecture is selected
  if (!lectureId) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-800/50 flex items-center justify-center mb-4">
          <BookOpen className="h-8 w-8 text-gray-600" />
        </div>
        <h3 className="text-white font-semibold mb-2">No Lecture Selected</h3>
        <p className="text-sm text-gray-400">
          Select a lecture to view and participate in discussions
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Lecture Info Header */}
      {lectureTitle && (
        <div className="p-4 border-b border-gray-800/50 bg-[#0a0d14]">
          <div className="flex items-start gap-2">
            <MessageSquare className="h-4 w-4 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <p className="text-xs text-gray-500 mb-1">Discussing:</p>
              <p className="text-sm font-medium text-white line-clamp-2">{lectureTitle}</p>
            </div>
          </div>
        </div>
      )}

      {/* New Question Form */}
      <div className="p-4 border-b border-gray-800/50 bg-[#0a0d14]">
        <form onSubmit={handleSubmitQuestion} className="space-y-3">
          <Textarea
            placeholder="Ask a question about this lecture..."
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 resize-none text-sm"
            disabled={submittingQuestion}
            rows={3}
          />
          <Button
            type="submit"
            disabled={!newQuestion.trim() || submittingQuestion}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-sm"
          >
            <Send className="h-4 w-4 mr-2" />
            {submittingQuestion ? "Posting..." : "Post Question"}
          </Button>
        </form>
      </div>

      {/* Discussions List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {discussions.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-white mb-1">No Discussions Yet</h3>
            <p className="text-xs text-gray-400">Be the first to ask a question!</p>
          </div>
        ) : (
          discussions.map((discussion) => (
            <div
              key={discussion._id}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-4 space-y-3"
            >
              {/* Question */}
              <div className="flex items-start gap-3">
                {discussion.user?.avatar?.url ? (
                  <Image
                    src={discussion.user.avatar.url}
                    alt={discussion.user?.name || "User"}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full ring-2 ring-gray-700 object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {discussion.user?.name?.charAt(0).toUpperCase() || "?"}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-white">
                      {discussion.user?.name || "Anonymous"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(discussion.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {discussion.question}
                  </p>
                </div>
              </div>

              {/* Answers */}
              {discussion.answers && discussion.answers.length > 0 && (
                <div className="ml-10 space-y-3 border-l-2 border-gray-800 pl-4">
                  {discussion.answers.map((answer) => (
                    <div key={answer._id} className="flex items-start gap-3">
                      {answer.user?.avatar?.url ? (
                        <Image
                          src={answer.user.avatar.url}
                          alt={answer.user?.name || "User"}
                          width={32}
                          height={32}
                          className="h-8 w-8 rounded-full ring-2 ring-gray-700 object-cover"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                          <span className="text-white text-xs font-medium">
                            {answer.user?.name?.charAt(0).toUpperCase() || "?"}
                          </span>
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {answer.isInstructorAnswer && (
                            <CheckCircle className="h-3 w-3 text-green-500" />
                          )}
                          <span className="text-xs font-semibold text-white">
                            {answer.user?.name || "Anonymous"}
                          </span>
                          {answer.isInstructorAnswer && (
                            <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-600/30">
                              Instructor
                            </span>
                          )}
                          <span className="text-xs text-gray-500">
                            {formatDate(answer.createdAt)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          {answer.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Button/Form */}
              {replyingTo === discussion._id ? (
                <div className="ml-10 space-y-2">
                  <Textarea
                    placeholder="Write your answer..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="bg-gray-800/50 border-gray-700 text-white text-sm placeholder:text-gray-500 resize-none"
                    disabled={submittingReply}
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleSubmitReply(discussion._id)}
                      disabled={!replyText.trim() || submittingReply}
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-xs"
                    >
                      {submittingReply ? "Posting..." : "Post Answer"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setReplyingTo(null)
                        setReplyText("")
                      }}
                      className="border-gray-700 text-gray-300 text-xs hover:bg-gray-800"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setReplyingTo(discussion._id)}
                  className="ml-10 flex items-center gap-1 text-xs text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <Reply className="h-3 w-3" />
                  Answer
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

