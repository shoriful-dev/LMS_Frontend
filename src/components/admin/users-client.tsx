"use client"
import Image from "next/image"

import { useState, useTransition, useOptimistic } from "react"
import { useRouter } from "next/navigation"
import { 
  Search, 
  Trash2,
  UserCog,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Shield,
  Award,
  User as UserIcon
} from "lucide-react"
import { updateUserRoleAction, deleteUserAction } from "@/app/(admin)/admin/actions"
import { useSession } from "@/lib/hooks/use-session"

interface User {
  _id: string
  name: string
  email: string
  role: "user" | "instructor" | "admin"
  isVerified: boolean
  avatar?: { url: string }
  createdAt: string
}

interface UsersClientProps {
  initialUsers: User[]
  initialTotal: number
  initialPage: number
  initialPages: number
  initialSearch: string
  initialRole: string
}

export function UsersClient({
  initialUsers,
  initialTotal,
  initialPage,
  initialPages,
  initialSearch,
  initialRole,
}: UsersClientProps) {
  const router = useRouter()
  const { user: currentUser } = useSession()
  const [isPending, startTransition] = useTransition()
  
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [roleEditId, setRoleEditId] = useState<string | null>(null)
  const [selectedRole, setSelectedRole] = useState<"user" | "instructor" | "admin">("user")
  
  // Optimistic UI: Remove user from list instantly
  const [optimisticUsers, removeOptimistic] = useOptimistic(
    initialUsers,
    (state, userId: string) => state.filter(u => u._id !== userId)
  )
  
  // Optimistic UI: Update user role instantly
  const [optimisticUsersWithRole, updateRoleOptimistic] = useOptimistic(
    optimisticUsers,
    (state, { userId, newRole }: { userId: string; newRole: "user" | "instructor" | "admin" }) =>
      state.map(u => u._id === userId ? { ...u, role: newRole } : u)
  )

  const handleSearch = (value: string) => {
    const params = new URLSearchParams()
    if (value) params.set("search", value)
    if (initialRole) params.set("role", initialRole)
    router.push(`/admin/users?${params.toString()}`)
  }

  const handleRoleFilter = (role: string) => {
    const params = new URLSearchParams()
    if (role) params.set("role", role)
    if (initialSearch) params.set("search", initialSearch)
    router.push(`/admin/users?${params.toString()}`)
  }

  const handleUpdateRole = async (userId: string, newRole: "user" | "instructor" | "admin") => {
    // Actual update with optimistic UI inside transition
    startTransition(async () => {
      // Optimistically update role in UI
      updateRoleOptimistic({ userId, newRole })
      setRoleEditId(null)
      
      try {
        const result = await updateUserRoleAction(userId, newRole)
        if (!result.success) {
          // If update fails, the page will automatically revalidate and revert the optimistic update
          console.error("Failed to update user role:", result.error)
          alert(result.error || "Failed to update user role")
          // Force a page refresh to revert the optimistic update
          router.refresh()
        }
      } catch (error) {
        console.error("Error updating user role:", error)
        alert("An unexpected error occurred while updating the user role")
        // Force a page refresh to revert the optimistic update
        router.refresh()
      }
    })
  }

  const handleDeleteUser = async (userId: string) => {
    // Actual deletion with optimistic UI inside transition
    startTransition(async () => {
      // Optimistically remove from UI
      removeOptimistic(userId)
      setDeleteConfirmId(null)
      
      const result = await deleteUserAction(userId)
      if (!result.success) {
        // If deletion fails, the page will automatically revalidate and show the user again
        console.error("Failed to delete user:", result.error)
        alert(result.error || "Failed to delete user")
        // Force a page refresh to show the user again
        router.refresh()
      }
    })
  }

  const getRoleBadge = (role: string) => {
    const badges = {
      admin: { color: "from-rose-500 to-orange-500", icon: Shield, label: "Admin" },
      instructor: { color: "from-violet-500 to-purple-500", icon: Award, label: "Instructor" },
      user: { color: "from-blue-500 to-cyan-500", icon: UserIcon, label: "Student" },
    }
    
    const badge = badges[role as keyof typeof badges] || badges.user
    const Icon = badge.icon
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r ${badge.color} bg-opacity-10 border border-current text-xs font-semibold`}>
        <Icon className="w-3.5 h-3.5" />
        {badge.label}
      </span>
    )
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams()
    params.set("page", String(newPage))
    if (initialSearch) params.set("search", initialSearch)
    if (initialRole) params.set("role", initialRole)
    router.push(`/admin/users?${params.toString()}`)
  }

  return (
    <>
      {/* Filters & Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name or email..."
            defaultValue={initialSearch}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-gray-900/50 border border-gray-800 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-rose-500/50 transition-colors"
          />
        </div>

        <div className="flex gap-2">
          {["", "user", "instructor", "admin"].map((role) => (
            <button
              key={role}
              onClick={() => handleRoleFilter(role)}
              className={`px-4 py-3 rounded-xl font-medium transition-all ${
                initialRole === role
                  ? "bg-gradient-to-r from-rose-500 to-orange-500 text-white"
                  : "bg-gray-900/50 border border-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              {role === "" ? "All" : role === "user" ? "Students" : role === "instructor" ? "Instructors" : "Admins"}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-gray-400 text-sm">
          Showing <span className="text-white font-semibold">{initialUsers.length}</span> of{" "}
          <span className="text-white font-semibold">{initialTotal}</span> users
        </p>
      </div>

      {/* Users Table */}
      {initialUsers.length === 0 ? (
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-800/50 rounded-xl p-12 text-center">
          <UserIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No users found</h3>
          <p className="text-gray-400">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-800/50 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">User</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">Role</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">Status</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">Joined</th>
                  <th className="text-right px-6 py-4 text-gray-400 font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {optimisticUsersWithRole.map((user) => (
                  <tr key={user._id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.avatar?.url ? (
                          <Image
                            src={user.avatar.url}
                            alt={user.name}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-700"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center text-white font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="text-white font-medium">{user.name}</p>
                          <p className="text-gray-500 text-sm">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {roleEditId === user._id ? (
                        <div className="flex items-center gap-2">
                          <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value as "user" | "instructor" | "admin")}
                            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-rose-500"
                          >
                            <option value="user">Student</option>
                            <option value="instructor">Instructor</option>
                            <option value="admin">Admin</option>
                          </select>
                          <button
                            onClick={() => handleUpdateRole(user._id, selectedRole)}
                            disabled={isPending}
                            className="px-3 py-1.5 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white text-sm rounded-lg transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setRoleEditId(null)}
                            className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        getRoleBadge(user.role)
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {user.isVerified ? (
                        <span className="inline-flex items-center gap-1.5 text-green-400 text-sm">
                          <CheckCircle className="w-4 h-4" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-red-400 text-sm">
                          <XCircle className="w-4 h-4" />
                          Unverified
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedRole(user.role)
                            setRoleEditId(user._id)
                          }}
                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                          title="Change Role"
                          disabled={user._id === currentUser?.id}
                        >
                          <UserCog className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(user._id)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete User"
                          disabled={user._id === currentUser?.id}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {initialPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-800 flex items-center justify-between">
              <p className="text-gray-400 text-sm">
                Page {initialPage} of {initialPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(initialPage - 1)}
                  disabled={initialPage === 1 || isPending}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(initialPage + 1)}
                  disabled={initialPage === initialPages || isPending}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-2">Delete User</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDeleteUser(deleteConfirmId)}
                disabled={isPending}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-lg transition-colors font-medium"
              >
                {isPending ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

