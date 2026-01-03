"use client"

import { ContentItem } from "./ContentItem"
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import type { Question } from "@/lib/types"

interface Lecture {
  _id: string
  title: string
  videoUrl: string
  duration: number
  isPreview: boolean
  resources?: string
  order: number
  type: 'lecture'
}

interface Quiz {
  _id: string
  title: string
  questions: Question[]
  duration: number
  order: number
  type: 'quiz'
}

type CombinedContent = (Lecture & { type: 'lecture' }) | (Quiz & { type: 'quiz' })

// Type guards
function isLecture(item: CombinedContent): item is Lecture & { type: 'lecture' } {
  return item.type === 'lecture'
}

function isQuiz(item: CombinedContent): item is Quiz & { type: 'quiz' } {
  return item.type === 'quiz'
}

interface ContentListProps {
  lectures: Lecture[]
  quizzes: Quiz[]
  chapterId: string
  onEditLecture: (lecture: Lecture) => void
  onDeleteLecture: (lectureId: string) => void
  onEditQuiz: (quiz: Quiz) => void
  onDeleteQuiz: (quizId: string) => void
  onMoveLectureUp?: (chapterId: string, lectureId: string) => void
  onMoveLectureDown?: (chapterId: string, lectureId: string) => void
  onMoveQuizUp?: (chapterId: string, quizId: string) => void
  onMoveQuizDown?: (chapterId: string, quizId: string) => void
  sortableIds?: string[]
}

export function ContentList({
  lectures = [],
  quizzes = [],
  chapterId,
  onEditLecture,
  onDeleteLecture,
  onEditQuiz,
  onDeleteQuiz,
  onMoveLectureUp,
  onMoveLectureDown,
  onMoveQuizUp,
  onMoveQuizDown,
  sortableIds = []
}: ContentListProps) {
  // Combine and sort content
  const combinedContent: CombinedContent[] = [
    ...lectures.map(l => ({ ...l, type: 'lecture' as const })),
    ...quizzes.map(q => ({ ...q, type: 'quiz' as const }))
  ].sort((a, b) => (a.order || 0) - (b.order || 0))

  if (combinedContent.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-sm">No content added yet.</p>
        <p className="text-xs mt-1">Add lectures or quizzes using the buttons above.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {sortableIds.length > 0 ? (
        <SortableContext
          items={sortableIds}
          strategy={verticalListSortingStrategy}
        >
          {combinedContent.map((item, idx) => (
            <ContentItem
              key={`${item.type}-${item._id}`}
              item={{
                _id: item._id,
                title: item.title,
                type: item.type,
                duration: item.duration || 0,
                questions: item.type === 'quiz' ? item.questions : undefined,
                isPreview: item.type === 'lecture' ? item.isPreview : undefined
              }}
              contentIndex={idx}
              isFirst={idx === 0}
              isLast={idx === combinedContent.length - 1}
              onEdit={() => {
                if (isLecture(item)) {
                  onEditLecture(item)
                } else if (isQuiz(item)) {
                  onEditQuiz(item)
                }
              }}
              onDelete={() => {
                if (item.type === 'lecture') {
                  onDeleteLecture(item._id)
                } else {
                  onDeleteQuiz(item._id)
                }
              }}
              onMoveUp={() => {
                if (item.type === 'lecture' && onMoveLectureUp) {
                  onMoveLectureUp(chapterId, item._id)
                } else if (item.type === 'quiz' && onMoveQuizUp) {
                  onMoveQuizUp(chapterId, item._id)
                }
              }}
              onMoveDown={() => {
                if (item.type === 'lecture' && onMoveLectureDown) {
                  onMoveLectureDown(chapterId, item._id)
                } else if (item.type === 'quiz' && onMoveQuizDown) {
                  onMoveQuizDown(chapterId, item._id)
                }
              }}
            />
          ))}
        </SortableContext>
      ) : (
        <>
          {combinedContent.map((item, idx) => (
            <ContentItem
              key={`${item.type}-${item._id}`}
              item={{
                _id: item._id,
                title: item.title,
                type: item.type,
                duration: item.duration || 0,
                questions: item.type === 'quiz' ? item.questions : undefined,
                isPreview: item.type === 'lecture' ? item.isPreview : undefined
              }}
              contentIndex={idx}
              isFirst={idx === 0}
              isLast={idx === combinedContent.length - 1}
              onEdit={() => {
                if (isLecture(item)) {
                  onEditLecture(item)
                } else if (isQuiz(item)) {
                  onEditQuiz(item)
                }
              }}
              onDelete={() => {
                if (item.type === 'lecture') {
                  onDeleteLecture(item._id)
                } else {
                  onDeleteQuiz(item._id)
                }
              }}
              onMoveUp={() => {
                if (item.type === 'lecture' && onMoveLectureUp) {
                  onMoveLectureUp(chapterId, item._id)
                } else if (item.type === 'quiz' && onMoveQuizUp) {
                  onMoveQuizUp(chapterId, item._id)
                }
              }}
              onMoveDown={() => {
                if (item.type === 'lecture' && onMoveLectureDown) {
                  onMoveLectureDown(chapterId, item._id)
                } else if (item.type === 'quiz' && onMoveQuizDown) {
                  onMoveQuizDown(chapterId, item._id)
                }
              }}
            />
          ))}
        </>
      )}
    </div>
  )
}

