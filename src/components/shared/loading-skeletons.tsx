/**
 * Reusable loading skeleton components
 * Following Next.js 15 best practices for loading states
 */

export function CourseCardSkeleton() {
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-800" />
      <div className="p-6 space-y-4">
        <div className="h-6 bg-gray-800 rounded w-3/4" />
        <div className="h-4 bg-gray-800 rounded w-full" />
        <div className="h-4 bg-gray-800 rounded w-5/6" />
        <div className="flex items-center justify-between pt-4">
          <div className="h-8 bg-gray-800 rounded w-20" />
          <div className="h-8 bg-gray-800 rounded w-24" />
        </div>
      </div>
    </div>
  )
}

export function CoursesGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <CourseCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function CourseDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#03050a] animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-br from-blue-900/20 via-[#03050a] to-cyan-900/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="h-8 bg-gray-800 rounded w-3/4" />
              <div className="h-12 bg-gray-800 rounded w-full" />
              <div className="h-6 bg-gray-800 rounded w-5/6" />
              <div className="flex gap-4">
                <div className="h-12 bg-gray-800 rounded w-32" />
                <div className="h-12 bg-gray-800 rounded w-32" />
              </div>
            </div>
            <div className="h-64 bg-gray-800 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-8 bg-gray-800 rounded w-48" />
            <div className="h-4 bg-gray-800 rounded w-full" />
            <div className="h-4 bg-gray-800 rounded w-5/6" />
            <div className="h-4 bg-gray-800 rounded w-4/6" />
          </div>
          <div className="space-y-4">
            <div className="h-64 bg-gray-800 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#03050a] p-8 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Skeleton */}
        <div className="space-y-4">
          <div className="h-10 bg-gray-800 rounded w-64" />
          <div className="h-6 bg-gray-800 rounded w-96" />
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="h-6 bg-gray-800 rounded w-3/4 mb-4" />
              <div className="h-10 bg-gray-800 rounded w-1/2" />
            </div>
          ))}
        </div>

        {/* Courses Skeleton */}
        <CoursesGridSkeleton count={3} />
      </div>
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden animate-pulse">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              {[...Array(4)].map((_, i) => (
                <th key={i} className="px-6 py-4">
                  <div className="h-4 bg-gray-800 rounded w-24" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(rows)].map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b border-gray-800/50">
                {[...Array(4)].map((_, colIndex) => (
                  <td key={colIndex} className="px-6 py-4">
                    <div className="h-4 bg-gray-800 rounded w-full" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function FormSkeleton() {
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 space-y-6 animate-pulse">
      <div className="h-8 bg-gray-800 rounded w-48" />
      
      {[...Array(5)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-gray-800 rounded w-32" />
          <div className="h-12 bg-gray-800 rounded w-full" />
        </div>
      ))}
      
      <div className="flex gap-4 pt-4">
        <div className="h-12 bg-gray-800 rounded w-32" />
        <div className="h-12 bg-gray-800 rounded w-24" />
      </div>
    </div>
  )
}

export function PlayerSkeleton() {
  return (
    <div className="min-h-screen bg-[#03050a] animate-pulse">
      <div className="grid lg:grid-cols-4 gap-0">
        {/* Video Player Skeleton */}
        <div className="lg:col-span-3 bg-black">
          <div className="aspect-video bg-gray-900" />
          <div className="p-6 space-y-4">
            <div className="h-8 bg-gray-800 rounded w-3/4" />
            <div className="flex gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-800 rounded w-24" />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="bg-gray-900 border-l border-gray-800 p-4 space-y-4">
          <div className="h-6 bg-gray-800 rounded w-3/4" />
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-800 rounded" />
          ))}
        </div>
      </div>
    </div>
  )
}

export function InstructorDashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#03050a] p-8 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-10 bg-gray-800 rounded w-64" />
            <div className="h-6 bg-gray-800 rounded w-48" />
          </div>
          <div className="h-12 bg-gray-800 rounded w-40" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="h-6 bg-gray-800 rounded w-32 mb-4" />
              <div className="h-12 bg-gray-800 rounded w-24" />
            </div>
          ))}
        </div>

        {/* Recent Courses */}
        <div className="space-y-4">
          <div className="h-8 bg-gray-800 rounded w-48" />
          <CoursesGridSkeleton count={3} />
        </div>

        {/* Recent Students */}
        <div className="space-y-4">
          <div className="h-8 bg-gray-800 rounded w-48" />
          <TableSkeleton rows={3} />
        </div>
      </div>
    </div>
  )
}

export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  }

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className={`${sizeClasses[size]} border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin`} />
    </div>
  )
}

export function PageLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#03050a] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="h-16 w-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mx-auto" />
        <div className="h-6 bg-gray-800 rounded w-48 mx-auto animate-pulse" />
      </div>
    </div>
  )
}

