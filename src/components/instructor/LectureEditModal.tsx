"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Save, Loader2 } from "lucide-react"
import dynamic from "next/dynamic"
import { getYouTubeVideoId } from "@/lib/youtube"

const YouTube = dynamic(() => import("react-youtube"), { ssr: false })

interface Lecture {
  _id: string
  title: string
  videoUrl: string
  duration: number
  isPreview: boolean
  resources?: string
}

interface LectureEditModalProps {
  lecture: Lecture | null
  open: boolean
  onClose: () => void
  onSave: (lectureId: string, data: { title: string; videoUrl: string; duration: number; isPreview: boolean; resources: string }) => Promise<void>
  onVideoUrlChange?: (url: string) => void
  isFetchingVideoInfo?: boolean
}

export function LectureEditModal({ 
  lecture, 
  open, 
  onClose, 
  onSave, 
  onVideoUrlChange,
  isFetchingVideoInfo = false
}: LectureEditModalProps) {
  const [editData, setEditData] = useState<{
    title: string
    videoUrl: string
    duration: number
    isPreview: boolean
    resources: string
  }>({
    title: lecture?.title || "",
    videoUrl: lecture?.videoUrl || "",
    duration: lecture?.duration || 0,
    isPreview: lecture?.isPreview || false,
    resources: lecture?.resources || ""
  })

  useEffect(() => {
    if (lecture) {
      setEditData({
        title: lecture.title,
        videoUrl: lecture.videoUrl,
        duration: lecture.duration,
        isPreview: lecture.isPreview,
        resources: lecture.resources || ""
      })
    }
  }, [lecture])

  const handleSave = async () => {
    if (!lecture) return
    await onSave(lecture._id, editData)
    onClose()
  }

  const handleVideoUrlChange = (url: string) => {
    setEditData({ ...editData, videoUrl: url })
    if (onVideoUrlChange) {
      onVideoUrlChange(url)
    }
  }

  const videoId = editData.videoUrl ? getYouTubeVideoId(editData.videoUrl) : null

  if (!lecture) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[95vh] overflow-y-auto bg-gradient-to-br from-gray-900/98 via-blue-900/30 to-gray-900/98 border-2 border-blue-500/40 shadow-2xl shadow-blue-500/20">
        <DialogHeader className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md pb-4 border-b border-blue-500/20">
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            Edit Lecture
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-6 px-2">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-blue-300">Lecture Title</Label>
            <Input
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              placeholder="Enter lecture title..."
              className="text-lg h-12 bg-gray-800/50 border-blue-500/30 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-blue-300">YouTube Video URL</Label>
            <Input
              value={editData.videoUrl}
              onChange={(e) => handleVideoUrlChange(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              disabled={isFetchingVideoInfo}
              className="h-12 bg-gray-800/50 border-blue-500/30 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
            />
            {isFetchingVideoInfo && (
              <p className="text-sm text-blue-400 mt-2 flex items-center gap-2 bg-blue-500/10 p-2 rounded-lg border border-blue-500/30">
                <Loader2 className="h-4 w-4 animate-spin" />
                Fetching video information...
              </p>
            )}
          </div>

          {videoId && (
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-blue-300 flex items-center gap-2">
                <span className="p-1.5 bg-blue-500/20 rounded">
                  🎥
                </span>
                Video Preview
              </Label>
              <div className="rounded-xl overflow-hidden border-2 border-blue-500/30 shadow-2xl shadow-blue-500/10">
                <YouTube
                  videoId={videoId}
                  opts={{
                    width: "100%",
                    height: "480",
                    playerVars: { 
                      autoplay: 0,
                      origin: typeof window !== 'undefined' ? window.location.origin : undefined,
                    }
                  }}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-blue-300">Duration (seconds)</Label>
              <Input
                type="number"
                value={editData.duration}
                onChange={(e) => setEditData({ ...editData, duration: parseInt(e.target.value) || 0 })}
                placeholder="e.g., 600"
                className="h-12 bg-gray-800/50 border-blue-500/30 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-blue-300">Preview Access</Label>
              <div className="flex items-center gap-3 h-12 px-4 bg-gray-800/50 border border-blue-500/30 rounded-lg">
                <Switch
                  checked={editData.isPreview}
                  onCheckedChange={(checked) => setEditData({ ...editData, isPreview: checked })}
                />
                <Label className="text-sm text-gray-300 cursor-pointer">Allow free preview</Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-blue-300">Resources (Optional)</Label>
            <Textarea
              value={editData.resources}
              onChange={(e) => setEditData({ ...editData, resources: e.target.value })}
              placeholder="Add resource links (comma-separated): https://example.com/resource1, https://example.com/resource2"
              rows={4}
              className="bg-gray-800/50 border-blue-500/30 focus:border-blue-500 text-sm"
            />
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 z-50 flex justify-end gap-3 pt-6 pb-2 bg-gradient-to-t from-gray-900/95 to-transparent backdrop-blur-md">
            <Button 
              onClick={onClose} 
              variant="outline"
              className="border-gray-600 text-gray-400 hover:bg-gray-800 h-12 px-6"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/30 h-12 px-8 text-base font-semibold"
            >
              <Save className="h-5 w-5 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

