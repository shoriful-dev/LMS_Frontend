"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Users, Mail, Search } from "lucide-react"
import Image from "next/image"

interface StudentCourse {
  courseId: string
  courseTitle: string
  enrolledAt: string
  amountPaid: number
  paymentStatus: string
  completionPercentage: number
  isCompleted: boolean
}

interface Student {
  _id: string
  name: string
  email: string
  avatar?: string
  joinedAt: string
  courses: StudentCourse[]
  totalEnrolled: number
  totalCompleted: number
  totalRevenue: number
}

interface StudentsData {
  students: Student[]
  totalStudents: number
  totalEnrollments: number
  courseMap: Record<string, string>
}

interface InstructorStudentsClientProps {
  studentsData: StudentsData
}

export function InstructorStudentsClient({ studentsData }: InstructorStudentsClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCourse, setSelectedCourse] = useState<string>("all")

  // Safely extract data
  const students = studentsData?.students || []
  const courseMap = studentsData?.courseMap || {}

  if (students.length === 0) {
    return (
      <div className="w-full max-w-7xl py-10">
        <div className="text-center py-12 px-4">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-full blur-2xl opacity-50" />
            <div className="relative w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 flex items-center justify-center">
              <Users className="h-10 w-10 text-gray-500" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No students yet</h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Students who enroll in your courses will appear here
          </p>
        </div>
      </div>
    )
  }

  // Filter students
  const filteredStudents = students.filter((student: any) => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (selectedCourse === "all") return matchesSearch
    
    return matchesSearch && student.courses.some((c: any) => c.courseId === selectedCourse)
  })


  return (
    <div className="w-full max-w-7xl py-6 sm:py-8 lg:py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">My Students</h1>
        <p className="text-gray-400">View and manage your student community</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl text-white">{studentsData?.totalStudents || students.length}</CardTitle>
            <CardDescription className="text-gray-400">Total Students</CardDescription>
          </CardHeader>
        </Card>
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl text-white">{studentsData?.totalEnrollments || 0}</CardTitle>
            <CardDescription className="text-gray-400">Total Enrollments</CardDescription>
          </CardHeader>
        </Card>
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl text-white">
              {students.reduce((sum: number, s: any) => sum + (s.totalCompleted || 0), 0)}
            </CardTitle>
            <CardDescription className="text-gray-400">Completed Courses</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <Input
            placeholder="Search students by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-900/50 border-gray-800 text-white placeholder:text-gray-500"
          />
        </div>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-violet-500"
        >
          <option value="all">All Courses</option>
          {Object.entries(courseMap).map(([id, title]) => (
            <option key={id} value={id}>{String(title)}</option>
          ))}
        </select>
      </div>

      {/* Students Grid */}
      {filteredStudents.length === 0 ? (
        <div className="text-center py-12 px-4">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-full blur-2xl opacity-50" />
            <div className="relative w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 flex items-center justify-center">
              <Users className="h-10 w-10 text-gray-500" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No students found</h3>
          <p className="text-gray-400">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student: any) => (
            <Card key={student._id} className="bg-gray-900/50 border-gray-800 hover:border-violet-500/50 transition-all">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  {student.avatar?.url ? (
                    <Image
                      src={student.avatar?.url }
                      alt={student.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-white text-lg">{student.name}</CardTitle>
                    <CardDescription className="text-gray-400 text-sm flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {student.email}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Enrolled Courses</span>
                  <span className="text-white font-semibold">{student.totalEnrolled}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Completed</span>
                  <span className="text-green-400 font-semibold">{student.totalCompleted}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Revenue</span>
                  <span className="text-white font-semibold">${student.totalRevenue}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

