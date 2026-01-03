"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Save, X } from "lucide-react"

interface ChapterFormProps {
  initialTitle?: string
  onSave: (title: string) => Promise<void>
  onCancel: () => void
  mode: "create" | "edit"
}

export function ChapterForm({ initialTitle = "", onSave, onCancel, mode }: ChapterFormProps) {
  const [title, setTitle] = useState(initialTitle)
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async () => {
    if (!title.trim()) return
    
    try {
      setIsSaving(true)
      await onSave(title.trim())
    } catch (error) {
      console.error("Error saving chapter:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="mb-6 relative overflow-hidden border-violet-500/20 bg-gradient-to-br from-gray-900/90 via-indigo-900/50 to-gray-900/90 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 via-transparent to-purple-600/5 opacity-50"></div>
      <CardContent className="relative z-10 pt-6">
        <div className="flex gap-3">
          <Input
            placeholder="Chapter title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="flex-1"
            autoFocus
          />
          <Button 
            onClick={handleSubmit}
            disabled={!title.trim() || isSaving}
            className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : mode === "edit" ? "Update" : "Save"}
          </Button>
          <Button 
            onClick={onCancel}
            variant="outline"
            className="border-gray-700 text-gray-400 hover:bg-gray-800"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

