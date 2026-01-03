"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FileQuestion, Edit, Trash2, ArrowUp, ArrowDown, Save, X, Plus, GripVertical } from "lucide-react"
import { formatDuration } from "@/lib/utils"

interface Question {
  questionText: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface Quiz {
  _id: string
  title: string
  questions: Question[]
  duration?: number
  order: number
}

interface QuizCardProps {
  quiz: Quiz
  contentIndex: number
  isFirst: boolean
  isLast: boolean
  onEdit: (quizId: string, data: { title: string; questions: Question[] }) => Promise<void>
  onDelete: (quizId: string) => void
  onMoveUp: () => void
  onMoveDown: () => void
}

export function QuizCard({ 
  quiz, 
  contentIndex,
  isFirst,
  isLast,
  onEdit, 
  onDelete,
  onMoveUp,
  onMoveDown
}: QuizCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    title: quiz.title,
    questions: quiz.questions
  })

  const handleSave = async () => {
    try {
      await onEdit(quiz._id, editData)
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating quiz:", error)
    }
  }

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updated = [...editData.questions]
    updated[index] = { ...updated[index], [field]: value }
    setEditData({ ...editData, questions: updated })
  }

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updated = [...editData.questions]
    updated[questionIndex].options[optionIndex] = value
    setEditData({ ...editData, questions: updated })
  }

  const removeQuestion = (index: number) => {
    if (editData.questions.length === 1) return
    setEditData({
      ...editData,
      questions: editData.questions.filter((_, i) => i !== index)
    })
  }

  const addQuestion = () => {
    setEditData({
      ...editData,
      questions: [...editData.questions, { questionText: "", options: ["", ""], correctAnswer: 0, explanation: "" }]
    })
  }

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updated = [...editData.questions]
    if (updated[questionIndex].options.length <= 2) return
    updated[questionIndex].options = updated[questionIndex].options.filter((_, i) => i !== optionIndex)
    if (updated[questionIndex].correctAnswer >= updated[questionIndex].options.length) {
      updated[questionIndex].correctAnswer = 0
    }
    setEditData({ ...editData, questions: updated })
  }

  const addOption = (questionIndex: number) => {
    const updated = [...editData.questions]
    updated[questionIndex].options.push("")
    setEditData({ ...editData, questions: updated })
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border transition-all duration-200 bg-amber-900/20 border-amber-700/50 hover:bg-amber-900/30 hover:border-amber-500/30 hover:shadow-md">
      {/* Drag Handle and Number Badge */}
      <div className="flex items-center gap-2 px-4 py-4 cursor-grab active:cursor-grabbing hover:bg-amber-500/20 rounded-l-lg transition-all border-r-2 border-amber-500/30 hover:border-amber-500 group">
        <GripVertical className="h-6 w-6 text-amber-400 group-hover:text-amber-300 transition-colors flex-shrink-0" />
        <span className="text-xs font-bold text-white bg-amber-500 px-3 py-1.5 rounded shadow-lg min-w-[40px] text-center">
          #{contentIndex + 1}
        </span>
      </div>
      
      {/* Quiz Content */}
      <div className="flex-1 flex items-center gap-3 py-2 pr-3">
        <FileQuestion className="h-5 w-5 text-amber-400 flex-shrink-0" />
        
        {isEditing ? (
          <div className="flex-1 space-y-2">
            <Input
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              placeholder="Quiz title"
            />
            
            {/* Edit Questions */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {editData.questions.map((question, qIndex) => (
                <div key={qIndex} className="p-3 bg-gray-800/50 rounded-lg space-y-2 border border-gray-700">
                  <div className="flex gap-2">
                    <Input
                      placeholder={`Question ${qIndex + 1}...`}
                      value={question.questionText}
                      onChange={(e) => updateQuestion(qIndex, "questionText", e.target.value)}
                      className="flex-1"
                    />
                    {editData.questions.length > 1 && (
                      <Button
                        onClick={() => removeQuestion(qIndex)}
                        size="sm"
                        variant="outline"
                        className="border-red-500/30 bg-red-500/10 text-red-400"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  
                  {/* Options */}
                  <div className="space-y-2 pl-4">
                    <p className="text-xs text-amber-400 font-semibold">Options:</p>
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className="flex gap-2 items-center">
                        <input
                          type="radio"
                          name={`edit-question-${qIndex}`}
                          checked={question.correctAnswer === oIndex}
                          onChange={() => updateQuestion(qIndex, "correctAnswer", oIndex)}
                          className="w-4 h-4 text-amber-500"
                        />
                        <Input
                          placeholder={`Option ${oIndex + 1}`}
                          value={option}
                          onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                          className="flex-1"
                        />
                        {question.options.length > 2 && (
                          <Button
                            onClick={() => removeOption(qIndex, oIndex)}
                            size="sm"
                            variant="ghost"
                            className="text-red-400 hover:text-red-300"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      onClick={() => addOption(qIndex)}
                      size="sm"
                      variant="outline"
                      className="border-amber-500/20 bg-amber-500/5 text-amber-400 text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Option
                    </Button>
                    
                    {/* Explanation */}
                    <Textarea
                      placeholder="Explanation (optional)"
                      value={question.explanation || ""}
                      onChange={(e) => updateQuestion(qIndex, "explanation", e.target.value)}
                      rows={2}
                      className="text-xs bg-gray-900/50 border-gray-600 text-white resize-none"
                    />
                  </div>
                </div>
              ))}
              <Button
                onClick={addQuestion}
                size="sm"
                variant="outline"
                className="border-amber-500/30 bg-amber-500/10 text-amber-400 w-full"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Question
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleSave}
                size="sm"
                className="bg-amber-500 hover:bg-amber-600 text-white"
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
                <p className="text-sm font-medium text-amber-200 truncate">{quiz.title}</p>
                <span className="px-2 py-0.5 text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded flex-shrink-0">
                  Quiz • {quiz.questions.length} questions
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Duration: {formatDuration(quiz.duration || 600)}
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
                  className="h-6 px-2 border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move up"
                >
                  <ArrowUp className="h-3 w-3" />
                </Button>
                <Button 
                  onClick={onMoveDown}
                  disabled={isLast}
                  size="sm"
                  variant="outline"
                  className="h-6 px-2 border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move down"
                >
                  <ArrowDown className="h-3 w-3" />
                </Button>
              </div>
              <Button 
                onClick={() => setIsEditing(true)}
                size="sm"
                variant="outline"
                className="border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button 
                onClick={() => onDelete(quiz._id)}
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

