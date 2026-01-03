import { Award, TrendingUp } from "lucide-react"

interface CourseHeaderProps {
  courseTitle: string
  progressPercentage: number
}

/**
 * CourseHeader - Server Component
 * Displays course title and progress bar
 * No client-side interactivity needed
 */
export function CourseHeader({ courseTitle, progressPercentage }: CourseHeaderProps) {
  const isCompleted = progressPercentage >= 100
  
  return (
    <div className="bg-[#0a0d14] border-b border-gray-800/50 p-3 sm:p-4 md:p-6 sticky top-0 z-20 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex-1 max-w-5xl mx-auto">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white truncate">{courseTitle}</h1>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mt-2 sm:mt-3">
              <div className="flex items-center gap-2 flex-shrink-0">
                {isCompleted ? (
                  <Award className="h-4 w-4 text-[#F25320]" />
                ) : (
                  <TrendingUp className="h-4 w-4 text-blue-400" />
                )}
                <p className="text-xs sm:text-sm text-gray-400 font-medium whitespace-nowrap">
                  {isCompleted ? 'Completed' : `${progressPercentage}% Complete`}
                </p>
              </div>
              <div className="w-full sm:flex-1 sm:max-w-md h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ease-out ${
                    isCompleted 
                      ? 'bg-[#F25320]' 
                      : 'bg-gradient-to-r from-blue-600 to-cyan-600'
                  }`}
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

