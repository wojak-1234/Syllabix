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
    const fetchLatest = async () => {
      try {
        const res = await fetch('/api/curriculum/latest')
        if (res.ok) {
          const data = await res.json()
          if (data.curriculum) {
            setSavedCurriculum(data.curriculum)
          }
        }
      } catch (e) {
        console.error("Failed to fetch curriculum from DB", e)
      }
    }
    fetchLatest()
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
    setShowForm(true)
  }

  const [isAccepting, setIsAccepting] = useState(false)
  const handleAcceptCurriculum = async () => {
    if (!savedCurriculum) return
    setIsAccepting(true)
    try {
      const res = await fetch('/api/curriculum/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phases: savedCurriculum.phases })
      })
      if (res.ok) {
        window.location.href = '/dashboard'
      } else {
        alert("수강 등록에 실패했습니다.")
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsAccepting(false)
    }
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

        {/* Curriculum Display (Enhanced) */}
        {savedCurriculum ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 mb-20">
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

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button 
                  onClick={handleAcceptCurriculum}
                  disabled={isAccepting}
                  className="flex-1 h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg shadow-lg shadow-emerald-500/30 transition-all hover:-translate-y-1"
                >
                  {isAccepting ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    <Trophy className="h-5 w-5 mr-2" />
                  )}
                  {isAccepting ? "수강 등록 중..." : "이 커리큘럼 수락하고 학습 시작"}
                </Button>
                <Button 
                  variant="outline"
                  onClick={async () => {
                    if (confirm("이 커리큘럼을 삭제하시겠습니까?")) {
                      // 실제 DB 삭제 로직(추후 API 연동 필요 시)은 여기서 수행합니다.
                      setSavedCurriculum(null)
                    }
                  }}
                  className="sm:w-32 h-14 rounded-2xl border-rose-200 text-rose-600 hover:bg-rose-50 font-bold transition-all"
                >
                  커리큘럼 삭제
                </Button>
              </div>

              {/* AI Insight */}
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
                    <div className="absolute left-[15px] top-4 bottom-[-64px] w-0.5 bg-slate-100 hidden sm:block last:hidden" />
                    <div className="absolute left-0 top-0 hidden sm:flex h-8 w-8 rounded-full bg-white border-4 border-slate-900 items-center justify-center z-10 shadow-lg">
                      <div className="h-2 w-2 rounded-full bg-orange-500" />
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-3 py-1 rounded-lg bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest">Phase {phase.phaseNumber}</span>
                          <span className="text-sm font-black text-slate-400 tracking-tight">{phase.weekRange}</span>
                        </div>
                        <h4 className="text-3xl font-black text-gray-900">{phase.title}</h4>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                      {phase.topics.map((topic: string, tIdx: number) => (
                        <div key={tIdx} className="flex items-center gap-3 p-5 rounded-[1.5rem] bg-slate-50 border border-slate-100 group hover:bg-white hover:border-orange-200 hover:shadow-sm transition-all duration-300">
                          <div className="h-2 w-2 rounded-full bg-slate-300 group-hover:bg-orange-500 transition-all shrink-0" />
                          <span className="text-sm font-bold text-gray-700 tracking-tight">{topic}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col gap-4">
                      {phase.linkedCourses && phase.linkedCourses.length > 0 && (
                        <div className="mb-4">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">배정된 실제 강좌</p>
                          <div className="flex flex-col gap-3">
                            {phase.linkedCourses.map((course: any, cIdx: number) => (
                              <div key={cIdx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 cursor-default">
                                <div className="flex items-center gap-4">
                                  <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                                    <BookOpen className="h-5 w-5 text-slate-400" />
                                  </div>
                                  <div>
                                    <h5 className="font-black text-gray-900">{course.title}</h5>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{course.instructor} / 강의 {course.lectureCount}개</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
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
          <div className="animate-in fade-in zoom-in-95 duration-700 mb-20">
            <Card className="border-4 border-dashed border-gray-200 bg-white/40 backdrop-blur-sm rounded-[4rem] p-24 text-center shadow-inner relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="relative">
                <div className="mx-auto w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center mb-10 text-orange-500 shadow-2xl shadow-orange-500/10 group-hover:scale-110 transition-transform duration-500">
                  <Sparkles className="h-12 w-12" />
                </div>
                <h2 className="text-4xl font-black text-gray-900 mb-6 tracking-tight leading-tight">
                  아직 활성화된 학습 지도가 없습니다.
                </h2>
                <p className="text-gray-500 text-xl max-w-lg mx-auto font-bold leading-relaxed">
                  아래 폼에서 관심사를 입력하시고 <br/>
                  <span className="text-orange-500">나만의 커리큘럼</span>을 즉시 설계받아 보세요!
                </p>
              </div>
            </Card>
          </div>
        )}

        {/* Curriculum Generator Form (항상 하단에 표시) */}
        <div className="max-w-2xl mx-auto mt-16 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-700 border-t border-dashed border-slate-200 pt-16">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-black text-gray-900">새로운 커리큘럼 설계하기</h3>
            <p className="text-gray-500 mt-2 font-medium tracking-tight">이전 커리큘럼은 덮어씌워집니다.</p>
          </div>
          
          <Card className="border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] bg-white/90 backdrop-blur-2xl rounded-[3rem] p-10 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -mr-16 -mt-16 blur-2xl" />
            
            <div className="space-y-8">
              {/* Topic Input */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-black text-gray-700 uppercase tracking-wider ml-1">
                  <Target className="h-4 w-4 text-orange-500" /> 어떤 주제를 마스터하고 싶으세요?
                </label>
                <input 
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="예: 실무에서 바로 써먹는 파이썬 데이터 분석 ..."
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
                  placeholder="예: 어려운 수학 수식은 빼주세요..."
                  rows={3}
                  className="w-full p-6 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:bg-white transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <Button 
                onClick={handleGenerate}
                disabled={!goal || isGenerating}
                className="w-full h-16 rounded-[2rem] bg-gradient-to-r from-orange-600 to-amber-500 text-white font-black text-lg shadow-2xl shadow-orange-500/30 hover:-translate-y-1 active:scale-[0.98] transition-all disabled:opacity-50 mt-4"
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
        </div>
      </div>
      
      <Footer />
    </main>
  )
}
