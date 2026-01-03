"use client"

import { useState, useTransition, useOptimistic } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, BarChart, BookOpen } from "lucide-react"
import type { Course } from "@/lib/types"
import { deleteCourseAction } from "@/app/(admin)/admin/actions"

interface InstructorCoursesClientProps {
  courses: Course[]
}

export function InstructorCoursesClient({ courses }: InstructorCoursesClientProps) {
  // const router = useRouter() removed
  const [isPending, startTransition] = useTransition()
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  
  // Optimistic UI: Remove course from list instantly
  const [optimisticCourses, removeOptimistic] = useOptimistic(
    courses,
    (state, courseId: string) => state.filter(c => c._id !== courseId)
  )

  const handleDeleteCourse = async (courseId: string) => {
    // Optimistically remove from UI
    removeOptimistic(courseId)
    setDeleteConfirmId(null)
    
    // Actual deletion
    startTransition(async () => {
      const result = await deleteCourseAction(courseId)
      if (!result.success) {
        // If deletion fails, the page will automatically revalidate and show the course again
        alert(result.error || "Failed to delete course")
      }
    })
  }

  if (optimisticCourses.length === 0) {
    return (
      <div className="w-full max-w-7xl py-10">
        <div className="text-center py-12 px-4">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-purple-600/20 rounded-full blur-2xl opacity-50" />
            <div className="relative w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 flex items-center justify-center">
              <BookOpen className="h-10 w-10 text-gray-500" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No courses yet</h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Create your first course to start teaching
          </p>
          <Link href="/instructor/courses/create">
            <Button size="lg" className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700">
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Course
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl py-6 sm:py-8 lg:py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">My Courses</h1>
          <p className="text-gray-400">Manage your teaching content</p>
        </div>
        <Link href="/instructor/courses/create">
          <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700">
            <Plus className="h-5 w-5 mr-2" />
            Create Course
          </Button>
        </Link>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {optimisticCourses.map((course) => (
          <Card key={course._id} className="bg-gray-900/50 border-gray-800 hover:border-violet-500/50 transition-all group">
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <CardTitle className="text-white group-hover:text-violet-400 transition-colors line-clamp-2 flex-1">
                  {course.title}
                </CardTitle>
                <Badge variant={course.isPublished ? "default" : "secondary"} className="ml-2">
                  {course.isPublished ? "Published" : "Draft"}
                </Badge>
              </div>
              <CardDescription className="text-gray-400 line-clamp-2">
                {course.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>Students: {course.enrollmentCount || 0}</span>
                <span>Rating: {course.averageRating?.toFixed(1) || "N/A"}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Link href={`/instructor/courses/${course._id}`} className="flex-1">
                  <Button variant="outline" className="w-full border-gray-700 hover:border-violet-500 hover:bg-violet-500/10">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </Link>
                <Link href={`/instructor/analytics/${course._id}`}>
                  <Button variant="outline" className="border-gray-700 hover:border-blue-500 hover:bg-blue-500/10">
                    <BarChart className="h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setDeleteConfirmId(course._id)}
                  className="border-gray-700 hover:border-red-500 hover:bg-red-500/10 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-2">Delete Course</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete this course? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDeleteCourse(deleteConfirmId)}
                disabled={isPending}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-lg transition-colors font-medium"
              >
                {isPending ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

