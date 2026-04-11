'use client'

import { useState, useEffect } from "react"
import { AnimatedBackground } from "@/components/animated-background"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import CurriculumGenerator from "@/components/CurriculumGenerator"
import { 
  Sparkles, 
  BrainCircuit, 
  Trophy, 
  BookOpen, 
  AlertCircle,
  ChevronRight,
  Check,
  Zap,
  Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface CurriculumPhase {
  phaseNumber: number
  title: string
  weekRange: string
  topics: string[]
  milestone: string
  riskLevel: 'low' | 'medium' | 'high'
  riskReason: string
}

interface Curriculum {
  title: string
  totalWeeks: number
  totalHours: number
  phases: CurriculumPhase[]
  aiInsight: string
}

export default function DashboardPage() {
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  // 1. 세션에서 데이터 확인 및 커리큘럼 생성 트리거
  useEffect(() => {
    const checkAndGenerate = async () => {
      const rawChatContext = sessionStorage.getItem('chatContext')
      const rawOnboardingResult = sessionStorage.getItem('onboardingResult')
      const savedCurriculum = sessionStorage.getItem('savedCurriculum')

      // 이미 저장된 커리큘럼이 있으면 그것을 표시
      if (savedCurriculum) {
        setCurriculum(JSON.parse(savedCurriculum))
        return
      }

      // 상담 내역과 진단 결과가 모두 있을 때만 자동 생성 시작
      if (rawChatContext && rawOnboardingResult) {
        setLoading(true)
        try {
          const chatContext = JSON.parse(rawChatContext)
          const onboardingResult = JSON.parse(rawOnboardingResult)

          const res = await fetch('/api/curriculum/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              action: 'generate',
              messages: chatContext.messages,
              initialForm: chatContext.initialForm,
              onboardingResult: onboardingResult
            })
          })
          const data = await res.json()
          
          if (data.curriculum) {
            setCurriculum(data.curriculum)
            sessionStorage.setItem('savedCurriculum', JSON.stringify(data.curriculum))
          }
        } catch (error) {
          console.error("커리큘럼 생성 에러:", error)
        } finally {
          setLoading(false)
        }
      }
    }

    checkAndGenerate()
  }, [])

  const handleSaveToDashboard = () => {
    setSaved(true)
    // 실제론 DB 저장 로직이 들어갈 자리
  }

  const handleReset = () => {
    sessionStorage.clear()
    window.location.reload()
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50/50 pb-20">
      <AnimatedBackground />
      <Navbar />
      
      <div className="relative z-10 container mx-auto px-4 pt-28 max-w-5xl">
        {/* Case 1: Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in fade-in zoom-in-95 duration-700">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-400 rounded-full animate-ping opacity-20" />
              <div className="relative h-24 w-24 bg-gradient-to-br from-orange-500 to-amber-400 rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-500/20 rotate-12">
                <BrainCircuit className="h-12 w-12 text-white animate-pulse" />
              </div>
            </div>
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">당신만의 커리큘럼을 설계 중입니다</h2>
              <p className="text-gray-500 font-medium">상담 요약과 진단 데이터를 바탕으로 최적의 학습 경로를 빚어내고 있어요...</p>
            </div>
            <div className="flex gap-2">
              {[0, 1, 2].map(i => (
                <div key={i} className="h-3 w-3 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: `${i * 200}ms` }} />
              ))}
            </div>
          </div>
        )}

        {/* Case 2: Show Result */}
        {!loading && curriculum && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Summary Card */}
            <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl p-10 border border-white/60 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100/30 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-orange-200/40 transition-colors duration-700" />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-none px-3 py-1 flex items-center gap-1.5">
                      <Zap className="h-3 w-3" /> AI 개인화 설계
                    </Badge>
                  </div>
                  <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                    {curriculum.title}
                  </h1>
                </div>
                <div className="flex items-center gap-6 bg-slate-50/80 p-5 rounded-3xl border border-slate-100 shadow-inner shrink-0">
                  <div className="text-center px-4 border-r border-slate-200">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">전체 기간</p>
                    <p className="text-xl font-black text-gray-900 flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-orange-500" /> {curriculum.totalWeeks}주
                    </p>
                  </div>
                  <div className="text-center px-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">총 학습 시간</p>
                    <p className="text-xl font-black text-gray-900 flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-amber-500" /> {curriculum.totalHours}시간
                    </p>
                  </div>
                </div>
              </div>

              {/* AI Deep Insight */}
              <div className="p-6 rounded-[2rem] bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100/50 shadow-sm relative overflow-hidden group/insight">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/insight:opacity-20 transition-opacity">
                  <BrainCircuit className="h-20 w-20 text-indigo-600" />
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
                    <Sparkles className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-indigo-950 mb-1 flex items-center gap-2">AI 컨설턴트 한마디</h4>
                    <p className="text-sm text-indigo-800 leading-relaxed font-medium">{curriculum.aiInsight}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Phases Grid/Timeline */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 px-4 flex items-center gap-3">
                  <BookOpen className="h-6 w-6 text-orange-500" /> 단계별 학습 로드맵
                </h3>
                <div className="space-y-4">
                  {curriculum.phases.map((phase, idx) => (
                    <div key={idx} className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-8 border border-white/60 shadow-lg hover:shadow-xl hover:translate-x-1 transition-all duration-300">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-orange-50 text-orange-600 font-black flex items-center justify-center text-xl shrink-0">
                            {idx + 1}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-orange-500/80 tracking-widest uppercase">{phase.weekRange}</span>
                            <h4 className="text-xl font-bold text-gray-900">{phase.title}</h4>
                          </div>
                        </div>
                        <Badge className={cn(
                          "px-4 py-1.5 rounded-full border-none font-bold text-xs shadow-sm",
                          phase.riskLevel === 'high' ? "bg-red-50 text-red-600" :
                          phase.riskLevel === 'medium' ? "bg-amber-50 text-amber-600" :
                          "bg-emerald-50 text-emerald-600"
                        )}>
                          난이도 {phase.riskLevel.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                        {phase.topics.map((topic, tidx) => (
                          <div key={tidx} className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/50 border border-slate-100 text-slate-700 text-sm font-medium hover:bg-orange-50/50 hover:border-orange-100 transition-colors group/topic">
                            <div className="h-2 w-2 rounded-full bg-orange-300 group-hover/topic:scale-125 transition-transform" />
                            {topic}
                          </div>
                        ))}
                      </div>

                      <div className="space-y-3 pt-4 border-t border-slate-100">
                        <div className="flex items-start gap-3">
                          <Trophy className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold text-emerald-700 mb-0.5">도달 목표</p>
                            <p className="text-sm text-gray-700 font-medium">{phase.milestone}</p>
                          </div>
                        </div>
                        {phase.riskReason && (
                          <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-bold text-amber-700 mb-0.5">학습 포인트</p>
                              <p className="text-sm text-gray-600 font-medium leading-relaxed">{phase.riskReason}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4 space-y-6">
                <div className="sticky top-28 space-y-6">
                  <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/60 shadow-xl relative overflow-hidden group/actions">
                    <div className="absolute -bottom-10 -right-10 p-4 opacity-5 group-hover/actions:opacity-10 transition-opacity">
                      <Sparkles className="h-40 w-40 text-orange-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                       <Zap className="h-5 w-5 text-orange-500" />
                       맞춤형 학습 관리
                    </h3>
                    <div className="space-y-4 relative z-10">
                      <Button 
                        onClick={handleSaveToDashboard}
                        disabled={saved}
                        className={cn(
                          "w-full h-14 rounded-2xl font-bold text-base transition-all",
                          saved 
                           ? "bg-emerald-500 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                           : "bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-1 active:scale-95"
                        )}
                      >
                        {saved ? (
                          <div className="flex items-center gap-2">
                            <Check className="h-5 w-5" /> 
                            저장이 완료되었습니다
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            커리큘럼 저장하기
                            <ChevronRight className="h-4 w-4" />
                          </div>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={handleReset}
                        className="w-full h-14 rounded-2xl bg-white border-orange-100 text-orange-600 hover:bg-orange-50 hover:border-orange-200 font-bold transition-all active:scale-95"
                      >
                        새로운 목표 설정하기
                      </Button>
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/60 shadow-lg">
                    <h4 className="font-bold text-gray-900 mb-4">학습 가이드</h4>
                    <ul className="space-y-4">
                      {[
                        "매일 정해진 분량을 꾸준히 해내는 것이 중요합니다.",
                        "이해가 안 되는 부분은 AI 챗봇에게 즉시 질문하세요.",
                        "이론보다는 실습 위주로 프로젝트를 완성해보세요."
                      ].map((tip, idx) => (
                        <li key={idx} className="flex gap-3 text-sm text-gray-600 font-medium">
                          <div className="h-5 w-5 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                            <Check className="h-3 w-3 text-orange-600" />
                          </div>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Case 3: Empty State (Starting New) */}
        {!loading && !curriculum && (
          <>
            <header className="text-center mb-16 space-y-4">
              <h1 className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-6xl">
                나만의 학습 여정
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
          </>
        )}
      </div>
      
      <Footer />
    </main>
  )
}
