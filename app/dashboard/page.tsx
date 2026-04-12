'use client'

import { useState } from "react"
import { AnimatedBackground } from "@/components/animated-background"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Sparkles,
  BookOpen,
  PlayCircle,
  Trophy,
  ChevronRight,
  Zap,
  Code2
} from "lucide-react"

// ── Mock Data ────────────────────────────────────────────────────────

const MOCK_ENROLLMENTS = [
  {
    id: "e1",
    seriesId: "s1",
    seriesTitle: "파이썬 데이터 분석 마스터",
    progressRate: 45,
    lastLectureTitle: "Pandas 기초 다지기",
    totalLectures: 12,
    finishedLectures: 5
  }
]

const MOCK_RECOMMENDATIONS = [
  {
    id: "s2",
    title: "React를 활용한 프론트엔드 실전",
    instructor: "김코딩 강사",
    targetLevel: "intermediate",
    description: "useState부터 커스텀 훅, 상태 관리까지 실무 기반의 리액트 핵심을 배웁니다.",
    lectureCount: 15
  },
  {
    id: "s3",
    title: "Next.js 14 및 서버 컴포넌트",
    instructor: "이넥스트 강사",
    targetLevel: "advanced",
    description: "Next.js의 최신 기능인 App Router와 RSC의 원리를 파악하고 실전 프로젝트를 만듭니다.",
    lectureCount: 8
  }
]

// ── Components ───────────────────────────────────────────────────────

export default function StudentDashboardPage() {
  const [enrollments] = useState(MOCK_ENROLLMENTS)
  const [recommendations] = useState(MOCK_RECOMMENDATIONS)

  return (
    <main className="relative min-h-screen bg-slate-50/50 pb-20">
      <AnimatedBackground />
      <Navbar />

      <div className="relative z-10 container mx-auto px-4 pt-28 max-w-5xl">
        {/* Header */}
        <div className="mb-12 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-orange-100 text-orange-700 border-none px-3 py-1 flex items-center gap-1.5">
              <Zap className="h-3 w-3" /> 내 학습 대시보드
            </Badge>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            환영합니다, 학생님! 👋
          </h1>
          <p className="text-gray-500 font-medium">
            현재 <b>{enrollments.length}개</b>의 강좌를 수강하고 있습니다. 계속해서 목표를 달성해 보세요.
          </p>
        </div>

        {/* My Enrollments Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <PlayCircle className="h-6 w-6 text-orange-500" /> 수강 중인 커리큘럼
          </h2>
          
          {enrollments.length === 0 ? (
            <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-[2rem] border border-dashed border-gray-200">
              <BookOpen className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-bold">아직 수강 중인 커리큘럼이 없습니다.</p>
              <p className="text-gray-400 text-sm mt-1 mb-5">아래 추천 커리큘럼에서 나에게 맞는 강의를 찾아보세요.</p>
              <Button onClick={() => window.location.href = '/chatbot'} className="bg-orange-600 hover:bg-orange-700 rounded-xl font-bold">
                AI 진단받기
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrollments.map((en) => (
                <div key={en.id} className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-7 border border-white/60 shadow-lg hover:shadow-xl transition-all relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100/30 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-orange-200/50 transition-all" />
                  
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-orange-50 text-orange-600 border-none px-2.5 py-0.5 rounded-full font-bold text-xs">
                      수강 중
                    </Badge>
                    <span className="text-xs font-bold text-gray-400">
                      {en.finishedLectures} / {en.totalLectures} 강좌
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                    {en.seriesTitle}
                  </h3>
                  <p className="text-sm font-medium text-gray-500 mb-6">
                    다음 학습: <span className="text-gray-900 font-bold">{en.lastLectureTitle}</span>
                  </p>

                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-orange-500">진도율</span>
                      <span className="text-orange-600">{en.progressRate}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-orange-400 to-amber-500 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${en.progressRate}%` }}
                      />
                    </div>
                  </div>

                  <Button 
                    className="w-full h-12 rounded-xl font-bold bg-gray-900 text-white hover:bg-orange-600 transition-colors"
                    onClick={() => window.location.href = `/learn/${en.seriesId}`}
                  >
                    이어서 학습하기 <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Recommended Section */}
        <div>
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-amber-500" /> AI 맞춤 추천 커리큘럼
              </h2>
              <p className="text-sm text-gray-500 mt-1">학생님의 목표와 수준에 꼭 맞는 강좌들을 모았습니다.</p>
            </div>
            <Button variant="outline" className="hidden sm:flex rounded-xl font-bold border-orange-200 text-orange-600 hover:bg-orange-50">
              다시 진단받기
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map(rec => (
              <div key={rec.id} className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 border border-white/60 shadow-sm hover:border-orange-200 hover:shadow-md transition-all cursor-pointer" onClick={() => window.location.href = `/series/${rec.id}`}>
                <div className="flex items-center gap-2 mb-3">
                  <Badge className={cn(
                    "border-none px-2 py-0.5 rounded-md font-bold text-[10px]",
                    rec.targetLevel === 'beginner' ? 'bg-emerald-50 text-emerald-600' :
                    rec.targetLevel === 'intermediate' ? 'bg-amber-50 text-amber-600' :
                    'bg-red-50 text-red-600'
                  )}>
                    {rec.targetLevel === 'beginner' ? '입문' : rec.targetLevel === 'intermediate' ? '중급' : '고급'}
                  </Badge>
                  <span className="text-xs font-bold text-gray-400 px-2 border-l border-gray-200">
                    {rec.instructor}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">
                  {rec.title}
                </h3>
                <p className="text-xs text-gray-500 mb-4 line-clamp-2 leading-relaxed">
                  {rec.description}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-400 font-bold pt-4 border-t border-slate-100">
                  <span className="flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5" /> 총 {rec.lectureCount}강</span>
                  <span className="text-orange-500 group-hover:translate-x-1 transition-transform flex items-center">
                    상세 보기 <ChevronRight className="h-3 w-3 ml-0.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
      <Footer />
    </main>
  )
}
