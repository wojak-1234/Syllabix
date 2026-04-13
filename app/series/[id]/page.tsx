'use client'

import { useState, use } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  BookOpen, ChevronLeft, CalendarDays, BarChart, 
  CheckCircle2, PlayCircle, Rocket, Sparkles, Star
} from "lucide-react"

// ── Mock Data ────────────────────────────────────────────────────────

const MOCK_SERIES_DETAIL = {
  id: "s2",
  title: "React를 활용한 프론트엔드 실전",
  instructor: "김코딩 강사",
  instructorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  rating: 4.8,
  reviewCount: 124,
  targetLevel: "intermediate",
  tags: ["React", "Frontend", "Web", "JavaScript"],
  description: "실무에서 쓰이는 React의 핵심 패턴과 상태 관리를 배웁니다. 기본 useState부터 커스텀 훅까지 프로젝트 기반으로 학습하여 실제 업무에 바로 투입될 수 있는 실력을 기릅니다.",
  totalLectures: 15,
  totalHours: 12,
  lectures: [
    { title: "React 기초 복습 및 세팅", type: "video" },
    { title: "useState와 useEffect 깊게 파기", type: "video" },
    { title: "컴포넌트 분리 및 Props 활용", type: "quiz" },
    { title: "커스텀 훅 직접 만들어보기", type: "code" },
  ]
}

export default function SeriesDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [course] = useState(MOCK_SERIES_DETAIL)
  const [isJoining, setIsJoining] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleJoin = async () => {
    setIsJoining(true)
    
    try {
      setTimeout(() => {
        setIsJoining(false)
        setIsSuccess(true)
        setTimeout(() => {
          window.location.href = `/learn/${course.id}`
        }, 1500)
      }, 1000)
    } catch (e) {
      console.error(e)
      setIsJoining(false)
    }
  }

  return (
    <main className="relative min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero Banner */}
      <div className="bg-slate-900 pt-32 pb-24 relative overflow-hidden text-slate-300">
        <div className="absolute top-0 right-0 -mr-64 -mt-32 w-96 h-96 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="container mx-auto max-w-4xl px-4 relative z-10">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-white transition-colors mb-10 group"
          >
            <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> 뒤로 가기
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-6">
                <Badge className={cn(
                   "border-none px-3 py-1 rounded-full font-bold text-[11px] shadow-sm uppercase tracking-wider",
                   course.targetLevel === 'beginner' ? 'bg-emerald-500/20 text-emerald-400' :
                   course.targetLevel === 'intermediate' ? 'bg-amber-500/20 text-amber-400' :
                   'bg-rose-500/20 text-rose-400'
                )}>
                  {course.targetLevel === 'beginner' ? 'Beginner' : course.targetLevel === 'intermediate' ? 'Intermediate' : 'Advanced'}
                </Badge>
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="h-4 w-4 fill-amber-400" />
                  <span className="font-black text-sm">{course.rating}</span>
                  <span className="text-slate-500 text-xs font-medium">({course.reviewCount}+)</span>
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.1] tracking-tight mb-8">
                {course.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-10">
                {course.tags.map(tag => (
                  <Badge key={tag} className="bg-slate-800/50 text-slate-400 border border-slate-700/50 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors hover:bg-slate-700/50">
                    #{tag}
                  </Badge>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-8">
                <div className="flex items-center gap-4 group">
                  <div className="relative">
                    <div className="absolute inset-0 bg-orange-500 rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
                    <img src={course.instructorImage} alt="instructor" className="relative h-14 w-14 bg-slate-800 rounded-2xl border border-slate-700 object-cover" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Instructor</p>
                    <p className="font-black text-white text-lg">{course.instructor}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-8">
                  <div className="w-px h-10 bg-slate-800 hidden md:block" />
                  <div className="flex gap-10">
                    <div className="space-y-1">
                      <p className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                        <BookOpen className="h-3 w-3 text-orange-500" /> Lectures
                      </p>
                      <p className="text-xl font-black text-white">{course.totalLectures}<span className="text-sm font-medium text-slate-500 ml-1">강</span></p>
                    </div>
                    <div className="space-y-1">
                      <p className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                        <CalendarDays className="h-3 w-3 text-emerald-500" /> Estimated
                      </p>
                      <p className="text-xl font-black text-white">{course.totalHours}<span className="text-sm font-medium text-slate-500 ml-1">시간</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-16 flex flex-col md:flex-row gap-8 relative items-start">
        {/* Left column: Curriculum Details */}
        <div className="flex-1 space-y-8">
          <h2 className="text-2xl font-black text-gray-900 border-b border-gray-200 pb-4">
            어떤 내용을 배우게 되나요?
          </h2>
          
          <div className="space-y-4">
            {course.lectures.map((lec, idx) => (
              <div key={idx} className="flex gap-4 group">
                <div className="flex flex-col items-center">
                  <div className="h-8 w-8 rounded-full border-2 border-gray-200 bg-white flex items-center justify-center font-bold text-xs text-gray-400 group-hover:border-orange-400 group-hover:text-orange-500 transition-colors z-10 relative">
                    {idx + 1}
                  </div>
                  {idx !== course.lectures.length - 1 && (
                    <div className="w-px h-full bg-gray-200 my-1 group-hover:bg-orange-200 transition-colors" />
                  )}
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex-1 mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="outline" className="text-[10px] text-gray-500 font-bold px-2 py-0.5 border-gray-200">
                      {lec.type === 'video' ? '📺 영상 강의' : lec.type === 'quiz' ? '✅ 간단 퀴즈' : '💻 코딩 실습'}
                    </Badge>
                  </div>
                  <h4 className="font-bold text-gray-900">{lec.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: Action Board (Sticky) */}
        <div className="w-full md:w-80 bg-white border border-gray-200 rounded-[2rem] p-8 shadow-xl sticky top-8">
           <div className="text-center mb-6">
             <div className="inline-flex h-16 w-16 bg-orange-50 text-orange-500 rounded-2xl items-center justify-center mb-4">
               <Rocket className="h-8 w-8" />
             </div>
             <h3 className="text-xl font-black text-gray-900 mb-2">지금 바로 스킬을<br/>업그레이드 하세요!</h3>
           </div>
           
           <Button 
             onClick={handleJoin} 
             disabled={isJoining || isSuccess}
             className={cn(
               "w-full h-14 rounded-2xl font-bold text-lg shadow-lg transition-all",
               isSuccess ? "bg-emerald-500 text-white shadow-emerald-500/30" : "bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-orange-500/30 hover:-translate-y-1 hover:shadow-orange-500/50"
             )}
           >
             {isSuccess ? (
               <span className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5" /> 수강 처리됨</span>
             ) : isJoining ? (
               <span className="flex items-center gap-2">
                 <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> 준비 중...
               </span>
             ) : (
               "수강 신청하기 (무료)"
             )}
           </Button>
           
           {isSuccess && (
             <p className="text-center text-xs font-bold text-emerald-600 mt-4 animate-pulse">
               강의실로 이동합니다...
             </p>
           )}
           
           <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-3 bg-slate-50 p-4 rounded-xl">
             <Sparkles className="h-5 w-5 text-amber-500" />
             <p className="text-xs text-gray-500 font-medium leading-relaxed">
               AI 진단 결과를 통해 <strong className="text-gray-900">100% 매칭도</strong>가 입증된 코스입니다.
             </p>
           </div>
        </div>
      </div>
      
      <Footer />
    </main>
  )
}
