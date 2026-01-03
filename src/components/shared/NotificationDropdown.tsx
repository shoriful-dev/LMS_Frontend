"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Bell, Check, CheckCheck, Archive, Trash2, X, Loader2 } from "lucide-react"
import type { Notification } from "@/lib/types"
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationsAsRead,
  archiveNotifications,
  deleteNotification,
} from "@/lib/api-client"
import { useSession } from "@/lib/hooks/use-session"

type FilterType = "all" | "unread" | "archived"

export function NotificationDropdown() {
  const { session, update } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [filter, setFilter] = useState<FilterType>("all")
  const [isLoading, setIsLoading] = useState(false)
  const [isMarkingRead, setIsMarkingRead] = useState(false)
  const [isArchiving, setIsArchiving] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const token = session?.accessToken

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!token) return
    
    setIsLoading(true)
    setError(null)
    try {
      const params: any = { limit: 50 }
      
      if (filter === "unread") {
        params.isRead = false
      }
      
      if (filter === "archived") {
        params.includeArchived = true
      }
      
      const response = await getNotifications(token, params)
      setNotifications(response.notifications as Notification[])
    } catch (error: any) {
      console.error("Failed to fetch notifications:", error)
      setError(error.message || "Failed to load notifications. Please try again.")
      
      // If token expired, refresh the session
      if (error.message?.includes("expired") || error.message?.includes("refresh")) {
        console.log("🔄 Token expired, refreshing session...")
        await update()
      }
    } finally {
      setIsLoading(false)
    }
  }, [token, filter, update])

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    if (!token) return
    
    try {
      const response = await getUnreadNotificationCount(token)
      setUnreadCount(response.data)
    } catch (error: any) {
      console.error("Failed to fetch unread count:", error)
      
      // If token expired, refresh the session
      if (error.message?.includes("expired") || error.message?.includes("refresh")) {
        console.log("🔄 Token expired, refreshing session...")
        await update()
      }
    }
  }, [token, update])

  // Initial load and when filter changes
  useEffect(() => {
    if (isOpen && token) {
      fetchNotifications()
    }
  }, [isOpen, token, fetchNotifications])

  // Fetch unread count on mount and periodically
  useEffect(() => {
    if (token) {
      fetchUnreadCount()
      const interval = setInterval(fetchUnreadCount, 30000) // Refresh every 30 seconds
      return () => clearInterval(interval)
    }
  }, [token, fetchUnreadCount])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Mark as read
  const handleMarkAsRead = async (notificationId?: string) => {
    if (!token) return
    
    setIsMarkingRead(true)
    setError(null)
    try {
      if (notificationId) {
        await markNotificationsAsRead(token, [notificationId])
        setNotifications((prev) =>
          prev.map((notif) =>
            notif._id === notificationId ? { ...notif, isRead: true } : notif
          )
        )
        setUnreadCount((prev) => Math.max(0, prev - 1))
      } else {
        // Mark all as read
        await markNotificationsAsRead(token, undefined, true)
        setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })))
        setUnreadCount(0)
      }
    } catch (error: any) {
      console.error("Failed to mark as read:", error)
      setError(error.message || "Failed to mark notifications as read. Please try again.")
    } finally {
      setIsMarkingRead(false)
    }
  }

  // Archive notification
  const handleArchive = async (notificationId: string) => {
    if (!token) return
    
    setIsArchiving(true)
    setError(null)
    try {
      await archiveNotifications(token, [notificationId])
      setNotifications((prev) => prev.filter((notif) => notif._id !== notificationId))
    } catch (error: any) {
      console.error("Failed to archive notification:", error)
      setError(error.message || "Failed to archive notification. Please try again.")
    } finally {
      setIsArchiving(false)
    }
  }

  // Delete notification
  const handleDelete = async (notificationId: string) => {
    if (!token) return
    
    setIsDeleting(notificationId)
    setError(null)
    try {
      await deleteNotification(token, notificationId)
      setNotifications((prev) => prev.filter((notif) => notif._id !== notificationId))
      // Update unread count if notification was unread
      const notification = notifications.find((n) => n._id === notificationId)
      if (notification && !notification.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1))
      }
    } catch (error: any) {
      console.error("Failed to delete notification:", error)
      setError(error.message || "Failed to delete notification. Please try again.")
    } finally {
      setIsDeleting(null)
    }
  }

  // Get notification icon based on type
  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "course_update":
        return "📚"
      case "new_review":
        return "⭐"
      case "quiz_grade":
        return "📝"
      case "announcement":
        return "📢"
      case "enrollment":
        return "🎓"
      case "course_completion":
        return "🎉"
      case "certificate_earned":
        return "🏆"
      case "payment_success":
        return "✅"
      case "payment_failed":
        return "❌"
      default:
        return "🔔"
    }
  }

  // Format time ago
  const getTimeAgo = (date: string) => {
    const now = new Date()
    const notificationDate = new Date(date)
    const diffInSeconds = Math.floor((now.getTime() - notificationDate.getTime()) / 1000)

    if (diffInSeconds < 60) return "Just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
    return notificationDate.toLocaleDateString()
  }

  // Filter notifications based on current filter
  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "unread") return !notif.isRead
    if (filter === "archived") return notif.archived
    return !notif.archived
  })

  const hasUnread = notifications.some((n) => !n.isRead && !n.archived)

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800/50 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-blue-500 rounded-full text-white font-medium shadow-lg shadow-blue-500/50">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-[#0a0d14] border border-gray-800 rounded-lg shadow-2xl z-50 max-h-[600px] flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">Notifications</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-800/50 rounded transition-colors"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Filters */}
            <div className="flex gap-2">
              {(["all", "unread", "archived"] as FilterType[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    filter === f
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            {/* Mark all as read */}
            {hasUnread && filter !== "archived" && (
              <button
                onClick={() => handleMarkAsRead()}
                disabled={isMarkingRead}
                className="mt-2 w-full px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isMarkingRead ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <CheckCheck className="h-4 w-4" />
                    Mark all as read
                  </>
                )}
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1">
            {isLoading ? (
              <div className="p-8 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <Bell className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-800">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-4 hover:bg-gray-800/30 transition-colors ${
                      !notification.isRead ? "bg-blue-500/5" : ""
                    }`}
                  >
                    <div className="flex gap-3">
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600/20 to-cyan-600/20 flex items-center justify-center text-xl">
                          {getNotificationIcon(notification.type)}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-white line-clamp-2">
                              {notification.title || notification.message}
                            </p>
                            {notification.title && (
                              <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              {getTimeAgo(notification.createdAt)}
                            </p>
                          </div>
                          {!notification.isRead && (
                            <div className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0 mt-1" />
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 mt-3">
                          {!notification.isRead && (
                            <button
                              onClick={() => handleMarkAsRead(notification._id)}
                              className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded transition-colors"
                            >
                              <Check className="h-3 w-3" />
                              Mark as read
                            </button>
                          )}
                          <button
                            onClick={() => handleArchive(notification._id)}
                            disabled={isArchiving}
                            className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-400 hover:text-gray-300 hover:bg-gray-800/50 rounded transition-colors disabled:opacity-50"
                          >
                            <Archive className="h-3 w-3" />
                            Archive
                          </button>
                          <button
                            onClick={() => handleDelete(notification._id)}
                            disabled={isDeleting === notification._id}
                            className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors disabled:opacity-50"
                          >
                            {isDeleting === notification._id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Trash2 className="h-3 w-3" />
                            )}
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {filteredNotifications.length > 0 && (
            <div className="p-3 border-t border-gray-800 text-center">
              <p className="text-xs text-gray-500">
                Showing {filteredNotifications.length} notification
                {filteredNotifications.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
