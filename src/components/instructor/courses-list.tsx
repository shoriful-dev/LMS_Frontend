import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"
import type { Course } from "@/lib/types"

interface CoursesListProps {
  courses: Course[]
}

/**
 * Instructor Courses List - Server Component
 * Displays instructor's courses
 */
export function CoursesList({ courses }: CoursesListProps) {
  if (courses.length === 0) {
    return (
      <Card className="relative overflow-hidden border-violet-500/20 bg-gradient-to-br from-gray-900/90 via-indigo-900/50 to-gray-900/90 backdrop-blur-sm pt-12">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 via-transparent to-purple-600/5 opacity-50"></div>
        <CardHeader className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">My Courses</CardTitle>
              <CardDescription className="text-gray-400">Manage and track your courses</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-center py-8">
            <div className="p-4 bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl w-fit mx-auto mb-4 shadow-lg shadow-violet-500/30">
              <BookOpen className="h-12 w-12 text-white" />
            </div>
            <p className="text-gray-300 mb-4">No courses yet</p>
            <Link href="/instructor/courses/create">
              <Button className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white shadow-lg shadow-violet-500/20 border-0">
                Create Your First Course
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="relative overflow-hidden border-violet-500/20 bg-gradient-to-br from-gray-900/90 via-indigo-900/50 to-gray-900/90 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 via-transparent to-purple-600/5 opacity-50"></div>
      <CardHeader className="relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">My Courses</CardTitle>
            <CardDescription className="text-gray-400">Manage and track your courses</CardDescription>
          </div>
          <Link href="/instructor/courses">
            <Button variant="outline" className="border-violet-500/30 bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 hover:border-violet-400/50">View All</Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="space-y-4">
          {courses.slice(0, 5).map((course) => (
            <div
              key={course._id}
              className="flex items-center justify-between p-4 border border-violet-500/20 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 hover:border-violet-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/10"
            >
              <div className="flex items-center space-x-4 flex-1">
                <div className="h-16 w-24 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex-shrink-0 shadow-lg shadow-violet-500/30">
                  {course.thumbnail?.url && (
                    <Image
                      src={course.thumbnail.url}
                      alt={course.title}
                      width={96}
                      height={64}
                      className="h-full w-full object-cover rounded-lg"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white">
                    {course.title}
                  </h4>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-400">
                    <span>{course.enrollmentCount || 0} students</span>
                    <span>⭐ {(course.averageRating || 0).toFixed(1)}</span>
                    <span className="font-semibold text-violet-400">${course.price || 0}</span>
                  </div>
                </div>
              </div>
              <Link href={`/instructor/courses/${course._id}`}>
                <Button variant="outline" className="border-violet-500/30 bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 hover:border-violet-400/50">Manage</Button>
              </Link>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

