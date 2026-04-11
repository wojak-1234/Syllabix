"use client"

import { useEffect, useRef, useState } from "react"
import { Zap, Shield, Palette, Globe, BarChart3, Layers } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "한걸음 한걸음씩",
    description: "학생의 수준과 목표에 맞춘 개인화된 학습 경로를 제공합니다.",
  },
  {
    icon: Shield,
    title: "의미있는 학습",
    description: "AI 기반 자동 피드백 시스템으로 차별화된 학습 효과를 경험하세요.",
  },
  {
    icon: Palette,
    title: "오답노트",
    description: "약점을 즉시 파악하고 집중 학습할 수 있습니다.",
  },
  {
    icon: Globe,
    title: "지구 어디서든",
    description: "인터넷만 연결되어 있다면 어디서든 학습할 수 있습니다.",
  },
  {
    icon: BarChart3,
    title: "스택 분석",
    description: "당신의 스택을 분석하여 최적의 학습 경로를 제공합니다.",
  },
  {
    icon: Layers,
    title: "어떤 목표던지",
    description: "AI 기반 챗봇이 어떤 목표던지 함께합니다.",
  },
]

export function FeaturesSection() {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set())
  const refs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observers = refs.current.map((ref, index) => {
      if (!ref) return null

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleItems(prev => new Set([...prev, index]))
            observer.disconnect()
          }
        },
        { threshold: 0.2 }
      )

      observer.observe(ref)
      return observer
    })

    return () => {
      observers.forEach(observer => observer?.disconnect())
    }
  }, [])

  return (
    <section id="home" className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="text-balance block text-foreground">목표를 향한 여정에</span>
            <span className="mt-1 block bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent teacher:from-emerald-500 teacher:to-teal-500">
              AI 조교가 함께합니다
            </span>
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
            당신의 지식에 신경쓰는 진정한 AI
          </p>
        </div>

        {/* Features grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              ref={el => { refs.current[index] = el }}
              className={`group relative rounded-2xl border border-white/60 bg-white/50 p-8 shadow-sm backdrop-blur-sm transition-all duration-500 ease-out hover:border-orange-200/50 teacher:hover:border-emerald-200/50 hover:bg-white/80 hover:shadow-lg hover:shadow-orange-500/10 teacher:hover:shadow-emerald-500/10 hover:-translate-y-1 ${visibleItems.has(index)
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
                }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <div className="relative mb-4 inline-flex">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-100 to-amber-50 teacher:from-emerald-100 teacher:to-teal-50 transition-all duration-300 group-hover:scale-110 group-hover:from-orange-200 group-hover:to-amber-100 teacher:group-hover:from-emerald-200 teacher:group-hover:to-teal-100 group-hover:shadow-md group-hover:shadow-orange-500/20 teacher:group-hover:shadow-emerald-500/20">
                  <feature.icon className="h-6 w-6 text-orange-600 teacher:text-emerald-600 transition-transform duration-300 group-hover:scale-110" />
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 -z-10 h-12 w-12 rounded-xl bg-gradient-to-br from-orange-400 to-amber-400 teacher:from-emerald-400 teacher:to-teal-400 opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-30" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-foreground transition-colors duration-300 group-hover:text-orange-700 teacher:group-hover:text-emerald-700">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>

              {/* Hover border gradient */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute inset-[-1px] rounded-2xl bg-gradient-to-br from-orange-300/30 teacher:from-emerald-300/30 via-transparent to-amber-300/30 teacher:to-teal-300/30" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
