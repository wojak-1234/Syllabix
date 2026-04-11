"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function ThemeManager() {
  const pathname = usePathname()

  useEffect(() => {
    // Check if the current route is teacher-related
    const isTeacherRoute = pathname.startsWith("/teacher")
    
    // We can also check localStorage for a persistent preference
    const savedTheme = localStorage.getItem("user-role")
    
    if (isTeacherRoute || savedTheme === "teacher") {
      document.documentElement.classList.add("teacher-theme")
    } else {
      document.documentElement.classList.remove("teacher-theme")
    }
  }, [pathname])

  return null
}
