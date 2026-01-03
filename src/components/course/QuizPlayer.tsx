"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Check } from "lucide-react"
import type { ChapterContent } from "@/lib/types"
import { NavigationButtons } from "@/components/shared"

// Type alias for backward compatibility
type CourseContent = ChapterContent

interface QuizPlayerProps {
  content: CourseContent
  isCompleted: boolean
  onQuizSubmit: (quizId: string, answers: number[]) => Promise<any>
  accessToken: string
  // Navigation controls
  onNext?: () => void
  onPrev?: () => void
  canNext?: boolean
  canPrev?: boolean
}

export function QuizPlayer({ content, isCompleted, onQuizSubmit, onNext, onPrev, canNext, canPrev }: QuizPlayerProps) {
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)

  const handleSubmit = async () => {
    if (!content.quizId) return
    
    // Validate all questions are answered
    const questionCount = content.questions?.length || 0
    if (Object.keys(answers).length !== questionCount) {
      setSubmitError("Please answer all questions before submitting")
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)
    
    try {
      // Convert answers object to array format
      const answersArray = Array.from({ length: questionCount }, (_, i) => answers[i])
      const result = await onQuizSubmit(content.quizId, answersArray)
      setResult(result)
    } catch (error: any) {
      setSubmitError(error.message || "Failed to submit quiz")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRetry = () => {
    setAnswers({})
    setResult(null)
    setSubmitError(null)
  }

  const handleAnswerChange = (questionIndex: number, optionIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }))
  }

  // Check if quiz is completed (either from backend or scored 100%)
  const isQuizCompleted = isCompleted || result?.data?.score === 100

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Card className="bg-[#0a0d14] border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <span>{content.lectureTitle || content.title || 'Quiz'}</span>
          {isQuizCompleted && (
            <span className="flex items-center text-green-400 text-base font-normal">
              <CheckCircle className="h-4 w-4 mr-2" />
              Completed
            </span>
          )}
        </CardTitle>
        <CardDescription className="text-gray-400">
          {content.questionCount || content.questions?.length || 0} questions • You must score 100% to complete this quiz
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {content.questions?.map((question, qIndex) => {
            const userAnswer = answers[qIndex]
            const correctAnswer = question.correctAnswer
            const isAnswered = result !== null
            const isCorrect = isAnswered && userAnswer === correctAnswer
            
            return (
              <div key={question._id} className={`border rounded-xl p-5 transition-all ${
                isAnswered ? (isCorrect ? 'border-green-600/50 bg-green-900/20' : 'border-red-600/50 bg-red-900/20') : 'border-gray-800 bg-gray-900/30'
              }`}>
                <div className="flex items-start justify-between mb-4">
                  <p className="font-medium flex-1 text-white text-lg">
                    {qIndex + 1}. {question.questionText}
                  </p>
                  {isAnswered && (
                    <div className="ml-3">
                      {isCorrect ? (
                        <CheckCircle className="h-6 w-6 text-green-400" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-400" />
                      )}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  {question.options.map((option, oIndex) => {
                    const isUserAnswer = userAnswer === oIndex
                    const isCorrectOption = correctAnswer === oIndex
                    const showFeedback = isAnswered
                    
                    let optionClasses = "flex items-center p-4 border rounded-lg transition-all"
                    let iconColor = ""
                    let textColor = "text-gray-300"
                    
                    if (showFeedback) {
                      if (isCorrectOption) {
                        optionClasses += " bg-green-900/30 border-green-600/50"
                        iconColor = "text-green-400"
                        textColor = "text-green-100"
                      } else if (isUserAnswer && !isCorrectOption) {
                        optionClasses += " bg-red-900/30 border-red-600/50"
                        iconColor = "text-red-400"
                        textColor = "text-red-100"
                      } else {
                        optionClasses += " bg-gray-800/30 border-gray-700/50"
                        textColor = "text-gray-400"
                      }
                    } else {
                      optionClasses += " bg-gray-800/30 border-gray-700 hover:bg-gray-800/50 hover:border-blue-600/50 cursor-pointer"
                      if (isUserAnswer) {
                        optionClasses += " border-blue-600/50 bg-blue-900/20"
                        textColor = "text-blue-100"
                      }
                    }
                    
                    return (
                      <label
                        key={oIndex}
                        className={optionClasses}
                      >
                        <input
                          type="radio"
                          name={`question-${qIndex}`}
                          checked={userAnswer === oIndex}
                          onChange={() => handleAnswerChange(qIndex, oIndex)}
                          className="mr-3 accent-blue-600"
                          disabled={isQuizCompleted || isSubmitting || result !== null}
                        />
                        <span className={`flex-1 ${textColor} ${showFeedback ? 'font-medium' : ''}`}>
                          {option}
                        </span>
                        {showFeedback && isCorrectOption && (
                          <Check className={`h-5 w-5 ml-2 ${iconColor}`} />
                        )}
                        {showFeedback && isUserAnswer && !isCorrectOption && (
                          <XCircle className={`h-5 w-5 ml-2 ${iconColor}`} />
                        )}
                      </label>
                    )
                  })}
                </div>
                
                {/* Show explanation after submission if available */}
                {isAnswered && question.explanation && (
                  <div className="mt-4 p-4 bg-blue-900/20 border border-blue-600/30 rounded-lg">
                    <p className="text-sm font-semibold text-blue-300 mb-1">📚 Explanation:</p>
                    <p className="text-sm text-gray-300 leading-relaxed">{question.explanation}</p>
                  </div>
                )}
                
                {/* Show what the correct answer was if user got it wrong */}
                {isAnswered && !isCorrect && (
                  <div className="mt-3 text-sm">
                    <p className="text-gray-300">
                      <span className="font-semibold text-green-400">Correct answer:</span> {question.options[correctAnswer]}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
          
          {submitError && (
            <div className="p-4 bg-red-900/20 border border-red-600/50 rounded-lg text-red-400">
              {submitError}
            </div>
          )}
          
          {result && result.data && (
            <div className={`p-5 border rounded-xl ${
              result.data.score === 100 
                ? "bg-green-900/20 border-green-600/50" 
                : "bg-orange-900/20 border-orange-600/50"
            }`}>
              <p className={`font-semibold text-lg ${
                result.data.score === 100 
                  ? "text-green-400" 
                  : "text-orange-400"
              }`}>
                {result.data.score === 100 
                  ? "🎉 Perfect Score! Quiz Completed!" 
                  : "Quiz Submitted - Review Your Answers!"}
              </p>
              {result.data.score !== undefined && (
                <p className={`mt-2 ${
                  result.data.score === 100 
                    ? "text-green-300" 
                    : "text-orange-300"
                }`}>
                  Score: {result.data.score}% ({result.data.correctAnswers || 0}/{result.data.totalQuestions || 0} correct)
                </p>
              )}
              {result.data.score < 100 && (
                <div className="mt-4 space-y-3">
                  <p className="text-orange-300 text-sm font-medium">
                    💡 Review the feedback above to understand your mistakes:
                  </p>
                  <ul className="text-gray-300 text-sm list-disc list-inside space-y-1">
                    <li>✅ Green highlights show correct answers</li>
                    <li>❌ Red highlights show incorrect choices</li>
                    <li>📚 Read the explanations to learn more</li>
                  </ul>
                  <p className="text-orange-300 mt-2 text-sm font-medium">
                    You need 100% to complete this quiz. Click &quot;Retry Quiz&quot; when ready!
                  </p>
                </div>
              )}
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4">
            <NavigationButtons 
              onPrev={onPrev}
              onNext={onNext}
              canPrev={canPrev}
              canNext={canNext}
            />
            <div className="flex gap-3">
              {result && result.data?.score < 100 && !isQuizCompleted ? (
                <Button 
                  onClick={handleRetry} 
                  variant="outline"
                  className="w-full sm:w-auto border-orange-600/50 text-orange-400 hover:bg-orange-900/20 hover:border-orange-500"
                >
                  Retry Quiz
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit} 
                  disabled={isQuizCompleted || isSubmitting || result !== null}
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : isQuizCompleted ? "✓ Quiz Completed" : "Submit Quiz"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    </div>
  )
}

