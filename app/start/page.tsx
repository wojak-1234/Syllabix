"use client"

import { AnimatedBackground } from "@/components/animated-background"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { User, GraduationCap, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function StartPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <AnimatedBackground />
      <Navbar />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pt-24 pb-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            시작하기
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            당신에게 맞는 역할을 선택하여 맞춤형 학습 여정을 시작하세요.
          </p>
        </div>

        {/* Selection Cards */}
        <div className="grid w-full max-w-5xl gap-8 md:grid-cols-2">
          {/* Student Card */}
          <Link
            href="/dashboard"
            className="group"
            onClick={() => {
              localStorage.setItem("user-role", "student");
              window.dispatchEvent(new Event('roleUpdate'));
            }}
          >
            {/* ... student card content ... */}
            <div className="relative h-full overflow-hidden rounded-[2.5rem] border border-orange-200/50 bg-gradient-to-br from-orange-50/80 to-amber-50/50 p-8 shadow-xl shadow-orange-500/5 transition-all duration-500 hover:-translate-y-2 hover:border-orange-300 hover:shadow-2xl hover:shadow-orange-500/15 backdrop-blur-sm">
              {/* ... content ... */}
              <div className="relative z-10">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 text-white shadow-lg shadow-orange-500/20">
                  <GraduationCap className="h-7 w-7" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">저는 학생입니다</h2>
                <p className="mt-3 text-gray-600">
                  나만의 커리큘럼을 생성해 학습하고,<br />
                  AI 분석을 통해 취약점을 보완하세요.
                </p>
                <div className="mt-8">
                  <Button className="rounded-xl bg-orange-500 px-6 font-semibold text-white transition-all duration-300 group-hover:bg-orange-600 group-hover:shadow-lg group-hover:shadow-orange-500/30">
                    학생 대시보드 입장
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>

              {/* Infographic Image */}
              <div className="relative mt-8 flex justify-center perspective-1000">
                <div className="relative h-64 w-full transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1">
                  <Image
                    src="/images/student-start.png"
                    alt="Student Learning Infographic"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-orange-200/20 blur-3xl transition-opacity duration-500 group-hover:opacity-40" />
            </div>
          </Link>

          {/* Teacher Card */}
          <Link
            href="/teacher"
            className="group"
            onClick={() => {
              localStorage.setItem("user-role", "teacher");
              window.dispatchEvent(new Event('roleUpdate'));
            }}
          >
            <div className="relative h-full overflow-hidden rounded-[2.5rem] border border-emerald-200/50 bg-gradient-to-br from-emerald-50/80 to-teal-50/50 p-8 shadow-xl shadow-emerald-500/5 transition-all duration-500 hover:-translate-y-2 hover:border-emerald-300 hover:shadow-2xl hover:shadow-emerald-500/15 backdrop-blur-sm">
              <div className="relative z-10">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 text-white shadow-lg shadow-emerald-500/20">
                  <User className="h-7 w-7" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">저는 선생님입니다.</h2>
                <p className="mt-3 text-gray-600">
                  학생들의 학습 상태를 모니터링하고,<br />
                  데이터 기반의 맞춤 지도를 시작하세요.
                </p>
                <div className="mt-8">
                  <Button className="rounded-xl bg-emerald-600 px-6 font-semibold text-white transition-all duration-300 group-hover:bg-emerald-700 group-hover:shadow-lg group-hover:shadow-emerald-500/30">
                    교사 매니지먼트 입장
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>

              {/* Infographic Image */}
              <div className="relative mt-8 flex justify-center perspective-1000">
                <div className="relative h-64 w-full transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-1">
                  <Image
                    src="/images/teacher-start.png"
                    alt="Teacher Management Infographic"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-200/20 blur-3xl transition-opacity duration-500 group-hover:opacity-40" />
            </div>
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  )
}
