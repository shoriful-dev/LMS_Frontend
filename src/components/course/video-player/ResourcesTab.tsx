import { Download, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"

interface ResourcesTabProps {
  resources?: string | Array<{ url: string; title: string }>
}

export function ResourcesTab({ resources }: ResourcesTabProps) {
  // Parse resources
  let parsedResources: Array<{ url: string; title: string }> = []
  
  if (typeof resources === 'string' && resources.trim()) {
    try {
      const parsed = JSON.parse(resources)
      parsedResources = Array.isArray(parsed) ? parsed : []
    } catch {
      // If not JSON, treat as single URL
      parsedResources = [{ url: resources, title: "Resource" }]
    }
  } else if (Array.isArray(resources)) {
    parsedResources = resources
  }

  if (parsedResources.length === 0) {
    return (
      <EmptyState 
        icon={FileText}
        title="No Resources"
        description="No downloadable resources are available for this lecture"
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-600/30 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="h-5 w-5 text-blue-400" />
          <h4 className="font-semibold text-white">Downloadable Resources</h4>
        </div>
        <p className="text-sm text-gray-400">
          {parsedResources.length} resource{parsedResources.length !== 1 ? 's' : ''} available for this lecture
        </p>
      </div>

      <div className="space-y-3">
        {parsedResources.map((resource, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-gray-900/50 border border-gray-800 rounded-lg hover:border-blue-600/30 transition-colors group"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                <FileText className="h-5 w-5 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {resource.title || `Resource ${index + 1}`}
                </p>
                <p className="text-xs text-gray-500 truncate">{resource.url}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-blue-600/30 text-blue-400 hover:bg-blue-900/20 hover:border-blue-500 flex-shrink-0"
              onClick={() => window.open(resource.url, '_blank')}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        ))}
      </div>

      {/* Download All Button */}
      {parsedResources.length > 1 && (
        <Button
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
          onClick={() => {
            parsedResources.forEach(r => window.open(r.url, '_blank'))
          }}
        >
          <Download className="h-4 w-4 mr-2" />
          Download All Resources
        </Button>
      )}
    </div>
  )
}

