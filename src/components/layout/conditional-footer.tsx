"use client"

import { usePathname } from "next/navigation"
import { Footer } from "./footer"

export function ConditionalFooter() {
  const pathname = usePathname()
  
  // Don't show footer on dashboard, instructor, admin, or course learning pages
  const hiddenRoutes = ['/dashboard', '/instructor', '/admin']
  const isCourseLearnPage = pathname.includes('/courses/') && pathname.includes('/learn')
  const shouldHideFooter = hiddenRoutes.some(route => pathname.startsWith(route)) || isCourseLearnPage
  
  if (shouldHideFooter) {
    return null
  }
  
  return <Footer />
}

