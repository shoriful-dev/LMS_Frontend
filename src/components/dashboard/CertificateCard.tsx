"use client"
import Image from "next/image"

import { Award, Download, Calendar, CheckCircle, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Certificate } from "@/lib/types"

interface CertificateCardProps {
  certificate: Certificate
}

export function CertificateCard({ certificate: cert }: CertificateCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  const handleDownload = () => {
    window.open(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/certificates/download/${cert.certificateId || cert.verificationCode}`,
      '_blank'
    )
  }

  // Type guard to check if course is populated
  const course = typeof cert.course === 'object' ? cert.course : null
  const courseId = typeof cert.course === 'object' ? cert.course._id : cert.course

  return (
    <Card className="group relative overflow-hidden bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 border-gray-800/50 hover:border-emerald-500/40 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 via-transparent to-green-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <CardHeader className="relative z-10">
        {/* Course Thumbnail */}
        {course?.thumbnail?.url ? (
          <div className="relative aspect-video rounded-xl overflow-hidden mb-4 border border-gray-700/50 group-hover:border-emerald-500/30 transition-colors duration-300">
            <Image 
              src={course.thumbnail.url} 
              alt={course.title}
              width={400}
              height={225}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d14] via-transparent to-transparent opacity-60" />
            <div className="absolute top-2.5 right-2.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg shadow-emerald-500/50">
              <CheckCircle className="h-3 w-3" />
              Completed
            </div>
          </div>
        ) : (
          <div className="aspect-video rounded-xl bg-gradient-to-br from-emerald-600/20 to-green-600/20 border border-emerald-500/20 flex items-center justify-center mb-4">
            <Award className="h-16 w-16 text-emerald-400/50" />
          </div>
        )}
        
        <CardTitle className="text-white text-base sm:text-lg font-bold group-hover:text-emerald-400 transition-colors line-clamp-2">
          {course?.title || 'Course'}
        </CardTitle>
        <CardDescription className="flex items-center gap-2 mt-2">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex-shrink-0">
            <Calendar className="h-3 w-3 text-emerald-400" />
          </span>
          <span className="text-gray-400 text-xs sm:text-sm font-medium">
            Completed {formatDate(cert.issueDate)}
          </span>
        </CardDescription>
      </CardHeader>

      <CardContent className="relative z-10 space-y-3">
        {/* Certificate ID */}
        <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-3 hover:bg-gray-800/50 hover:border-emerald-500/30 transition-all duration-200">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1.5">Certificate ID</p>
          <p className="text-sm text-emerald-400 font-mono truncate font-medium">
            {cert.certificateId || cert.verificationCode}
          </p>
        </div>

        {/* Category Badge */}
        {course?.category && (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-lg border border-emerald-500/30 font-medium">
              <Award className="h-3 w-3" />
              {course.category}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={handleDownload}
            className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white border-0 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-200 group/btn"
            size="sm"
          >
            <Download className="h-4 w-4 mr-2 group-hover/btn:translate-y-0.5 transition-transform" />
            Download
          </Button>
          <Link href={`/courses/${courseId}`}>
            <Button
              variant="outline"
              className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 hover:border-emerald-400/50 transition-all duration-200"
              size="sm"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

