'use client'

import { useState } from "react"
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
  Users,
  CheckCircle2,
  BrainCircuit,
  MessageSquareWarning,
  ArrowUpRight
} from "lucide-react"

// ── Mock Analytics Data ──────────────────────────────────────────────

const MOCK_ANALYTICS = {
  seriesId: "1",
  seriesTitle: "Python 기초부터 실전까지",
  stats: {
    totalStudents: 124,
    avgProgress: 68,
    completionRate: 42,
  },
  heatmap: [
    { id: "l1", title: "변수와 자료형", score: 95, errorCount: 12 },
    { id: "l2", title: "조건문과 반복문", score: 82, errorCount: 45 },
    { id: "l3", title: "함수와 모듈", score: 64, errorCount: 89 }, // Blind Point!
    { id: "l4", title: "클래스와 객체", score: 45, errorCount: 120 }, // Severe Blind Point!
  ],
  blindPoints: [
    {
      id: "bp1",
      lectureTitle: "함수와 모듈",
      concept: "전역 변수 vs 지역 변수 (Scope)",
      failRate: 67,
      studentComment: "전역 변수가 왜 함수 안에서 수정이 안 되는지 이해가 안 가요.",
      aiSuggestion: "변수 스코프에 대한 시각적 다이어그램을 보충 자료로 추가하고, 'global' 키워드 사용법에 대한 실습 예제를 2개 더 배치하는 것이 좋습니다."
    },
    {
      id: "bp2",
      lectureTitle: "클래스와 객체",
      concept: "self 인자의 역할",
      failRate: 85,
      studentComment: "메서드 정의할 때 self를 왜 꼭 써야 하나요? 호출할 때는 안 쓰는데 말이죠.",
      aiSuggestion: "인스턴스 자체를 가리키는 self의 메커니즘을 붕어빵 틀과 붕어빵 비유로 설명하는 3분 분량의 보충 영상을 삽입하세요."
    }
  ]
}

export default function SeriesAnalyticsPage({ params }: { params: { id: string } }) {
  const [data] = useState(MOCK_ANALYTICS)
  const [isAdding, setIsAdding] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleAddSupplement = async (bpId: string, concept: string, aiSuggestion: string) => {
    setIsAdding(bpId)
    try {
      // Mock API calling simulation
      setTimeout(() => {
        setIsAdding(null)
        setSuccess(`${concept} 보충 강좌가 삽입되었습니다!`)
        setTimeout(() => setSuccess(null), 3000)
      }, 1500)
    } catch (e) {
      console.error(e)
      setIsAdding(null)
    }
  }

  return (
    <main className="relative min-h-screen bg-slate-50/50 pb-20">
      <Navbar />
      
      {/* Success Notification */}
      {success && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 duration-300">
           <div className="bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-2 font-bold ring-4 ring-emerald-500/20">
             <CheckCircle2 className="h-5 w-5" /> {success}
           </div>
        </div>
      )}

      <div className="relative z-10 container mx-auto px-4 pt-28 max-w-5xl">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-1.5 text-sm font-bold text-gray-500 hover:text-emerald-600 transition-colors mb-8"
        >
          <ChevronLeft className="h-4 w-4" /> 커리큘럼 관리로 돌아가기
        </button>

        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-emerald-100 text-emerald-700 border-none px-3 py-1 text-xs font-bold flex items-center gap-1.5">
                <BarChart3 className="h-3 w-3" /> AI 학습 분석 리포트
              </Badge>
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
              {data.seriesTitle}
            </h1>
            <p className="text-gray-500 font-medium">
              수강생들의 오답 패턴을 분석하여 **학습 공백(Blind Points)**을 찾아냈습니다.
            </p>
          </div>

          <div className="flex gap-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col items-center justify-center min-w-[100px]">
              <span className="text-[10px] font-bold text-gray-400 uppercase">수강생</span>
              <span className="text-xl font-black text-gray-900">{data.stats.totalStudents}명</span>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col items-center justify-center min-w-[100px]">
              <span className="text-[10px] font-bold text-gray-400 uppercase">평균 진도</span>
              <span className="text-xl font-black text-emerald-600">{data.stats.avgProgress}%</span>
            </div>
          </div>
        </div>

        {/* 이해도 히트맵 */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-rose-500" /> 강좌별 이해도 히트맵
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {data.heatmap.map((lec) => (
              <div key={lec.id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm relative overflow-hidden group">
                <div className={cn(
                  "absolute bottom-0 left-0 h-1 transition-all duration-1000 group-hover:h-2",
                  lec.score > 80 ? "bg-emerald-500 w-full" : 
                  lec.score > 60 ? "bg-amber-500 w-[70%]" : "bg-rose-500 w-[40%]"
                )} />
                <h4 className="text-sm font-bold text-gray-700 mb-4 line-clamp-1">{lec.title}</h4>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">성취도</p>
                    <p className={cn(
                      "text-2xl font-black",
                      lec.score > 80 ? "text-emerald-600" : 
                      lec.score > 60 ? "text-amber-600" : "text-rose-600"
                    )}>{lec.score}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">오답</p>
                    <p className="text-sm font-bold text-gray-600">{lec.errorCount}건</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Blind Points (핵심 영역) */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <MessageSquareWarning className="h-5 w-5 text-amber-500" /> 발견된 Blind Points
            </h2>
            <Badge className="bg-amber-50 text-amber-700 border-amber-200">2개의 취약 개념 발견</Badge>
          </div>

          <div className="space-y-6">
            {data.blindPoints.map((bp) => (
              <div key={bp.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden relative group">
                <div className="absolute top-0 left-0 w-2 h-full bg-amber-500" />
                <div className="p-8">
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Concept Failure Display */}
                    <div className="md:w-1/3">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-2">
                        <span className="text-emerald-600">{bp.lectureTitle}</span>
                        <span>•</span>
                        <span>실패율 {bp.failRate}%</span>
                      </div>
                      <h3 className="text-2xl font-black text-gray-900 mb-4 leading-tight">
                        {bp.concept}
                      </h3>
                      <div className="bg-rose-50 rounded-2xl p-4 border border-rose-100">
                        <p className="text-[10px] font-bold text-rose-400 uppercase mb-2 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> 실제 학생 코멘트
                        </p>
                        <p className="text-sm text-rose-800 font-medium italic">
                          "{bp.studentComment}"
                        </p>
                      </div>
                    </div>

                    {/* AI Suggestion Area */}
                    <div className="flex-1 bg-slate-50/50 rounded-[2rem] p-6 border border-slate-100 relative">
                      <div className="absolute top-6 right-8">
                        <BrainCircuit className="h-10 w-10 text-emerald-500 opacity-20" />
                      </div>
                      <h4 className="text-sm font-bold text-emerald-700 flex items-center gap-2 mb-4">
                        <Lightbulb className="h-4 w-4" /> AI 강의 개선 제안
                      </h4>
                      <p className="text-gray-700 leading-relaxed font-medium mb-8">
                        {bp.aiSuggestion}
                      </p>

                      <div className="flex flex-wrap gap-3">
                        <Button 
                          onClick={() => handleAddSupplement(bp.id, bp.concept, bp.aiSuggestion)}
                          disabled={isAdding === bp.id}
                          className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 px-6 shadow-lg shadow-emerald-500/20"
                        >
                          {isAdding === bp.id ? "생성 중..." : "보충 강좌 즉시 추가하기"}
                        </Button>
                        <Button variant="outline" className="rounded-xl border-slate-200 text-gray-500 font-bold h-11">
                          설명 구간 편집하러 가기
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 추가 리포트 링크 (미구현) */}
        <div className="mt-12 p-8 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-[2.5rem] text-white flex items-center justify-between shadow-2xl shadow-emerald-500/30">
           <div>
             <h3 className="text-2xl font-black mb-1">더 심층적인 데이터가 필요하신가요?</h3>
             <p className="text-emerald-50 font-medium opacity-80">수강생들 개개인의 오답 트레이싱 데이터를 엑셀로 내려받으세요.</p>
           </div>
           <Button className="bg-white text-emerald-700 hover:bg-emerald-50 font-black px-8 h-14 rounded-2xl shadow-xl">
             상세 데이터 내보내기 <ArrowUpRight className="ml-2 h-5 w-5" />
           </Button>
        </div>

      </div>
      <Footer />
    </main>
  )
}
