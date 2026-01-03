"use client"

import { useState } from "react"
import { CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Save, PlayCircle } from "lucide-react"
import dynamic from "next/dynamic"
import { getYouTubeVideoId } from "@/lib/youtube"

const YouTube = dynamic(() => import("react-youtube"), { ssr: false })

interface LectureFormData {
  title: string
  videoUrl: string
  duration: number
  isPreview: boolean
  resources: string
}

interface LectureFormProps {
  initialData?: LectureFormData
  onSave: (data: LectureFormData) => Promise<void>
  onCancel: () => void
  mode: "create" | "edit"
  onVideoUrlChange?: (url: string) => void
  onPlayerReady?: (event: any) => void
  isFetchingVideoInfo?: boolean
}

export function LectureForm({ 
  initialData, 
  onSave, 
  onCancel, 
  mode,
  onVideoUrlChange,
  onPlayerReady,
  isFetchingVideoInfo = false
}: LectureFormProps) {
  const [formData, setFormData] = useState<LectureFormData>(
    initialData || {
      title: "",
      videoUrl: "",
      duration: 0,
      isPreview: false,
      resources: ""
    }
  )
  const [isSaving, setIsSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.videoUrl.trim()) {
      alert("Title and video URL are required")
      return
    }
    
    try {
      setIsSaving(true)
      await onSave(formData)
    } catch (error) {
      console.error("Error saving lecture:", error)
      alert("Failed to save lecture")
    } finally {
      setIsSaving(false)
    }
  }

  const handleVideoUrlChange = (url: string) => {
    setFormData({ ...formData, videoUrl: url })
    if (onVideoUrlChange) {
      onVideoUrlChange(url)
    }
  }


  const handlePlayerReady = (event: any) => {
    if (onPlayerReady) {
      onPlayerReady(event)
      // Update form data with video info
      const player = event.target
      const duration = Math.floor(player.getDuration())
      const title = player.getVideoData().title
      
      setFormData(prev => ({
        ...prev,
        title: prev.title || title,
        duration: prev.duration || duration
      }))
    }
  }

  return (
    <CardContent className="relative z-10 border-t border-gray-700/50 pt-4">
      <div className="space-y-4 bg-blue-900/20 p-4 rounded-lg border border-blue-500/20">
        <Input
          placeholder="Lecture title..."
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="YouTube URL (e.g. https://youtube.com/watch?v=...)"
              value={formData.videoUrl}
              onChange={(e) => handleVideoUrlChange(e.target.value)}
              className="flex-1"
            />
            {formData.videoUrl && (
              <Button
                onClick={() => setShowPreview(!showPreview)}
                size="sm"
                variant="outline"
                className="border-blue-500/30 bg-blue-500/10 text-blue-400"
              >
                <PlayCircle className="h-4 w-4 mr-1" />
                {showPreview ? "Hide" : "Preview"}
              </Button>
            )}
          </div>
          {isFetchingVideoInfo && (
            <p className="text-xs text-blue-400">Fetching video information...</p>
          )}
          {showPreview && formData.videoUrl && (
            <div className="aspect-video rounded-lg overflow-hidden bg-black">
              <YouTube
                videoId={getYouTubeVideoId(formData.videoUrl)}
                opts={{
                  width: '100%',
                  height: '100%',
                  playerVars: {
                    autoplay: 0,
                    origin: typeof window !== 'undefined' ? window.location.origin : undefined,
                  },
                }}
                onReady={handlePlayerReady}
                className="w-full h-full"
              />
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <Input
            type="number"
            placeholder="Duration (seconds)"
            value={formData.duration || ""}
            onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
          />
          <label className="flex items-center gap-2 px-3 py-2 bg-gray-700 rounded-lg cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isPreview}
              onChange={(e) => setFormData({ ...formData, isPreview: e.target.checked })}
              className="w-4 h-4 rounded border-gray-600 text-violet-500 focus:ring-violet-500"
            />
            <span className="text-sm text-gray-300">Free Preview</span>
          </label>
        </div>
        <Input
          placeholder="Resources (optional)"
          value={formData.resources}
          onChange={(e) => setFormData({ ...formData, resources: e.target.value })}
        />
        <div className="flex gap-3">
          <Button 
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : mode === "edit" ? "Update Lecture" : "Save Lecture"}
          </Button>
          <Button 
            onClick={onCancel}
            variant="outline"
            className="border-gray-600 text-gray-400"
          >
            Cancel
          </Button>
        </div>
      </div>
    </CardContent>
  )
}

