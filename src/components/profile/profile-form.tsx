"use client"
import Image from "next/image"

import { useState } from "react"
import { signOut } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { updateProfile, updateProfilePicture } from "@/lib/api-client"
import { convertToBase64, validateImageFile } from "@/lib/utils"
import { User, Mail, Edit2, Save, X, CheckCircle, ShieldCheck, Camera, Upload } from "lucide-react"

interface ProfileFormProps {
  user: {
    id: string
    name: string
    email: string
    role: string
    avatar?: string
    isVerified: boolean
  }
  accessToken: string
}

/**
 * Profile Form - Client Component for interactive editing
 */
export function ProfileForm({ user, accessToken }: ProfileFormProps) {
  // const router = useRouter() removed
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: user.name,
  })

  // Check if user is using social auth avatar
  const isSocialAuthUser = !!user.avatar && (
    user.avatar.includes('googleusercontent.com') ||
    user.avatar.includes('fbcdn.net') ||
    user.avatar.includes('githubusercontent.com') ||
    user.avatar.includes('twimg.com')
  )

  const handleSave = async () => {
    setIsSaving(true)
    setError("")
    setSuccess("")

    try {
      await updateProfile(formData, accessToken)
      setSuccess("Profile updated successfully! Logging out...")
      setIsEditing(false)
      
      // Wait a moment to show the success message
      setTimeout(async () => {
        // Logout and redirect to signin
        await signOut({ 
          callbackUrl: "/signin?message=profile-updated",
          redirect: true 
        })
      }, 1500)
    } catch (err) {
      const error = err as Error
      setError(error.message || "Failed to update profile")
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData({ name: user.name })
    setError("")
    setSuccess("")
  }

  // Handle avatar file selection
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate image file using utility function
    const validation = validateImageFile(file, 5)
    if (!validation.valid) {
      setError(validation.error || "Invalid file")
      return
    }

    setError("")
    setSuccess("")
    
    try {
      // Convert to base64 and show preview
      const base64 = await convertToBase64(file)
      setAvatarPreview(base64)
    } catch {
      setError("Failed to process image")
    }
  }

  // Upload avatar
  const handleAvatarUpload = async () => {
    if (!avatarPreview) return

    setIsUploadingAvatar(true)
    setError("")
    setSuccess("")

    try {
      await updateProfilePicture({ avatar: avatarPreview }, accessToken)
      setSuccess("Profile picture updated successfully! Logging out...")
      
      // Wait a moment to show the success message
      setTimeout(async () => {
        await signOut({ 
          callbackUrl: "/signin?message=profile-updated",
          redirect: true 
        })
      }, 1500)
    } catch (err) {
      const error = err as Error
      setError(error.message || "Failed to update profile picture")
      setIsUploadingAvatar(false)
    }
  }

  // Cancel avatar upload
  const handleAvatarCancel = () => {
    setAvatarPreview(null)
    setError("")
  }

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 border-gray-800/50 hover:border-blue-500/30 transition-all duration-300 shadow-xl group">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-cyan-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <CardHeader className="relative z-10">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-white text-2xl font-bold flex items-center gap-2">
              <User className="w-6 h-6 text-blue-400" />
              Personal Information
            </CardTitle>
            <CardDescription className="text-gray-400 mt-1">
              Manage your account details and preferences
            </CardDescription>
          </div>
          {user.isVerified && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-semibold text-emerald-400">Verified</span>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6 relative z-10">
        {error && (
          <Alert variant="error" className="bg-red-500/10 border-red-500/30 text-red-400">
            {error}
          </Alert>
        )}
        {success && (
          <Alert variant="success" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400">
            {success}
          </Alert>
        )}

        {/* Avatar Section */}
        <div className="flex items-center gap-6 p-6 rounded-xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50">
          <div className="relative group/avatar">
            {/* Avatar Display */}
            {(avatarPreview || user.avatar) ? (
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur opacity-75 group-hover/avatar:opacity-100 transition-opacity"></div>
                <Image
                  src={avatarPreview || user.avatar || "https://res.cloudinary.com/dj8fpb6tq/image/upload/v1758530649/qllwshtuqe3njr8pzim6.png"}
                  alt={user.name}
                  width={80}
                  height={80}
                  className="relative h-20 w-20 shrink-0 rounded-full border-2 border-gray-900 object-cover"
                />
                {/* Camera overlay on hover - only for non-social auth users */}
                {!isSocialAuthUser && (
                  <label 
                    htmlFor="avatar-upload" 
                    className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Camera className="w-6 h-6 text-white" />
                  </label>
                )}
              </div>
            ) : (
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur opacity-75 group-hover/avatar:opacity-100 transition-opacity"></div>
                <div className="relative h-20 w-20 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center border-2 border-gray-900">
                  <span className="text-white text-2xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                {/* Camera overlay on hover - only for non-social auth users */}
                {!isSocialAuthUser && (
                  <label 
                    htmlFor="avatar-upload" 
                    className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Camera className="w-6 h-6 text-white" />
                  </label>
                )}
              </div>
            )}
            
            {/* Hidden file input - disabled for social auth users */}
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
              disabled={isUploadingAvatar || isSocialAuthUser}
            />
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-1.5">{user.name}</h3>
            <div className="flex items-center gap-2 mb-2">
              <Badge 
                variant={user.role === "instructor" ? "default" : "secondary"}
                className={
                  user.role === "instructor" 
                    ? "bg-violet-500/20 text-violet-300 border-violet-500/30 hover:bg-violet-500/30" 
                    : "bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30"
                }
              >
                <ShieldCheck className="w-3 h-3 mr-1" />
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Badge>
            </div>
            
            {/* Avatar upload actions */}
            {avatarPreview && (
              <div className="flex items-center gap-2 mt-3">
                <Button
                  size="sm"
                  onClick={handleAvatarUpload}
                  disabled={isUploadingAvatar}
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white text-xs h-8 px-3"
                >
                  <Upload className="w-3 h-3 mr-1" />
                  {isUploadingAvatar ? "Uploading..." : "Upload"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleAvatarCancel}
                  disabled={isUploadingAvatar}
                  className="border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-700 text-xs h-8 px-3"
                >
                  <X className="w-3 h-3 mr-1" />
                  Cancel
                </Button>
              </div>
            )}
            
            {!avatarPreview && (
              <p className="text-xs text-gray-500 mt-2">
                {isSocialAuthUser 
                  ? "Avatar is linked to your social account and cannot be changed"
                  : "Hover over avatar and click to upload a new picture"
                }
              </p>
            )}
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-400" />
              Full Name
            </label>
            <div className="relative">
              <Input
                value={isEditing ? formData.name : user.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!isEditing}
                className={`bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 ${
                  isEditing ? 'focus:border-blue-500/50 focus:ring-blue-500/20' : ''
                }`}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-400" />
              Email Address
            </label>
            <div className="relative flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gray-800/30 border border-gray-700/50">
              <span className="text-white flex-1">{user.email}</span>
              <span className="text-xs text-gray-500 bg-gray-700/50 px-2 py-1 rounded">Read-only</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          {isEditing ? (
            <>
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 group/btn"
              >
                <Save className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving}
                className="border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-700 hover:text-white hover:border-gray-600 transition-all duration-200"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </>
          ) : (
            <Button 
              onClick={() => setIsEditing(true)}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 group/btn"
            >
              <Edit2 className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
              Edit Profile
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

