"use client"

import { useState } from "react"
import YouTube from "react-youtube"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, Clock, FileText } from "lucide-react"
import { DiscussionsSection } from "./DiscussionsSection"
import { NavigationButtons, TabNavigation } from "@/components/shared"
import { OverviewTab } from "./video-player/OverviewTab"
import { InstructorTab } from "./video-player/InstructorTab"
import { ResourcesTab } from "./video-player/ResourcesTab"
import { ReviewsTabClient } from "./video-player/ReviewsTab"
import { getYouTubeVideoId } from "@/lib/youtube"

interface VideoPlayerProps {
  content: {
    lectureId?: string
    lectureTitle: string
    lectureUrl?: string
    lectureDuration?: number
    resources?: string | Array<{ url: string; title: string }>
  }
  isCompleted: boolean
  onMarkComplete: (itemId: string) => void
  accessToken?: string
  courseId?: string
  currentUserId?: string
  // Optional course-level data for tabs section
  courseInfo?: {
    title?: string
    description?: string
    whatYouWillLearn?: string[]
    instructor?: {
      _id?: string
      name?: string
      avatar?: {
        url?: string
      }
      bio?: string
    }
    category?: string
    level?: string
  }
  // Navigation controls
  onNext?: () => void
  onPrev?: () => void
  canNext?: boolean
  canPrev?: boolean
}

export function VideoPlayer({ content, isCompleted, onMarkComplete, accessToken, courseId, currentUserId, courseInfo, onNext, onPrev, canNext = false, canPrev = false }: VideoPlayerProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "author" | "resources" | "reviews" | "discussions">("overview")

  const handleMarkComplete = () => {
    if (content.lectureId) {
      onMarkComplete(content.lectureId)
    }
  }


  // YouTube player options
  const youtubeOpts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
      modestbranding: 1,
      rel: 0,
      fs: 1,
      origin: typeof window !== 'undefined' ? window.location.origin : undefined,
    },
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Video Player */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-0">
          {content.lectureUrl ? (
            <div className="aspect-video bg-black relative">
              <YouTube
                videoId={getYouTubeVideoId(content.lectureUrl)}
                opts={youtubeOpts}
                className="w-full h-full"
                iframeClassName="w-full h-full"
              />
              <PlayerNavOverlay onPrev={onPrev} onNext={onNext} canPrev={canPrev} canNext={canNext} />
            </div>
          ) : (
            <div className="aspect-video bg-black flex items-center justify-center">
              <div className="text-center text-white">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                <p className="text-lg font-medium">No video available</p>
                <p className="text-sm text-gray-400 mt-2">This lecture doesn&apos;t have a video yet</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lecture Details */}
      <Card className="bg-[#0a0d14] border-gray-800">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-white text-base sm:text-lg md:text-xl">{content.lectureTitle || 'Lecture'}</CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <NavigationButtons 
                onPrev={onPrev}
                onNext={onNext}
                canPrev={canPrev}
                canNext={canNext}
              />
              <Button 
                onClick={handleMarkComplete}
                variant={isCompleted ? "secondary" : "default"}
                disabled={isCompleted}
                size="sm"
                className="text-xs sm:text-sm"
              >
                {isCompleted ? (
                  <>
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    <span className="hidden sm:inline">Completed</span>
                    <span className="sm:hidden">✓</span>
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">Mark as Complete</span>
                    <span className="sm:hidden">Complete</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {content.lectureDuration && (
            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="h-4 w-4" />
              <span>
                Duration: {Math.floor(content.lectureDuration / 60)}:{String(content.lectureDuration % 60).padStart(2, "0")}
              </span>
            </div>
          )}
          
          {content.resources && (
            <div className="mt-4 p-3 bg-gradient-to-r from-blue-900/10 to-cyan-900/10 border border-blue-600/30 rounded-lg">
              <div className="flex items-center gap-2 text-blue-400 text-sm">
                <FileText className="h-4 w-4" />
                <span className="font-medium">
                  {typeof content.resources === 'string' 
                    ? '1 resource available' 
                    : Array.isArray(content.resources) 
                    ? `${content.resources.length} resources available` 
                    : '0 resources'}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1 ml-6">
                View in the Resources tab below
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs: Overview / Instructor / Discussions / Resources / Reviews */}
      <Card className="bg-[#0a0d14] border-gray-800">
        <CardHeader className="pb-2">
          <TabNavigation 
            tabs={[
              { key: "overview", label: "Overview" },
              { key: "author", label: "Instructor" },
              { key: "discussions", label: "Discussions" },
              { key: "resources", label: "Resources" },
              { key: "reviews", label: "Reviews" },
            ]}
            activeTab={activeTab}
            onTabChange={(key) => setActiveTab(key as typeof activeTab)}
            className="-mx-2 px-2"
          />
        </CardHeader>
        <CardContent className="space-y-6">
          {activeTab === "overview" && <OverviewTab courseInfo={courseInfo} />}

          {activeTab === "author" && <InstructorTab instructor={courseInfo?.instructor} />}

          {activeTab === "discussions" && content.lectureId && accessToken && (
            <DiscussionsSection lectureId={content.lectureId} accessToken={accessToken} />
          )}

          {activeTab === "resources" && <ResourcesTab resources={content.resources} />}

          {activeTab === "reviews" && courseId && accessToken && currentUserId && (
            <ReviewsTabClient 
              courseId={courseId}
              accessToken={accessToken}
              currentUserId={currentUserId}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function PlayerNavOverlay({ onPrev, onNext, canPrev, canNext }: { onPrev?: () => void; onNext?: () => void; canPrev?: boolean; canNext?: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-between px-3">
      {/* left gradient edge */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black/40 to-transparent" />
      {/* right gradient edge */}
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black/40 to-transparent" />
      <button
        onClick={onPrev}
        disabled={!canPrev}
        className="pointer-events-auto h-11 w-11 rounded-full bg-black/50 hover:bg-black/70 text-white grid place-items-center disabled:opacity-30 shadow-lg"
        aria-label="Previous item"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path fillRule="evenodd" d="M15.78 4.22a.75.75 0 010 1.06L9.06 12l6.72 6.72a.75.75 0 11-1.06 1.06l-7.25-7.25a.75.75 0 010-1.06l7.25-7.25a.75.75 0 011.06 0z" clipRule="evenodd" />
        </svg>
      </button>
      <button
        onClick={onNext}
        disabled={!canNext}
        className="pointer-events-auto h-11 w-11 rounded-full bg-black/50 hover:bg-black/70 text-white grid place-items-center disabled:opacity-30 shadow-lg"
        aria-label="Next item"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path fillRule="evenodd" d="M8.22 19.78a.75.75 0 010-1.06L14.94 12 8.22 5.28a.75.75 0 011.06-1.06l7.25 7.25a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  )
}
