'use client'

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { 
  AlertTriangle, BookOpen, ChevronRight, LayoutDashboard, ChevronLeft, Sparkles, Filter 
} from "lucide-react"

// ── Mock Data ────────────────────────────────────────────────────────

const MOCK_ERROR_NOTES = [
  {
    id: "en1",
    seriesTitle: "파이썬 데이터 분석 마스터",
    lectureTitle: "Pandas 기초 다지기",
    date: "2026-04-12",
    conceptTitle: "DataFrame 불리언 인덱싱",
    aiAnalysis: "DataFrame의 `df[df['column'] > value]` 형태의 인덱싱 조건문 작성법에 혼동이 있습니다. 단순 조건이 아닌 시리즈(Series) 객체의 논리 연산을 다시 익히는 것이 좋습니다.",
    status: "need_review" // need_review, mastered
  },
  {
    id: "en2",
    seriesTitle: "React를 활용한 프론트엔드 실전",
    lectureTitle: "useEffect와 라이프사이클",
    date: "2026-04-10",
    conceptTitle: "의존성 배열(Dependency Array) 이해 부족",
    aiAnalysis: "무한 루프가 발생하는 코드를 작성했습니다. useEffect의 두 번째 인자인 의존성 배열에 값이 주어지지 않았을 때 렌더링마다 훅이 실행되는 원리에 대한 보충 학습이 필요합니다.",
    status: "mastered"
  }
]

export default function ErrorNotesPage() {
  const [filter, setFilter] = useState<'all' | 'need_review' | 'mastered'>('all')

  const filteredNotes = MOCK_ERROR_NOTES.filter(n => filter === 'all' || n.status === filter)

  return (
    <main className="relative min-h-screen bg-slate-50/50">
      <Navbar />
      
      <div className="container mx-auto max-w-5xl px-4 pt-32 pb-20 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <button
                 onClick={() => window.location.href='/dashboard'}
                 className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-orange-600 transition-colors"
               >
                 <LayoutDashboard className="h-4 w-4" /> 내 대시보드
               </button>
               <ChevronRight className="h-3 w-3 text-gray-300" />
               <span className="text-xs font-bold text-red-500">오답 노트 수집함</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              나의 약점 분석 리포트
            </h1>
            <p className="text-gray-500 mt-2">
              AI가 테스트 결과를 바탕으로 분석한 당신의 취약점과 보충해야 할 개념들입니다.
            </p>
          </div>
          
          <div className="flex p-1 bg-white border border-gray-200 rounded-xl shadow-sm">
            <button 
              onClick={() => setFilter('all')}
              className={cn("px-4 py-2 text-sm font-bold rounded-lg transition-all", filter === 'all' ? "bg-slate-100 text-slate-900" : "text-gray-500 hover:text-gray-700")}
            >전체 보기</button>
            <button 
              onClick={() => setFilter('need_review')}
              className={cn("px-4 py-2 text-sm font-bold rounded-lg transition-all", filter === 'need_review' ? "bg-red-50 text-red-700" : "text-gray-500 hover:text-gray-700")}
            >복습 요망</button>
            <button 
              onClick={() => setFilter('mastered')}
              className={cn("px-4 py-2 text-sm font-bold rounded-lg transition-all", filter === 'mastered' ? "bg-emerald-50 text-emerald-700" : "text-gray-500 hover:text-gray-700")}
            >약점 극복</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredNotes.length === 0 ? (
            <div className="col-span-2 text-center py-20 bg-white rounded-3xl border border-gray-200 border-dashed">
               <AlertTriangle className="h-10 w-10 text-gray-300 mx-auto mb-4" />
               <h3 className="text-gray-900 font-bold mb-1">해당하는 오답 노트가 없습니다.</h3>
               <p className="text-gray-500 text-sm">완벽한 학습을 진행 중이시거나 조건에 맞는 기록이 존재하지 않아요.</p>
            </div>
          ) : (
            filteredNotes.map(note => (
              <div key={note.id} className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-slate-200/40 p-6 flex flex-col group relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-orange-500/10 hover:border-orange-200">
                <div className={cn(
                  "absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none opacity-50",
                  note.status === 'need_review' ? "bg-red-500/20" : "bg-emerald-500/20"
                )} />
                
                <div className="flex items-center justify-between mb-4 relative">
                  <div className="flex gap-2 items-center text-xs font-bold text-gray-400">
                    <span className="flex items-center gap-1.5"><BookOpen className="h-3 w-3" /> {note.seriesTitle}</span>
                    <ChevronRight className="h-3 w-3" />
                  </div>
                  <Badge variant="outline" className={cn(
                    "text-[10px] font-bold border", 
                    note.status === 'need_review' ? "bg-red-50 text-red-600 border-red-200" : "bg-emerald-50 text-emerald-600 border-emerald-200"
                  )}>
                    {note.status === 'need_review' ? "복습 요망" : "약점 극복 완료"}
                  </Badge>
                </div>
                
                <h2 className="text-lg font-black text-gray-900 mb-1 relative">{note.conceptTitle}</h2>
                <p className="text-xs text-gray-500 font-medium mb-6 relative">관련 강의: {note.lectureTitle} ({note.date})</p>
                
                <div className="bg-orange-50/50 border border-orange-100/60 rounded-2xl p-4 mb-6 relative flex-1">
                  <h4 className="flex items-center gap-1.5 text-xs font-bold text-orange-800 mb-2">
                    <Sparkles className="h-3.5 w-3.5 text-orange-500" /> AI의 약점 분석 코멘트
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed font-medium">
                    {note.aiAnalysis}
                  </p>
                </div>
                
                <div className="mt-auto relative">
                  <Button className="w-full font-bold bg-gray-900 text-white group-hover:bg-orange-600 rounded-xl h-12 transition-colors shadow-md">
                    취약점 보충 학습하기 (연결된 강의)
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </main>
  )
}
