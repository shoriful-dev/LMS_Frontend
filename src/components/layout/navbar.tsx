"use client"
import Image from "next/image"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { useEffect } from "react"
import { 
  // BookOpen removed, 
  User, 
  LogOut, 
  Settings, 
  // LayoutDashboard removed,
  GraduationCap
} from "lucide-react"
import { useSession } from "@/lib/hooks/use-session"
import { useState } from "react"
import { NotificationDropdown } from "@/components/shared/NotificationDropdown"

// Reusable NavLink Component
const NavLink = ({ href, children, pathname, className = "" }: { href: string; children: React.ReactNode; pathname: string; className?: string }) => {
  const isActive = pathname === href
  return (
    <Link 
      href={href} 
      className={`px-4 py-2 rounded-lg transition-all duration-300 text-base ${
        isActive 
          ? 'bg-white/10 text-white font-semibold' 
          : 'text-gray-300 hover:text-white hover:bg-white/5 font-medium'
      } ${className}`}
    >
      {children}
    </Link>
  )
}

export function Navbar() {
  const { user, isAuthenticated, isLoading } = useSession()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [avatarError, setAvatarError] = useState(false)

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" })
  }

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Reset avatar error when user changes
  useEffect(() => {
    setAvatarError(false)
  }, [user?.avatar])

  return (
    <>
      <nav 
        className="w-full fixed top-0 left-0 right-0 bg-gradient-to-b from-black/95 via-black/90 to-transparent backdrop-blur-xl border-b border-gray-800/50 z-50"
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-cyan-600/5 to-blue-600/5 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between relative">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link href="/" className="group" aria-label="CodeTutor Home">
              <h1 className="font-bold w-auto h-9 flex items-center text-white justify-center gap-2.5 transition-all duration-300">
                <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 p-0.5 shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300">
                  <div className="w-full h-full bg-[#0a0d14] rounded-[8px] flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-blue-400" />
                  </div>
                </div>
                <div className="flex text-base items-center gap-0.5">
                  <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-bold">Code</span>
                  <span className="text-white font-bold">Tutor</span>
                </div>
              </h1>
            </Link>
          </div>

          {/* Middle: Main Navigation */}
          <div className="hidden lg:flex space-x-1">
            <NavLink href="/" pathname={pathname}>Home</NavLink>
            <NavLink href="/courses" pathname={pathname}>Courses</NavLink>
            <NavLink href="#" pathname={pathname}>Books</NavLink>
            <NavLink href="#" pathname={pathname}>About</NavLink>
            <NavLink href="#" pathname={pathname}>Contact</NavLink>
          </div>

          {/* Right: Dashboard + Notifications + Avatar */}
          <div className="flex items-center space-x-2">
            {isLoading ? (
              // Loading skeleton - prevents flash of wrong content
              <div className="hidden md:flex items-center space-x-2">
                <div className="h-9 w-24 bg-gray-800/50 rounded-lg animate-pulse" />
                <div className="h-9 w-9 bg-gray-800/50 rounded-full animate-pulse" />
              </div>
            ) : isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                {/* Dashboard Link */}
                <NavLink href="/dashboard" pathname={pathname}>Dashboard</NavLink>
                
                {/* Instructor Link (if instructor) */}
                {user?.role === "instructor" && (
                  <NavLink href="/instructor" pathname={pathname}>Instructor</NavLink>
                )}
                
                {/* Admin Link (if admin) */}
                {user?.role === "admin" && (
                  <NavLink href="/admin" pathname={pathname}>Admin</NavLink>
                )}

                {/* Notifications */}
                <NotificationDropdown />

                {/* Profile Avatar Dropdown */}
                <div className="relative flex items-center">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="p-1 rounded-lg hover:bg-gray-800/50 transition-colors flex items-center justify-center"
                    aria-label="User menu"
                  >
                    {user?.avatar && !avatarError ? (
                      <Image
                        src={user.avatar}
                        alt={user.name || "User"}
                        width={36}
                        height={36}
                        className="h-9 w-9 rounded-full border-2 border-blue-500 hover:border-cyan-500 transition-colors object-cover"
                        onError={() => setAvatarError(true)}
                      />
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center hover:scale-110 transition-transform">
                        <span className="text-white text-sm font-medium">
                          {user?.name?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>
                    )}
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-[#0a0d14] border border-gray-800 rounded-lg shadow-lg py-1 z-50">
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800/50 hover:text-white"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                      <Link
                        href="/profile/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800/50 hover:text-white"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                      <hr className="my-1 border-gray-800" />
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-800/50"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link href="/signin">
                  <button 
                    className="px-6 py-2.5 rounded-xl border-2 text-white border-gray-700 hover:border-gray-600 hover:bg-gray-800/50 cursor-pointer transition-all duration-300 font-medium"
                    aria-label="Login to your account"
                  >
                    Login
                  </button>
                </Link>
                <Link href="/signup">
                  <button 
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-2.5 rounded-xl cursor-pointer transition-all duration-300 font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
                    aria-label="Create a new account"
                  >
                    Register
                  </button>
                </Link>
              </div>
            )}

            {/* Mobile Auth & Menu Toggle */}
            <div className="md:hidden flex text-white items-center gap-3">
              {!isLoading && !isAuthenticated && (
                <Link href="/signin">
                  <button 
                    className="border-2 cursor-pointer border-gray-700 hover:border-gray-600 hover:bg-gray-800/50 transition-all duration-300 text-white px-4 py-1.5 rounded-lg text-sm font-medium"
                    aria-label="Login to your account"
                  >
                    Login
                  </button>
                </Link>
              )}
              
              {/* Hamburger Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-all duration-300 relative z-[60]"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
              >
                <div className="w-6 h-5 flex flex-col justify-between">
                  <span className={`block h-0.5 w-full bg-white transition-all duration-300 ${
                    isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                  }`} />
                  <span className={`block h-0.5 w-full bg-white transition-all duration-300 ${
                    isMobileMenuOpen ? 'opacity-0' : ''
                  }`} />
                  <span className={`block h-0.5 w-full bg-white transition-all duration-300 ${
                    isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                  }`} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 lg:hidden z-40">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={toggleMobileMenu}
          />
          
          {/* Mobile Menu Panel */}
          <div className="absolute top-[73px] left-0 right-0 bottom-0 overflow-y-auto">
            {/* Ultra-modern layered background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-950" />
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 via-transparent to-cyan-900/20" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent" />
            
            {/* Animated gradient orbs */}
            <div className="absolute top-20 -left-20 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 -right-20 w-72 h-72 bg-cyan-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            
            {/* Content */}
            <div className="relative max-w-7xl mx-auto px-4 py-6 space-y-1">
              <Link 
                href="/" 
                className={`block px-4 py-4 rounded-xl text-lg font-medium transition-all duration-300 border ${
                  pathname === '/' 
                    ? 'bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-white border-blue-500/30 shadow-lg shadow-blue-500/20' 
                    : 'text-gray-200 hover:text-white hover:bg-gray-800/50 border-gray-800/50 hover:border-gray-700 backdrop-blur-sm'
                }`}
                onClick={toggleMobileMenu}
              >
                Home
              </Link>
              <Link 
                href="/courses" 
                className={`block px-4 py-4 rounded-xl text-lg font-medium transition-all duration-300 border ${
                  pathname === '/courses' 
                    ? 'bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-white border-blue-500/30 shadow-lg shadow-blue-500/20' 
                    : 'text-gray-200 hover:text-white hover:bg-gray-800/50 border-gray-800/50 hover:border-gray-700 backdrop-blur-sm'
                }`}
                onClick={toggleMobileMenu}
              >
                Courses
              </Link>
              <Link 
                href="/books" 
                className={`block px-4 py-4 rounded-xl text-lg font-medium transition-all duration-300 border ${
                  pathname === '/books' 
                    ? 'bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-white border-blue-500/30 shadow-lg shadow-blue-500/20' 
                    : 'text-gray-200 hover:text-white hover:bg-gray-800/50 border-gray-800/50 hover:border-gray-700 backdrop-blur-sm'
                }`}
                onClick={toggleMobileMenu}
              >
                Books
              </Link>
              <Link 
                href="/about" 
                className={`block px-4 py-4 rounded-xl text-lg font-medium transition-all duration-300 border ${
                  pathname === '/about' 
                    ? 'bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-white border-blue-500/30 shadow-lg shadow-blue-500/20' 
                    : 'text-gray-200 hover:text-white hover:bg-gray-800/50 border-gray-800/50 hover:border-gray-700 backdrop-blur-sm'
                }`}
                onClick={toggleMobileMenu}
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className={`block px-4 py-4 rounded-xl text-lg font-medium transition-all duration-300 border ${
                  pathname === '/contact' 
                    ? 'bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-white border-blue-500/30 shadow-lg shadow-blue-500/20' 
                    : 'text-gray-200 hover:text-white hover:bg-gray-800/50 border-gray-800/50 hover:border-gray-700 backdrop-blur-sm'
                }`}
                onClick={toggleMobileMenu}
              >
                Contact
              </Link>

              {isAuthenticated && (
                <>
                  <div className="border-t border-gray-800/50 my-4 pt-4 space-y-1">
                    <Link 
                      href="/dashboard" 
                      className={`block px-4 py-4 rounded-xl text-lg font-medium transition-all duration-300 border ${
                        pathname === '/dashboard' 
                          ? 'bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-white border-blue-500/30 shadow-lg shadow-blue-500/20' 
                          : 'text-gray-200 hover:text-white hover:bg-gray-800/50 border-gray-800/50 hover:border-gray-700 backdrop-blur-sm'
                      }`}
                      onClick={toggleMobileMenu}
                    >
                      Dashboard
                    </Link>
                    {user?.role === "instructor" && (
                      <Link 
                        href="/instructor" 
                        className={`block px-4 py-4 rounded-xl text-lg font-medium transition-all duration-300 border ${
                          pathname === '/instructor' 
                            ? 'bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-white border-blue-500/30 shadow-lg shadow-blue-500/20' 
                            : 'text-gray-200 hover:text-white hover:bg-gray-800/50 border-gray-800/50 hover:border-gray-700 backdrop-blur-sm'
                        }`}
                        onClick={toggleMobileMenu}
                      >
                        Instructor
                      </Link>
                    )}
                    {user?.role === "admin" && (
                      <Link 
                        href="/admin" 
                        className={`block px-4 py-4 rounded-xl text-lg font-medium transition-all duration-300 border ${
                          pathname === '/admin' 
                            ? 'bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-white border-blue-500/30 shadow-lg shadow-blue-500/20' 
                            : 'text-gray-200 hover:text-white hover:bg-gray-800/50 border-gray-800/50 hover:border-gray-700 backdrop-blur-sm'
                        }`}
                        onClick={toggleMobileMenu}
                      >
                        Admin
                      </Link>
                    )}
                    <Link 
                      href="/profile" 
                      className={`block px-4 py-4 rounded-xl text-lg font-medium transition-all duration-300 border ${
                        pathname === '/profile' 
                          ? 'bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-white border-blue-500/30 shadow-lg shadow-blue-500/20' 
                          : 'text-gray-200 hover:text-white hover:bg-gray-800/50 border-gray-800/50 hover:border-gray-700 backdrop-blur-sm'
                      }`}
                      onClick={toggleMobileMenu}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => { handleSignOut(); toggleMobileMenu(); }}
                      className="block w-full text-left px-4 py-4 rounded-xl text-lg font-medium transition-all duration-300 border text-red-400 hover:text-red-300 hover:bg-red-500/10 border-red-500/20 hover:border-red-500/40 backdrop-blur-sm"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              )}

              {!isAuthenticated && !isLoading && (
                <div className="border-t border-gray-800/50 my-4 pt-4 flex flex-col gap-3">
                  <Link href="/signup" onClick={toggleMobileMenu}>
                    <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3.5 rounded-xl cursor-pointer transition-all duration-300 font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] border border-blue-500/30">
                      Register
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

