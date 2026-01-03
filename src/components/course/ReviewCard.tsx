import Image from "next/image"
import { Star } from "lucide-react"

interface Review {
  _id: string
  user: {
    _id: string
    name?: string
    avatar?: {
      url?: string
    }
  }
  rating: number
  comment: string
  createdAt: string
}

interface ReviewCardProps {
  review: Review
  formatDate: (date: string) => string
}

export function ReviewCard({ review, formatDate }: ReviewCardProps) {
  // Safe user data extraction
  const userName = review.user?.name || "Anonymous"
  const userAvatar = review.user?.avatar?.url
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  // Format date
  const timeAgo = formatDate(review.createdAt)

  return (
    <div className="p-4 rounded-xl bg-gradient-to-br from-gray-800/30 to-gray-900/30 border border-gray-700/50 hover:border-cyan-500/20 transition-all duration-300">
      <div className="flex items-start gap-4">
        {userAvatar ? (
          <div className="relative h-12 w-12 rounded-full flex-shrink-0 shadow-lg shadow-cyan-500/20 overflow-hidden">
            <Image
              src={userAvatar}
              alt={userName}
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
        ) : (
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/20">
            <span className="text-white text-lg font-medium">{initials}</span>
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-semibold text-white">{userName}</h4>
              <p className="text-sm text-gray-500">{timeAgo}</p>
            </div>
            <div className="flex items-center gap-1 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3.5 w-3.5 ${
                    star <= review.rating
                      ? "fill-cyan-400 text-cyan-400"
                      : "fill-gray-700 text-gray-700"
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-gray-300 leading-relaxed text-sm">
            {review.comment}
          </p>
        </div>
      </div>
    </div>
  )
}

