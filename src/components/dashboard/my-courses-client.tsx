"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BookOpen, ArrowRight, CheckCircle, TrendingUp } from "lucide-react"
import type { Enrollment } from "@/lib/types"


interface MyCoursesClientProps {
  enrollments: Enrollment[]
}

export function MyCoursesClient({ enrollments }: MyCoursesClientProps) {
  const [filter, setFilter] = useState<"all" | "in-progress" | "completed">("all")

  const filteredEnrollments = enrollments.filter(enrollment => {
    const progress = enrollment.progress
    const completionPercentage = typeof progress === 'object' ? progress.completionPercentage : (progress || 0)
    if (filter === "in-progress") return completionPercentage > 0 && completionPercentage < 100
    if (filter === "completed") return completionPercentage === 100
    return true
  })

  return (
    <div className="w-full max-w-6xl py-6 sm:py-8 lg:py-10">
      {/* Header Section with Gradient */}
      <div className="relative mb-8 sm:mb-10">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600/10 via-cyan-600/10 to-blue-600/10 border border-blue-500/20 p-6 sm:p-8">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg backdrop-blur-sm border border-blue-500/20">
                    <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    My Learning Journey
                  </h1>
                </div>
                <p className="text-sm sm:text-base text-gray-400 max-w-2xl">
                  Continue your progress and achieve your learning goals
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
        <button
          onClick={() => setFilter("all")}
          className={`
            flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium transition-all duration-200
            ${filter === "all"
              ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/25"
              : "bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-800 border border-gray-700/50"
            }
          `}
        >
          <BookOpen className="h-4 w-4" />
          <span className="text-sm sm:text-base">All Courses</span>
          <Badge variant="secondary" className="bg-white/10 text-white text-xs">
            {enrollments.length}
          </Badge>
        </button>
        
        <button
          onClick={() => setFilter("in-progress")}
          className={`
            flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium transition-all duration-200
            ${filter === "in-progress"
              ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/25"
              : "bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-800 border border-gray-700/50"
            }
          `}
        >
          <TrendingUp className="h-4 w-4" />
          <span className="text-sm sm:text-base">In Progress</span>
        </button>
        
        <button
          onClick={() => setFilter("completed")}
          className={`
            flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium transition-all duration-200
            ${filter === "completed"
              ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/25"
              : "bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-800 border border-gray-700/50"
            }
          `}
        >
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm sm:text-base">Completed</span>
        </button>
      </div>

      {/* Courses Grid */}
      {filteredEnrollments.length === 0 ? (
        <div className="text-center py-12 px-4">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-full blur-2xl opacity-50" />
            <div className="relative w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 flex items-center justify-center">
              <BookOpen className="h-10 w-10 text-gray-500" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {filter === "all" ? "No courses yet" : `No ${filter === "in-progress" ? "in-progress" : "completed"} courses`}
          </h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            {filter === "all" ? "Start your learning journey by enrolling in a course" : `You don't have any ${filter === "in-progress" ? "in-progress" : "completed"} courses yet`}
          </p>
          <Link href="/courses">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
              Browse Courses
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {filteredEnrollments.map((enrollment) => {
            const course = enrollment.course
            const progress = enrollment.progress
            const completionPercentage = typeof progress === 'object' ? progress.completionPercentage : (progress || 0)
            const isCompleted = completionPercentage === 100

            return (
              <Card 
                key={enrollment._id} 
                className="group overflow-hidden bg-gray-900/50 border-gray-800 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
              >
                {/* Course Image */}
                <div className="relative h-40 sm:h-48 overflow-hidden bg-gradient-to-br from-blue-600/20 to-cyan-600/20">
                  {typeof course === 'object' && course.thumbnail?.url ? (
                    <Image
                      src={course.thumbnail?.url || ""}
                      alt={typeof course === 'object' ? course.title : "Course"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-gray-700" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  {isCompleted && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-green-500/90 text-white border-0 shadow-lg">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    </div>
                  )}
                </div>

                <CardHeader className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg sm:text-xl text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                      {typeof course === 'object' ? course.title : "Course"}
                    </CardTitle>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Progress</span>
                      <span className="font-semibold text-white">{Math.round(completionPercentage)}%</span>
                    </div>
                    <Progress 
                      value={completionPercentage} 
                      className={`h-2 ${isCompleted ? "bg-green-500/20" : "bg-gray-800"}`}
                    />
                  </div>

                  {/* Action Button */}
                  <Link 
                    href={`/courses/${typeof course === 'object' ? course._id : enrollment.courseId}/learn`}
                    className="block"
                  >
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white group/btn"
                    >
                      {isCompleted ? "Review Course" : "Continue Learning"}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

