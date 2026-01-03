import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, DollarSign, TrendingUp } from "lucide-react"

interface InstructorStatsProps {
  totalCourses: number
  totalStudents: number
  totalRevenue: number
  avgRating: number
}

/**
 * Instructor Stats - Server Component
 * Displays instructor's course statistics
 */
export function InstructorStats({
  totalCourses,
  totalStudents,
  totalRevenue,
  avgRating,
}: InstructorStatsProps) {
  return (
    <div className="grid md:grid-cols-4 gap-6 mb-8">
      <Card className="relative overflow-hidden border-blue-500/20 bg-gradient-to-br from-gray-900/90 via-indigo-900/50 to-gray-900/90 backdrop-blur-sm hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 hover:border-blue-500/40">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-cyan-600/5 opacity-50"></div>
        <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">Total Courses</CardTitle>
          <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg shadow-lg shadow-blue-500/30">
            <BookOpen className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">{totalCourses}</div>
          <p className="text-xs text-gray-400 mt-1">
            Published courses
          </p>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden border-cyan-500/20 bg-gradient-to-br from-gray-900/90 via-indigo-900/50 to-gray-900/90 backdrop-blur-sm hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300 hover:border-cyan-500/40">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/5 via-transparent to-blue-600/5 opacity-50"></div>
        <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">Total Students</CardTitle>
          <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg shadow-lg shadow-cyan-500/30">
            <Users className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">{totalStudents}</div>
          <p className="text-xs text-gray-400 mt-1">
            Enrolled students
          </p>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden border-blue-500/20 bg-gradient-to-br from-gray-900/90 via-indigo-900/50 to-gray-900/90 backdrop-blur-sm hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 hover:border-blue-500/40">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-cyan-600/5 opacity-50"></div>
        <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">Total Revenue</CardTitle>
          <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg shadow-lg shadow-blue-500/30">
            <DollarSign className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">${totalRevenue.toLocaleString()}</div>
          <p className="text-xs text-gray-400 mt-1">
            Lifetime earnings
          </p>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden border-cyan-500/20 bg-gradient-to-br from-gray-900/90 via-indigo-900/50 to-gray-900/90 backdrop-blur-sm hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300 hover:border-cyan-500/40">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/5 via-transparent to-blue-600/5 opacity-50"></div>
        <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">Avg Rating</CardTitle>
          <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg shadow-lg shadow-cyan-500/30">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">{avgRating.toFixed(1)}</div>
          <p className="text-xs text-gray-400 mt-1">
            Course rating
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

