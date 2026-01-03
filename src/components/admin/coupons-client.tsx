"use client"

import { useState, useTransition } from "react"
import { Tag, Search, Plus, Edit, Trash2, X, CheckCircle, XCircle, Calendar, Users, Percent, Clock } from "lucide-react"
import {  createCouponAction, updateCouponAction, deleteCouponAction } from "@/app/(admin)/admin/actions"

interface Coupon {
  _id: string
  code: string
  discountValue: number
  appliesTo: string | { _id: string; title: string }
  expiresAt?: string
  isActive: boolean
  usageLimit?: number
  usageCount: number
  createdAt: string
}

interface Course {
  _id: string
  title: string
}

interface CouponsClientProps {
  initialCoupons: Coupon[]
  courses: Course[]
}

export function CouponsClient({ initialCoupons, courses }: CouponsClientProps) {
  const [isPending, startTransition] = useTransition()
  const [search, setSearch] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    code: "",
    discountValue: 10,
    appliesTo: "all",
    expiresAt: "",
    isActive: true,
    usageLimit: undefined as number | undefined,
  })

  const filteredCoupons = initialCoupons.filter(coupon =>
    coupon.code.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const data = {
        ...formData,
        code: formData.code.toUpperCase(),
        appliesTo: formData.appliesTo === "all" ? "all" : formData.appliesTo,
        expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : undefined,
        usageLimit: formData.usageLimit || undefined,
      }
      
      const result = await createCouponAction(data)
      if (result.success) {
        setShowCreateModal(false)
        resetForm()
      } else {
        alert(result.error || "Failed to create coupon")
      }
    })
  }

  const handleUpdateCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCoupon) return
    
    startTransition(async () => {
      const data = {
        code: formData.code.toUpperCase(),
        discountValue: formData.discountValue,
        appliesTo: formData.appliesTo === "all" ? "all" : formData.appliesTo,
        expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : undefined,
        isActive: formData.isActive,
        usageLimit: formData.usageLimit || undefined,
      }
      
      const result = await updateCouponAction(editingCoupon._id, data)
      if (result.success) {
        setEditingCoupon(null)
        resetForm()
      } else {
        alert(result.error || "Failed to update coupon")
      }
    })
  }

  const handleDeleteCoupon = async (couponId: string) => {
    startTransition(async () => {
      const result = await deleteCouponAction(couponId)
      if (result.success) {
        setDeleteConfirmId(null)
      } else {
        alert(result.error || "Failed to delete coupon")
      }
    })
  }

  const resetForm = () => {
    setFormData({
      code: "",
      discountValue: 10,
      appliesTo: "all",
      expiresAt: "",
      isActive: true,
      usageLimit: undefined,
    })
  }

  const openEditModal = (coupon: Coupon) => {
    setEditingCoupon(coupon)
    setFormData({
      code: coupon.code,
      discountValue: coupon.discountValue,
      appliesTo: typeof coupon.appliesTo === "string" ? coupon.appliesTo : coupon.appliesTo._id,
      expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().split('T')[0] : "",
      isActive: coupon.isActive,
      usageLimit: coupon.usageLimit,
    })
  }

  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false
    return new Date(expiresAt) < new Date()
  }

  const getAppliesTo = (appliesTo: string | { _id: string; title: string }) => {
    if (typeof appliesTo === "string") {
      if (appliesTo === "all") return "All Courses"
      // Look up course title from courses list
      const course = courses.find(c => c._id === appliesTo)
      return course?.title || "Unknown Course"
    }
    return appliesTo.title || "Specific Course"
  }

  return (
    <>
      {/* Header Actions */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search coupons by code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-900/50 border border-gray-800 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 transition-colors"
          />
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white rounded-xl font-medium transition-all flex items-center gap-2 shadow-lg shadow-violet-500/20"
        >
          <Plus className="w-5 h-5" />
          Create Coupon
        </button>
      </div>

      {/* Coupons Grid */}
      {filteredCoupons.length === 0 ? (
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-800/50 rounded-xl p-12 text-center">
          <Tag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            {search ? "No coupons found" : "No coupons yet"}
          </h3>
          <p className="text-gray-400 mb-4">
            {search ? "Try adjusting your search" : "Create your first coupon to get started"}
          </p>
          {!search && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white rounded-xl font-medium transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Coupon
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCoupons.map((coupon) => {
            const expired = isExpired(coupon.expiresAt)
            const usageLimitReached = coupon.usageLimit && coupon.usageCount >= coupon.usageLimit
            
            return (
              <div
                key={coupon._id}
                className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-800/50 rounded-xl p-6 hover:border-violet-500/30 transition-all duration-300"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="w-5 h-5 text-violet-400" />
                      <h3 className="text-2xl font-bold text-white font-mono">
                        {coupon.code}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Percent className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 text-lg font-semibold">
                        {coupon.discountValue}% OFF
                      </span>
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <div>
                    {!coupon.isActive ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-semibold">
                        <XCircle className="w-3.5 h-3.5" />
                        Inactive
                      </span>
                    ) : expired ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-semibold">
                        <Clock className="w-3.5 h-3.5" />
                        Expired
                      </span>
                    ) : usageLimitReached ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-semibold">
                        <Users className="w-3.5 h-3.5" />
                        Limit Reached
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-semibold">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Active
                      </span>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Tag className="w-4 h-4" />
                    <span>{getAppliesTo(coupon.appliesTo)}</span>
                  </div>
                  
                  {coupon.expiresAt && (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>Expires: {new Date(coupon.expiresAt).toLocaleDateString()}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>
                      Used: {coupon.usageCount}
                      {coupon.usageLimit && ` / ${coupon.usageLimit}`}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(coupon)}
                    className="flex-1 px-4 py-2 bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/30 text-violet-400 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(coupon._id)}
                    className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      {(showCreateModal || editingCoupon) && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">
                {editingCoupon ? "Edit Coupon" : "Create Coupon"}
              </h3>
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setEditingCoupon(null)
                  resetForm()
                }}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={editingCoupon ? handleUpdateCoupon : handleCreateCoupon} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="SAVE20"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 font-mono text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Discount Percentage *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="100"
                  value={formData.discountValue}
                  onChange={(e) => setFormData({ ...formData, discountValue: parseInt(e.target.value) })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Applies To
                </label>
                <select
                  value={formData.appliesTo}
                  onChange={(e) => setFormData({ ...formData, appliesTo: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500"
                >
                  <option value="all">All Courses</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Expiry Date (Optional)
                </label>
                <input
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Usage Limit (Optional)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.usageLimit || ""}
                  onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value ? parseInt(e.target.value) : undefined })}
                  placeholder="Unlimited"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-5 h-5 rounded bg-gray-800 border-gray-700 text-violet-500 focus:ring-violet-500"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-300">
                  Active
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
                >
                  {isPending ? "Saving..." : editingCoupon ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false)
                    setEditingCoupon(null)
                    resetForm()
                  }}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-2">Delete Coupon</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete this coupon? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDeleteCoupon(deleteConfirmId)}
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

