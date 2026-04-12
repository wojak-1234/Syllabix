'use client'

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { 
  AlertTriangle, BookOpen, ChevronRight, LayoutDashboard, ChevronLeft, Sparkles, Filter, ChevronDown, ChevronUp, Code2 
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
  const [expandedIds, setExpandedIds] = useState<string[]>(["en1"]) // 기본적으로 첫 번째 항목은 펼쳐둠

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const filteredNotes = MOCK_ERROR_NOTES.filter(n => filter === 'all' || n.status === filter)

  return (
    <main className="relative min-h-screen bg-slate-50/50">
      <Navbar />
      
      <div className="container mx-auto max-w-4xl px-4 pt-32 pb-20 relative z-10">
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
               <span className="text-xs font-bold text-red-500">오답 노트 분석</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              나의 약점 분석 리포트
            </h1>
            <p className="text-gray-500 mt-2">
              AI가 각 강좌의 **코딩테스트 오답**을 실시간으로 분석하여 도출한 결과입니다.
            </p>
          </div>
          
          <div className="flex p-1 bg-white border border-gray-200 rounded-xl shadow-sm h-fit">
            <button 
              onClick={() => setFilter('all')}
              className={cn("px-4 py-2 text-xs font-bold rounded-lg transition-all", filter === 'all' ? "bg-slate-100 text-slate-900" : "text-gray-500 hover:text-gray-700")}
            >전체</button>
            <button 
              onClick={() => setFilter('need_review')}
              className={cn("px-4 py-2 text-xs font-bold rounded-lg transition-all", filter === 'need_review' ? "bg-red-50 text-red-700" : "text-gray-500 hover:text-gray-700")}
            >복습 요망</button>
            <button 
              onClick={() => setFilter('mastered')}
              className={cn("px-4 py-2 text-xs font-bold rounded-lg transition-all", filter === 'mastered' ? "bg-emerald-50 text-emerald-700" : "text-gray-500 hover:text-gray-700")}
            >약점 극복</button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 border-dashed">
               <AlertTriangle className="h-10 w-10 text-gray-300 mx-auto mb-4" />
               <h3 className="text-gray-900 font-bold mb-1">해당하는 오답 노트가 없습니다.</h3>
               <p className="text-gray-500 text-sm">모든 코딩테스트를 완벽하게 통과하셨거나 조건에 맞는 기록이 없네요!</p>
            </div>
          ) : (
            filteredNotes.map(note => {
              const isExpanded = expandedIds.includes(note.id);
              return (
                <div key={note.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all hover:border-orange-200">
                  {/* Item Header (Toggle Trigger) */}
                  <div 
                    onClick={() => toggleExpand(note.id)}
                    className="p-6 cursor-pointer flex items-center justify-between hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline" className={cn(
                          "text-[10px] font-bold border", 
                          note.status === 'need_review' ? "bg-red-50 text-red-600 border-red-200" : "bg-emerald-50 text-emerald-600 border-emerald-200"
                        )}>
                          {note.status === 'need_review' ? "복습 요망" : "약점 극복 완료"}
                        </Badge>
                        <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                          <Code2 className="h-3 w-3" /> 코딩테스트 오답 발생
                        </span>
                      </div>
                      <h2 className="text-lg font-black text-gray-900">{note.conceptTitle}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold text-orange-600">{note.seriesTitle}</span>
                        <ChevronRight className="h-3 w-3 text-gray-300" />
                        <span className="text-xs font-medium text-gray-500">{note.lectureTitle}</span>
                        <span className="text-[10px] text-gray-300 ml-2">{note.date}</span>
                      </div>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-gray-400 group-hover:bg-orange-100 group-hover:text-orange-500 transition-all">
                      {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </div>
                  </div>

                  {/* Expandable Analysis Section */}
                  <div className={cn(
                    "transition-all duration-300 ease-in-out border-t border-gray-100",
                    isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                  )}>
                    <div className="p-6 bg-slate-50/30">
                      <div className="bg-white border border-orange-100 rounded-2xl p-6 shadow-sm mb-6">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-orange-900 mb-3">
                          <Sparkles className="h-4 w-4 text-orange-500" /> AI 심층 분석 결과
                        </h4>
                        <p className="text-sm text-gray-700 leading-relaxed font-medium">
                          {note.aiAnalysis}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button 
                          className="flex-1 font-bold bg-gray-900 text-white hover:bg-orange-600 rounded-xl h-11 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `/learn/s1`; // 실제 시스템에서는 연동된 강의 ID로 이동
                          }}
                        >
                          해당 강의로 이동하여 복습
                        </Button>
                        <Button 
                          variant="outline"
                          className="flex-1 font-bold border-gray-200 text-gray-600 hover:bg-slate-100 rounded-xl h-11 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          관련 연습문제 더 풀기
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      <Footer />
    </main>
  )
}
