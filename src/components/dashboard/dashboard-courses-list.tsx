import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, ArrowRight, CheckCircle, Clock, Trophy, Play } from "lucide-react"
import type { BackendEnrollmentItem } from "@/lib/types"

interface DashboardCoursesListProps {
  courses: BackendEnrollmentItem[]
}

/**
 * Dashboard Courses List - Server Component
 * Displays user's enrolled courses with detailed progress
 */
export function DashboardCoursesList({ courses }: DashboardCoursesListProps) {
  if (courses.length === 0) {
    return (
      <Card className="relative overflow-hidden bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 border-gray-800/50 hover:border-blue-500/30 transition-all duration-300 shadow-xl">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <CardHeader className="relative z-10">
          <CardTitle className="text-white text-xl sm:text-2xl font-bold">Your Learning Journey</CardTitle>
          <CardDescription className="text-gray-400 text-sm sm:text-base">Start learning today</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-center py-12 sm:py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 mb-6">
              <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-blue-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">No courses yet</h3>
            <p className="text-gray-400 mb-8 text-sm sm:text-base max-w-md mx-auto px-4">Discover amazing courses and start your learning journey today</p>
            <Link href="/courses">
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 group">
                Explore Courses
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Separate courses by completion status
  const inProgressCourses = courses.filter(c => !c.progress.isCourseCompleted && c.progress.completionPercentage > 0)
  const completedCourses = courses.filter(c => c.progress.isCourseCompleted)
  const notStartedCourses = courses.filter(c => !c.progress.isCourseCompleted && c.progress.completionPercentage === 0)

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Continue Learning Section */}
      {inProgressCourses.length > 0 && (
        <Card className="relative overflow-hidden bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 border-gray-800/50 hover:border-violet-500/30 transition-all duration-300 shadow-xl">
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 via-transparent to-purple-600/5 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
          
          <CardHeader className="relative z-10">
            <div className="flex items-center justify-between flex-col sm:flex-row gap-3 sm:gap-4">
              <div>
                <CardTitle className="text-white text-lg sm:text-xl font-bold flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 p-0.5 shadow-lg shadow-violet-500/20">
                    <div className="w-full h-full bg-[#0a0d14] rounded-[7px] flex items-center justify-center">
                      <Play className="h-4 w-4 text-violet-400" />
                    </div>
                  </div>
                  Continue Learning
                </CardTitle>
                <CardDescription className="text-gray-400 text-sm sm:text-base">Pick up where you left off</CardDescription>
              </div>
              <Badge className="bg-violet-600/20 text-violet-400 border-violet-600/30 px-3 py-1.5 text-xs font-semibold">
                {inProgressCourses.length} in progress
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="space-y-3 sm:space-y-4">
              {inProgressCourses.map((item, index) => (
                <CourseProgressCard key={item._id} courseProgress={item} index={index} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completed Courses */}
      {completedCourses.length > 0 && (
        <Card className="relative overflow-hidden bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 border-gray-800/50 hover:border-emerald-500/30 transition-all duration-300 shadow-xl">
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 via-transparent to-green-600/5 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
          
          <CardHeader className="relative z-10">
            <div className="flex items-center justify-between flex-col sm:flex-row gap-3 sm:gap-4">
              <div>
                <CardTitle className="text-white text-lg sm:text-xl font-bold flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 p-0.5 shadow-lg shadow-emerald-500/20">
                    <div className="w-full h-full bg-[#0a0d14] rounded-[7px] flex items-center justify-center">
                      <Trophy className="h-4 w-4 text-emerald-400" />
                    </div>
                  </div>
                  Completed Courses
                </CardTitle>
                <CardDescription className="text-gray-400 text-sm sm:text-base">Congratulations on your achievements!</CardDescription>
              </div>
              <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-600/30 px-3 py-1.5 text-xs font-semibold">
                {completedCourses.length} completed
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              {completedCourses.map((item, index) => (
                <CompletedCourseCard key={item._id} courseProgress={item} index={index} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Not Started Courses */}
      {notStartedCourses.length > 0 && (
        <Card className="relative overflow-hidden bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 border-gray-800/50 hover:border-blue-500/30 transition-all duration-300 shadow-xl">
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-cyan-600/5 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
          
          <CardHeader className="relative z-10">
            <div className="flex items-center justify-between flex-col sm:flex-row gap-3 sm:gap-4">
              <div>
                <CardTitle className="text-white text-lg sm:text-xl font-bold flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 p-0.5 shadow-lg shadow-blue-500/20">
                    <div className="w-full h-full bg-[#0a0d14] rounded-[7px] flex items-center justify-center">
                      <Clock className="h-4 w-4 text-blue-400" />
                    </div>
                  </div>
                  Ready to Start
                </CardTitle>
                <CardDescription className="text-gray-400 text-sm sm:text-base">Begin your learning journey</CardDescription>
              </div>
              <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30 px-3 py-1.5 text-xs font-semibold">
                {notStartedCourses.length} courses
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              {notStartedCourses.map((item, index) => (
                <CourseProgressCard key={item._id} courseProgress={item} index={index} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Course Progress Card for in-progress courses
function CourseProgressCard({ courseProgress, compact = false, index = 0 }: { courseProgress: BackendEnrollmentItem; compact?: boolean; index?: number }) {
  const progress = courseProgress.progress
  return (
    <div 
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 border border-gray-800/50 rounded-xl hover:bg-gray-800/40 hover:border-violet-500/40 transition-all duration-300 group shadow-lg hover:shadow-xl hover:scale-[1.01]"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 flex-1 w-full sm:w-auto mb-4 sm:mb-0">
        {/* Thumbnail */}
        <div className="h-16 w-20 sm:h-20 sm:w-28 bg-gradient-to-br from-violet-600/20 to-purple-600/20 rounded-xl flex-shrink-0 overflow-hidden relative border border-violet-500/20">
          {courseProgress.thumbnail?.url ? (
            <Image
              src={courseProgress.thumbnail.url}
              alt={courseProgress.title}
              width={112}
              height={80}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <BookOpen className="h-7 w-7 sm:h-8 sm:w-8 text-violet-400/50" />
            </div>
          )}
          {progress.isCourseCompleted && (
            <div className="absolute top-1.5 right-1.5 bg-emerald-500 rounded-full p-1 shadow-lg">
              <CheckCircle className="h-3 w-3 text-white" />
            </div>
          )}
        </div>

        {/* Course Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white text-sm sm:text-base truncate group-hover:text-violet-400 transition-colors">
            {courseProgress.title}
          </h4>
          
          {!compact && (
            <>
              {/* Progress Stats */}
              <div className="flex items-center gap-3 sm:gap-4 mt-2 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  {progress.completedLectures} / {progress.totalLectures} lectures
                </span>
                {progress.totalQuizzes > 0 && (
                  <span className="flex items-center gap-1 text-violet-400">
                    <Trophy className="h-3 w-3" />
                    {progress.completedQuizzes} / {progress.totalQuizzes} quizzes ({progress.averageQuizScore.toFixed(0)}%)
                  </span>
                )}
              </div>
            </>
          )}

          {/* Progress Bar */}
          <div className="flex items-center mt-2.5 sm:mt-3">
            <div className="flex-1 bg-gray-800/50 rounded-full h-2 mr-3 sm:mr-4 overflow-hidden border border-gray-700/30">
              <div
                className="bg-gradient-to-r from-violet-500 to-purple-500 h-full rounded-full transition-all duration-500 shadow-lg shadow-violet-500/50"
                style={{ width: `${progress.completionPercentage}%` }}
              />
            </div>
            <span className="text-xs sm:text-sm font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent min-w-[2.5rem] sm:min-w-[3rem] text-right">
              {progress.completionPercentage}%
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <Link href={`/courses/${courseProgress._id}/learn`} className="w-full sm:w-auto sm:ml-4">
        <Button className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white border-0 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-200 group/btn">
          {progress.completionPercentage === 0 ? 'Start' : 'Continue'}
          <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </Link>
    </div>
  )
}

// Completed Course Card
function CompletedCourseCard({ courseProgress, index = 0 }: { courseProgress: BackendEnrollmentItem; index?: number }) {
  const progress = courseProgress.progress
  return (
    <div 
      className="p-4 sm:p-5 border border-gray-800/50 rounded-xl hover:bg-gray-800/40 hover:border-emerald-500/40 transition-all duration-300 group shadow-lg hover:shadow-xl hover:scale-[1.02]"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Thumbnail */}
        <div className="h-16 w-20 sm:h-18 sm:w-24 bg-gradient-to-br from-emerald-600/20 to-green-600/20 rounded-xl flex-shrink-0 overflow-hidden relative border border-emerald-500/20">
          {courseProgress.thumbnail?.url ? (
            <Image
              src={courseProgress.thumbnail.url}
              alt={courseProgress.title}
              width={96}
              height={72}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <BookOpen className="h-6 w-6 sm:h-7 sm:w-7 text-emerald-400/50" />
            </div>
          )}
          <div className="absolute top-1.5 right-1.5 bg-emerald-500 rounded-full p-1 shadow-lg shadow-emerald-500/50">
            <CheckCircle className="h-3 w-3 text-white" />
          </div>
        </div>

        {/* Course Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white text-sm sm:text-base truncate group-hover:text-emerald-400 transition-colors">
            {courseProgress.title}
          </h4>
          
          <div className="flex items-center gap-3 sm:gap-4 mt-2 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              {progress.completedLectures} / {progress.totalLectures} lectures
            </span>
            {progress.totalQuizzes > 0 && (
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <Trophy className="h-3 w-3" />
                {progress.averageQuizScore.toFixed(0)}%
              </span>
            )}
          </div>

          {/* Completion Badge */}
          <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 mr-4">
            <CheckCircle className="h-3 w-3 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400">Completed</span>
          </div>

          <Link href={`/courses/${courseProgress._id}/learn`}>
            <Button variant="ghost" size="sm" className="mt-3 text-xs sm:text-sm text-gray-400 hover:text-white p-0 h-auto group/btn">
              Review Course
              <ArrowRight className="h-3 w-3 ml-1 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

