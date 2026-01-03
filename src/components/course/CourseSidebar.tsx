"use client"

import { useState } from "react"
import { 
  CheckCircle, 
  Circle, 
  PlayCircle, 
  FileText,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  Award,
  MessageSquare,
  BookOpen,
  X
} from "lucide-react"
import type { Chapter, ChapterItem } from "@/lib/types"
import { getChapterItems, type EnrolledCourseChapter } from "@/lib/types/course-player"
import { DiscussionsTab } from "./DiscussionsTab"
import { EmptyState } from "@/components/ui/empty-state"

// Type alias for backward compatibility - includes legacy fields for UI
type CourseContent = ChapterItem & {
  lectureTitle?: string
  lectureUrl?: string
  lectureDuration?: number
}

interface CourseSidebarProps {
  courseContent?: Chapter[] | EnrolledCourseChapter[]
  completedItems: Set<string>
  selectedContent: CourseContent | null
  onContentSelect: (content: CourseContent, type: "lecture" | "quiz") => void
  accessToken?: string
  isOpen?: boolean
  onToggle?: () => void
}

type TabType = "content" | "discussions"

export function CourseSidebar({ 
  courseContent = [], 
  completedItems, 
  selectedContent,
  onContentSelect,
  accessToken,
  isOpen = true,
  onToggle
}: CourseSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>("content")
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(() => {
    // Auto-expand first chapter that has content
    const firstChapterIndex = courseContent?.findIndex(
      chapter => {
        const content = getChapterItems(chapter)
        return content && content.length > 0
      }
    )
    
    if (firstChapterIndex !== undefined && firstChapterIndex >= 0) {
      const firstChapter = courseContent[firstChapterIndex]
      const chapterKey = ('_id' in firstChapter ? firstChapter._id : firstChapter.chapterId) || `chapter-${firstChapterIndex}`
      return new Set([chapterKey])
    }
    
    return new Set()
  })

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev => {
      const newExpanded = new Set(prev)
      if (newExpanded.has(chapterId)) {
        newExpanded.delete(chapterId)
      } else {
        newExpanded.add(chapterId)
      }
      return newExpanded
    })
  }

  const totalChapters = courseContent.length
  
  // Calculate total items and completed
  const totalItems = courseContent.reduce((acc, chapter) => {
    const items = getChapterItems(chapter)
    return acc + items.length
  }, 0)
  
  const completedCount = completedItems.size

  // If sidebar is hidden completely
  if (!isOpen) {
    return null
  }

  if (isCollapsed) {
    return (
      <div className="hidden lg:flex w-16 bg-[#0a0d14] border-l border-gray-800/50 flex-col items-center py-4 flex-shrink-0">
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-2 rounded-lg hover:bg-gray-800/50 text-gray-400 hover:text-white transition-colors"
          aria-label="Expand sidebar"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="mt-4 text-center">
          <div className="text-xs text-gray-500 writing-mode-vertical">
            {completedCount}/{totalItems}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        onClick={onToggle}
        aria-hidden="true"
      />
      
      {/* Sidebar Container */}
      <div className="fixed lg:relative inset-0 lg:inset-auto w-full lg:w-96 bg-[#0a0d14] border-t lg:border-t-0 lg:border-l border-gray-800/50 flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out z-50 lg:z-auto">
        {/* Header */}
        <div className="p-4 border-b border-gray-800/50 bg-[#0a0d14]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-base sm:text-lg text-white">Course Dashboard</h3>
            <div className="flex items-center gap-2">
              {/* Close button - visible on all screens */}
              {onToggle && (
                <button
                  onClick={onToggle}
                  className="p-1.5 rounded-lg hover:bg-gray-800/50 text-gray-400 hover:text-white transition-colors"
                  aria-label="Close sidebar"
                  title="Close sidebar"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              {/* Collapse button - desktop only */}
              <button
                onClick={() => setIsCollapsed(true)}
                className="hidden lg:block p-1.5 rounded-lg hover:bg-gray-800/50 text-gray-400 hover:text-white transition-colors"
                aria-label="Collapse sidebar"
                title="Collapse sidebar"
              >
                <ChevronsLeft className="h-4 w-4" />
              </button>
            </div>
          </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("content")}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all ${
              activeTab === "content"
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                : "bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span className="text-sm font-medium">Content</span>
          </button>
          <button
            onClick={() => setActiveTab("discussions")}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all ${
              activeTab === "discussions"
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                : "bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            <span className="text-sm font-medium">Discuss</span>
          </button>
        </div>
      </div>

      {/* Content Tab */}
      {activeTab === "content" && (
        <>
          <div className="px-4 py-3 border-b border-gray-800/50 bg-[#0a0d14]">
            <div className="flex items-center justify-between text-sm">
              <p className="text-gray-400">
                {totalChapters} {totalChapters === 1 ? 'chapter' : 'chapters'}
              </p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-gray-400">
                  <CheckCircle className="h-4 w-4 text-blue-400" />
                  <span>{completedCount}/{totalItems}</span>
                </div>
              </div>
            </div>
            {/* Progress bar */}
            <div className="mt-3 bg-gray-800 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-blue-600 to-cyan-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${totalItems > 0 ? (completedCount / totalItems) * 100 : 0}%` }}
              />
            </div>
          </div>
        </>
      )}

      {/* Chapters List - Only show when content tab is active */}
      {activeTab === "content" && (
        <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-2">
          {totalChapters === 0 ? (
            <EmptyState 
              icon={FileText}
              title="No Content Yet"
              description="Course content will appear here"
            />
          ) : (
            courseContent.map((chapter, chapterIndex) => {
            const chapterId = '_id' in chapter ? chapter._id : chapter.chapterId
            const chapterTitle = ('title' in chapter ? chapter.title : chapter.chapterTitle) || ''
            const items = getChapterItems(chapter)
            const chapterKey = chapterId || `chapter-${chapterIndex}`
            
            // Calculate completion
            const completedCount = items.filter((item) => {
              const id = item.type === "lecture" ? item.lectureId : item.quizId
              return id && completedItems.has(String(id))
            }).length
            const isChapterCompleted = items.length > 0 && completedCount === items.length
            
            return (
              <div key={chapterKey} className="mb-1">
                <button
                  onClick={() => toggleChapter(chapterKey)}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-800/50 transition-colors group"
                >
                  <div className="flex items-center flex-1 min-w-0">
                    {expandedChapters.has(chapterKey) ? (
                      <ChevronDown className="h-4 w-4 mr-2 flex-shrink-0 text-gray-400 group-hover:text-white transition-colors" />
                    ) : (
                      <ChevronRight className="h-4 w-4 mr-2 flex-shrink-0 text-gray-400 group-hover:text-white transition-colors" />
                    )}
                    <div className="text-left flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-base text-white">Chapter {chapterIndex + 1}</p>
                        {isChapterCompleted && (
                          <Award className="h-4 w-4 text-[#F25320]" />
                        )}
                      </div>
                      <p className="text-base text-gray-400 truncate group-hover:text-gray-300">{chapterTitle}</p>
                    </div>
                  </div>
                  {items.length > 0 && (
                    <span className="ml-2 text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-full flex-shrink-0">
                      {completedCount}/{items.length}
                    </span>
                  )}
                </button>

                {expandedChapters.has(chapterKey) && (
                  <div className="ml-6 mt-1 space-y-1">
                    {items.length === 0 ? (
                      <p className="text-xs text-gray-500 italic text-center py-4">No content in this chapter yet</p>
                    ) : (
                      items.map((rawItem, itemIndex: number) => {
                      const isLecture = rawItem.type === "lecture"
                      const itemId = isLecture ? rawItem.lectureId : rawItem.quizId
                      const itemTitle = rawItem.lectureTitle || rawItem.title || ''
                      const isCompleted = itemId && completedItems.has(String(itemId))
                      const isSelected = selectedContent && String(itemId) === String(
                        isLecture ? selectedContent.lectureId : selectedContent.quizId
                      )
                      
                      const item: CourseContent = {
                        type: rawItem.type,
                        lectureId: rawItem.lectureId,
                        lectureTitle: itemTitle,
                        lectureUrl: rawItem.lectureUrl || rawItem.videoUrl,
                        lectureDuration: rawItem.lectureDuration || rawItem.duration,
                        resources: rawItem.resources,
                        quizId: rawItem.quizId,
                        questionCount: rawItem.questionCount,
                        questions: rawItem.questions,
                        isCompleted: rawItem.isCompleted || false,
                        title: itemTitle,
                        order: rawItem.order || 0,
                      }
                      
                      return (
                        <button
                          key={itemId || `${chapterKey}-${itemIndex}`}
                          onClick={() => onContentSelect(item, isLecture ? "lecture" : "quiz")}
                          className={`relative w-full flex items-center p-2.5 rounded-lg transition-all group overflow-hidden ${
                            isSelected 
                              ? "bg-gray-800/50 border border-blue-600/50" 
                              : "hover:bg-gray-800/50 border border-transparent"
                          }`}
                        >
                          {/* Playing indicator */}
                          {isSelected && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 to-cyan-600" />
                          )}
                          
                          <div className="relative flex items-center w-full">
                            {isCompleted ? (
                              <CheckCircle className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                            ) : (
                              <Circle className="h-4 w-4 text-gray-600 mr-2 flex-shrink-0" />
                            )}
                            <div className="flex items-center flex-1 min-w-0">
                              {isLecture ? (
                                <PlayCircle className={`h-5 w-5 mr-2 flex-shrink-0 ${
                                  isSelected ? 'text-blue-400 animate-pulse' : 'text-blue-400'
                                }`} />
                              ) : (
                                <FileText className={`h-5 w-5 mr-2 flex-shrink-0 ${
                                  isSelected ? 'text-cyan-400 animate-pulse' : 'text-cyan-400'
                                }`} />
                              )}
                              <div className="flex-1 min-w-0">
                                <span className={`text-base truncate text-left block ${isSelected ? 'text-white font-semibold' : 'text-gray-300'}`}>
                                  <span className="text-gray-500 mr-1.5">{itemIndex + 1}.</span>
                                  {item.lectureTitle}
                                </span>
                              </div>
                            </div>
                            {isLecture && item.lectureDuration && (
                              <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                                {Math.floor(item.lectureDuration / 60)}:{String(item.lectureDuration % 60).padStart(2, "0")}
                              </span>
                            )}
                          </div>
                        </button>
                      )
                    })
                  )}
                </div>
              )}
            </div>
          )
          })
          )}
        </div>
      )}

      {/* Discussions Tab */}
      {activeTab === "discussions" && accessToken && (
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <DiscussionsTab 
            lectureId={selectedContent?.lectureId || null}
            lectureTitle={selectedContent?.lectureTitle || selectedContent?.title}
            accessToken={accessToken}
          />
        </div>
      )}
      </div>
    </>
  )
}

