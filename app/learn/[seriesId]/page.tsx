'use client'

import { useState } from "react"
import { AnimatedBackground } from "@/components/animated-background"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  PlayCircle,
  BookOpen,
  CheckCircle2,
  Lock,
  ChevronRight,
  ChevronLeft
} from "lucide-react"

// ── Mock Data ────────────────────────────────────────────────────────

const MOCK_ENROLLMENT_DETAIL = {
  seriesId: "s1",
  seriesTitle: "파이썬 데이터 분석 마스터",
  description: "파이썬 기초부터 실무 데이터 분석까지 완벽하게 마스터합니다.",
  progressRate: 45,
  lectures: [
    { id: "l1", title: "파이썬 환경 설정", isCompleted: true, type: "video" },
    { id: "l2", title: "자료형과 변수", isCompleted: true, type: "quiz" },
    { id: "l3", title: "Pandas 기초 다지기", isCompleted: false, type: "code", isCurrent: true },
    { id: "l4", title: "데이터 시각화", isCompleted: false, type: "video" },
  ]
}

export default function SeriesLearnPage() {
  const [detail] = useState(MOCK_ENROLLMENT_DETAIL)

  return (
    <main className="relative min-h-screen bg-slate-50/50 pb-20">
      <AnimatedBackground />
      <Navbar />

      <div className="relative z-10 container mx-auto px-4 pt-28 max-w-4xl">
        {/* Back */}
        <button
          onClick={() => window.location.href = '/dashboard'}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-600 font-medium mb-6 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" /> 대시보드로 돌아가기
        </button>

        {/* Header Summary */}
        <div className="bg-white/90 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/60 shadow-xl mb-10 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100/30 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
          
          <h1 className="text-3xl font-black text-gray-900 mb-2">{detail.seriesTitle}</h1>
          <p className="text-gray-500 mb-8">{detail.description}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full border-4 border-slate-100 flex items-center justify-center relative">
                 <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle
                      cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" 
                      className="text-orange-500" fill="none"
                      strokeDasharray="175" strokeDashoffset={175 - (175 * detail.progressRate) / 100}
                    />
                 </svg>
                 <span className="text-sm font-black text-gray-900">{detail.progressRate}%</span>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">전체 진행률</p>
                <p className="text-sm font-bold text-gray-700">좋은 페이스입니다!</p>
              </div>
            </div>
            
            <Button 
              className="h-12 px-6 rounded-2xl font-bold bg-gray-900 text-white hover:bg-orange-600 transition-colors shadow-lg"
              onClick={() => {
                const currentId = detail.lectures.find(l => l.isCurrent)?.id || detail.lectures[0].id;
                window.location.href = `/learn/${detail.seriesId}/lecture/${currentId}`;
              }}
            >
              이어서 학습하기 <PlayCircle className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Lecture List */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 px-2">
            <BookOpen className="h-5 w-5 text-orange-500" /> 목차
          </h3>
          
          <div className="space-y-3">
            {detail.lectures.map((lecture, idx) => (
              <div 
                key={lecture.id}
                className={cn(
                  "flex items-center justify-between p-5 rounded-2xl border transition-all cursor-pointer",
                  lecture.isCurrent ? "bg-orange-50 border-orange-200 shadow-md" : 
                  lecture.isCompleted ? "bg-white/80 border-slate-200" : "bg-slate-50/50 border-slate-100 opacity-60"
                )}
                onClick={() => {
                  if (lecture.isCompleted || lecture.isCurrent) {
                    window.location.href = `/learn/${detail.seriesId}/lecture/${lecture.id}`;
                  }
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-full flex items-center justify-center bg-white shadow-sm border border-slate-100">
                    {lecture.isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    ) : lecture.isCurrent ? (
                      <PlayCircle className="h-5 w-5 text-orange-500" />
                    ) : (
                      <Lock className="h-4 w-4 text-gray-300" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 mb-0.5">강좌 {idx + 1}</p>
                    <h4 className={cn("text-base font-bold", lecture.isCurrent ? "text-orange-900" : "text-gray-900")}>
                      {lecture.title}
                    </h4>
                  </div>
                </div>
                
                {(lecture.isCurrent || lecture.isCompleted) && (
                  <ChevronRight className={cn("h-5 w-5", lecture.isCurrent ? "text-orange-500" : "text-gray-300")} />
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
      <Footer />
    </main>
  )
}
