"use client"

import { Button } from "@/components/ui/button"
import { FileQuestion, PlayCircle, Edit, Trash2, ArrowUp, ArrowDown, GripVertical } from "lucide-react"
import { formatDuration } from "@/lib/utils"
import type { Question } from "@/lib/types"

interface ContentItemProps {
  item: {
    _id: string
    title: string
    type: 'lecture' | 'quiz'
    duration?: number
    questions?: Question[]
    isPreview?: boolean
  }
  contentIndex: number
  isFirst: boolean
  isLast: boolean
  onEdit: () => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  dragHandleProps?: {
    ref: any
    attributes: any
    listeners: any
  }
}

export function ContentItem({
  item,
  contentIndex,
  isFirst,
  isLast,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  dragHandleProps
}: ContentItemProps) {
  const isQuiz = item.type === 'quiz'
  
  return (
    <div 
      className={`flex items-center gap-3 rounded-lg border transition-all duration-200 ${
        isQuiz 
          ? 'bg-amber-900/20 border-amber-700/50 hover:bg-amber-900/30 hover:border-amber-500/30' 
          : 'bg-blue-900/20 border-blue-700/50 hover:bg-blue-900/30 hover:border-blue-500/30'
      } hover:shadow-md`}
    >
      {/* Drag Handle and Number Badge */}
      <div 
        {...(dragHandleProps ? { ref: dragHandleProps.ref, ...dragHandleProps.attributes, ...dragHandleProps.listeners } : {})}
        className={`flex items-center gap-2 px-4 py-4 ${dragHandleProps ? 'cursor-grab active:cursor-grabbing' : ''} ${
          isQuiz ? 'hover:bg-amber-500/20' : 'hover:bg-blue-500/20'
        } rounded-l-lg transition-all border-r-2 ${
          isQuiz ? 'border-amber-500/30 hover:border-amber-500' : 'border-blue-500/30 hover:border-blue-500'
        } group`}
      >
        {dragHandleProps && <GripVertical className={`h-6 w-6 ${isQuiz ? 'text-amber-400' : 'text-blue-400'} group-hover:${isQuiz ? 'text-amber-300' : 'text-blue-300'} transition-colors flex-shrink-0`} />}
        <span className={`text-xs font-bold text-white ${isQuiz ? 'bg-amber-500' : 'bg-blue-500'} px-3 py-1.5 rounded shadow-lg min-w-[40px] text-center`}>
          #{contentIndex + 1}
        </span>
      </div>
      
      {/* Content Info */}
      <div className="flex-1 flex items-center gap-3 py-2 pr-3">
        {isQuiz ? (
          <FileQuestion className="h-5 w-5 text-amber-400 flex-shrink-0" />
        ) : (
          <PlayCircle className="h-5 w-5 text-blue-400 flex-shrink-0" />
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className={`text-sm font-medium ${isQuiz ? 'text-amber-200' : 'text-blue-200'} truncate`}>
              {item.title}
            </p>
            {isQuiz ? (
              <span className="px-2 py-0.5 text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded flex-shrink-0">
                Quiz • {item.questions?.length || 0} questions
              </span>
            ) : (
              <span className="px-2 py-0.5 text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded flex-shrink-0">
                {item.isPreview ? '👁️ Preview' : 'Lecture'}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Duration: {formatDuration(item.duration || 0)}
          </p>
        </div>
        
        {/* Actions */}
        <div className="flex gap-2 flex-shrink-0">
          {/* Move Up/Down */}
          <div className="flex flex-col gap-1">
            <Button 
              onClick={(e) => {
                e.stopPropagation()
                onMoveUp()
              }}
              disabled={isFirst}
              size="sm"
              variant="outline"
              className={`h-6 px-2 ${
                isQuiz 
                  ? 'border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20' 
                  : 'border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'
              } disabled:opacity-30 disabled:cursor-not-allowed`}
              title="Move up"
            >
              <ArrowUp className="h-3 w-3" />
            </Button>
            <Button 
              onClick={(e) => {
                e.stopPropagation()
                onMoveDown()
              }}
              disabled={isLast}
              size="sm"
              variant="outline"
              className={`h-6 px-2 ${
                isQuiz 
                  ? 'border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20' 
                  : 'border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'
              } disabled:opacity-30 disabled:cursor-not-allowed`}
              title="Move down"
            >
              <ArrowDown className="h-3 w-3" />
            </Button>
          </div>
          
          <Button 
            onClick={onEdit}
            size="sm"
            variant="outline"
            className={`${
              isQuiz 
                ? 'border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20' 
                : 'border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'
            }`}
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
        </div>
      </div>
    </div>
  )
}

