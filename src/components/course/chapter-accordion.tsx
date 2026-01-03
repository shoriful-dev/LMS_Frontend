"use client"

import { useState } from "react"
import YouTube from "react-youtube"
import { ChevronDown, ChevronUp, PlayCircle, FileText, Lock, Eye, Clock } from "lucide-react"
import { Modal } from "@/components/ui/modal"
import { formatDuration } from "@/lib/utils"
import { getYouTubeVideoId } from "@/lib/youtube"
import type { Chapter, ChapterItem } from "@/lib/types"

interface ChapterAccordionProps {
  chapters: Chapter[]
}

export function ChapterAccordion({ chapters }: ChapterAccordionProps) {
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set([chapters[0]?._id]))
  const [previewVideo, setPreviewVideo] = useState<{ url: string; title: string } | null>(null)

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev => {
      const newSet = new Set(prev)
      if (newSet.has(chapterId)) {
        newSet.delete(chapterId)
      } else {
        newSet.add(chapterId)
      }
      return newSet
    })
  }

  const handlePreviewClick = (videoUrl: string, title: string) => {
    setPreviewVideo({ url: videoUrl, title })
  }

  return (
    <>
      <div className="space-y-2">
        {chapters.map((chapter: Chapter, index: number) => {
          const isExpanded = expandedChapters.has(chapter._id)
          const items = chapter.items || []
          const lectureCount = items.filter(item => item.type === "lecture").length
          const quizCount = items.filter(item => item.type === "quiz").length
          const chapterDuration = chapter.chapterDuration || 0

          return (
            <div key={chapter._id} className="border border-gray-800 rounded-lg overflow-hidden bg-gray-800/30">
              {/* Chapter Header */}
              <button
                onClick={() => toggleChapter(chapter._id)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-start flex-1 text-left">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">
                      Chapter {index + 1}: {chapter.title}
                    </h4>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      {lectureCount > 0 && (
                        <span className="flex items-center gap-1">
                          <PlayCircle className="h-3 w-3 text-blue-400" />
                          {lectureCount} lecture{lectureCount !== 1 ? 's' : ''}
                        </span>
                      )}
                      {quizCount > 0 && (
                        <span className="flex items-center gap-1">
                          <FileText className="h-3 w-3 text-cyan-400" />
                          {quizCount} quiz{quizCount !== 1 ? 'zes' : ''}
                        </span>
                      )}
                      {chapterDuration > 0 && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-blue-400" />
                          {formatDuration(chapterDuration)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="ml-4">
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </button>

              {/* Chapter Content */}
              {isExpanded && items.length > 0 && (
                <div className="border-t border-gray-800 bg-gray-900/30">
                  <div className="divide-y divide-gray-800">
                    {items.map((item: ChapterItem) => (
                      <div
                        key={item.type === "lecture" ? item.lectureId : item.quizId}
                        className="flex items-center justify-between p-3 pl-8 hover:bg-gray-800/50 transition-colors"
                      >
                        <div className="flex items-center flex-1">
                          {item.type === "lecture" ? (
                            <>
                              <PlayCircle className="h-4 w-4 text-blue-400 mr-3 flex-shrink-0" />
                              <div className="flex-1">
                                <span className="text-sm text-gray-300">{item.lectureTitle || item.title}</span>
                                {(item.lectureDuration || item.duration) && (
                                  <span className="text-xs text-gray-500 ml-2">
                                    ({formatDuration(item.lectureDuration || item.duration || 0)})
                                  </span>
                                )}
                              </div>
                            </>
                          ) : (
                            <>
                              <FileText className="h-4 w-4 text-cyan-400 mr-3 flex-shrink-0" />
                              <div className="flex-1">
                                <span className="text-sm text-gray-300">{item.lectureTitle || item.title}</span>
                                {item.questions && (
                                  <span className="text-xs text-gray-500 ml-2">
                                    ({item.questionCount || item.questions.length} questions)
                                  </span>
                                )}
                              </div>
                            </>
                          )}
                        </div>

                        {/* Preview/Lock Badge */}
                        <div className="flex items-center gap-2 ml-4">
                          {item.type === "lecture" && item.isPreview && (item.lectureUrl || item.videoUrl) ? (
                            <button
                              onClick={() => handlePreviewClick((item.lectureUrl || item.videoUrl)!, item.lectureTitle || item.title || 'Lecture')}
                              className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs rounded-full hover:from-blue-500 hover:to-cyan-500 transition-colors shadow-lg shadow-blue-500/25"
                            >
                              <Eye className="h-3 w-3" />
                              Preview
                            </button>
                          ) : (
                            <div className="flex items-center gap-1 px-3 py-1 bg-gray-800 text-gray-400 text-xs rounded-full border border-gray-700">
                              <Lock className="h-3 w-3" />
                              Locked
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Video Preview Modal */}
      {previewVideo && (
        <Modal
          isOpen={true}
          onClose={() => setPreviewVideo(null)}
          title={previewVideo.title}
        >
          <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
            <YouTube
              videoId={getYouTubeVideoId(previewVideo.url)}
              opts={{
                height: '100%',
                width: '100%',
                playerVars: {
                  autoplay: 1,
                  modestbranding: 1,
                  rel: 0,
                  fs: 1,
                  origin: typeof window !== 'undefined' ? window.location.origin : undefined,
                },
              }}
              className="absolute top-0 left-0 w-full h-full"
              iframeClassName="w-full h-full"
            />
          </div>
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 rounded-lg border border-blue-500/30 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <Eye className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-white mb-1">
                  Free Preview Lecture
                </p>
                <p className="text-sm text-gray-300">
                  This is a preview lecture available to everyone. Enroll in the course to unlock all lectures, quizzes, resources, and get a certificate upon completion.
                </p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}

