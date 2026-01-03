"use client"
import Image from "next/image"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  BookOpen, 
  GraduationCap, 
  Trophy,
  MessageSquare,
  Settings,
  BarChart,
  Users,
  FileText,
  Tag,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles
} from "lucide-react"
import { useSession } from "@/lib/hooks/use-session"
import { useEffect, useState } from "react"

interface SidebarProps {
  type: "student" | "instructor" | "admin"
  isMobileOpen?: boolean
  onMobileClose?: () => void
}

export function Sidebar({ type, isMobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname()
  const { user } = useSession()
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Persist collapse state across pages/sessions
  useEffect(() => {
    try {
      const saved = localStorage.getItem("sidebar:collapsed")
      if (saved !== null) {
        setIsCollapsed(saved === "1")
      }
    } catch {}
  }, [])

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => {
      const next = !prev
      try {
        localStorage.setItem("sidebar:collapsed", next ? "1" : "0")
      } catch {}
      return next
    })
  }

  // Dispatch event after state update completes
  useEffect(() => {
    try {
      window.dispatchEvent(new CustomEvent('sidebar-toggle', { detail: { collapsed: isCollapsed } }))
    } catch {}
  }, [isCollapsed])

  const isActive = (path: string) => {
    if (path === "/dashboard" || path === "/instructor" || path === "/admin") {
      return pathname === path
    }
    return pathname === path || pathname.startsWith(path + "/")
  }

  const studentLinks = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard", badge: null },
    { href: "/dashboard/courses", icon: BookOpen, label: "My Courses", badge: null },
    { href: "/dashboard/progress", icon: BarChart, label: "Progress", badge: null },
    { href: "/dashboard/certificates", icon: Trophy, label: "Certificates", badge: null },
    { href: "/dashboard/discussions", icon: MessageSquare, label: "Discussions", badge: null },
  ]

  const instructorLinks = [
    { href: "/instructor", icon: LayoutDashboard, label: "Dashboard", badge: null },
    { href: "/instructor/courses", icon: BookOpen, label: "My Courses", badge: null },
    { href: "/instructor/analytics", icon: BarChart, label: "Analytics", badge: null },
    { href: "/instructor/students", icon: Users, label: "Students", badge: null },
    { href: "/instructor/reviews", icon: MessageSquare, label: "Reviews", badge: null },
  ]

  const adminLinks = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard", badge: null },
    { href: "/admin/users", icon: Users, label: "Users", badge: null },
    { href: "/admin/courses", icon: BookOpen, label: "Courses", badge: null },
    { href: "/admin/enrollments", icon: GraduationCap, label: "Enrollments", badge: null },
    { href: "/admin/coupons", icon: Tag, label: "Coupons", badge: null },
    { href: "/admin/reports", icon: FileText, label: "Reports", badge: null },
    { href: "/admin/settings", icon: Settings, label: "Settings", badge: null },
  ]

  const links = 
    type === "student" ? studentLinks : 
    type === "instructor" ? instructorLinks : 
    adminLinks

  const roleConfig = {
    student: { 
      color: "from-blue-500 to-cyan-500", 
      gradient: "from-blue-600/20 via-cyan-600/20 to-blue-600/20",
      shadow: "shadow-blue-500/20",
      border: "border-blue-500/30",
      icon: GraduationCap 
    },
    instructor: { 
      color: "from-violet-500 to-purple-500", 
      gradient: "from-violet-600/20 via-purple-600/20 to-violet-600/20",
      shadow: "shadow-violet-500/20",
      border: "border-violet-500/30",
      icon: Sparkles 
    },
    admin: { 
      color: "from-rose-500 to-orange-500", 
      gradient: "from-rose-600/20 via-orange-600/20 to-rose-600/20",
      shadow: "shadow-rose-500/20",
      border: "border-rose-500/30",
      icon: Settings 
    },
  }

  const config = roleConfig[type]
  const RoleIcon = config.icon

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-40 md:hidden animate-in fade-in duration-200"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50
          ${isCollapsed ? 'w-64 md:w-20' : 'w-64 md:w-72'}
          transform transition-all duration-300 ease-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-screen bg-gradient-to-b from-[#0a0d14] via-[#0f1218] to-[#0a0d14] border-r border-gray-800/50 shadow-2xl">
          
          {/* Logo/Brand Section */}
          <div className="relative px-4 lg:px-6 pt-12 pb-4">
            <div className={`flex items-center gap-3 transition-all duration-300 ${isCollapsed && !isMobileOpen ? 'justify-center' : ''}`}>
              <div className={`relative flex-shrink-0 ${isCollapsed && !isMobileOpen ? '' : ''}`}>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.color} p-0.5 shadow-lg ${config.shadow}`}>
                  <div className="w-full h-full bg-[#0a0d14] rounded-[10px] flex items-center justify-center">
                    <RoleIcon className="w-5 h-5 text-white" />
                  </div>
                </div>
                {/* Pulse effect */}
                <div className={`absolute inset-0 w-10 h-10 rounded-xl bg-gradient-to-br ${config.color} opacity-0 group-hover:opacity-30 animate-pulse`}></div>
              </div>
              
              {(!isCollapsed || isMobileOpen) && (
                <div className="flex flex-col overflow-hidden">
                  <span className="text-white font-bold text-lg tracking-tight truncate">
                    CodeTutor LMS
                  </span>
                  <span className={`text-xs font-medium bg-gradient-to-r ${config.color} bg-clip-text text-transparent capitalize`}>
                    {type} Portal
                  </span>
                </div>
              )}
            </div>

            {/* Desktop Toggle Button */}
            <button
              type="button"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              onClick={toggleCollapsed}
              className={`
                hidden md:flex
                absolute top-12 right-4
                w-6 h-6 rounded-full 
                bg-gradient-to-br ${config.color} 
                items-center justify-center
                text-white shadow-lg ${config.shadow}
                hover:scale-110 active:scale-95
                transition-all duration-200
                border border-gray-800
              `}
            >
              {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
            </button>

            {/* Mobile Close Button */}
            {isMobileOpen && (
              <button
                type="button"
                aria-label="Close menu"
                onClick={onMobileClose}
                className="
                  md:hidden flex
                  absolute top-12 -right-3
                  w-6 h-6 rounded-full 
                  bg-gradient-to-br from-gray-600 to-gray-700
                  items-center justify-center
                  text-white shadow-lg
                  hover:scale-110 active:scale-95
                  transition-all duration-200
                  border border-gray-800
                "
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Navigation Section */}
          <div className="flex-1 px-3 lg:px-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
            {/* Section Label */}
            {(!isCollapsed || isMobileOpen) && (
              <div className="px-3 mb-3">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Menu
                </span>
              </div>
            )}

            <nav className="space-y-1.5">
              {links.map((link, index) => {
                const Icon = link.icon
                const active = isActive(link.href)
                
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => {
                      if (onMobileClose && isMobileOpen) {
                        onMobileClose()
                      }
                    }}
                    title={isCollapsed && !isMobileOpen ? link.label : undefined}
                    className={`
                      group relative flex items-center gap-3
                      px-3 py-3 rounded-xl
                      font-medium text-sm
                      transition-all duration-200
                      ${active 
                        ? `bg-gradient-to-r ${config.gradient} text-white border ${config.border} shadow-lg ${config.shadow}` 
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/40 border border-transparent'
                      }
                      ${isCollapsed && !isMobileOpen ? 'justify-center' : ''}
                    `}
                    style={{
                      animationDelay: `${index * 50}ms`
                    }}
                  >
                    {/* Active Indicator */}
                    {active && (
                      <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b ${config.color} rounded-r-full`}></div>
                    )}

                    <Icon
                      className={`
                        flex-shrink-0 w-5 h-5
                        transition-all duration-200
                        ${active 
                          ? `${config.color.includes('blue') ? 'text-blue-400' : config.color.includes('violet') ? 'text-violet-400' : 'text-rose-400'}` 
                          : 'text-gray-500 group-hover:text-gray-300'
                        }
                        ${active ? 'scale-110' : 'group-hover:scale-105'}
                      `}
                    />
                    
                    {(!isCollapsed || isMobileOpen) && (
                      <>
                        <span className="truncate flex-1">
                          {link.label}
                        </span>
                        {link.badge && (
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full bg-gradient-to-r ${config.color} text-white`}>
                            {link.badge}
                          </span>
                        )}
                      </>
                    )}

                    {/* Hover glow effect */}
                    {!active && (
                      <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${config.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`}></div>
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* User Profile Section */}
          <div className="p-3 lg:p-4 border-t border-gray-800/50">
            {user && (
              <div className={`
                flex items-center gap-3 p-3 rounded-xl
                bg-gray-800/30 border border-gray-800/50
                hover:bg-gray-800/50 hover:border-gray-700/50
                transition-all duration-200 cursor-pointer
                ${isCollapsed && !isMobileOpen ? 'justify-center' : ''}
              `}>
                <div className="relative flex-shrink-0">
                  {user.avatar ? (
                    <Image 
                      src={user.avatar} 
                      alt={user.name} 
                      width={36}
                      height={36}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-700/50"
                    />
                  ) : (
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${config.color} flex items-center justify-center text-white font-semibold text-sm`}>
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-gradient-to-br ${config.color} border-2 border-[#0a0d14]`}></div>
                </div>
                
                {(!isCollapsed || isMobileOpen) && (
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-semibold text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>
                )}

                {(!isCollapsed || isMobileOpen) && (
                  <button
                    className="flex-shrink-0 p-1.5 rounded-lg hover:bg-gray-700/50 text-gray-400 hover:text-white transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
