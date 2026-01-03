/**
 * Lazy Loading Components
 * Dynamic imports for code splitting and better performance
 */

import dynamic from 'next/dynamic'
import { VideoPlayerSkeleton, QuizPlayerSkeleton } from '@/components/ui/skeleton'

// ============================================================================
// Course Learning Components
// ============================================================================

/**
 * Lazy load Quiz Player
 * Heavy component with quiz logic - only load when needed
 */
export const LazyQuizPlayer = dynamic(
  () => import('@/components/course/QuizPlayer').then(mod => ({ default: mod.QuizPlayer })),
  {
    loading: () => <QuizPlayerSkeleton />,
    ssr: false, // Quiz requires client-side state
  }
)

/**
 * Lazy load Video Player
 * Media player component - only load when needed
 */
export const LazyVideoPlayer = dynamic(
  () => import('@/components/course/VideoPlayer').then(mod => ({ default: mod.VideoPlayer })),
  {
    loading: () => <VideoPlayerSkeleton />,
    ssr: false, // Video player requires client-side
  }
)

// ============================================================================
// Chart & Analytics Components (if you add them later)
// ============================================================================

/**
 * Lazy load Chart components
 * Heavy charting libraries - only load when needed
 * 
 * Uncomment when you create the charts component:
 * 
 * export const LazyCharts = dynamic(
 *   () => import('@/components/dashboard/charts').then(mod => ({ default: mod.Charts })),
 *   {
 *     loading: () => <div className="h-64 animate-pulse bg-gray-200 rounded-lg" />,
 *     ssr: false,
 *   }
 * )
 */

// ============================================================================
// Profile Components
// ============================================================================

/**
 * Lazy load Profile Form
 * Only load when user visits profile page
 */
export const LazyProfileForm = dynamic(
  () => import('@/components/profile/profile-form').then(mod => ({ default: mod.ProfileForm })),
  {
    loading: () => (
      <div className="space-y-4">
        <div className="h-32 animate-pulse bg-gray-200 rounded-lg" />
        <div className="h-10 animate-pulse bg-gray-200 rounded" />
        <div className="h-10 animate-pulse bg-gray-200 rounded" />
      </div>
    ),
  }
)

// ============================================================================
// Export all lazy components
// ============================================================================

export { default as dynamic } from 'next/dynamic'

