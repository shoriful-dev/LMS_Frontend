import { CheckCircle, Star, FileText } from "lucide-react"

interface OverviewTabProps {
  courseInfo?: {
    title?: string
    description?: string
    whatYouWillLearn?: string[]
    category?: string
    level?: string
  }
}

export function OverviewTab({ courseInfo }: OverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* Course Header */}
      <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-gray-800 rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {courseInfo?.title && (
              <h3 className="text-2xl font-bold bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent mb-2">
                {courseInfo.title}
              </h3>
            )}
            {courseInfo?.description && courseInfo.description.trim() ? (
              <p className="text-gray-300 leading-relaxed text-sm">
                {courseInfo.description}
              </p>
            ) : (
              <p className="text-gray-500 leading-relaxed text-sm italic">
                No description available
              </p>
            )}
          </div>
        </div>
        
        {/* Course Meta Info */}
        {(courseInfo?.category || courseInfo?.level) && (
          <div className="flex gap-2">
            {courseInfo.category && (
              <span className="text-xs bg-gray-900/50 text-gray-300 px-3 py-1.5 rounded-full border border-gray-700 backdrop-blur-sm">
                📚 {courseInfo.category}
              </span>
            )}
            {courseInfo.level && (
              <span className="text-xs bg-blue-600/20 text-blue-400 px-3 py-1.5 rounded-full border border-blue-600/30 backdrop-blur-sm">
                🎯 {courseInfo.level}
              </span>
            )}
          </div>
        )}
      </div>
      
      {/* What You'll Learn */}
      {courseInfo?.whatYouWillLearn && courseInfo.whatYouWillLearn.length > 0 && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-blue-400" />
            </div>
            <h4 className="text-lg font-semibold text-white">What You&apos;ll Learn</h4>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {courseInfo.whatYouWillLearn.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-gray-800/30 rounded-lg border border-gray-800/50">
                <CheckCircle className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-300 leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Course Highlights */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 text-center">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center mx-auto mb-2">
            <Star className="h-5 w-5 text-blue-400" />
          </div>
          <p className="text-white font-semibold">Quality Content</p>
          <p className="text-xs text-gray-400 mt-1">Expert-curated curriculum</p>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 text-center">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center mx-auto mb-2">
            <FileText className="h-5 w-5 text-cyan-400" />
          </div>
          <p className="text-white font-semibold">Resources Included</p>
          <p className="text-xs text-gray-400 mt-1">Downloadable materials</p>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 text-center">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center mx-auto mb-2">
            <CheckCircle className="h-5 w-5 text-blue-400" />
          </div>
          <p className="text-white font-semibold">Lifetime Access</p>
          <p className="text-xs text-gray-400 mt-1">Learn at your own pace</p>
        </div>
      </div>
    </div>
  )
}

