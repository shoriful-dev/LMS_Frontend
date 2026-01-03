import { cn } from "@/lib/utils"

/**
 * Base Skeleton Component
 * Provides a loading placeholder with pulse animation
 */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-800/50", className)}
      {...props}
    />
  )
}

/**
 * Course Card Skeleton
 * Loading placeholder for course cards in grid
 */
export function CourseCardSkeleton() {
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden border border-gray-800">
      <Skeleton className="h-48 w-full rounded-none bg-gray-800/70" />
      <div className="p-6 space-y-3">
        <div className="flex justify-between items-start">
          <Skeleton className="h-6 w-20 bg-gray-800/70" />
          <Skeleton className="h-6 w-20 bg-gray-800/70" />
        </div>
        <Skeleton className="h-6 w-3/4 bg-gray-800/70" />
        <Skeleton className="h-4 w-full bg-gray-800/70" />
        <Skeleton className="h-4 w-5/6 bg-gray-800/70" />
        <div className="flex justify-between items-center pt-4">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-16 bg-gray-800/70" />
            <Skeleton className="h-4 w-16 bg-gray-800/70" />
          </div>
        </div>
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-8 w-20 bg-gray-800/70" />
          <Skeleton className="h-10 w-28 bg-gray-800/70" />
        </div>
      </div>
      <div className="border-t border-gray-800 p-4">
        <div className="flex items-center">
          <Skeleton className="h-8 w-8 rounded-full mr-2 bg-gray-800/70" />
          <Skeleton className="h-4 w-32 bg-gray-800/70" />
        </div>
      </div>
    </div>
  )
}

/**
 * Courses Grid Skeleton
 * Loading placeholder for course grid layout
 */
export function CoursesGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CourseCardSkeleton key={i} />
      ))}
    </div>
  )
}

/**
 * Course Detail Skeleton
 * Loading placeholder for course detail page
 */
export function CourseDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20 bg-blue-400" />
                <Skeleton className="h-6 w-24 bg-blue-400" />
              </div>
              <Skeleton className="h-12 w-3/4 bg-blue-400" />
              <Skeleton className="h-6 w-full bg-blue-400" />
              <Skeleton className="h-6 w-5/6 bg-blue-400" />
              <div className="flex gap-4 pt-4">
                <Skeleton className="h-5 w-24 bg-blue-400" />
                <Skeleton className="h-5 w-24 bg-blue-400" />
                <Skeleton className="h-5 w-24 bg-blue-400" />
              </div>
            </div>
            <div className="md:col-span-1">
              <Skeleton className="h-64 w-full bg-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
          <div className="md:col-span-1">
            <Skeleton className="h-80 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Dashboard Stats Skeleton
 * Loading placeholder for dashboard statistics
 */
export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-6 w-16" />
          </div>
          <Skeleton className="h-8 w-20 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
      ))}
    </div>
  )
}

/**
 * Enrollment Card Skeleton
 * Loading placeholder for enrollment/course cards
 */
export function EnrollmentCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex">
        <Skeleton className="h-32 w-48 flex-shrink-0 rounded-none" />
        <div className="flex-1 p-4 space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <div className="flex items-center justify-between pt-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Enrollments List Skeleton
 * Loading placeholder for list of enrollments
 */
export function EnrollmentsListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <EnrollmentCardSkeleton key={i} />
      ))}
    </div>
  )
}

/**
 * Video Player Skeleton
 * Loading placeholder for video player
 */
export function VideoPlayerSkeleton() {
  return (
    <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center">
      <div className="text-center">
        <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4 bg-gray-700" />
        <Skeleton className="h-4 w-32 mx-auto bg-gray-700" />
      </div>
    </div>
  )
}

/**
 * Quiz Player Skeleton
 * Loading placeholder for quiz player
 */
export function QuizPlayerSkeleton() {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Quiz Card with Blue-Cyan Theme */}
      <div className="bg-gradient-to-br from-gray-900 via-[#0a0d14] to-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-800/50 bg-gradient-to-r from-blue-900/10 to-cyan-900/10">
          <Skeleton className="h-8 w-3/4 mb-2 bg-gradient-to-r from-blue-600/20 to-cyan-600/20" />
          <Skeleton className="h-4 w-1/2 bg-gray-800/50" />
        </div>

        {/* Questions */}
        <div className="p-6 space-y-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-4">
              {/* Question */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600/30 to-cyan-600/30 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                  <Skeleton className="h-4 w-4 rounded-full bg-blue-500/20" />
                </div>
                <Skeleton className="h-6 flex-1 bg-gradient-to-r from-gray-800/80 to-gray-800/50" />
              </div>
              
              {/* Answer Options */}
              <div className="ml-11 space-y-3">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="flex items-center gap-3 p-4 rounded-lg bg-gray-800/30 border border-gray-700/50 hover:border-blue-600/30 transition-colors">
                    <Skeleton className="h-5 w-5 rounded-full bg-gray-700/50" />
                    <Skeleton className="h-5 flex-1 bg-gray-700/30" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800/50 bg-gradient-to-r from-gray-900/50 to-gray-800/30">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24 bg-gray-800/50" />
              <Skeleton className="h-10 w-24 bg-gray-800/50" />
            </div>
            <Skeleton className="h-10 w-32 bg-gradient-to-r from-blue-600/30 to-cyan-600/30 border border-blue-500/30" />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Chapter Accordion Skeleton
 * Loading placeholder for course chapters
 */
export function ChapterAccordionSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-6 w-6" />
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Profile Form Skeleton
 * Loading placeholder for profile forms
 */
export function ProfileFormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-24 w-24 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <div className="flex gap-3">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  )
}

/**
 * Table Skeleton
 * Generic loading placeholder for tables
 */
export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 border-b p-4">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="border-b p-4">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
            {Array.from({ length: cols }).map((_, j) => (
              <Skeleton key={j} className="h-4 w-full" />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

