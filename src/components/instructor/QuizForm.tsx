"use client"

import { useState } from "react"
import { CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Save, Plus, X } from "lucide-react"

interface Question {
  questionText: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface QuizFormData {
  title: string
  questions: Question[]
}

interface QuizFormProps {
  initialData?: QuizFormData
  onSave: (data: QuizFormData) => Promise<void>
  onCancel: () => void
  mode: "create" | "edit"
}

export function QuizForm({ initialData, onSave, onCancel, mode }: QuizFormProps) {
  const [formData, setFormData] = useState<QuizFormData>(
    initialData || {
      title: "",
      questions: [{ questionText: "", options: ["", ""], correctAnswer: 0, explanation: "" }]
    }
  )
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      alert("Quiz title is required")
      return
    }

    // Validate all questions
    const hasInvalidQuestion = formData.questions.some(q => 
      !q.questionText.trim() || q.options.some(opt => !opt.trim())
    )

    if (hasInvalidQuestion) {
      alert("Please fill in all questions and options")
      return
    }

    try {
      setIsSaving(true)
      await onSave(formData)
    } catch (error) {
      console.error("Error saving quiz:", error)
      alert("Failed to save quiz")
    } finally {
      setIsSaving(false)
    }
  }

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [...formData.questions, { questionText: "", options: ["", ""], correctAnswer: 0, explanation: "" }]
    })
  }

  const removeQuestion = (index: number) => {
    if (formData.questions.length === 1) return
    setFormData({
      ...formData,
      questions: formData.questions.filter((_, i) => i !== index)
    })
  }

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updated = [...formData.questions]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, questions: updated })
  }

  const addOption = (questionIndex: number) => {
    const updated = [...formData.questions]
    updated[questionIndex].options.push("")
    setFormData({ ...formData, questions: updated })
  }

  const removeOption = (questionIndex: number, optionIndex: number) => {
    if (formData.questions[questionIndex].options.length <= 2) return
    const updated = [...formData.questions]
    updated[questionIndex].options = updated[questionIndex].options.filter((_, i) => i !== optionIndex)
    // Adjust correctAnswer if needed
    if (updated[questionIndex].correctAnswer >= updated[questionIndex].options.length) {
      updated[questionIndex].correctAnswer = 0
    }
    setFormData({ ...formData, questions: updated })
  }

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updated = [...formData.questions]
    updated[questionIndex].options[optionIndex] = value
    setFormData({ ...formData, questions: updated })
  }

  return (
    <CardContent className="relative z-10 border-t border-gray-700/50 pt-4">
      <div className="space-y-4 bg-amber-900/20 p-4 rounded-lg border border-amber-500/20">
        <Input
          placeholder="Quiz title..."
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        
        {/* Questions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-amber-300">Questions</p>
            <Button
              onClick={addQuestion}
              size="sm"
              variant="outline"
              className="border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Question
            </Button>
          </div>
          
          {formData.questions.map((question, qIndex) => (
            <div key={qIndex} className="p-3 bg-gray-800/50 rounded-lg space-y-2 border border-gray-700">
              <div className="flex gap-2">
                <Input
                  placeholder={`Question ${qIndex + 1}...`}
                  value={question.questionText}
                  onChange={(e) => updateQuestion(qIndex, "questionText", e.target.value)}
                  className="flex-1"
                />
                {formData.questions.length > 1 && (
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
                <p className="text-xs text-amber-400 font-semibold">Answer Options:</p>
                {question.options.map((option, oIndex) => (
                  <div key={oIndex} className="flex gap-2 items-center">
                    <input
                      type="radio"
                      name={`question-${qIndex}`}
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
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
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
                  placeholder="Explanation (optional) - Why is this the correct answer?"
                  value={question.explanation || ""}
                  onChange={(e) => updateQuestion(qIndex, "explanation", e.target.value)}
                  rows={2}
                  className="text-sm bg-gray-900/50 border-gray-600 text-white resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">Students will see this after answering</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button 
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : mode === "edit" ? "Update Quiz" : "Save Quiz"}
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

