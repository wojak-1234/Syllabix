'use client'

import { useEffect, useState } from "react"
import { AnimatedBackground } from "@/components/animated-background"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, BookOpen, Clock, Trophy, AlertCircle, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export default function CurriculumPage() {
  const [savedCurriculum, setSavedCurriculum] = useState<any>(null)

  useEffect(() => {
    const raw = sessionStorage.getItem('savedCurriculum')
    if (raw) {
      setSavedCurriculum(JSON.parse(raw))
    }
  }, [])

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50/50">
      <AnimatedBackground />
      <Navbar />
      
      <div className="relative z-10 container mx-auto px-4 pt-32 pb-20 max-w-5xl">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            내 학습 <span className="text-orange-500">커리큘럼</span>
          </h1>
          <p className="text-gray-500 text-lg">
            생성된 커리큘럼을 확인하고 학습 목표를 향해 나아가세요.
          </p>
        </header>

        {savedCurriculum ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Main Info Card */}
            <Card className="border-none shadow-2xl bg-white/90 backdrop-blur-xl rounded-[2.5rem] overflow-hidden p-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-gray-100">
                <div className="space-y-3">
                  <Badge className="bg-emerald-100 text-emerald-700 border-none px-4 py-1.5 text-sm font-bold">
                    현재 진행 중
                  </Badge>
                  <CardTitle className="text-3xl md:text-4xl font-black flex items-center gap-3 text-gray-900 tracking-tight">
                    <Sparkles className="h-8 w-8 text-amber-500" />
                    {savedCurriculum.title}
                  </CardTitle>
                </div>
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 min-w-[180px]">
                  <div className="flex items-center gap-2 text-orange-600 font-bold mb-1">
                    <Clock className="h-4 w-4" />
                    총 {savedCurriculum.totalWeeks}주 과정
                  </div>
                  <div className="text-sm text-gray-500 font-medium">
                    예상 {savedCurriculum.totalHours}시간 학습
                  </div>
                </div>
              </div>

              {/* AI Insight */}
              {savedCurriculum.aiInsight && (
                <div className="mb-10 p-6 rounded-3xl bg-purple-50 border border-purple-100">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-2xl bg-purple-100 flex items-center justify-center shrink-0">
                      <Sparkles className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-purple-800 mb-1.5 uppercase tracking-wider">AI Insight Report</p>
                      <p className="text-gray-700 leading-relaxed font-medium">{savedCurriculum.aiInsight}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Phases */}
              <div className="space-y-12 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-gray-100 before:hidden sm:before:block">
                {savedCurriculum.phases.map((phase: any, idx: number) => (
                  <div key={idx} className="relative sm:pl-12">
                    {/* Phase Number Indicator */}
                    <div className="absolute left-0 top-0 hidden sm:flex h-8 w-8 rounded-full bg-white border-2 border-orange-500 items-center justify-center z-10">
                      <div className="h-3 w-3 rounded-full bg-orange-500" />
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-black text-orange-600 uppercase tracking-widest">Phase {phase.phaseNumber}</span>
                          <span className="h-1 w-1 rounded-full bg-gray-300" />
                          <span className="text-xs font-bold text-gray-400 tracking-tight">{phase.weekRange}</span>
                        </div>
                        <h4 className="text-2xl font-bold text-gray-900">{phase.title}</h4>
                      </div>
                      <Badge variant="outline" className={cn(
                        "border-none px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-tighter",
                        phase.riskLevel === 'high' ? "bg-red-50 text-red-600" :
                        phase.riskLevel === 'medium' ? "bg-amber-50 text-amber-600" :
                        "bg-emerald-50 text-emerald-600"
                      )}>
                        Risk Level: {phase.riskLevel}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                      {phase.topics.map((topic: string, tIdx: number) => (
                        <div key={tIdx} className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-white border border-gray-100 shadow-sm text-sm text-gray-700 font-medium">
                          <div className="h-2 w-2 rounded-full bg-orange-400 shrink-0" />
                          {topic}
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col gap-3">
                      {phase.milestone && (
                        <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100/50 text-sm text-emerald-800">
                          <Trophy className="h-5 w-5 text-emerald-500 shrink-0" />
                          <span className="font-bold shrink-0">마일스톤:</span>
                          <span className="font-medium">{phase.milestone}</span>
                        </div>
                      )}
                      {phase.riskReason && (
                        <div className="flex items-start gap-2.5 px-4 py-1 text-sm text-gray-400">
                          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                          <p className="font-medium underline underline-offset-4 decoration-gray-200 decoration-2 italic">"{phase.riskReason}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        ) : (
          <div className="animate-in fade-in zoom-in-95 duration-700">
            <Card className="border-4 border-dashed border-gray-200 bg-white/40 backdrop-blur-sm rounded-[3rem] p-20 text-center shadow-inner">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-[2rem] flex items-center justify-center mb-8 text-gray-400 shadow-xl shadow-gray-100">
                <BookOpen className="h-10 w-10" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">아직은 조용하군요...</h2>
              <p className="text-gray-500 text-lg mb-10 max-w-md mx-auto font-medium">
                나만을 위한 고퀄리티 학습 경로가 없습니다.<br/>지금 바로 첫 커리큘럼을 생성해보세요!
              </p>
              <a 
                href="/dashboard"
                className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold text-lg shadow-2xl shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-1 transition-all group"
              >
                커리큘럼 생성하러 가기
                <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </a>
            </Card>
          </div>
        )}
      </div>
      
      <Footer />
    </main>
  )
}
