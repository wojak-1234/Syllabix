'use client'

import { useState, useEffect } from "react"
import { AnimatedBackground } from "@/components/animated-background"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, ChevronRight, Zap, AlertTriangle, BookOpen, PlayCircle, Calendar, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
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
    instructorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    rating: 4.8,
    targetLevel: "intermediate",
    description: "useState부터 커스텀 훅, 상태 관리까지 실무 기반의 리액트 핵심을 배웁니다.",
    lectureCount: 15
  },
  {
    id: "s3",
    title: "Next.js 14 및 서버 컴포넌트",
    instructor: "이넥스트 강사",
    instructorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
    rating: 4.9,
    targetLevel: "advanced",
    description: "Next.js의 최신 기능인 App Router와 RSC의 원리를 파악하고 실전 프로젝트를 만듭니다.",
    lectureCount: 8
  }
]

// ── Components ───────────────────────────────────────────────────────

export default function StudentDashboardPage() {
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [curriculum, setCurriculum] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/student/dashboard')
          if (res.ok) {
          const data = await res.json()
          setEnrollments(data.enrollments)
          setCurriculum(data.curriculum)
        }
      } catch (e) {
        console.error("Dashboard failed to load", e)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
      </div>
    )
  }

  const activeIndex = enrollments.findIndex(e => e.progressRate < 100) === -1 ? enrollments.length - 1 : enrollments.findIndex(e => e.progressRate < 100)


  return (
    <main className="relative min-h-screen bg-slate-50/50 pb-20">
      <AnimatedBackground />
      <Navbar />

      <div className="relative z-10 container mx-auto px-4 pt-28 max-w-5xl">
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-3">
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
          
          <Button 
            onClick={() => window.location.href='/blunders'}
            variant="outline"
            className="h-12 bg-white/50 backdrop-blur-sm border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl font-bold shadow-sm flex items-center gap-2 px-5"
          >
             <AlertTriangle className="h-4 w-4" /> 나의 다빈도 실수 분석 (Blunders)
          </Button>
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
              <Button onClick={() => window.location.href = '/onboarding'} className="bg-orange-600 hover:bg-orange-700 rounded-xl font-bold">
                AI 진단받기
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {enrollments.map((en, idx, arr) => {
                const activeIndex = arr.findIndex(e => e.progressRate < 100) === -1 ? arr.length - 1 : arr.findIndex(e => e.progressRate < 100)
                const isActive = idx === activeIndex

                return (
                 <div 
                    key={en.id} 
                    className={cn(
                      "transition-all duration-500 relative overflow-hidden group border",
                      isActive 
                        ? "bg-white/90 backdrop-blur-xl rounded-[2rem] p-8 shadow-xl border-orange-200/50 scale-100 opacity-100" 
                        : "bg-slate-50/50 hover:bg-white/60 rounded-2xl p-5 shadow-sm border-transparent opacity-60 hover:opacity-80 scale-[0.98] cursor-pointer"
                    )}
                    onClick={() => { if (!isActive) window.location.href = `/learn/${en.seriesId}` }}
                  >
                    {isActive && (
                      <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/10 rounded-full -mr-20 -mt-20 blur-3xl transition-all" />
                    )}
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className={cn(
                            "border-none px-2.5 py-0.5 rounded-full font-black text-[10px] tracking-wider",
                            isActive ? "bg-orange-500 text-white shadow-md shadow-orange-500/20" : "bg-slate-200 text-slate-500"
                          )}>
                            {en.progressRate === 100 ? "학습 완료" : isActive ? "현재 집중 강좌" : "대기 중"}
                          </Badge>
                          <span className={cn("text-xs font-bold", isActive ? "text-gray-400" : "text-gray-400")}>
                            {en.finishedLectures} / {en.totalLectures} 강좌 완료
                          </span>
                        </div>

                        <h3 className={cn(
                          "font-black tracking-tight mb-1",
                          isActive ? "text-2xl text-gray-900" : "text-lg text-gray-600"
                        )}>
                          {en.seriesTitle}
                        </h3>
                        
                        {isActive && (
                          <p className="text-sm font-medium text-gray-500 mb-6 mt-3">
                            지금 바로 이어서 👉 <span className="text-gray-900 font-bold">{en.lastLectureTitle}</span>
                          </p>
                        )}
                      </div>

                      <div className={cn(
                        "w-full md:w-64 shrink-0 space-y-3",
                        !isActive && "md:w-32"
                      )}>
                        <div className="flex justify-between text-xs font-black">
                          <span className={isActive ? "text-orange-500" : "text-gray-500"}>진도율</span>
                          <span className={isActive ? "text-orange-600" : "text-gray-600"}>{en.progressRate}%</span>
                        </div>
                        <div className="w-full bg-slate-200/50 h-2.5 rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full rounded-full transition-all duration-1000",
                              en.progressRate === 100 ? "bg-slate-400" : isActive ? "bg-gradient-to-r from-orange-400 to-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.3)]" : "bg-orange-300"
                            )}
                            style={{ width: `${en.progressRate}%` }}
                          />
                        </div>
                        {isActive && (
                          <Button 
                            className="w-full h-12 mt-4 rounded-xl font-bold bg-gray-900 text-white hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/20 transition-all active:scale-95"
                            onClick={(e) => { e.stopPropagation(); window.location.href = `/learn/${en.seriesId}` }}
                          >
                            이어서 학습하기 <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Upcoming Curriculum Roadmap Section */}
        {curriculum && (
          <div className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-emerald-500" /> 예정된 학습 로드맵
                </h2>
                <p className="text-sm text-gray-500 mt-1">AI가 설계한 '{curriculum.title}'의 다음 여정입니다.</p>
              </div>
              <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 px-3 py-1 font-bold">
                진행 중인 경로
              </Badge>
            </div>

            <div className="relative border-l-2 border-slate-200 ml-4 pl-8 space-y-10">
              {curriculum.phases.map((phase: any, pIdx: number) => {
                // 이 페이즈의 모든 강좌가 완료되었는지 확인 (단순 예시 로직)
                const isCompleted = phase.linkedCourses?.every((c: any) => 
                   enrollments.find(e => e.seriesId === c.id)?.progressRate === 100
                )
                const isCurrent = !isCompleted && phase.linkedCourses?.some((c: any) => 
                   enrollments.find(e => e.seriesId === c.id)?.progressRate < 100
                )

                return (
                  <div key={pIdx} className="relative">
                    {/* Timeline Dot */}
                    <div className={cn(
                      "absolute -left-[41px] top-1 h-5 w-5 rounded-full border-4 bg-white transition-all",
                      isCompleted ? "border-emerald-500 bg-emerald-500" :
                      isCurrent ? "border-orange-500 scale-125 shadow-[0_0_10px_rgba(249,115,22,0.5)]" :
                      "border-slate-200"
                    )} />
                    
                    <div className={cn(
                      "transition-all",
                      !isCurrent && !isCompleted && "opacity-50"
                    )}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phase {phase.phaseNumber}</span>
                        <span className="text-xs font-bold text-slate-300">•</span>
                        <span className="text-xs font-bold text-slate-400">{phase.weekRange}</span>
                      </div>
                      <h4 className="text-lg font-black text-gray-900 mb-4">{phase.title}</h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                         {phase.linkedCourses?.map((course: any, cIdx: number) => {
                            const en = enrollments.find(e => e.seriesId === course.id)
                            return (
                              <div key={cIdx} className="flex items-center justify-between p-4 rounded-xl bg-white border border-slate-100 shadow-sm group hover:border-emerald-200 transition-all">
                                 <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center">
                                       <BookOpen className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <div>
                                       <p className="text-sm font-bold text-gray-800 line-clamp-1">{course.title}</p>
                                       <p className="text-[10px] font-medium text-gray-400">{en ? `진도율 ${en.progressRate}%` : '학습 예정'}</p>
                                    </div>
                                 </div>
                                 {en?.progressRate === 100 ? (
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                 ) : (
                                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                                 )}
                              </div>
                            )
                         })}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

      </div>
      <Footer />
    </main>
  )
}
