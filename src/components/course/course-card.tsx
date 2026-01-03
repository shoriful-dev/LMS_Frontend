import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Clock, Users, BookOpen, Sparkles, ArrowRight } from "lucide-react"
import type { Course } from "@/lib/types"
import { formatDuration } from "@/lib/utils"

interface CourseCardProps {
  course: Course
}

export function CourseCard({ course }: CourseCardProps) {
  const discountedPrice = course.discount > 0 
    ? course.price * (1 - course.discount / 100) 
    : course.price

  return (
    <Link href={`/courses/${course._id}`} className="group block">
      <Card className="relative overflow-hidden bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 border-gray-800/50 hover:border-blue-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 hover:scale-[1.02] h-full flex flex-col">
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-cyan-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Thumbnail Section with Overlay */}
        <div className="relative aspect-video bg-gradient-to-br from-blue-600/20 to-cyan-600/20 overflow-hidden">
          {course.thumbnail.url ? (
            <>
              <Image
                src={course.thumbnail.url}
                alt={course.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={false}
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <BookOpen className="h-12 w-12 text-white/80" />
            </div>
          )}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d14] via-transparent to-transparent opacity-60"></div>
          
          {/* Badge Overlay - Only Featured or Category */}
          <div className="absolute top-2.5 left-2.5 z-10">
            {course.isFeatured ? (
              <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-0 shadow-lg shadow-blue-500/50 text-xs font-bold px-2.5 py-1">
                <Sparkles className="w-3 h-3 mr-1 inline-block" />
                Featured
              </Badge>
            ) : (
              <Badge variant="default" className="bg-gray-900/90 text-white border border-gray-700/50 hover:bg-gray-900 backdrop-blur-sm shadow-lg text-xs px-2.5 py-1">
                {course.category}
              </Badge>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="relative z-10 flex-1 flex flex-col p-4 sm:p-5">
          {/* Title */}
          <h3 className="text-base sm:text-lg font-bold text-white line-clamp-2 mb-2 group-hover:text-blue-400 transition-colors">
            {course.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-gray-400 line-clamp-2 mb-3 flex-grow">
            {course.description}
          </p>

          {/* Stats Row */}
          <div className="flex items-center gap-3 sm:gap-4 mb-3 pb-3 border-b border-gray-800/50">
            <div className="flex items-center text-xs text-gray-400">
              <div className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mr-1.5">
                <Clock className="h-3 w-3 text-blue-400" />
              </div>
              <span className="font-medium">
                {formatDuration(Math.floor((course.totalDuration || 0)))}
              </span>
            </div>
            <div className="flex items-center text-xs text-gray-400">
              <div className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mr-1.5">
                <Users className="h-3 w-3 text-cyan-400" />
              </div>
              <span className="font-medium">{course.enrollmentCount || 0}</span>
            </div>
            {course.averageRating > 0 && (
              <div className="flex items-center text-xs text-gray-400">
                <div className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mr-1.5">
                  <Star className="h-3 w-3 fill-cyan-400 text-cyan-400" />
                </div>
                <span className="font-bold text-white">{course.averageRating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Footer - Instructor & Price */}
          <div className="flex items-center justify-between">
            {/* Instructor */}
            <div className="flex items-center min-w-0 flex-1 mr-2">
              {typeof course.instructor === 'object' && course.instructor?.avatar?.url ? (
                <div className="relative h-6 w-6 mr-1.5 flex-shrink-0">
                  <Image
                    src={course.instructor.avatar.url}
                    alt={course.instructor?.name || 'Instructor'}
                    fill
                    className="rounded-full object-cover ring-1 ring-gray-700"
                    sizes="24px"
                  />
                </div>
              ) : (
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mr-1.5 flex-shrink-0">
                  <span className="text-white text-[10px] font-bold">
                    {typeof course.instructor === 'object' && course.instructor?.name ? course.instructor.name.charAt(0) : 'I'}
                  </span>
                </div>
              )}
              <span className="text-xs sm:text-[11px] text-gray-400 font-medium truncate">
                {typeof course.instructor === 'object' && course.instructor?.name ? course.instructor.name : 'Instructor'}
              </span>
            </div>

            {/* Price */}
            <div className="flex flex-col items-end flex-shrink-0">
              {course.discount > 0 && course.price > 0 && (
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-xs sm:text-sm text-gray-500 line-through">
                    ${course.price.toFixed(2)}
                  </span>
                  <span className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-1.5 py-0.5 rounded-md text-[9px] font-bold">
                    {course.discount}% OFF
                  </span>
                </div>
              )}
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                ${discountedPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Hover CTA */}
        <div className="relative z-10 px-4 sm:px-5 pb-4 sm:pb-5">
          <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/25 group-hover:shadow-xl group-hover:shadow-blue-500/40 transition-all duration-300 text-sm border-0 group/btn">
            View Details
            <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform inline-block" />
          </Button>
        </div>
      </Card>
    </Link>
  )
}

