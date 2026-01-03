"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlayCircle, Edit, Trash2, ArrowUp, ArrowDown, Save, X, GripVertical } from "lucide-react"
import { formatDuration } from "@/lib/utils"

interface Lecture {
  _id: string
  title: string
  videoUrl?: string
  duration: number
  isPreview: boolean
  resources?: string
  order: number
}

interface LectureCardProps {
  lecture: Lecture
  lectureIndex: number
  contentIndex: number
  isFirst: boolean
  isLast: boolean
  isDragging?: boolean
  onEdit: (lectureId: string, data: { title: string; videoUrl: string; duration: number; isPreview: boolean; resources: string }) => Promise<void>
  onDelete: (lectureId: string) => void
  onMoveUp: () => void
  onMoveDown: () => void
  dragHandleProps?: {
    ref: any
    attributes: any
    listeners: any
  }
  isFetchingVideoInfo?: boolean
  onVideoUrlChange?: (url: string) => void
}

export function LectureCard({ 
  lecture, 
  contentIndex,
  isFirst,
  isLast,
  isDragging = false,
  onEdit, 
  onDelete,
  onMoveUp,
  onMoveDown,
  dragHandleProps,
  isFetchingVideoInfo = false,
  onVideoUrlChange
}: LectureCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    title: lecture.title,
    videoUrl: lecture.videoUrl || "",
    duration: lecture.duration,
    isPreview: lecture.isPreview,
    resources: lecture.resources || ""
  })

  const handleSave = async () => {
    try {
      await onEdit(lecture._id, editData)
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating lecture:", error)
    }
  }

  const handleVideoUrlChange = (url: string) => {
    setEditData({ ...editData, videoUrl: url })
    if (onVideoUrlChange) {
      onVideoUrlChange(url)
    }
  }

  return (
    <div 
      className={`flex items-center gap-3 rounded-lg border transition-all duration-200 ${
        isDragging 
          ? 'bg-blue-500/20 border-blue-500 shadow-xl shadow-blue-500/30 scale-[1.02] ring-2 ring-blue-500/50' 
          : 'bg-gray-800/30 border-gray-700/50 hover:bg-gray-800/50 hover:border-blue-500/30 hover:shadow-md'
      }`}
    >
      {/* Drag Handle */}
      {dragHandleProps && (
        <div 
          ref={dragHandleProps.ref}
          {...dragHandleProps.attributes}
          {...dragHandleProps.listeners}
          className="flex items-center gap-2 px-4 py-4 cursor-grab active:cursor-grabbing hover:bg-blue-500/20 rounded-l-lg transition-all border-r-2 border-blue-500/30 hover:border-blue-500 group"
          title="👆 Click and drag to reorder"
        >
          <GripVertical className="h-6 w-6 text-blue-400 group-hover:text-blue-300 transition-colors flex-shrink-0 animate-pulse group-hover:animate-none" />
          <span className="text-xs font-bold text-white bg-blue-500 px-3 py-1.5 rounded shadow-lg min-w-[40px] text-center">
            #{contentIndex + 1}
          </span>
        </div>
      )}

      {/* Lecture Content */}
      <div className="flex-1 flex items-center gap-3 py-2 pr-3">
        <PlayCircle className="h-5 w-5 text-blue-400 flex-shrink-0" />
        
        {isEditing ? (
          <div className="flex-1 space-y-2">
            <div className="relative">
              <Input
                value={editData.videoUrl}
                onChange={(e) => handleVideoUrlChange(e.target.value)}
                placeholder="Video URL"
              />
              {isFetchingVideoInfo && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-violet-500"></div>
                </div>
              )}
            </div>
            <Input
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              placeholder="Lecture title"
            />
            <div className="flex gap-2">
              <Input
                type="number"
                value={editData.duration}
                onChange={(e) => setEditData({ ...editData, duration: parseInt(e.target.value) || 0 })}
                placeholder="Duration (seconds)"
                className="w-32"
              />
              <label className="flex items-center gap-2 px-3 py-2 bg-gray-700 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={editData.isPreview}
                  onChange={(e) => setEditData({ ...editData, isPreview: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-300">Preview</span>
              </label>
              <Button 
                onClick={handleSave}
                size="sm"
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Save className="h-4 w-4" />
              </Button>
              <Button 
                onClick={() => setIsEditing(false)}
                size="sm"
                variant="outline"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-gray-200 truncate">{lecture.title}</p>
                {lecture.isPreview && (
                  <span className="px-2 py-0.5 text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded flex-shrink-0">
                    Preview
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Duration: {formatDuration(lecture.duration)}
              </p>
            </div>
            
            <div className="flex gap-2 flex-shrink-0">
              {/* Move Up/Down */}
              <div className="flex flex-col gap-1">
                <Button 
                  onClick={onMoveUp}
                  disabled={isFirst}
                  size="sm"
                  variant="outline"
                  className="h-6 px-2 border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move up"
                >
                  <ArrowUp className="h-3 w-3" />
                </Button>
                <Button 
                  onClick={onMoveDown}
                  disabled={isLast}
                  size="sm"
                  variant="outline"
                  className="h-6 px-2 border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move down"
                >
                  <ArrowDown className="h-3 w-3" />
                </Button>
              </div>
              <Button 
                onClick={() => setIsEditing(true)}
                size="sm"
                variant="outline"
                className="border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button 
                onClick={() => onDelete(lecture._id)}
                size="sm"
                variant="outline"
                className="border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
