"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Upload, X } from "lucide-react"
import Image from "next/image"
import { ArrayFieldInput } from "./ArrayFieldInput"

interface CourseFormData {
  title: string
  description: string
  category: string
  level: string
  price: string
  discount: string
  thumbnail: string
  stacks: string[]
  requirements: string[]
  whatYouWillLearn: string[]
  status?: "draft" | "published" | "archived"
}

interface CourseFormFieldsProps {
  formData: CourseFormData
  onChange: (data: Partial<CourseFormData>) => void
  imagePreview?: string
  isUploading?: boolean
  onImageUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveImage?: () => void
  showStatus?: boolean
}

export function CourseFormFields({
  formData,
  onChange,
  imagePreview,
  isUploading = false,
  onImageUpload,
  onRemoveImage,
  showStatus = false
}: CourseFormFieldsProps) {
  return (
    <div className="space-y-6">
      <Input
        label="Course Title"
        placeholder="e.g., Complete Web Development Bootcamp"
        value={formData.title}
        onChange={(e) => onChange({ title: e.target.value })}
        required
      />

      <Textarea
        label="Course Description"
        placeholder="Describe what students will learn in this course..."
        value={formData.description}
        onChange={(e) => onChange({ description: e.target.value })}
        required
        rows={5}
      />

      <div className="grid md:grid-cols-2 gap-4">
        <Select
          label="Category"
          value={formData.category}
          onChange={(e) => onChange({ category: e.target.value })}
          options={[
            { value: "programming", label: "Programming" },
            { value: "web-development", label: "Web Development" },
            { value: "mobile-development", label: "Mobile Development" },
            { value: "data-science", label: "Data Science" },
            { value: "machine-learning", label: "Machine Learning & AI" },
            { value: "design", label: "Design" },
            { value: "ui-ux", label: "UI/UX Design" },
            { value: "graphic-design", label: "Graphic Design" },
            { value: "business", label: "Business" },
            { value: "marketing", label: "Marketing" },
            { value: "finance", label: "Finance & Accounting" },
            { value: "photography", label: "Photography & Video" },
            { value: "music", label: "Music" },
            { value: "health-fitness", label: "Health & Fitness" },
            { value: "personal-development", label: "Personal Development" },
            { value: "office-productivity", label: "Office Productivity" },
            { value: "teaching", label: "Teaching & Academics" },
            { value: "lifestyle", label: "Lifestyle" },
          ]}
        />

        <Select
          label="Level"
          value={formData.level}
          onChange={(e) => onChange({ level: e.target.value })}
          options={[
            { value: "beginner", label: "Beginner" },
            { value: "intermediate", label: "Intermediate" },
            { value: "advanced", label: "Advanced" },
          ]}
        />
      </div>

      <div className={`grid ${showStatus ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4`}>
        <Input
          label="Price ($)"
          type="number"
          min="0"
          step="0.01"
          placeholder="29.99"
          value={formData.price}
          onChange={(e) => onChange({ price: e.target.value })}
          required
        />

        <Input
          label="Discount (%)"
          type="number"
          min="0"
          max="100"
          placeholder="10"
          value={formData.discount}
          onChange={(e) => onChange({ discount: e.target.value })}
        />

        {showStatus && formData.status && (
          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => onChange({ status: e.target.value as "draft" | "published" | "archived" })}
            options={[
              { value: "draft", label: "Draft" },
              { value: "published", label: "Published" },
              { value: "archived", label: "Archived" },
            ]}
          />
        )}
      </div>

      {/* Thumbnail Upload */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          Course Thumbnail
        </label>
        
        {imagePreview || formData.thumbnail ? (
          <div className="relative w-full h-64 rounded-lg overflow-hidden border border-violet-500/20 bg-gray-800/30">
            <Image
              src={imagePreview || formData.thumbnail}
              alt="Course thumbnail preview"
              fill
              className="object-cover"
            />
            {onRemoveImage && (
              <button
                type="button"
                onClick={onRemoveImage}
                className="absolute top-2 right-2 p-2 bg-red-500/90 hover:bg-red-600 text-white rounded-lg transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-violet-500/30 rounded-lg cursor-pointer bg-gray-800/30 hover:bg-gray-800/50 transition-all">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <div className="p-4 bg-gradient-to-br from-violet-500 to-purple-500 rounded-full mb-4">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <p className="mb-2 text-sm text-gray-300">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG or WEBP (MAX. 5MB)</p>
                {isUploading && (
                  <div className="mt-4">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
                    <p className="text-sm text-violet-400 mt-2">Processing...</p>
                  </div>
                )}
              </div>
              {onImageUpload && (
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={onImageUpload}
                  disabled={isUploading}
                />
              )}
            </label>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-gray-900 text-gray-500">OR</span>
              </div>
            </div>

            <Input
              placeholder="Enter image URL (optional)"
              type="url"
              value={formData.thumbnail.startsWith('data:') ? '' : formData.thumbnail}
              onChange={(e) => {
                onChange({ thumbnail: e.target.value })
              }}
            />
          </div>
        )}
        <p className="text-xs text-gray-500 mt-2">
          Upload an image (will be sent as base64 to backend) or enter URL. {!showStatus && "Leave empty to use default thumbnail."}
        </p>
      </div>

      {/* Stacks/Technologies */}
      <ArrayFieldInput
        label="Stacks/Technologies"
        placeholder="e.g., Node.js"
        values={formData.stacks}
        onChange={(values) => onChange({ stacks: values })}
      />

      {/* Requirements */}
      <ArrayFieldInput
        label="Requirements"
        placeholder="e.g., JavaScript ES6+ knowledge"
        values={formData.requirements}
        onChange={(values) => onChange({ requirements: values })}
      />

      {/* What You Will Learn */}
      <ArrayFieldInput
        label="What You Will Learn"
        placeholder="e.g., Express.js framework and middleware"
        values={formData.whatYouWillLearn}
        onChange={(values) => onChange({ whatYouWillLearn: values })}
      />
    </div>
  )
}

