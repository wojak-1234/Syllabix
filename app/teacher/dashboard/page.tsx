'use client'

import { useState, useEffect, useRef } from "react"
import { AnimatedBackground } from "@/components/animated-background"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Sparkles, 
  Plus,
  ChevronRight,
  BookOpen,
  AlertTriangle,
  Zap,
  Check,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface ThemeDemand {
  theme: string
  demandScore: number
  studentCount: number
  growthRate: number
  avgBlindPointCount: number
  topKeywords: string[]
}

// ─── 막대그래프 컴포넌트 ────────────────────────────────────────────────
function DemandBarChart({ data }: { data: ThemeDemand[] }) {
  const maxScore = Math.max(...data.map(d => d.demandScore))

  return (
    <div className="space-y-4">
      {data.map((item, idx) => {
        const widthPercent = (item.demandScore / maxScore) * 100
        const barColor = 
          item.demandScore >= 80 ? "from-emerald-500 to-teal-400" :
          item.demandScore >= 60 ? "from-amber-500 to-orange-400" :
          "from-slate-400 to-slate-300"
        const bgColor = 
          item.demandScore >= 80 ? "bg-emerald-50" :
          item.demandScore >= 60 ? "bg-amber-50" :
          "bg-slate-50"

        return (
          <div key={item.theme} className="group cursor-pointer">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-gray-400 w-5">{idx + 1}</span>
                <span className="text-sm font-bold text-gray-900">{item.theme}</span>
                {item.growthRate > 20 && (
                  <Badge className="bg-rose-50 text-rose-600 border-none text-[10px] px-1.5 py-0 h-4 font-bold">
                    <TrendingUp className="h-2.5 w-2.5 mr-0.5" /> HOT
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" /> {item.studentCount}명
                </span>
                <span className={cn(
                  "font-bold",
                  item.growthRate > 0 ? "text-emerald-600" : "text-red-500"
                )}>
                  {item.growthRate > 0 ? "▲" : "▼"} {Math.abs(item.growthRate)}%
                </span>
              </div>
            </div>
            <div className="relative h-10 w-full bg-slate-100/60 rounded-xl overflow-hidden group-hover:bg-slate-100 transition-colors">
              <div
                className={cn(
                  "absolute left-0 top-0 h-full rounded-xl bg-gradient-to-r transition-all duration-1000 ease-out flex items-center justify-end pr-3",
                  barColor
                )}
                style={{ width: `${widthPercent}%` }}
              >
                <span className="text-white text-xs font-black drop-shadow-sm">
                  {item.demandScore}점
                </span>
              </div>
            </div>
            {/* Expandable keywords */}
            <div className="flex gap-1.5 mt-2 flex-wrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {item.topKeywords.map(kw => (
                <span key={kw} className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", bgColor, 
                  item.demandScore >= 80 ? "text-emerald-700" :
                  item.demandScore >= 60 ? "text-amber-700" : "text-slate-600"
                )}>
                  #{kw}
                </span>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── 강의 생성 모달 ─────────────────────────────────────────────────────
function CreateLectureModal({ theme, onClose }: { theme: ThemeDemand | null, onClose: () => void }) {
  const [title, setTitle] = useState("")
  const [difficulty, setDifficulty] = useState("beginner")
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    if (theme) {
      setTitle(`${theme.theme} 마스터 클래스`)
      setGenerating(false)
    }
  }, [theme])

  if (!theme) return null

  const handleGenerateWithAI = () => {
    setGenerating(true)
    // sessionStorage에 요청 데이터 저장 후 초안 페이지로 이동
    sessionStorage.setItem('lectureGenRequest', JSON.stringify({
      theme: theme.theme,
      title: title,
      keywords: theme.topKeywords,
      difficulty: difficulty
    }))
    window.location.href = '/teacher/lecture-draft'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[2rem] p-8 w-full max-w-lg shadow-2xl border border-white/60 animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <Plus className="h-5 w-5 text-emerald-500" /> AI 강의 초안 생성
          </h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
          <p className="text-xs font-bold text-emerald-600 mb-1">AI 추천 테마 기반</p>
          <p className="text-sm font-bold text-gray-900">{theme.theme}</p>
          <p className="text-xs text-gray-500 mt-1">
            현재 {theme.studentCount}명의 학생이 관심을 보이고 있으며, 수요 지수 {theme.demandScore}점입니다.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">강의 제목</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-300 transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">난이도 설정</label>
            <div className="flex gap-3">
              {[
                { value: "beginner", label: "입문" },
                { value: "intermediate", label: "중급" },
                { value: "advanced", label: "고급" }
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setDifficulty(opt.value)}
                  className={cn(
                    "flex-1 h-10 rounded-xl text-sm font-bold transition-all duration-200 border-2",
                    difficulty === opt.value
                      ? "bg-emerald-50 border-emerald-400 text-emerald-700 shadow-sm"
                      : "bg-white border-slate-200 text-gray-400 hover:border-slate-300"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">관련 키워드</label>
            <div className="flex flex-wrap gap-2">
              {theme.topKeywords.map(kw => (
                <span key={kw} className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* AI 생성 안내 */}
        <div className="mt-6 p-3 rounded-xl bg-slate-50 border border-slate-100">
          <p className="text-[11px] text-gray-500 font-medium flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-emerald-500" />
            AI가 목차 → 강의 내용 → 진단 문제를 순차적으로 자동 생성합니다.
          </p>
        </div>

        <Button
          onClick={handleGenerateWithAI}
          disabled={generating || !title.trim()}
          className={cn(
            "w-full h-14 mt-4 rounded-2xl font-bold text-base transition-all",
            "bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:scale-95"
          )}
        >
          {generating ? (
            <span className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              준비 중...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" /> AI로 강의 초안 생성하기
            </span>
          )}
        </Button>
      </div>
    </div>
  )
}



// ─── 메인 페이지 ────────────────────────────────────────────────────────
export default function TeacherDashboardPage() {
  const [demandData, setDemandData] = useState<ThemeDemand[]>([])
  const [metadata, setMetadata] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTheme, setSelectedTheme] = useState<ThemeDemand | null>(null)

  useEffect(() => {
    const fetchDemand = async () => {
      try {
        const res = await fetch('/api/teacher/demand')
        const json = await res.json()
        setDemandData(json.data)
        setMetadata(json.metadata)
      } catch (err) {
        console.error("Demand fetch error:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchDemand()
  }, [])

  const teacherName = "홍길동"
  const topTheme = demandData[0]

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50/50 pb-20">
      <AnimatedBackground />
      <Navbar />

      <div className="relative z-10 container mx-auto px-4 pt-28 max-w-6xl">
        {/* Header */}
        <div className="mb-10 space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-emerald-100 text-emerald-700 border-none px-3 py-1 text-xs font-bold flex items-center gap-1.5">
              <Zap className="h-3 w-3" /> 교사 전용 대시보드
            </Badge>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            {teacherName} 선생님, 안녕하세요
          </h1>
          <p className="text-gray-500 font-medium">
            학생들의 학습 데이터를 분석하여 가장 효과적인 강의 테마를 추천합니다.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-6">
            <div className="h-16 w-16 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-2xl flex items-center justify-center shadow-xl rotate-6">
              <BarChart3 className="h-8 w-8 text-white animate-pulse" />
            </div>
            <p className="text-gray-500 font-medium">수요 데이터를 분석하고 있습니다...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Stats + Chart */}
            <div className="lg:col-span-8 space-y-8">
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 border border-white/60 shadow-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <Users className="h-5 w-5 text-emerald-600" />
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">전체 수요 학생</p>
                  </div>
                  <p className="text-3xl font-black text-gray-900">{metadata?.totalStudents?.toLocaleString() || 0}<span className="text-base text-gray-400 ml-1">명</span></p>
                </div>
                <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 border border-white/60 shadow-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-amber-600" />
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">최고 성장 테마</p>
                  </div>
                  <p className="text-lg font-black text-gray-900 truncate">{demandData.sort((a,b) => b.growthRate - a.growthRate)[0]?.theme || "-"}</p>
                  <p className="text-xs text-emerald-600 font-bold">▲ {demandData.sort((a,b) => b.growthRate - a.growthRate)[0]?.growthRate}%</p>
                </div>
                <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 border border-white/60 shadow-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-xl bg-rose-50 flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-rose-500" />
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">최다 취약점 테마</p>
                  </div>
                  <p className="text-lg font-black text-gray-900 truncate">{demandData.sort((a,b) => b.avgBlindPointCount - a.avgBlindPointCount)[0]?.theme || "-"}</p>
                  <p className="text-xs text-rose-500 font-bold">평균 {demandData.sort((a,b) => b.avgBlindPointCount - a.avgBlindPointCount)[0]?.avgBlindPointCount}건</p>
                </div>
              </div>

              {/* Main Chart Card */}
              <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] p-10 border border-white/60 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-100/20 rounded-full -mr-24 -mt-24 blur-3xl" />
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                      <BarChart3 className="h-6 w-6 text-emerald-500" /> 테마별 학습 수요 지수
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">BlindPoint + ActivityLog 데이터 기반 AI 집계 결과</p>
                  </div>
                  <Badge className="bg-slate-100 text-slate-600 border-none text-[10px] font-bold">
                    {new Date().toLocaleDateString('ko-KR')} 기준
                  </Badge>
                </div>
                <DemandBarChart data={demandData.sort((a,b) => b.demandScore - a.demandScore)} />
              </div>
            </div>

            {/* Right: AI Recommendation + Quick Actions */}
            <div className="lg:col-span-4 space-y-6">
              <div className="sticky top-28 space-y-6">
                {/* AI Recommendation Card */}
                <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-emerald-500/20 relative overflow-hidden">
                  <div className="absolute -bottom-8 -right-8 opacity-10">
                    <Sparkles className="h-36 w-36" />
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-lg font-black mb-2 flex items-center gap-2">
                      <Sparkles className="h-5 w-5" /> AI 추천
                    </h3>
                    <p className="text-emerald-100 text-sm font-medium mb-6 leading-relaxed">
                      <strong>{teacherName}</strong> 선생님에게 가장 적합한 강의 테마를 데이터 기반으로 추천합니다.
                    </p>

                    {topTheme && (
                      <div className="bg-white/15 backdrop-blur-md rounded-2xl p-5 mb-4 border border-white/20">
                        <p className="text-[10px] font-bold text-emerald-200 uppercase tracking-widest mb-1">1순위 추천</p>
                        <p className="text-xl font-black mb-2">{topTheme.theme}</p>
                        <div className="flex items-center gap-4 text-xs">
                          <span>수요 {topTheme.demandScore}점</span>
                          <span>학생 {topTheme.studentCount}명</span>
                          <span className="text-emerald-200">▲ {topTheme.growthRate}%</span>
                        </div>
                      </div>
                    )}

                    <Button 
                      onClick={() => topTheme && setSelectedTheme(topTheme)}
                      className="w-full h-12 rounded-2xl bg-white text-emerald-700 font-bold hover:bg-emerald-50 transition-all active:scale-95"
                    >
                      <Plus className="h-4 w-4 mr-2" /> 이 테마로 강의 만들기
                    </Button>
                  </div>
                </div>

                {/* Quick Pick List */}
                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/60 shadow-lg">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-emerald-500" /> 빠른 강의 생성
                  </h4>
                  <div className="space-y-2">
                    {demandData.slice(0, 4).map(theme => (
                      <button
                        key={theme.theme}
                        onClick={() => setSelectedTheme(theme)}
                        className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-emerald-50 transition-colors text-left group"
                      >
                        <div>
                          <p className="text-sm font-bold text-gray-900">{theme.theme}</p>
                          <p className="text-[11px] text-gray-400">{theme.studentCount}명 · 수요 {theme.demandScore}점</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-emerald-500 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Lecture Modal */}
      <CreateLectureModal theme={selectedTheme} onClose={() => setSelectedTheme(null)} />

      <Footer />
    </main>
  )
}
