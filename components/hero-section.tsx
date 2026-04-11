"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Play } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: (e.clientX - rect.left - rect.width / 2) / 50,
      y: (e.clientY - rect.top - rect.height / 2) / 50,
    })
  }

  return (
    <section
      className="relative min-h-screen pt-32 pb-20"
      onMouseMove={handleMouseMove}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div
            className={`mb-8 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
          >
            <div className="group relative inline-flex items-center gap-2 rounded-full border border-orange-200/50 teacher:border-emerald-200/50 bg-gradient-to-r from-orange-50 to-amber-50 teacher:from-emerald-50 teacher:to-teal-50 px-4 py-2 text-sm font-medium text-orange-700 teacher:text-emerald-700 shadow-sm transition-all duration-300 hover:border-orange-300/50 teacher:hover:border-emerald-300/50 hover:shadow-md hover:shadow-orange-500/10 teacher:hover:shadow-emerald-500/10">
              <Sparkles className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
              <span>Syllabix 를 소개합니다</span>
              <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>

          {/* Headline */}
          <h1
            className={`max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl transition-all duration-700 delay-100 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            style={{
              transform: `perspective(1000px) rotateX(${mousePosition.y * 0.5}deg) rotateY(${mousePosition.x * 0.5}deg)`,
            }}
          >
            <span className="text-balance block text-foreground">
              무엇이든 이룰 수 있는
            </span>
            <span className="text-balance mt-2 block bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent teacher:from-emerald-500 teacher:via-teal-500 teacher:to-cyan-500">
              당신만을 위한 커리큘럼
            </span>
          </h1>

          {/* Subtext */}
          <p
            className={`mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl transition-all duration-700 delay-200 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
          >
            <span className="text-pretty">
              Syllabix는 AI 기반 교육 플랫폼으로, 학생과 교사의 학습 경험을 혁신합니다.
            </span>
          </p>

          {/* CTA Buttons */}
          <div
            className={`mt-10 flex flex-col gap-4 sm:flex-row sm:gap-6 transition-all duration-700 delay-300 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
          >
            <Button
              asChild
              size="lg"
              className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 teacher:from-emerald-500 teacher:to-teal-500 px-8 py-6 text-base font-semibold text-white shadow-lg shadow-orange-500/25 teacher:shadow-emerald-500/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/30 teacher:hover:shadow-emerald-500/30"
            >
              <Link href="/start">
                <span className="relative z-10 flex items-center gap-2">
                  시작하기
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-600 teacher:from-emerald-600 teacher:to-teal-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100" />
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="group relative overflow-hidden rounded-xl border-2 border-foreground/10 bg-white/50 px-8 py-6 text-base font-semibold backdrop-blur-sm transition-all duration-300 hover:border-orange-300 teacher:hover:border-emerald-300 hover:bg-orange-50/50 teacher:hover:bg-emerald-50/50 hover:scale-105"
            >
              <span className="flex items-center gap-2 text-foreground/80 transition-colors duration-300 group-hover:text-orange-600 teacher:group-hover:text-emerald-600">
                <div className="relative flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-amber-500 teacher:from-emerald-500 teacher:to-teal-500 transition-transform duration-300 group-hover:scale-110">
                  <Play className="h-3 w-3 fill-white text-white" />
                </div>
                소개 영상
              </span>
            </Button>
          </div>




        </div>
      </div>
    </section>
  )
}
