"use client"
import Image from "next/image"

import { useState, useTransition, useOptimistic } from "react"
import { useRouter } from "next/navigation"
import { Search, Trash2, Eye, CheckCircle, XCircle, ChevronLeft, ChevronRight, BookOpen, DollarSign, Users } from "lucide-react"
import { deleteCourseAction } from "@/app/(admin)/admin/actions"
import Link from "next/link"
import type { Course } from "@/lib/types"

interface CoursesClientProps {
  initialCourses: Course[]
  initialTotal: number
  initialPage: number
  initialSearch: string
}

export function CoursesClient({
  initialCourses,
  initialTotal,
  initialPage,
  initialSearch,
}: CoursesClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  
  // Optimistic UI: Remove course from list instantly
  const [optimisticCourses, removeOptimistic] = useOptimistic(
    initialCourses,
    (state, courseId: string) => state.filter(c => c._id !== courseId)
  )

  const handleSearch = (value: string) => {
    const params = new URLSearchParams()
    if (value) params.set("search", value)
    router.push(`/admin/courses?${params.toString()}`)
  }

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

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams()
    params.set("page", String(newPage))
    if (initialSearch) params.set("search", initialSearch)
    router.push(`/admin/courses?${params.toString()}`)
  }

  const totalPages = Math.ceil(initialTotal / 10)

  return (
    <>
      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search courses by title..."
            defaultValue={initialSearch}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-gray-900/50 border border-gray-800 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors"
          />
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-gray-400 text-sm">
          Showing <span className="text-white font-semibold">{initialCourses.length}</span> of{" "}
          <span className="text-white font-semibold">{initialTotal}</span> courses
        </p>
      </div>

      {/* Courses Grid */}
      {initialCourses.length === 0 ? (
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-800/50 rounded-xl p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No courses found</h3>
          <p className="text-gray-400">Try adjusting your search</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {optimisticCourses.map((course) => (
              <div
                key={course._id}
                className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-800/50 rounded-xl overflow-hidden hover:border-blue-500/30 transition-all duration-300 group"
              >
                {/* Course Thumbnail */}
                <div className="relative h-48 bg-gray-800 overflow-hidden">
                  {course.thumbnail?.url ? (
                    <Image
                      src={course.thumbnail.url}
                      alt={course.title}
                      width={400}
                      height={192}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                      <BookOpen className="w-16 h-16 text-gray-600" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    {course.status ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-semibold backdrop-blur-sm">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-semibold backdrop-blur-sm">
                        <XCircle className="w-3.5 h-3.5" />
                        Draft
                      </span>
                    )}
                  </div>
                </div>

                {/* Course Info */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                    {course.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  {/* Instructor */}
                  <p className="text-gray-500 text-sm mb-4">
                    by <span className="text-gray-300">
                      {typeof course.instructor === 'string' || !course.instructor || !course.instructor?.name 
                        ? 'Unknown' 
                        : course.instructor.name}
                    </span>
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
                    <span className="inline-flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4" />
                      ${course.price}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      {course.enrollmentCount || 0}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs">
                      {course.category}
                    </span>
                    <span className="px-2 py-1 rounded-md bg-violet-500/10 text-violet-400 text-xs">
                      {course.level}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/courses/${course._id}`}
                      className="flex-1 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Link>
                    <button
                      onClick={() => setDeleteConfirmId(course._id)}
                      className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-800/50 rounded-xl px-6 py-4">
              <p className="text-gray-400 text-sm">
                Page {initialPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(initialPage - 1)}
                  disabled={initialPage === 1 || isPending}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(initialPage + 1)}
                  disabled={initialPage === totalPages || isPending}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-2">Delete Course</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete this course? This action cannot be undone and will affect all enrolled students.
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
    </>
  )
}

