'use client'

import { useState, use, useEffect } from "react"
import Link from "next/link"
import { AnimatedBackground } from "@/components/animated-background"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, PlayCircle, BookOpen, CheckCircle2, Lock, ChevronRight, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"

export default function SeriesLearnPage({ params }: { params: Promise<{ seriesId: string }> }) {
  const resolvedParams = use(params)
  const [detail, setDetail] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/student/enrollment/${resolvedParams.seriesId}`)
        if (res.ok) {
          const data = await res.json()
          setDetail(data)
        }
      } catch (e) {
        console.error("Failed to load series detail", e)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDetail()
  }, [resolvedParams.seriesId])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
      </div>
    )
  }

  if (!detail) return <div className="p-20 text-center">강좌 정보를 찾을 수 없습니다.</div>


  return (
    <main className="relative min-h-screen bg-slate-50/50 pb-20">
      <AnimatedBackground />
      <Navbar />

      <div className="relative z-10 container mx-auto px-4 pt-28 max-w-4xl">
        {/* Back */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-600 font-bold mb-6 transition-colors relative z-20 cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" /> 대시보드로 돌아가기
        </Link>

        {/* Header Summary */}
        <div className="bg-white/90 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/60 shadow-xl mb-10 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100/30 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
          
          <h1 className="text-3xl font-black text-gray-900 mb-2">{detail.seriesTitle}</h1>
          <p className="text-gray-500 mb-8">{detail.description}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full border-4 border-slate-100 flex items-center justify-center relative">
                 <svg viewBox="0 0 64 64" className="absolute inset-0 w-full h-full -rotate-90 overflow-visible">
                    <circle
                      cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" 
                      className="text-orange-500" fill="none"
                      strokeLinecap="round"
                      strokeDasharray="175" strokeDashoffset={175 - (175 * detail.progressRate) / 100}
                    />
                 </svg>
                 <span className="text-sm font-black text-gray-900">{detail.progressRate}%</span>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">전체 진행률</p>
                <p className="text-sm font-bold text-gray-700">좋은 페이스입니다!</p>
              </div>
            </div>
            
            <Button 
              className="h-12 px-6 rounded-2xl font-bold bg-gray-900 text-white hover:bg-orange-600 transition-colors shadow-lg"
              onClick={() => {
                const currentId = detail.lectures.find(l => l.isCurrent)?.id || detail.lectures[0].id;
                window.location.href = `/learn/${resolvedParams.seriesId}/lecture/${currentId}`;
              }}
            >
              이어서 학습하기 <PlayCircle className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Lecture List */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 px-2">
            <BookOpen className="h-5 w-5 text-orange-500" /> 목차
          </h3>
          
          <div className="space-y-3">
            {detail.lectures.map((lecture, idx) => (
              <div 
                key={lecture.id}
                className={cn(
                  "flex items-center justify-between p-5 rounded-2xl border transition-all cursor-pointer",
                  lecture.isCurrent ? "bg-orange-50 border-orange-200 shadow-md" : 
                  lecture.isCompleted ? "bg-white/80 border-slate-200" : "bg-slate-50/50 border-slate-100 opacity-60"
                )}
                onClick={() => {
                  if (lecture.isCompleted || lecture.isCurrent) {
                    window.location.href = `/learn/${resolvedParams.seriesId}/lecture/${lecture.id}`;
                  }
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-full flex items-center justify-center bg-white shadow-sm border border-slate-100">
                    {lecture.isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    ) : lecture.isCurrent ? (
                      <PlayCircle className="h-5 w-5 text-orange-500" />
                    ) : (
                      <Lock className="h-4 w-4 text-gray-300" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-xs font-bold text-gray-400">강좌 {idx + 1}</p>
                      {/* @ts-ignore */}
                      {lecture.isSupplemental && (
                        <Badge className="bg-orange-500 text-white border-none text-[8px] h-4 px-1.5 font-black uppercase">보충 학습</Badge>
                      )}
                    </div>
                    <h4 className={cn("text-base font-bold", lecture.isCurrent ? "text-orange-900" : "text-gray-900")}>
                      {lecture.title}
                    </h4>
                  </div>
                </div>
                
                {(lecture.isCurrent || lecture.isCompleted) && (
                  <ChevronRight className={cn("h-5 w-5", lecture.isCurrent ? "text-orange-500" : "text-gray-300")} />
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
      <Footer />
    </main>
  )
}
