import Link from "next/link"
import { GraduationCap, Github, Twitter, Linkedin, Heart } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-[#0a0d14] border-t border-gray-800/50">
      {/* Decorative gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-10 sm:mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 p-0.5 shadow-lg shadow-blue-500/20">
                <div className="w-full h-full bg-[#0a0d14] rounded-[9px] flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-blue-400" />
                </div>
              </div>
              <div>
                <h3 className="text-white font-bold text-xl">CodeTutor LMS</h3>
                <p className="text-xs text-blue-400 font-medium">Learn & Grow</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Empowering students worldwide with quality tech education and professional skills development
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-2">
              <a 
                href="#" 
                className="w-8 h-8 rounded-lg bg-gray-800/50 border border-gray-700/50 flex items-center justify-center hover:bg-blue-500/10 hover:border-blue-500/30 text-gray-400 hover:text-blue-400 transition-all duration-200"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-8 h-8 rounded-lg bg-gray-800/50 border border-gray-700/50 flex items-center justify-center hover:bg-blue-500/10 hover:border-blue-500/30 text-gray-400 hover:text-blue-400 transition-all duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-8 h-8 rounded-lg bg-gray-800/50 border border-gray-700/50 flex items-center justify-center hover:bg-blue-500/10 hover:border-blue-500/30 text-gray-400 hover:text-blue-400 transition-all duration-200"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          {/* Learn Links */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></span>
              Learn
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/courses" className="text-gray-400 hover:text-blue-400 transition-colors inline-flex items-center gap-1 group">
                  <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-blue-400 transition-colors"></span>
                  All Courses
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-400 hover:text-blue-400 transition-colors inline-flex items-center gap-1 group">
                  <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-blue-400 transition-colors"></span>
                  My Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/courses" className="text-gray-400 hover:text-blue-400 transition-colors inline-flex items-center gap-1 group">
                  <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-blue-400 transition-colors"></span>
                  My Courses
                </Link>
              </li>
              <li>
                <Link href="/dashboard/certificates" className="text-gray-400 hover:text-blue-400 transition-colors inline-flex items-center gap-1 group">
                  <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-blue-400 transition-colors"></span>
                  Certificates
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Company Links */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-gradient-to-b from-violet-500 to-purple-500 rounded-full"></span>
              Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-violet-400 transition-colors inline-flex items-center gap-1 group">
                  <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-violet-400 transition-colors"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-violet-400 transition-colors inline-flex items-center gap-1 group">
                  <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-violet-400 transition-colors"></span>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/instructor" className="text-gray-400 hover:text-violet-400 transition-colors inline-flex items-center gap-1 group">
                  <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-violet-400 transition-colors"></span>
                  Become Instructor
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-400 hover:text-violet-400 transition-colors inline-flex items-center gap-1 group">
                  <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-violet-400 transition-colors"></span>
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Support Links */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-gradient-to-b from-emerald-500 to-green-500 rounded-full"></span>
              Support
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/help" className="text-gray-400 hover:text-emerald-400 transition-colors inline-flex items-center gap-1 group">
                  <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-emerald-400 transition-colors"></span>
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-emerald-400 transition-colors inline-flex items-center gap-1 group">
                  <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-emerald-400 transition-colors"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-emerald-400 transition-colors inline-flex items-center gap-1 group">
                  <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-emerald-400 transition-colors"></span>
                  Terms of Service
                </Link>
              </li>
              <li>
                <a href="mailto:support@codetutor.com" className="text-gray-400 hover:text-emerald-400 transition-colors inline-flex items-center gap-1 group">
                  <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-emerald-400 transition-colors"></span>
                  Contact Support
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-800/50 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 text-center sm:text-left">
              © {currentYear} CodeTutor LMS. All Rights Reserved
            </p>
            <p className="text-sm text-gray-500 flex items-center gap-1.5">
              Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" /> for learners worldwide
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

