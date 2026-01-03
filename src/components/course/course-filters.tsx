"use client"

import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, Filter, X, Sparkles } from "lucide-react"
import { useFormStatus } from "react-dom"

interface CourseFiltersProps {
  search?: string
  category?: string
  level?: string
  applyFilters: (formData: FormData) => Promise<void>
}

function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <Button 
      type="submit"
      disabled={pending}
      className="flex-1 sm:flex-initial bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 group/btn"
    >
      {pending ? (
        <>
          <Sparkles className="h-4 w-4 mr-2 animate-spin" />
          Applying...
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4 mr-2 group-hover/btn:rotate-12 transition-transform" />
          Apply Filters
        </>
      )}
    </Button>
  )
}

export function CourseFilters({ 
  search = "", 
  category = "", 
  level = "",
  applyFilters
}: CourseFiltersProps) {
  const hasActiveFilters = search || category || level

  return (
    <form action={applyFilters} className="space-y-5 sm:space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 p-0.5 shadow-lg shadow-blue-500/20">
            <div className="w-full h-full bg-[#0a0d14] rounded-[6px] flex items-center justify-center">
              <Filter className="w-3.5 h-3.5 text-blue-400" />
            </div>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white">Filter Courses</h3>
        </div>
        {hasActiveFilters && (
          <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-lg">
            {[search && 'search', category && 'category', level && 'level'].filter(Boolean).length} active
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Search</label>
          <div className="relative group">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
              <Search className="h-3.5 w-3.5 text-blue-400" />
            </div>
            <Input
              name="search"
              placeholder="Search by title or keyword..."
              defaultValue={search}
              className="pl-11 bg-gray-800/30 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20 hover:bg-gray-800/50 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Category</label>
          <Select
            name="category"
            defaultValue={category}
            options={[
              { value: "", label: "All Categories" },
              { value: "programming", label: "Programming" },
              { value: "design", label: "Design" },
              { value: "business", label: "Business" },
              { value: "marketing", label: "Marketing" },
              { value: "data-science", label: "Data Science" },
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Level</label>
          <Select
            name="level"
            defaultValue={level}
            options={[
              { value: "", label: "All Levels" },
              { value: "beginner", label: "Beginner" },
              { value: "intermediate", label: "Intermediate" },
              { value: "advanced", label: "Advanced" },
            ]}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <SubmitButton />
        <Button 
          type="button"
          variant="outline" 
          onClick={() => window.location.href = '/courses'}
          className="flex-1 sm:flex-initial border-gray-700/50 bg-gray-800/30 text-gray-300 hover:bg-gray-800/50 hover:text-white hover:border-gray-600 transition-all duration-200"
        >
          <X className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>
    </form>
  )
}

