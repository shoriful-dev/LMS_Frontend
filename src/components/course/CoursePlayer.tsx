"use client"

import { useState, useEffect } from "react"
import { Menu } from "lucide-react"
import { CourseHeader } from "./CourseHeader"
import { LazyVideoPlayer, LazyQuizPlayer } from "@/components/lazy"
import { CourseSidebar } from "./CourseSidebar"
import { ChapterItem } from "@/lib/types"
import { 
  EnrolledCourseForPlayer, 
  PlayerData, 
  getChapterItems 
} from "@/lib/types/course-player"
import { updateLectureProgress, submitQuiz, getCourseProgress } from "@/lib/api-client"

interface CoursePlayerProps {
  course: EnrolledCourseForPlayer
  accessToken: string
  currentUserId?: string
}

export function CoursePlayer({ course, accessToken, currentUserId }: CoursePlayerProps) {
  const [playerData, setPlayerData] = useState<PlayerData | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [progressPercentage, setProgressPercentage] = useState<number>(
    course.progress?.completionPercentage ?? 0
  )
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set())

  // Open sidebar on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Initialize completed items from backend
  useEffect(() => {
    const completed = new Set<string>()
    
    if (course.courseContent) {
      course.courseContent.forEach((chapter) => {
        const items = getChapterItems(chapter)
        items.forEach((item) => {
          if (item.isCompleted) {
            const itemId = item.type === "lecture" ? item.lectureId : item.quizId
            if (itemId) completed.add(itemId)
          }
        })
      })
    }
    
    setCompletedItems(completed)
  }, [course.courseContent])

  // Auto-select first lecture on load
  useEffect(() => {
    if (!playerData && course.courseContent && course.courseContent.length > 0) {
      const firstChapter = course.courseContent[0]
      const items = getChapterItems(firstChapter)
      if (items.length > 0) {
        const firstItem = items[0]
        setPlayerData({
          ...firstItem,
          // Add legacy aliases for backward compatibility
          title: firstItem.lectureTitle,
          videoUrl: firstItem.lectureUrl,
          duration: firstItem.lectureDuration,
          chapter: 1,
          lecture: 1,
        })
      }
    }
  }, [playerData, course.courseContent])

  // Check if there's a previous lecture
  const hasPreviousLecture = () => {
    if (!playerData) return false
    const currentChapter = playerData.chapter - 1
    const currentLecture = playerData.lecture - 1
    return currentChapter > 0 || currentLecture > 0
  }

  // Check if there's a next lecture
  const hasNextLecture = () => {
    if (!playerData || !course.courseContent) return false
    const currentChapter = playerData.chapter - 1
    const currentLecture = playerData.lecture - 1
    const lastChapterIndex = course.courseContent.length - 1
    const currentChapterItems = getChapterItems(course.courseContent[currentChapter])
    const lastLectureIndex = currentChapterItems.length - 1
    return currentChapter < lastChapterIndex || currentLecture < lastLectureIndex
  }

  // Navigate to previous lecture
  const playPreviousLecture = () => {
    if (!playerData || !course.courseContent) return
    
    const currentChapterIndex = playerData.chapter - 1
    const currentLectureIndex = playerData.lecture - 1

    if (currentLectureIndex > 0) {
      // Move to the previous item in the current chapter
      const items = getChapterItems(course.courseContent[currentChapterIndex])
      const previousItem = items[currentLectureIndex - 1]
      setPlayerData({
        ...previousItem,
        // Add legacy aliases for backward compatibility
        title: previousItem.lectureTitle,
        videoUrl: previousItem.lectureUrl,
        duration: previousItem.lectureDuration,
        chapter: currentChapterIndex + 1,
        lecture: currentLectureIndex,
      })
    } else if (currentChapterIndex > 0) {
      // Move to the last item of the previous chapter
      const previousChapter = course.courseContent[currentChapterIndex - 1]
      const items = getChapterItems(previousChapter)
      const lastItemIndex = items.length - 1
      const previousItem = items[lastItemIndex]
      setPlayerData({
        ...previousItem,
        // Add legacy aliases for backward compatibility
        title: previousItem.lectureTitle,
        videoUrl: previousItem.lectureUrl,
        duration: previousItem.lectureDuration,
        chapter: currentChapterIndex,
        lecture: lastItemIndex + 1,
      })
    }
  }

  // Navigate to next lecture
  const playNextLecture = () => {
    if (!playerData || !course.courseContent) return
    
    const currentChapterIndex = playerData.chapter - 1
    const currentLectureIndex = playerData.lecture - 1

    const currentItems = getChapterItems(course.courseContent[currentChapterIndex])
    const lastItemIndex = currentItems.length - 1

    if (currentLectureIndex < lastItemIndex) {
      // Move to the next item in the current chapter
      const nextItem = currentItems[currentLectureIndex + 1]
      setPlayerData({
        ...nextItem,
        // Add legacy aliases for backward compatibility
        title: nextItem.lectureTitle,
        videoUrl: nextItem.lectureUrl,
        duration: nextItem.lectureDuration,
        chapter: currentChapterIndex + 1,
        lecture: currentLectureIndex + 2,
      })
    } else if (currentChapterIndex < course.courseContent.length - 1) {
      // Move to the first item of the next chapter
      const nextChapter = course.courseContent[currentChapterIndex + 1]
      const nextItems = getChapterItems(nextChapter)
      const nextItem = nextItems[0]
      setPlayerData({
        ...nextItem,
        // Add legacy aliases for backward compatibility
        title: nextItem.lectureTitle,
        videoUrl: nextItem.lectureUrl,
        duration: nextItem.lectureDuration,
        chapter: currentChapterIndex + 2,
        lecture: 1,
      })
    }
  }

  // Refresh progress from backend
  const refreshProgress = async () => {
    try {
      const response = await getCourseProgress(course._id, accessToken)
      if (response.progress?.completionPercentage !== undefined) {
        setProgressPercentage(response.progress.completionPercentage as number)
      }
    } catch (error) {
      console.error("Failed to refresh progress:", error)
    }
  }

  // Handle manual content selection from sidebar
  const handleContentSelect = (content: ChapterItem) => {
    // Find the chapter and lecture indices
    let chapterIndex = 0
    let lectureIndex = 0
    let found = false
    
    if (course.courseContent) {
      for (let i = 0; i < course.courseContent.length && !found; i++) {
        const items = getChapterItems(course.courseContent[i])
        for (let j = 0; j < items.length; j++) {
          const item = items[j]
          const itemId = item.type === "lecture" ? item.lectureId : item.quizId
          const selectedId = content.lectureId || content.quizId
          
          // Convert to string for consistent comparison
          if (String(itemId) === String(selectedId)) {
            chapterIndex = i
            lectureIndex = j
            found = true
            break
          }
        }
      }
    }
    
    setPlayerData({
      ...content,
      // Add legacy aliases for backward compatibility
      title: content.lectureTitle,
      videoUrl: content.lectureUrl,
      duration: content.lectureDuration,
      chapter: chapterIndex + 1,
      lecture: lectureIndex + 1,
    })
    
    // Close sidebar on mobile after selection
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false)
    }
  }

  // Handle lecture completion
  const handleLectureComplete = async (lectureId: string) => {
    try {
      // Update UI immediately
      setCompletedItems(prev => new Set([...prev, lectureId]))
      
      // Update backend
      await updateLectureProgress(lectureId, 1, accessToken)
      
      // Refresh overall progress
      await refreshProgress()
      
      // Auto-advance to next item after 1 second
      setTimeout(() => {
        if (hasNextLecture()) {
          playNextLecture()
        }
      }, 1000)
    } catch (error) {
      console.error("Failed to mark lecture complete:", error)
      // Revert on error
      setCompletedItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(lectureId)
        return newSet
      })
    }
  }

  // Handle quiz submission
  const handleQuizSubmit = async (quizId: string, answers: number[]) => {
    try {
      const result = await submitQuiz(quizId, answers, accessToken)
      
      const score = result.data?.score
      
      // Mark as completed if perfect score
      if (score === 100) {
        setCompletedItems(prev => new Set([...prev, quizId]))
        await refreshProgress()
        
        // Auto-advance after 2 seconds
        setTimeout(() => {
          if (hasNextLecture()) {
            playNextLecture()
          }
        }, 2000)
      }
      
      return result
    } catch (error) {
      console.error("Failed to submit quiz:", error)
      throw error
    }
  }

  // Get content type
  const contentType = playerData?.type as "lecture" | "quiz" | null

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-[#03050a] relative">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <CourseHeader
          courseTitle={course.title}
          progressPercentage={progressPercentage}
        />

        <div className="flex-1 p-3 sm:p-4 md:p-6">
          {playerData && contentType === "lecture" ? (
            <LazyVideoPlayer
                content={{
                  lectureId: playerData.lectureId,
                  lectureTitle: playerData.lectureTitle,
                  lectureUrl: playerData.lectureUrl,
                  lectureDuration: playerData.lectureDuration,
                  resources: playerData.resources
                }}
              isCompleted={completedItems.has(playerData.lectureId || "")}
              onMarkComplete={handleLectureComplete}
              accessToken={accessToken}
              courseId={course._id}
              currentUserId={currentUserId}
              courseInfo={{
                title: course.title,
                description: course.description,
                whatYouWillLearn: course.whatYouWillLearn,
                category: course.category,
                level: course.level,
                instructor: typeof course.instructor === 'string' || !course.instructor ? undefined : {
                  _id: course.instructor._id,
                  name: course.instructor.name,
                  avatar: course.instructor.avatar ? { url: course.instructor.avatar.url } : undefined
                }
              }}
              onNext={playNextLecture}
              onPrev={playPreviousLecture}
              canNext={hasNextLecture()}
              canPrev={hasPreviousLecture()}
            />
          ) : playerData && contentType === "quiz" ? (
            <LazyQuizPlayer
              content={{
                type: "quiz",
                lectureId: playerData.lectureId,
                lectureTitle: playerData.lectureTitle,
                lectureUrl: playerData.lectureUrl,
                videoUrl: playerData.lectureUrl,
                lectureDuration: playerData.lectureDuration,
                resources: playerData.resources,
                quizId: playerData.quizId,
                quizTitle: playerData.lectureTitle,
                questionCount: playerData.questionCount,
                questions: playerData.questions,
                title: playerData.lectureTitle,
                duration: playerData.lectureDuration,
                order: playerData.order,
                isPreview: playerData.isPreview,
                isCompleted: completedItems.has(playerData.quizId || "")
              }}
              isCompleted={completedItems.has(playerData.quizId || "")}
              onQuizSubmit={handleQuizSubmit}
              accessToken={accessToken}
              onNext={playNextLecture}
              onPrev={playPreviousLecture}
              canNext={hasNextLecture()}
              canPrev={hasPreviousLecture()}
            />
          ) : (
            <VideoPlayerPlaceholder />
          )}
        </div>
      </div>

      {/* Floating Menu Button */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-2xl flex items-center justify-center transition-all hover:scale-110 border-2 border-gray-800"
          aria-label="Open course content"
        >
          <Menu className="h-6 w-6" />
        </button>
      )}

      {/* Sidebar */}
      <CourseSidebar
        courseContent={course.courseContent}
        completedItems={completedItems}
        selectedContent={playerData}
        onContentSelect={handleContentSelect}
        accessToken={accessToken}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(prev => !prev)}
      />
    </div>
  )
}

// Placeholder for when no content is selected
function VideoPlayerPlaceholder() {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="relative bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-800">
        <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-gray-900 via-[#0a0d14] to-gray-900">
          <div className="text-center px-4 sm:px-6">
            <div className="inline-block p-4 sm:p-6 bg-gray-800/50 backdrop-blur-sm rounded-full mb-4 sm:mb-6">
              <BookOpenIcon className="h-12 w-12 sm:h-16 sm:w-16 text-blue-400" />
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-2 sm:mb-3">
              Start Your Learning Journey
            </h3>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg mb-2">
              Select a lecture from the course content
            </p>
            <p className="text-gray-500 text-xs sm:text-sm">
              <span className="hidden lg:inline">Choose from the sidebar to begin watching →</span>
              <span className="lg:hidden">Tap the menu button to view content ↓</span>
            </p>
          </div>
        </div>
        
        {/* Player Controls (Disabled) */}
        <div className="bg-gray-900 border-t border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-lg bg-gray-800 text-gray-600 cursor-not-allowed" disabled>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </button>
              <span className="text-sm text-gray-600">0:00 / 0:00</span>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full w-0 bg-gradient-to-r from-blue-600 to-cyan-600"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function BookOpenIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  )
}
