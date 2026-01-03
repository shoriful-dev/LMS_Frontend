import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface NavigationButtonsProps {
  onPrev?: () => void
  onNext?: () => void
  canPrev?: boolean
  canNext?: boolean
  className?: string
}

export function NavigationButtons({ 
  onPrev, 
  onNext, 
  canPrev = false, 
  canNext = false,
  className = ""
}: NavigationButtonsProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {onPrev && (
        <Button
          onClick={onPrev}
          variant="outline"
          disabled={!canPrev}
          size="sm"
          className="border-gray-700 text-gray-300 hover:bg-gray-900 hover:text-white disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Prev
        </Button>
      )}
      {onNext && (
        <Button
          onClick={onNext}
          variant="outline"
          disabled={!canNext}
          size="sm"
          className="border-gray-700 text-gray-300 hover:bg-gray-900 hover:text-white disabled:opacity-50"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      )}
    </div>
  )
}

