"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X, Save } from "lucide-react"

interface Question {
  questionText: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

interface Quiz {
  _id: string
  title: string
  questions: Question[]
}

interface QuizEditModalProps {
  quiz: Quiz | null
  open: boolean
  onClose: () => void
  onSave: (quizId: string, data: { title: string; questions: Question[] }) => Promise<void>
}

export function QuizEditModal({ quiz, open, onClose, onSave }: QuizEditModalProps) {
  const [editData, setEditData] = useState<{ title: string; questions: Question[] }>({
    title: "",
    questions: []
  })

  // Update editData when quiz changes
  useEffect(() => {
    if (quiz) {
      setEditData({
        title: quiz.title,
        questions: quiz.questions.map(q => ({
          ...q,
          explanation: q.explanation || ""
        }))
      })
    }
  }, [quiz])

  const handleSave = async () => {
    if (!quiz) return
    await onSave(quiz._id, editData)
    onClose()
  }

  if (!quiz) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[95vh] overflow-y-auto bg-gradient-to-br from-gray-900/98 via-amber-900/30 to-gray-900/98 border-2 border-amber-500/40 shadow-2xl shadow-amber-500/20">
        <DialogHeader className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md pb-4 border-b border-amber-500/20">
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            Edit Quiz
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-6 px-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-amber-300">Quiz Title</label>
            <Input
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              placeholder="Enter quiz title..."
              className="text-lg h-12 bg-gray-800/50 border-amber-500/30 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          {/* Questions */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-amber-300 flex items-center gap-2">
              <span className="p-1.5 bg-amber-500/20 rounded">
                📝
              </span>
              Questions ({editData.questions.length})
            </label>
            
            <div className="space-y-4">
            {editData.questions.map((question, qIndex) => (
              <div key={qIndex} className="p-6 bg-gradient-to-br from-gray-800/70 to-gray-900/70 rounded-xl space-y-4 border-2 border-amber-500/30 hover:border-amber-500/50 transition-all shadow-lg">
                <div className="flex gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-lg text-white font-bold text-lg flex-shrink-0">
                    {qIndex + 1}
                  </div>
                  <Input
                    placeholder={`Enter question ${qIndex + 1}...`}
                    value={question.questionText}
                    onChange={(e) => {
                      const updated = [...editData.questions]
                      updated[qIndex].questionText = e.target.value
                      setEditData({ ...editData, questions: updated })
                    }}
                    className="flex-1 h-12 text-base bg-gray-700/50 border-amber-500/30 focus:border-amber-500"
                  />
                  {editData.questions.length > 1 && (
                    <Button
                      onClick={() => setEditData({
                        ...editData,
                        questions: editData.questions.filter((_, i) => i !== qIndex)
                      })}
                      size="sm"
                      variant="outline"
                      className="border-red-500/50 bg-red-500/20 text-red-400 hover:bg-red-500/30 h-12 px-4"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  )}
                </div>

                {/* Options */}
                <div className="space-y-3 pl-14">
                  <p className="text-sm font-semibold text-amber-300 flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                    Answer Options
                  </p>
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className={`flex gap-3 items-center p-3 rounded-lg border-2 transition-all ${
                      question.correctAnswer === oIndex 
                        ? 'bg-emerald-500/20 border-emerald-500/50 shadow-lg shadow-emerald-500/20' 
                        : 'bg-gray-700/30 border-gray-600/30 hover:border-amber-500/30'
                    }`}>
                      <input
                        type="radio"
                        name={`question-${qIndex}`}
                        checked={question.correctAnswer === oIndex}
                        onChange={() => {
                          const updated = [...editData.questions]
                          updated[qIndex].correctAnswer = oIndex
                          setEditData({ ...editData, questions: updated })
                        }}
                        className="w-5 h-5 text-emerald-500 cursor-pointer"
                      />
                      <span className="text-xs font-bold text-gray-400 w-6">{String.fromCharCode(65 + oIndex)}.</span>
                      <Input
                        placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                        value={option}
                        onChange={(e) => {
                          const updated = [...editData.questions]
                          updated[qIndex].options[oIndex] = e.target.value
                          setEditData({ ...editData, questions: updated })
                        }}
                        className="flex-1 bg-gray-800/50 border-gray-600/50 focus:border-amber-500 h-10"
                      />
                      {question.options.length > 2 && (
                        <Button
                          onClick={() => {
                            const updated = [...editData.questions]
                            updated[qIndex].options = updated[qIndex].options.filter((_, i) => i !== oIndex)
                            if (updated[qIndex].correctAnswer >= updated[qIndex].options.length) {
                              updated[qIndex].correctAnswer = 0
                            }
                            setEditData({ ...editData, questions: updated })
                          }}
                          size="sm"
                          variant="ghost"
                          className="text-red-400 hover:bg-red-500/20 h-10 px-3"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    onClick={() => {
                      const updated = [...editData.questions]
                      updated[qIndex].options.push("")
                      setEditData({ ...editData, questions: updated })
                    }}
                    size="sm"
                    variant="outline"
                    className="border-amber-500/50 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 h-10"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Option
                  </Button>

                  {/* Explanation */}
                  <div className="space-y-2 mt-3">
                    <label className="text-xs font-semibold text-gray-400 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                      Explanation (optional)
                    </label>
                    <Textarea
                      placeholder="Provide an explanation for this question..."
                      value={question.explanation || ""}
                      onChange={(e) => {
                        const updated = [...editData.questions]
                        updated[qIndex].explanation = e.target.value
                        setEditData({ ...editData, questions: updated })
                      }}
                      rows={3}
                      className="text-sm bg-gray-800/50 border-gray-600/50 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
            </div>
            
            <Button
              onClick={() => setEditData({
                ...editData,
                questions: [...editData.questions, { questionText: "", options: ["", ""], correctAnswer: 0, explanation: "" }]
              })}
              variant="outline"
              className="border-2 border-dashed border-amber-500/40 bg-amber-500/5 text-amber-400 hover:bg-amber-500/15 w-full h-14 text-base"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add New Question
            </Button>
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
              className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-lg shadow-amber-500/30 h-12 px-8 text-base font-semibold"
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

