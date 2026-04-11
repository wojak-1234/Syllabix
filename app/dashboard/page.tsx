'use client'

import { AnimatedBackground } from "@/components/animated-background"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import CurriculumGenerator from "@/components/CurriculumGenerator"
import { Sparkles } from "lucide-react"

export default function DashboardPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50/50">
      <AnimatedBackground />
      <Navbar />
      
      <div className="relative z-10 container mx-auto px-4 pt-28 pb-20">
        <header className="text-center mb-16 space-y-4">
          <h1 className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-6xl">
            My Learning Journey
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground font-medium">
            당신만의 특별한 학습 목표를 설정하고, 원하시는 방향에 맞춰 AI가 최적의 커리큘럼을 설계해 드립니다.
          </p>
        </header>

        <section className="pt-8 min-h-[600px]">
          <div className="flex items-center justify-center gap-2 mb-10">
            <Sparkles className="h-6 w-6 text-orange-500 animate-pulse" />
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
              새로운 커리큘럼 생성하기
            </h2>
            <Sparkles className="h-6 w-6 text-orange-500 animate-pulse" />
          </div>
          <CurriculumGenerator />
        </section>
      </div>
      
      <Footer />
    </main>
  )
}
