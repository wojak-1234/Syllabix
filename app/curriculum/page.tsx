'use client'

import { useEffect, useState } from "react"
import { AnimatedBackground } from "@/components/animated-background"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Sparkles, BookOpen, Clock, Trophy, AlertCircle, 
  ChevronRight, ArrowLeft, Loader2, Target, Brain, 
  Settings2, Ghost, Lightbulb
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function CurriculumPage() {
  const [savedCurriculum, setSavedCurriculum] = useState<any>(null)
  const [showForm, setShowForm] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  
  // Form States
  const [goal, setGoal] = useState('')
  const [currentLevel, setCurrentLevel] = useState('beginner')
  const [hoursPerWeek, setHoursPerWeek] = useState(5)
  const [excludes, setExcludes] = useState('')

  useEffect(() => {
    const raw = sessionStorage.getItem('savedCurriculum')
    if (raw) {
      setSavedCurriculum(JSON.parse(raw))
    }
  }, [])

  const handleGenerate = async () => {
    if (!goal) return
    setIsGenerating(true)
    console.log("[Client] Starting curriculum generation...");
    
    try {
      const res = await fetch('/api/curriculum/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal, currentLevel, hoursPerWeek, excludes })
      })

      console.log("[Client] Fetch response status:", res.status);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${res.status}`);
      }

      const data = await res.json()
      console.log("[Client] Curriculum generated successfully");

      if (data.curriculum) {
        setSavedCurriculum(data.curriculum)
        sessionStorage.setItem('savedCurriculum', JSON.stringify(data.curriculum))
        setShowForm(false)
      }
    } catch (err: any) {
      console.error("[Client] Generation Error:", err)
      alert(`커리큘럼 생성에 실패했습니다: ${err.message}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const resetGenerator = () => {
    setSavedCurriculum(null)
    sessionStorage.removeItem('savedCurriculum')
    setShowForm(true)
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50/50">
      <AnimatedBackground />
      <Navbar />
      
      <div className="relative z-10 container mx-auto px-4 pt-32 pb-20 max-w-5xl">
        {/* Header Section */}
        {!showForm && (
          <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                내 학습 <span className="text-orange-500">커리큘럼</span>
              </h1>
              <p className="text-gray-500 text-lg">
                AI 교육 설계자가 당신만을 위해 제안하는 성공 학습 경로입니다.
              </p>
            </div>
            {savedCurriculum && (
              <Button 
                variant="outline" 
                onClick={resetGenerator}
                className="rounded-2xl h-12 font-bold bg-white/50 backdrop-blur-sm border-gray-200 hover:bg-white transition-all shadow-sm"
              >
                새로운 커리큘럼 생성하기
              </Button>
            )}
          </header>
        )}

        {showForm ? (
          /* Curriculum Generator Form */
          <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
            <button 
              onClick={() => setShowForm(false)}
              className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-600 mb-8 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> 돌아가기
            </button>
            
            <Card className="border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] bg-white/90 backdrop-blur-2xl rounded-[3rem] p-10 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -mr-16 -mt-16 blur-2xl" />
              
              <div className="flex items-center gap-3 mb-8">
                <div className="h-12 w-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/30">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 leading-tight">AI 커리큘럼 설계자</h2>
                  <p className="text-xs font-bold text-orange-600 uppercase tracking-widest mt-1">Syllabix Learning Architect v2.0</p>
                </div>
              </div>

              <div className="space-y-8">
                {/* Topic Input */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-black text-gray-700 uppercase tracking-wider ml-1">
                    <Target className="h-4 w-4 text-orange-500" /> 어떤 주제를 마스터하고 싶으세요?
                  </label>
                  <input 
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="예: 실무에서 바로 써먹는 파이썬 데이터 분석, React 기초부터 실전..."
                    className="w-full h-16 px-6 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:bg-white transition-all"
                  />
                </div>

                {/* Level & Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-black text-gray-700 uppercase tracking-wider ml-1">
                      <Brain className="h-4 w-4 text-emerald-500" /> 현재 본인의 수준
                    </label>
                    <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                      {['beginner', 'intermediate', 'advanced'].map((lv) => (
                        <button
                          key={lv}
                          onClick={() => setCurrentLevel(lv)}
                          className={cn(
                            "flex-1 h-10 rounded-xl text-xs font-black transition-all",
                            currentLevel === lv ? "bg-white text-gray-900 shadow-md" : "text-gray-400 hover:text-gray-600"
                          )}
                        >
                          {lv === 'beginner' ? '입문' : lv === 'intermediate' ? '중급' : '고급'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-black text-gray-700 uppercase tracking-wider ml-1">
                      <Clock className="h-4 w-4 text-blue-500" /> 주당 학습 가능 시간
                    </label>
                    <div className="flex items-center gap-4 bg-slate-50 h-[52px] px-4 rounded-2xl border border-slate-100">
                      <input 
                        type="range" min="1" max="40" 
                        value={hoursPerWeek} 
                        onChange={(e) => setHoursPerWeek(parseInt(e.target.value))}
                        className="flex-1 accent-blue-500 cursor-pointer" 
                      />
                      <span className="w-12 text-center font-black text-gray-900">{hoursPerWeek}h</span>
                    </div>
                  </div>
                </div>

                {/* Exclusions */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-black text-gray-700 uppercase tracking-wider ml-1">
                    <Settings2 className="h-4 w-4 text-rose-500" /> 제외하고 싶은 점 (선택)
                  </label>
                  <textarea 
                    value={excludes}
                    onChange={(e) => setExcludes(e.target.value)}
                    placeholder="예: 어려운 수학 수식은 빼주세요, 유료 강의는 제외해주세요..."
                    rows={3}
                    className="w-full p-6 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:bg-white transition-all resize-none"
                  />
                </div>

                {/* Submit Button */}
                <Button 
                  onClick={handleGenerate}
                  disabled={!goal || isGenerating}
                  className="w-full h-16 rounded-[2rem] bg-gradient-to-r from-orange-600 to-amber-500 text-white font-black text-lg shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-1 active:scale-[0.98] transition-all disabled:opacity-50 mt-4"
                >
                  {isGenerating ? (
                    <span className="flex items-center gap-3">
                      <Loader2 className="h-6 w-6 animate-spin" /> 수석 교육 설계자가 분석 중...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">마법처럼 커리큘럼 생성하기 <Sparkles className="h-5 w-5" /></span>
                  )}
                </Button>
              </div>
            </Card>

            <div className="mt-8 flex items-center gap-3 justify-center text-gray-400">
              <Lightbulb className="h-4 w-4" />
              <p className="text-xs font-bold font-medium tracking-tight">수석 설계자가 가용 시간과 목표 사이의 균형을 완벽하게 맞춥니다.</p>
            </div>
          </div>
        ) : savedCurriculum ? (
          /* Curriculum Display (Enhanced) */
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <Card className="border-none shadow-2xl bg-white/90 backdrop-blur-xl rounded-[3rem] overflow-hidden p-10 relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -mr-32 -mt-32 blur-[100px]" />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-10 border-b border-gray-100">
                <div className="space-y-4">
                  <Badge className="bg-emerald-500 text-white border-none px-4 py-1.5 text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20">
                    Syllabix Certified Path
                  </Badge>
                  <CardTitle className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                    {savedCurriculum.title}
                  </CardTitle>
                </div>
                <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 min-w-[220px] shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                  <div className="relative space-y-4">
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">학습 기간</p>
                       <p className="text-3xl font-black">{savedCurriculum.totalWeeks}주</p>
                    </div>
                    <div className="space-y-0.5">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">총 학습량</p>
                       <p className="text-lg font-bold text-slate-300 tracking-tight">{savedCurriculum.totalHours}시간</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Insight (Enhanced) */}
              {savedCurriculum.aiInsight && (
                <div className="mb-12 p-8 rounded-[2.5rem] bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 relative group overflow-hidden">
                  <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                    <Brain className="h-40 w-40 text-indigo-900" />
                  </div>
                  <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="h-16 w-16 rounded-3xl bg-white shadow-xl shadow-indigo-200/50 flex items-center justify-center shrink-0">
                      <Sparkles className="h-10 w-10 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                        Strategic Insight Report <span className="h-1 w-1 rounded-full bg-indigo-200" /> AI Architect
                      </p>
                      <p className="text-lg text-gray-700 leading-relaxed font-bold italic tracking-tight">"{savedCurriculum.aiInsight}"</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Phases */}
              <div className="space-y-16">
                {savedCurriculum.phases.map((phase: any, idx: number) => (
                  <div key={idx} className="relative pl-0 sm:pl-20">
                    {/* Vertical Line for timeline */}
                    <div className="absolute left-[15px] top-4 bottom-[-64px] w-0.5 bg-slate-100 hidden sm:block last:hidden" />
                    
                    {/* Phase Marker */}
                    <div className="absolute left-0 top-0 hidden sm:flex h-8 w-8 rounded-full bg-white border-4 border-slate-900 items-center justify-center z-10 shadow-lg">
                      <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-3 py-1 rounded-lg bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest">Phase {phase.phaseNumber}</span>
                          <span className="text-sm font-black text-slate-400 tracking-tight">{phase.weekRange}</span>
                        </div>
                        <h4 className="text-3xl font-black text-gray-900">{phase.title}</h4>
                      </div>
                      <Badge className={cn(
                        "border-none px-5 py-2 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-sm",
                        phase.riskLevel === 'high' ? "bg-rose-100 text-rose-600" :
                        phase.riskLevel === 'medium' ? "bg-amber-100 text-amber-600" :
                        "bg-emerald-100 text-emerald-600"
                      )}>
                        Difficulty: {phase.riskLevel}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                      {phase.topics.map((topic: string, tIdx: number) => (
                        <div key={tIdx} className="flex items-center gap-3 p-5 rounded-[1.5rem] bg-slate-50 border border-slate-100 group hover:bg-white hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300">
                          <div className="h-2 w-2 rounded-full bg-slate-300 group-hover:bg-orange-500 group-hover:scale-150 transition-all shrink-0" />
                          <span className="text-sm font-bold text-gray-700 tracking-tight">{topic}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col gap-4">
                      {phase.milestone && (
                        <div className="flex items-center gap-4 p-6 rounded-[2rem] bg-emerald-50 border border-emerald-100 text-emerald-900 group">
                          <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                             <Trophy className="h-6 w-6 text-emerald-500" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-0.5">Milestone Goal</p>
                            <span className="font-black text-lg">{phase.milestone}</span>
                          </div>
                        </div>
                      )}
                      {phase.riskReason && (
                        <div className="flex items-start gap-3 px-6 py-2">
                          <AlertCircle className="h-4 w-4 text-orange-400 mt-1 shrink-0" />
                          <p className="text-sm text-gray-400 font-bold leading-relaxed italic">"{phase.riskReason}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        ) : (
          /* Empty State (initial) */
          <div className="animate-in fade-in zoom-in-95 duration-700">
            <Card className="border-4 border-dashed border-gray-200 bg-white/40 backdrop-blur-sm rounded-[4rem] p-24 text-center shadow-inner relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="relative">
                <div className="mx-auto w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center mb-10 text-orange-500 shadow-2xl shadow-orange-500/10 group-hover:scale-110 transition-transform duration-500">
                  <Sparkles className="h-12 w-12" />
                </div>
                <h2 className="text-4xl font-black text-gray-900 mb-6 tracking-tight leading-tight">
                  아직 당신만을 위한 학습 지도가 없습니다.
                </h2>
                <p className="text-gray-500 text-xl mb-12 max-w-lg mx-auto font-bold leading-relaxed">
                  관심 있는 주제와 가용 시간을 알려주세요. <br/>
                  <span className="text-orange-500 underline underline-offset-8">수석 교육 설계자 AI</span>가 지금 즉시 <br/>
                  가장 효율적인 경로를 설계해 드립니다.
                </p>
                <Button 
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center gap-3 px-12 py-7 rounded-[2rem] bg-gray-900 text-white font-black text-xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] hover:-translate-y-2 transition-all active:scale-95 group"
                >
                  나만의 커리큘럼 설계하기
                  <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
      
      <Footer />
    </main>
  )
}
