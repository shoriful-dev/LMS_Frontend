import { cn } from "@/lib/utils"

export interface Tab {
  key: string
  label: string
  badge?: number | string
}

interface TabNavigationProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (key: string) => void
  className?: string
}

export function TabNavigation({ 
  tabs, 
  activeTab, 
  onTabChange,
  className 
}: TabNavigationProps) {
  return (
    <div className={cn("flex gap-2 overflow-x-auto scrollbar-hide pb-2", className)}>
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
            activeTab === tab.key
              ? "text-white bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/50 shadow-lg"
              : "text-gray-400 hover:text-white hover:bg-gray-800/50 border border-transparent"
          )}
        >
          <span>{tab.label}</span>
          {tab.badge !== undefined && (
            <span className={cn(
              "ml-2 px-2 py-0.5 rounded-full text-xs",
              activeTab === tab.key
                ? "bg-blue-500/30 text-blue-300"
                : "bg-gray-700 text-gray-400"
            )}>
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

