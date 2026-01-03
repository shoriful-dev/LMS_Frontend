"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, X } from "lucide-react"

interface ArrayFieldInputProps {
  label: string
  placeholder: string
  values: string[]
  onChange: (values: string[]) => void
  icon?: React.ReactNode
}

export function ArrayFieldInput({ label, placeholder, values, onChange, icon }: ArrayFieldInputProps) {
  const addItem = () => {
    onChange([...values, ""])
  }

  const removeItem = (index: number) => {
    const newArray = values.filter((_, i) => i !== index)
    onChange(newArray.length > 0 ? newArray : [""])
  }

  const updateItem = (index: number, value: string) => {
    const newArray = [...values]
    newArray[index] = value
    onChange(newArray)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
          {icon}
          {label}
        </label>
        <Button
          type="button"
          onClick={addItem}
          size="sm"
          variant="outline"
          className="border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
        >
          <Plus className="h-3 w-3 mr-1" />
          Add
        </Button>
      </div>
      <div className="space-y-2">
        {values.map((value, index) => (
          <div key={index} className="flex gap-2">
            <Input
              placeholder={`${placeholder} ${index + 1}`}
              value={value}
              onChange={(e) => updateItem(index, e.target.value)}
              className="flex-1"
            />
            {values.length > 1 && (
              <Button
                type="button"
                onClick={() => removeItem(index)}
                size="sm"
                variant="outline"
                className="border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

