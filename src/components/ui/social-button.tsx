import * as React from "react"
import { FaGithub, FaFacebook } from "react-icons/fa"
import { FcGoogle } from "react-icons/fc"
import { cn } from "@/lib/utils"

interface SocialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  provider: "google" | "github" | "facebook"
  isLoading?: boolean
  iconOnly?: boolean
}

const providerConfig = {
  google: {
    name: "Google",
    icon: <FcGoogle className="w-6 h-6" />,
    bgClass: "bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200",
    glassClass: "bg-gray-800 hover:bg-gray-700 border-2 border-gray-700 shadow-lg transition-all duration-200",
  },
  github: {
    name: "GitHub",
    icon: <FaGithub className="w-6 h-6 text-white" />,
    bgClass: "bg-gray-900 hover:bg-gray-800 text-white border-2 border-gray-700",
    glassClass: "bg-gray-800 hover:bg-gray-700 border-2 border-gray-700 shadow-lg transition-all duration-200",
  },
  facebook: {
    name: "Facebook",
    icon: <FaFacebook className="w-6 h-6 text-blue-500" />,
    bgClass: "bg-[#1877F2] hover:bg-[#166fe5] text-white border-2 border-[#1877F2]",
    glassClass: "bg-gray-800 hover:bg-gray-700 border-2 border-gray-700 shadow-lg transition-all duration-200",
  },
}

const SocialButton = React.forwardRef<HTMLButtonElement, SocialButtonProps>(
  ({ className, provider, isLoading, disabled, children, iconOnly = false, ...props }, ref) => {
    const config = providerConfig[provider]
    
    if (iconOnly) {
      return (
        <button
          ref={ref}
          disabled={disabled || isLoading}
          className={cn(
            "inline-flex items-center justify-center rounded-lg p-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F25320] disabled:pointer-events-none disabled:opacity-50 hover:scale-105",
            config.glassClass,
            className
          )}
          {...props}
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            config.icon
          )}
        </button>
      )
    }
    
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center gap-3 w-full rounded-lg px-5 py-3 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F25320] disabled:pointer-events-none disabled:opacity-50 shadow-sm hover:shadow-md",
          config.glassClass,
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>Connecting...</span>
          </>
        ) : (
          <>
            {config.icon}
            <span>{children || `Continue with ${config.name}`}</span>
          </>
        )}
      </button>
    )
  }
)
SocialButton.displayName = "SocialButton"

export { SocialButton }

