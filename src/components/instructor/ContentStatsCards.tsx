"use client"

import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Video, FileQuestion, Clock } from "lucide-react"
import { formatDuration } from "@/lib/utils"

interface Chapter {
  lectures?: any[]
  quizzes?: any[]
  chapterDuration?: number
}

interface ContentStatsCardsProps {
  chapters: Chapter[]
}

export function ContentStatsCards({ chapters }: ContentStatsCardsProps) {
  const totalChapters = chapters.length
  const totalLectures = chapters.reduce((acc, ch) => acc + (ch.lectures?.length || 0), 0)
  const totalQuizzes = chapters.reduce((acc, ch) => acc + (ch.quizzes?.length || 0), 0)
  const totalDuration = chapters.reduce((acc, ch) => acc + (ch.chapterDuration || 0), 0)

  return (
    <div className="grid md:grid-cols-4 gap-6 mb-8">
      <Card className="relative overflow-hidden border-violet-500/20 bg-gradient-to-br from-gray-900/90 via-indigo-900/50 to-gray-900/90 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 via-transparent to-purple-600/5 opacity-50"></div>
        <CardContent className="relative z-10 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Chapters</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                {totalChapters}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden border-blue-500/20 bg-gradient-to-br from-gray-900/90 via-indigo-900/50 to-gray-900/90 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-cyan-600/5 opacity-50"></div>
        <CardContent className="relative z-10 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Lectures</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {totalLectures}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
              <Video className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden border-amber-500/20 bg-gradient-to-br from-gray-900/90 via-indigo-900/50 to-gray-900/90 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-600/5 via-transparent to-yellow-600/5 opacity-50"></div>
        <CardContent className="relative z-10 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Quizzes</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
                {totalQuizzes}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-lg">
              <FileQuestion className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden border-emerald-500/20 bg-gradient-to-br from-gray-900/90 via-indigo-900/50 to-gray-900/90 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 via-transparent to-green-600/5 opacity-50"></div>
        <CardContent className="relative z-10 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Duration</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                {formatDuration(totalDuration)}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

