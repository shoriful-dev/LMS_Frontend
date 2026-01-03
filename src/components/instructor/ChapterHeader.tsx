"use client"

// useState removed
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  ChevronDown, 
  ChevronRight, 
  GripVertical, 
  Edit, 
  Trash2, 
  Plus, 
  Save, 
  X 
} from "lucide-react"
import { formatDuration } from "@/lib/utils"

interface ChapterHeaderProps {
  chapter: {
    _id: string
    title: string
    lectures?: any[]
    quizzes?: any[]
    chapterDuration?: number
  }
  chapterIndex: number
  isExpanded: boolean
  isEditing: boolean
  editTitle: string
  onToggleExpand: () => void
  onStartEdit: () => void
  onSaveEdit: () => void
  onCancelEdit: () => void
  onDelete: () => void
  onAddLecture: () => void
  onAddQuiz: () => void
  onEditTitleChange: (title: string) => void
  dragHandleProps?: {
    ref: any
    attributes: any
    listeners: any
  }
}

export function ChapterHeader({
  chapter,
  chapterIndex,
  isExpanded,
  isEditing,
  editTitle,
  onToggleExpand,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  onAddLecture,
  onAddQuiz,
  onEditTitleChange,
  dragHandleProps
}: ChapterHeaderProps) {
  return (
    <CardHeader className="relative z-10">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleExpand}
          className="p-0 h-auto hover:bg-transparent"
        >
          {isExpanded ? (
            <ChevronDown className="h-5 w-5 text-violet-400" />
          ) : (
            <ChevronRight className="h-5 w-5 text-violet-400" />
          )}
        </Button>
        
        {dragHandleProps && (
          <div 
            ref={dragHandleProps.ref}
            {...dragHandleProps.attributes} 
            {...dragHandleProps.listeners} 
            className="cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="h-5 w-5 text-gray-500 hover:text-violet-400 transition-colors" />
          </div>
        )}
        
        <div className="flex-1">
          {isEditing ? (
            <div className="flex gap-3">
              <Input
                value={editTitle}
                onChange={(e) => onEditTitleChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSaveEdit()}
                className="flex-1"
              />
              <Button 
                onClick={onSaveEdit}
                size="sm"
                className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white"
              >
                <Save className="h-4 w-4" />
              </Button>
              <Button 
                onClick={onCancelEdit}
                size="sm"
                variant="outline"
                className="border-gray-600 text-gray-400"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-violet-300 text-lg">
                  Chapter {chapterIndex + 1}: {chapter.title}
                </CardTitle>
                <CardDescription className="text-gray-500 text-sm mt-1">
                  {chapter.lectures?.length || 0} lectures • {chapter.quizzes?.length || 0} quizzes • {formatDuration(chapter.chapterDuration || 0)}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={onStartEdit}
                  size="sm"
                  variant="outline"
                  className="border-violet-500/30 bg-violet-500/10 text-violet-400 hover:bg-violet-500/20"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  onClick={onDelete}
                  size="sm"
                  variant="outline"
                  className="border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button 
                  onClick={onAddLecture}
                  size="sm"
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Lecture
                </Button>
                <Button 
                  onClick={onAddQuiz}
                  size="sm"
                  className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Quiz
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </CardHeader>
  )
}

