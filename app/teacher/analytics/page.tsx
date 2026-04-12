'use client'

import { useState, Suspense, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  ChevronLeft,
  BarChart3,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  BrainCircuit,
  MessageSquareWarning,
  ArrowUpRight,
  RefreshCw,
  Search,
  ChevronDown
} from "lucide-react"

// ── Mock Analytics Data ──────────────────────────────────────────────

const MOCK_SERIES_LIST = [
  { id: "1", title: "Python 기초부터 실전까지" },
  { id: "2", title: "React Hooks 마스터 클래스" }
]

const MOCK_ANALYTICS: Record<string, any> = {
  "1": {
    seriesId: "1",
    seriesTitle: "Python 기초부터 실전까지",
    stats: { totalStudents: 124, avgProgress: 68 },
    heatmap: [
      { id: "l1", title: "변수와 자료형", score: 95, errorCount: 12 },
      { id: "l2", title: "조건문과 반복문", score: 82, errorCount: 45 },
      { id: "l3", title: "함수와 모듈", score: 64, errorCount: 89 },
      { id: "l4", title: "클래스와 객체", score: 45, errorCount: 120 },
    ],
    blindPoints: [
      {
        id: "bp1",
        lectureTitle: "함수와 모듈",
        concept: "전역 변수 vs 지역 변수 (Scope)",
        failRate: 67,
        studentComment: "전역 변수가 왜 함수 안에서 수정이 안 되는지 이해가 안 가요.",
        aiSuggestion: "변수 스코프에 대한 시각적 다이어그램을 보충 자료로 추가하고, 'global' 키워드 사용법에 대한 실습 예제를 2개 더 배치하는 것이 좋습니다.",
        ragAnchor: "이 오답은 2장 3절 '로컬 스코프의 이해' 파트의 예제 코드와 89% 일치합니다."
      }
    ]
  },
  "2": {
    seriesId: "2",
    seriesTitle: "React Hooks 마스터 클래스",
    stats: { totalStudents: 89, avgProgress: 54 },
    heatmap: [
      { id: "l5", title: "useState 이해하기", score: 88, errorCount: 15 },
      { id: "l6", title: "useEffect 입문", score: 42, errorCount: 156 },
    ],
    blindPoints: [
      {
        id: "bp2",
        lectureTitle: "useEffect 입문",
        concept: "의존성 배열(Dependency Array)",
        failRate: 91,
        studentComment: "빈 배열을 넣었는데 왜 자꾸 무한 루프가 돌까요?",
        aiSuggestion: "참조 타입 메모이제이션(useCallback, useMemo)과 연계된 의존성 비교 원리를 심화 강의로 구성하세요.",
        ragAnchor: "3장 'useEffect 라이프사이클' 섹션의 클린업 함수 설명 부분과 연관성이 높습니다."
      }
    ]
  }
}

function AnalyticsContent() {
  const searchParams = useSearchParams()
  const initialId = searchParams.get('seriesId') || "1"
  
  const [selectedId, setSelectedId] = useState(initialId)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isAdding, setIsAdding] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // 드롭다운 닫힘 지연 방지용 (UX 개선)
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    setIsDropdownOpen(true)
  }

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false)
    }, 300) // 300ms 지연 후 닫힘
  }

  const data = MOCK_ANALYTICS[selectedId] || MOCK_ANALYTICS["1"]

  const handleRunAgent = async () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
      setSuccess("LangChain 에이전트가 최신 데이터 분석을 마쳤습니다.")
      setTimeout(() => setSuccess(null), 3000)
    }, 2500)
  }

  const handleAddSupplement = async (bpId: string, concept: string) => {
    setIsAdding(bpId)
    setTimeout(() => {
      setIsAdding(null)
      setSuccess(`${concept} 보충 강좌가 삽입되었습니다!`)
      setTimeout(() => setSuccess(null), 3000)
    }, 1500)
  }

  return (
    <div className="relative z-10 container mx-auto px-4 pt-28 max-w-5xl">
      {success && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 duration-300">
           <div className="bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-2 font-bold ring-4 ring-emerald-500/20">
             <CheckCircle2 className="h-5 w-5" /> {success}
           </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <button
               onClick={() => window.location.href='/teacher/dashboard'}
               className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-emerald-600 transition-colors"
             >
               <ChevronLeft className="h-4 w-4" /> 교사 대시보드
             </button>
             <span className="text-gray-300 text-xs">/</span>
             <span className="text-xs font-bold text-emerald-600">통합 분석 리포트</span>
          </div>
          
          <div 
            className="relative inline-block"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button className="text-3xl font-black text-gray-900 flex items-center gap-2 hover:text-emerald-600 transition-colors py-1">
              {data.seriesTitle}
              <ChevronDown className={cn("h-6 w-6 text-gray-300 transition-transform duration-300", isDropdownOpen && "rotate-180")} />
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-slate-100 shadow-2xl rounded-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {MOCK_SERIES_LIST.map(s => (
                  <button 
                    key={s.id}
                    onClick={() => {
                      setSelectedId(s.id)
                      setIsDropdownOpen(false)
                    }}
                    className={cn(
                      "w-full text-left p-3 rounded-xl text-sm font-bold transition-colors",
                      selectedId === s.id ? "bg-emerald-50 text-emerald-700" : "text-gray-600 hover:bg-slate-50"
                    )}
                  >
                    {s.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <Button 
          onClick={handleRunAgent}
          disabled={isAnalyzing}
          className="bg-gray-900 hover:bg-black text-white rounded-xl font-bold flex items-center gap-2 px-5 h-12 shadow-md shrink-0"
        >
          <RefreshCw className={cn("h-4 w-4", isAnalyzing && "animate-spin")} />
          {isAnalyzing ? "에이전트 분석 중..." : "AI 취약점 정밀 분석"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
         <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-rose-500" /> 강좌별 이해도
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {data.heatmap.map((lec: any) => (
                  <div key={lec.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 relative group overflow-hidden">
                     <div className={cn(
                        "absolute inset-0 opacity-10 transition-opacity group-hover:opacity-20",
                        lec.score > 80 ? "bg-emerald-500" : lec.score > 60 ? "bg-amber-500" : "bg-rose-500"
                     )} />
                     <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">{lec.title}</p>
                     <p className={cn("text-xl font-black", lec.score > 80 ? "text-emerald-600" : lec.score > 60 ? "text-amber-600" : "text-rose-600")}>
                       {lec.score}%
                     </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 px-2">
                <MessageSquareWarning className="h-5 w-5 text-amber-500" /> 발견된 Blind Points
              </h3>
              {data.blindPoints.map((bp: any) => (
                <div key={bp.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-xl p-8 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                   <div className="flex flex-col gap-6">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div>
                          <Badge className="bg-amber-50 text-amber-600 border-none mb-2">{bp.lectureTitle}</Badge>
                          <h4 className="text-2xl font-black text-gray-900 leading-tight">{bp.concept}</h4>
                        </div>
                        <div className="text-right">
                           <div className="inline-block p-3 rounded-2xl bg-rose-50 border border-rose-100 text-center min-w-[80px]">
                             <p className="text-[10px] font-bold text-rose-400 uppercase">실패율</p>
                             <p className="text-lg font-black text-rose-600">{bp.failRate}%</p>
                           </div>
                        </div>
                      </div>

                      <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100">
                        <h5 className="text-sm font-bold text-emerald-800 flex items-center gap-2 mb-2">
                          <Lightbulb className="h-4 w-4" /> AI 강의 개선 가이드
                        </h5>
                        <p className="text-sm text-gray-700 leading-relaxed font-medium">
                          {bp.aiSuggestion}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                         <p className="text-[11px] text-gray-400 flex items-center gap-1.5 font-medium">
                           <Search className="h-3 w-3" /> {bp.ragAnchor}
                         </p>
                         <Button 
                           onClick={() => handleAddSupplement(bp.id, bp.concept)}
                           disabled={isAdding === bp.id}
                           className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold h-10 px-6 shadow-lg shadow-emerald-500/20"
                         >
                           보충 강좌 추천 삽입
                         </Button>
                      </div>
                   </div>
                </div>
              ))}
            </div>
         </div>

         <div className="space-y-6">
            <div className="bg-gray-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
              <div className="absolute top-10 right-10 opacity-10">
                <BarChart3 className="h-32 w-32" />
              </div>
              <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-6">운영 인사이트</h4>
              <div className="space-y-6 relative">
                 <div>
                   <p className="text-3xl font-black text-white mb-1">{data.stats.totalStudents}명</p>
                   <p className="text-xs text-gray-400">현재 학습 중인 수강생</p>
                 </div>
                 <div className="h-px bg-white/10 w-full" />
                 <div>
                   <p className="text-3xl font-black text-emerald-400 mb-1">{data.stats.avgProgress}%</p>
                   <p className="text-xs text-gray-400">평균 학습 완주율</p>
                 </div>
                 <Button className="w-full h-12 rounded-xl bg-white/10 hover:bg-white/20 border-none text-white font-bold mt-4">
                   상세 데이터 분석 <ArrowUpRight className="h-4 w-4 ml-2" />
                 </Button>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
               <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">최근 오답 키워드</h4>
               <div className="flex flex-wrap gap-2">
                  {["SyntaxError", "클로저", "스코프", "useEffect", "인덱싱"].map(k => (
                    <Badge key={k} variant="outline" className="rounded-lg h-8 px-3 border-slate-200 text-gray-600 font-bold">{k}</Badge>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  )
}

export default function GeneralAnalyticsPage() {
  return (
    <main className="relative min-h-screen bg-slate-50/50 pb-20">
      <Navbar />
      <Suspense fallback={
        <div className="pt-40 flex flex-col items-center justify-center gap-4">
           <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
           <p className="font-bold text-gray-400">데이터를 불러오는 중...</p>
        </div>
      }>
        <AnalyticsContent />
      </Suspense>
      <Footer />
    </main>
  )
}
