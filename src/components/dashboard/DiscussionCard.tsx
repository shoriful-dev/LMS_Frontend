"use client"
import Image from "next/image"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, BookOpen, Reply, ExternalLink, Send, Loader2 } from "lucide-react"

interface Discussion {
  _id: string
  user: {
    _id: string
    name: string
    avatar?: {
      url: string
    }
  }
  lecture: {
    _id: string
    title: string
  }
  course: {
    _id: string
    title: string
    thumbnail?: {
      url: string
    }
  }
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
    createdAt: string
    isInstructorAnswer?: boolean
  }>
  createdAt: string
  updatedAt: string
}

interface DiscussionCardProps {
  discussion: Discussion
  currentUserId?: string
  activeTab: "my-discussions" | "all-discussions"
  onReply: (discussionId: string, text: string) => Promise<void>
  formatDate: (date: string) => string
  index?: number
}

export function DiscussionCard({ 
  discussion, 
  currentUserId, 
  activeTab,
  onReply,
  formatDate,
  index = 0
}: DiscussionCardProps) {
  const [replyingTo, setReplyingTo] = useState(false)
  const [replyText, setReplyText] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const isMyQuestion = discussion.user?._id === currentUserId
  
  // Handle cases where course/lecture might not be fully populated
  const courseTitle = typeof discussion.course === 'object' ? discussion.course?.title : 'Unknown Course'
  const courseThumbnail = typeof discussion.course === 'object' ? discussion.course?.thumbnail?.url : null
  const courseId = typeof discussion.course === 'object' ? discussion.course?._id : discussion.course
  const lectureTitle = typeof discussion.lecture === 'object' ? discussion.lecture?.title : 'Unknown Lecture'

  const handleSubmitReply = async () => {
    if (!replyText.trim()) return
    
    try {
      setSubmitting(true)
      await onReply(discussion._id, replyText.trim())
      setReplyText("")
      setReplyingTo(false)
    } catch (error) {
      console.error("Error submitting reply:", error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card 
      className="group relative overflow-hidden bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 border-gray-800/50 hover:border-orange-500/40 transition-all duration-300 shadow-lg hover:shadow-xl"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-orange-600/5 via-transparent to-amber-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <CardHeader className="relative z-10">
        {/* Course & Lecture Info */}
        <div className="flex items-start gap-3 mb-4">
          {courseThumbnail ? (
            <Image 
              src={courseThumbnail} 
              alt={courseTitle}
              width={64}
              height={64}
              className="w-16 h-16 rounded-lg object-cover border-2 border-gray-800"
            />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-violet-600/20 to-pink-600/20 border border-gray-800 flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-violet-400" />
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-white font-semibold text-sm sm:text-base line-clamp-1">
              {courseTitle}
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm line-clamp-1">
              📖 {lectureTitle}
            </p>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-gray-500" />
                <span className="text-xs text-gray-500">{formatDate(discussion.createdAt)}</span>
              </div>
              {isMyQuestion && (
                <span className="text-xs bg-violet-600/20 text-violet-400 px-2 py-0.5 rounded-full border border-violet-600/30">
                  Your Question
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <div className="flex items-start gap-3 mb-3">
            {discussion.user?.avatar?.url ? (
              <Image
                src={discussion.user.avatar.url}
                alt={discussion.user?.name || "User"}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full border-2 border-gray-700 object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center text-white text-sm font-semibold border-2 border-gray-700">
                {(discussion.user?.name || "?").charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1">
              <p className="text-white font-medium text-sm">
                {discussion.user?.name || "Anonymous"}
              </p>
              <p className="text-gray-400 text-xs">Asked a question</p>
            </div>
          </div>
          <p className="text-white text-sm sm:text-base leading-relaxed">
            {discussion.question}
          </p>
        </div>
      </CardHeader>

      <CardContent>
        {/* Answers Section */}
        {discussion.answers && discussion.answers.length > 0 && (
          <div className="space-y-3 mb-4">
            <p className="text-xs text-gray-500 font-medium">
              {discussion.answers.length} {discussion.answers.length === 1 ? 'Answer' : 'Answers'}
            </p>
            {discussion.answers.map((answer) => (
              <div key={answer._id} className="flex items-start gap-3 bg-gray-800/30 border border-gray-700/50 rounded-lg p-3">
                {answer.user?.avatar?.url ? (
                  <Image
                    src={answer.user.avatar.url}
                    alt={answer.user?.name || "User"}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center text-white text-sm font-semibold">
                    {(answer.user?.name || "?").charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-white text-sm font-medium">
                      {answer.user?.name || "Anonymous"}
                    </p>
                    {answer.isInstructorAnswer && (
                      <span className="text-xs bg-violet-600/20 text-violet-400 px-2 py-0.5 rounded-full border border-violet-600/30">
                        Instructor
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      · {formatDate(answer.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    {answer.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reply Form */}
        {activeTab === "all-discussions" && replyingTo ? (
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <Textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your answer..."
              className="min-h-[100px] bg-gray-900/50 border-gray-700 text-white focus:border-violet-600/50 resize-none"
            />
            <div className="flex items-center justify-between mt-3">
              <Button
                onClick={() => {
                  setReplyingTo(false)
                  setReplyText("")
                }}
                variant="outline"
                size="sm"
                className="border-gray-700 text-gray-400 hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitReply}
                disabled={!replyText.trim() || submitting}
                size="sm"
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white border-0 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-200 group/btn"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Answer
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Reply className="h-4 w-4 text-green-500" />
              <span className="text-sm text-gray-400">
                {discussion.answers?.length || 0} {discussion.answers?.length === 1 ? 'answer' : 'answers'}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {activeTab === "all-discussions" && !isMyQuestion && (
                <Button
                  onClick={() => setReplyingTo(true)}
                  variant="outline"
                  size="sm"
                  className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 hover:border-emerald-400/50 transition-all duration-200"
                >
                  <Reply className="h-3 w-3 mr-2" />
                  Reply
                </Button>
              )}
              <Button
                onClick={() => window.location.href = `/courses/${courseId}/learn`}
                variant="outline"
                size="sm"
                className="border-orange-500/30 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 hover:text-orange-300 hover:border-orange-400/50 transition-all duration-200"
              >
                View in Course
                <ExternalLink className="h-3 w-3 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

