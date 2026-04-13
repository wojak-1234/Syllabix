"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, User as UserIcon, LogOut } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const router = useRouter()

  // 1. 역할에 따른 동적 메뉴 구성
  const guestItems = [
    { label: "홈", href: "/", public: true },
    { label: "커리큘럼", href: "/curriculum", public: false },
    { label: "분석", href: "/blunders", public: false },
    { label: "대시보드", href: "/dashboard", public: false },
    { label: "교사", href: "/teacher", public: false },
  ]

  const teacherItems = [
    { label: "홈", href: "/", public: true },
    { label: "강의 분석", href: "/teacher/analytics", public: false },
    { label: "대시보드", href: "/teacher/dashboard", public: false },
    { label: "교사", href: "/teacher", public: false },
  ]

  const navItems = userRole === "teacher" ? teacherItems : guestItems

  useEffect(() => {
    // Initial check
    const role = localStorage.getItem("user-role")
    setUserRole(role)

    // Listen for changes (e.g. from the start page)
    const handleStorageChange = () => {
      setUserRole(localStorage.getItem("user-role"))
    }
    window.addEventListener('storage', handleStorageChange)
    
    // Custom event to handle same-tab changes quickly
    const handleRoleUpdate = () => {
      setUserRole(localStorage.getItem("user-role"))
    }
    window.addEventListener('roleUpdate', handleRoleUpdate)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('roleUpdate', handleRoleUpdate)
    }
  }, [])

  const handleNavClick = (e: React.MouseEvent, item: any) => {
    if (!item.public && !userRole) {
      e.preventDefault()
      toast.error("로그인이 필요합니다", {
        description: "시작하기 버튼을 눌러 먼저 역할을 선택해주세요.",
      })
      return
    }

    // Role-based access control: Students cannot access Teacher section
    if (item.href === "/teacher" && userRole === "student") {
      e.preventDefault()
      toast.warning("권한이 없습니다", {
        description: "교사 전용 메뉴입니다. 선생님 계정으로 이용해주세요.",
      })
      return
    }

    setIsOpen(false)
  }

  const handleLogout = () => {
    localStorage.removeItem("user-role")
    setUserRole(null)
    toast.success("로그아웃 되었습니다")
    router.push("/")
    // Trigger theme update
    window.dispatchEvent(new Event('roleUpdate'))
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mt-4 flex h-16 items-center justify-between rounded-2xl border border-white/60 bg-white/70 px-6 shadow-lg shadow-orange-500/5 teacher:shadow-emerald-500/5 backdrop-blur-xl transition-all duration-500 hover:shadow-xl hover:shadow-orange-500/10 teacher:hover:shadow-emerald-500/10">
          {/* Logo */}
          <Link
            href="/"
            className="group relative flex items-center gap-2 text-xl font-bold"
          >
            <div className="relative">
              <img 
                src="/logo.jpg" 
                alt="Syllabix Logo" 
                className="h-9 w-9 rounded-xl object-cover border border-white/50 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg group-hover:shadow-orange-500/30 teacher:group-hover:shadow-emerald-500/30"
              />
              <div className="absolute inset-0 h-9 w-9 rounded-xl bg-orange-500/20 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-50" />
            </div>
            <span className="bg-gradient-to-r from-orange-600 to-amber-500 teacher:from-emerald-600 teacher:to-teal-500 bg-clip-text text-transparent transition-all duration-300 group-hover:from-orange-500 group-hover:to-amber-400 teacher:group-hover:from-emerald-500 teacher:group-hover:to-teal-400">
              Syllabix
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-1">
            {navItems.map((item, index) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item)}
                className="group relative px-4 py-2"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Hover background */}
                <span
                  className={`absolute inset-0 rounded-xl bg-gradient-to-r from-orange-100 to-amber-50 teacher:from-emerald-100 teacher:to-teal-50 transition-all duration-300 ease-out ${hoveredIndex === index ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
                    }`}
                />

                {/* Text */}
                <span
                  className={`relative text-sm font-medium transition-all duration-300 ease-out ${hoveredIndex === index
                    ? 'text-orange-600 teacher:text-emerald-700 translate-y-[-1px]'
                    : 'text-foreground/70'
                    }`}
                >
                  {item.label}
                </span>

                {/* Underline indicator */}
                <span
                  className={`absolute bottom-1 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 teacher:from-emerald-500 teacher:to-teal-400 transition-all duration-300 ease-out ${hoveredIndex === index ? 'w-4 opacity-100' : 'w-0 opacity-0'
                    }`}
                />
              </Link>
            ))}
          </div>

          {/* CTA or Profile */}
          <div className="hidden md:block">
            {userRole ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 rounded-xl border border-white/50 bg-white/40 px-3 py-1.5 backdrop-blur-md shadow-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-400 teacher:from-emerald-500 teacher:to-teal-400 text-white shadow-sm">
                    <UserIcon className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col text-left mr-2">
                    <span className="text-xs font-bold text-foreground">
                      {userRole === "teacher" ? "홍길동 선생님" : "김철수 학생"}
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase leading-none">
                      {userRole} Mode
                    </span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors"
                    title="로그아웃"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/start">
                <Button
                  className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 teacher:from-emerald-500 teacher:to-teal-500 px-6 py-2 font-medium text-white shadow-md shadow-orange-500/20 teacher:shadow-emerald-500/20 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/30 teacher:hover:shadow-emerald-500/30"
                >
                  <span className="relative z-10">시작하기</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-600 teacher:from-emerald-600 teacher:to-teal-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100" />
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative rounded-lg p-2 transition-all duration-300 hover:bg-orange-100/50 teacher:hover:bg-emerald-100/50 md:hidden"
          >
            <div className="relative h-5 w-5">
              <Menu
                className={`absolute inset-0 h-5 w-5 text-foreground/70 transition-all duration-300 ${isOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'
                  }`}
              />
              <X
                className={`absolute inset-0 h-5 w-5 text-foreground/70 transition-all duration-300 ${isOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'
                  }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`mt-2 overflow-hidden rounded-2xl border border-white/60 bg-white/90 shadow-lg backdrop-blur-xl transition-all duration-500 md:hidden ${isOpen ? 'max-h-[32rem] opacity-100' : 'max-h-0 opacity-0 border-transparent'
            }`}
        >
          <div className="space-y-1 p-4">
            {navItems.map((item, index) => (
              <Link
                key={item.label}
                href={item.href}
                className="block rounded-xl px-4 py-3 text-sm font-medium text-foreground/70 transition-all duration-300 hover:bg-gradient-to-r hover:from-orange-100 hover:to-amber-50 teacher:hover:from-emerald-100 teacher:hover:to-teal-50 hover:text-orange-600 teacher:hover:text-emerald-600"
                style={{ transitionDelay: `${index * 50}ms` }}
                onClick={(e) => handleNavClick(e, item)}
              >
                {item.label}
              </Link>
            ))}
            
            <div className="pt-2">
              {userRole ? (
                <div className="flex items-center justify-between rounded-xl border border-orange-100 teacher:border-emerald-100 bg-orange-50/30 teacher:bg-emerald-50/30 p-3">
                   <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-400 teacher:from-emerald-500 teacher:to-teal-400 text-white">
                      <UserIcon className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-bold text-foreground">
                        {userRole === "teacher" ? "홍길동 선생님" : "김철수 학생"}
                      </span>
                    </div>
                  </div>
                  <button onClick={handleLogout} className="p-2 text-muted-foreground hover:text-red-500">
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <Button
                  asChild
                  className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 teacher:from-emerald-500 teacher:to-teal-500 font-medium text-white"
                >
                  <Link href="/start">시작하기</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
