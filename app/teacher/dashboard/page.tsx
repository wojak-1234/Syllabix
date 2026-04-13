'use client'

import { useState, useEffect } from "react"
import { AnimatedBackground } from "@/components/animated-background"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Plus,
  BookOpen,
  Users,
  ChevronRight,
  Sparkles,
  Zap,
  GraduationCap,
  Eye,
  EyeOff,
  Link2,
  Pencil,
  Trash2,
  MoreHorizontal,
  BarChart3
} from "lucide-react"

// ── 타입 정의 ────────────────────────────────────────────────────────

interface SeriesSummary {
  id: string
  title: string
  description: string | null
  targetLevel: string
  status: 'DRAFT' | 'PUBLISHED'
  visibility: 'PUBLIC' | 'LINK_ONLY' | 'PRIVATE'
  lectures: { id: string; title: string; order: number }[]
  _count: { enrollments: number }
  updatedAt: string
}

// ── Mock 데이터 (DB 연결 전 데모용) ─────────────────────────────────

const MOCK_SERIES: SeriesSummary[] = [
  {
    id: '1',
    title: 'Python 기초부터 실전까지',
    description: '프로그래밍 입문자를 위한 파이썬 완벽 가이드',
    targetLevel: 'beginner',
    status: 'PUBLISHED',
    visibility: 'PUBLIC',
    lectures: [
      { id: 'l1', title: '변수와 자료형', order: 1 },
      { id: 'l2', title: '조건문과 반복문', order: 2 },
      { id: 'l3', title: '함수와 모듈', order: 3 },
    ],
    _count: { enrollments: 42 },
    updatedAt: '2026-04-12T10:00:00Z',
  },
  {
    id: '2',
    title: 'React Hooks 마스터 클래스',
    description: 'useState부터 커스텀 훅까지 완벽 이해',
    targetLevel: 'intermediate',
    status: 'DRAFT',
    visibility: 'PRIVATE',
    lectures: [
      { id: 'l4', title: 'useState 깊이 이해하기', order: 1 },
    ],
    _count: { enrollments: 0 },
    updatedAt: '2026-04-11T15:30:00Z',
  },
]

// ── 레벨 뱃지 ────────────────────────────────────────────────────────

function LevelBadge({ level }: { level: string }) {
  const config: Record<string, { label: string; className: string }> = {
    beginner: { label: '입문', className: 'bg-emerald-50 text-emerald-700' },
    intermediate: { label: '중급', className: 'bg-amber-50 text-amber-700' },
    advanced: { label: '고급', className: 'bg-rose-50 text-rose-700' },
  }
  const c = config[level] || config.beginner
  return <Badge className={cn('border-none font-bold text-xs px-2.5 py-0.5', c.className)}>{c.label}</Badge>
}

// ── 공개 설정 아이콘 ─────────────────────────────────────────────────

function VisibilityIcon({ visibility }: { visibility: string }) {
  if (visibility === 'PUBLIC') return <Eye className="h-3.5 w-3.5 text-emerald-500" />
  if (visibility === 'LINK_ONLY') return <Link2 className="h-3.5 w-3.5 text-amber-500" />
  return <EyeOff className="h-3.5 w-3.5 text-gray-400" />
}

// ── Series 카드 ──────────────────────────────────────────────────────

function SeriesCard({ series, onClick }: { series: SeriesSummary; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-white/80 backdrop-blur-xl rounded-[2rem] p-7 border border-white/60 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-emerald-100/20 transition-all" />

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <LevelBadge level={series.targetLevel} />
          <Badge className={cn(
            'border-none font-bold text-[10px] px-2 py-0.5',
            series.status === 'PUBLISHED'
              ? 'bg-emerald-500 text-white'
              : 'bg-gray-100 text-gray-500'
          )}>
            {series.status === 'PUBLISHED' ? '공개됨' : '작성 중'}
          </Badge>
        </div>
        <div className="flex items-center gap-1.5">
          <VisibilityIcon visibility={series.visibility} />
          <button
            onClick={e => { e.stopPropagation() }}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
          >
            <MoreHorizontal className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-1.5 group-hover:text-emerald-700 transition-colors">
        {series.title}
      </h3>
      {series.description && (
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{series.description}</p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            {series.lectures.length}개 강좌
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {series._count.enrollments}명 수강
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </div>
  )
}

// ── 새 Series 생성 카드 ──────────────────────────────────────────────

function CreateSeriesCard({ onClick }: { onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer border-2 border-dashed border-emerald-200 bg-emerald-50/10 hover:border-emerald-500 rounded-[2.5rem] p-7 flex flex-col items-center justify-center text-center min-h-[200px] transition-all duration-300 hover:bg-emerald-50 hover:shadow-xl hover:shadow-emerald-500/5 shadow-sm"
    >
      <div className="h-16 w-16 rounded-[1.5rem] bg-emerald-100 group-hover:bg-emerald-600 flex items-center justify-center mb-5 transition-all duration-500 shadow-sm group-hover:scale-110 group-hover:rotate-6">
        <Plus className="h-8 w-8 text-emerald-600 group-hover:text-white transition-colors" />
      </div>
      <p className="font-black text-gray-900 group-hover:text-emerald-700 transition-colors text-lg tracking-tight">
        새 커리큘럼 만들기
      </p>
      <p className="text-xs font-bold text-emerald-600/60 mt-1 uppercase tracking-widest">AI Assistance Ready</p>
    </div>
  )
}

// ── 새 Series 생성 모달 ──────────────────────────────────────────────

function CreateSeriesModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [targetLevel, setTargetLevel] = useState('beginner')
  const [creating, setCreating] = useState(false)

  if (!open) return null

  const handleCreate = async () => {
    if (!title.trim()) return
    setCreating(true)

    try {
      const res = await fetch('/api/teacher/series/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teacherId: 'mock-teacher-id', title, description, targetLevel }),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate series');
      }

      const { data } = await res.json()

      // 임시: sessionStorage에 저장 후 강좌 편집 페이지로 이동 (진행 중인 로직 호환성 대비)
      sessionStorage.setItem('newSeries', JSON.stringify({
        id: data.id,
        title: data.title,
        description: data.description,
        targetLevel: data.targetLevel,
        lectures: data.lectures || [],
      }))
      
      window.location.href = `/teacher/series/${data.id}/edit`
    } catch (error: any) {
      console.error(error)
      alert(`생성에 실패했습니다: ${error.message}`)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[2rem] p-8 w-full max-w-lg shadow-2xl border border-white/60 animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-500" />
            새 커리큘럼 만들기
          </h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
              커리큘럼 제목 *
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="예: Python 기초부터 실전까지"
              className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-300 transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
              설명
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="커리큘럼에 대한 간단한 설명"
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-300 transition-all resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
              대상 수준 *
            </label>
            <div className="flex gap-3">
              {[
                { value: 'beginner', label: '입문', icon: '🌱' },
                { value: 'intermediate', label: '중급', icon: '🌿' },
                { value: 'advanced', label: '고급', icon: '🌳' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setTargetLevel(opt.value)}
                  className={cn(
                    "flex-1 h-12 rounded-xl text-sm font-bold transition-all duration-200 border-2 flex items-center justify-center gap-1.5",
                    targetLevel === opt.value
                      ? "bg-emerald-50 border-emerald-400 text-emerald-700 shadow-sm"
                      : "bg-white border-slate-200 text-gray-400 hover:border-slate-300"
                  )}
                >
                  {opt.icon} {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Button
          onClick={handleCreate}
          disabled={creating || !title.trim()}
          className={cn(
            "w-full h-14 mt-6 rounded-2xl font-bold text-base transition-all",
            "bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:scale-95"
          )}
        >
          {creating ? (
            <span className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              생성 중...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> 커리큘럼 생성하기
            </span>
          )}
        </Button>
      </div>
    </div>
  )
}

// ── 메인 페이지 ──────────────────────────────────────────────────────

export default function TeacherDashboardPage() {
  const [seriesList, setSeriesList] = useState<SeriesSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const teacherId = 'mock-teacher-id'
  const teacherName = "홍길동"

  const fetchSeries = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/teacher/series?teacherId=${teacherId}`)
      if (!res.ok) throw new Error("Failed to fetch series")
      const { data } = await res.json()
      setSeriesList(data)
    } catch (error) {
      console.error("Error fetching series:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSeries()
  }, [])

  const publishedCount = seriesList.filter(s => s.status === 'PUBLISHED').length
  const totalEnrollments = seriesList.reduce((sum, s) => sum + (s._count?.enrollments || 0), 0)

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50/50 pb-20">
      <AnimatedBackground />
      <Navbar />

      <div className="relative z-10 container mx-auto px-4 pt-28 max-w-6xl">
        {/* Header */}
        <div className="mb-10 space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-emerald-100 text-emerald-700 border-none px-3 py-1 text-xs font-bold flex items-center gap-1.5">
              <Zap className="h-3 w-3" /> 교사 대시보드
            </Badge>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            {teacherName} 선생님의 커리큘럼
          </h1>
          <p className="text-gray-500 font-medium">
            커리큘럼을 설계하고 강좌를 구성하세요. AI가 전 과정을 보조합니다.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-3 mt-12 mb-4">
          <h2 className="text-xl font-black text-gray-900 tracking-tight">요약 통계</h2>
          <button onClick={() => alert('실제 동작: \n총 수강생 등의 수치는 DB의 Enrollment 테이블 값과 실제 User 진척도를 Aggregate하여 계산하게 됩니다. (현재 디자인 리뷰용으로 일부 가상 데이터가 포함되어 있습니다.)')} className="p-1 rounded-full bg-slate-200 text-slate-500 hover:bg-emerald-100 hover:text-emerald-600 transition-colors cursor-pointer">
            <span title="도움말">❓</span>
          </button>
          <span className="text-[10px] text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">데모(임시)</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 border border-white/60 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-emerald-600" />
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">전체 커리큘럼</p>
            </div>
            <p className="text-3xl font-black text-gray-900">
              {loading ? '-' : seriesList.length}<span className="text-base text-gray-400 ml-1">개</span>
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 border border-white/60 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-amber-600" />
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">공개 중</p>
            </div>
            <p className="text-3xl font-black text-gray-900">
              {loading ? '-' : publishedCount}<span className="text-base text-gray-400 ml-1">개</span>
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 border border-white/60 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                <Users className="h-5 w-5 text-indigo-600" />
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">총 수강생</p>
            </div>
            <p className="text-3xl font-black text-gray-900">
              {loading ? '-' : totalEnrollments}<span className="text-base text-gray-400 ml-1">명</span>
            </p>
          </div>
        </div>

        {/* Series Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {seriesList.map(series => (
            <SeriesCard
              key={series.id}
              series={series}
              onClick={() => {
                window.location.href = `/teacher/series/${series.id}/edit`
              }}
            />
          ))}
          {!loading && <CreateSeriesCard onClick={() => setShowCreateModal(true)} />}
          {loading && (
             <div className="col-span-full py-20 flex flex-col items-center justify-center">
                <div className="h-8 w-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
                <p className="text-gray-400 font-bold">커리큘럼 목록을 불러오고 있습니다...</p>
             </div>
          )}
        </div>
      </div>

      <CreateSeriesModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      <Footer />
    </main>
  )
}
