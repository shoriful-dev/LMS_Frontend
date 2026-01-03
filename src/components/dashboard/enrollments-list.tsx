import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, ArrowRight } from "lucide-react"
import type { Enrollment, Course } from "@/lib/types"

interface EnrollmentsListProps {
  enrollments: Enrollment[]
}

// Type guard to check if course is populated
function isCoursePopulated(course: Course | string): course is Course {
  return typeof course !== 'string'
}

/**
 * Enrollments List - Server Component
 * Displays user's enrolled courses with progress
 */
export function EnrollmentsList({ enrollments }: EnrollmentsListProps) {
  if (enrollments.length === 0) {
    return (
      <Card className="mb-8 bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Continue Learning</CardTitle>
          <CardDescription className="text-gray-400">Pick up where you left off</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No enrolled courses yet</p>
            <Link href="/courses">
              <Button className="bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700">Explore Courses</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-8 bg-gray-900/50 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Continue Learning</CardTitle>
        <CardDescription className="text-gray-400">Pick up where you left off</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {enrollments.slice(0, 3).map((enrollment) => {
            // Only show enrollments with populated course data
            if (!isCoursePopulated(enrollment.course)) return null
            
            const course = enrollment.course
            const progress = typeof enrollment.progress === 'number' ? enrollment.progress : 0
            
            return (
              <div
                key={enrollment._id}
                className="flex items-center justify-between p-4 border border-gray-800 rounded-lg hover:bg-gray-800/50 hover:border-violet-600/50 transition-all duration-200"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="h-16 w-24 bg-gradient-to-br from-violet-600 to-pink-600 rounded flex-shrink-0 overflow-hidden">
                    {course.thumbnail?.url && (
                      <Image
                        src={course.thumbnail.url}
                        alt={course.title}
                        width={96}
                        height={64}
                        className="h-full w-full object-cover rounded"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">
                      {course.title}
                    </h4>
                    <div className="flex items-center mt-2">
                      <div className="flex-1 bg-gray-800 rounded-full h-2 mr-4">
                        <div
                          className="bg-gradient-to-r from-violet-600 to-pink-600 h-2 rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-400">
                        {progress}%
                      </span>
                    </div>
                  </div>
                </div>
                <Link href={`/courses/${course._id}/learn`}>
                  <Button className="bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700">
                    Continue
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

