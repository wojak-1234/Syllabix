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
  GripVertical,
  BookOpen,
  Sparkles,
  ChevronLeft,
  Trash2,
  Eye,
  Save,
  Check,
  FileText,
  Code2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Globe,
  Lock,
  Link2,
} from "lucide-react"

// ── 타입 정의 ────────────────────────────────────────────────────────

interface LectureItem {
  id: string
  order: number
  title: string
  learningObjective: string
  conceptTags: string[]
  quizCount: number
  codingTestCount: number
}

interface SeriesData {
  id: string
  title: string
  description: string
  targetLevel: string
  status: 'DRAFT' | 'PUBLISHED'
  visibility: 'PUBLIC' | 'LINK_ONLY' | 'PRIVATE'
  lectures: LectureItem[]
}

// ── Mock 초기 데이터 ────────────────────────────────────────────────

const MOCK_SERIES_DETAIL: SeriesData = {
  id: '1',
  title: 'Python 기초부터 실전까지',
  description: '프로그래밍 입문자를 위한 파이썬 완벽 가이드',
  targetLevel: 'beginner',
  status: 'DRAFT',
  visibility: 'PRIVATE',
  lectures: [
    { id: 'l1', order: 1, title: '변수와 자료형', learningObjective: '파이썬의 기본 자료형을 이해하고 변수를 선언할 수 있다', conceptTags: ['변수', '자료형', 'int', 'str'], quizCount: 3, codingTestCount: 1 },
    { id: 'l2', order: 2, title: '조건문과 반복문', learningObjective: 'if/elif/else와 for/while 반복문을 사용할 수 있다', conceptTags: ['if', 'for', 'while'], quizCount: 2, codingTestCount: 2 },
    { id: 'l3', order: 3, title: '함수와 모듈', learningObjective: '사용자 정의 함수를 작성하고 모듈로 분리할 수 있다', conceptTags: ['함수', 'def', 'import'], quizCount: 0, codingTestCount: 0 },
  ],
}

// ── 강좌 추가 모달 ──────────────────────────────────────────────────

function AddLectureModal({
  open,
  onClose,
  onAdd,
}: {
  open: boolean
  onClose: () => void
  onAdd: (lecture: { title: string; learningObjective: string; conceptTags: string[] }) => void
}) {
  const [title, setTitle] = useState('')
  const [objective, setObjective] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])

  if (!open) return null

  const handleAddTag = () => {
    const trimmed = tagInput.trim()
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed])
      setTagInput('')
    }
  }

  const handleSubmit = () => {
    if (!title.trim() || !objective.trim() || tags.length === 0) return
    onAdd({ title, learningObjective: objective, conceptTags: tags })
    setTitle('')
    setObjective('')
    setTags([])
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[2rem] p-8 w-full max-w-lg shadow-2xl border border-white/60 animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
        <h3 className="text-xl font-black text-gray-900 flex items-center gap-2 mb-6">
          <Plus className="h-5 w-5 text-emerald-500" /> 새 강좌 추가
        </h3>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">강좌 제목 *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="예: 변수와 자료형"
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">학습 목표 *</label>
            <textarea
              value={objective}
              onChange={e => setObjective(e.target.value)}
              placeholder="이 강좌를 마치면 학습자가 할 수 있는 것"
              rows={2}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all resize-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">핵심 개념 태그 *</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="태그 입력 후 Enter"
                className="flex-1 h-10 px-4 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
              <Button onClick={handleAddTag} size="sm" variant="outline" className="rounded-xl h-10 px-4">추가</Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-1 cursor-pointer hover:bg-red-100 hover:text-red-600 transition-colors"
                  onClick={() => setTags(tags.filter(t => t !== tag))}
                >
                  {tag} ✕
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={onClose} className="flex-1 h-12 rounded-2xl font-bold">취소</Button>
          <Button
            onClick={handleSubmit}
            disabled={!title.trim() || !objective.trim() || tags.length === 0}
            className="flex-1 h-12 rounded-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 active:scale-95 transition-all"
          >
            강좌 추가
          </Button>
        </div>
      </div>
    </div>
  )
}

// ── 강좌 카드 ────────────────────────────────────────────────────────

function LectureCard({
  lecture,
  onDelete,
}: {
  lecture: LectureItem
  onDelete: () => void
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="flex items-center gap-3 p-4">
        <div className="cursor-grab text-gray-300 hover:text-gray-500 transition-colors">
          <GripVertical className="h-5 w-5" />
        </div>

        <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 font-black flex items-center justify-center text-sm shrink-0">
          {lecture.order}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-gray-900 truncate">{lecture.title}</h4>
          <p className="text-xs text-gray-400 truncate">{lecture.learningObjective}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
            <span className="flex items-center gap-0.5">
              <HelpCircle className="h-3 w-3" /> {lecture.quizCount}
            </span>
            <span className="flex items-center gap-0.5">
              <Code2 className="h-3 w-3" /> {lecture.codingTestCount}
            </span>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {expanded ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
          </button>

          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 pt-0 border-t border-slate-100 animate-in slide-in-from-top-2 duration-200">
          <div className="mt-3 space-y-3">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">개념 태그</p>
              <div className="flex flex-wrap gap-1.5">
                {lecture.conceptTags.map(tag => (
                  <span key={tag} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="rounded-xl text-xs h-8 flex items-center gap-1.5">
                <HelpCircle className="h-3 w-3" /> 퀴즈 관리
              </Button>
              <Button size="sm" variant="outline" className="rounded-xl text-xs h-8 flex items-center gap-1.5">
                <Code2 className="h-3 w-3" /> 코딩테스트 관리
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── 메인 페이지 ──────────────────────────────────────────────────────

export default function SeriesEditPage() {
  const [series, setSeries] = useState<SeriesData>(MOCK_SERIES_DETAIL)
  const [showAddLecture, setShowAddLecture] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleAddLecture = (data: { title: string; learningObjective: string; conceptTags: string[] }) => {
    const newLecture: LectureItem = {
      id: 'new-' + Date.now(),
      order: series.lectures.length + 1,
      title: data.title,
      learningObjective: data.learningObjective,
      conceptTags: data.conceptTags,
      quizCount: 0,
      codingTestCount: 0,
    }
    setSeries({ ...series, lectures: [...series.lectures, newLecture] })
  }

  const handleDeleteLecture = (lectureId: string) => {
    const filtered = series.lectures.filter(l => l.id !== lectureId)
    const reordered = filtered.map((l, idx) => ({ ...l, order: idx + 1 }))
    setSeries({ ...series, lectures: reordered })
  }

  const handlePublish = () => {
    setSeries({ ...series, status: 'PUBLISHED', visibility: 'PUBLIC' })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleSaveDraft = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50/50 pb-20">
      <AnimatedBackground />
      <Navbar />

      <div className="relative z-10 container mx-auto px-4 pt-28 max-w-4xl">
        {/* Back */}
        <button
          onClick={() => window.location.href = '/teacher/dashboard'}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-emerald-600 font-medium mb-6 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" /> 대시보드로 돌아가기
        </button>

        {/* Series Header Card */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/60 shadow-2xl mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-100/20 rounded-full -mr-24 -mt-24 blur-3xl" />

          <div className="flex items-start justify-between mb-6">
            <div>
              <Badge className={cn(
                'border-none font-bold text-xs px-2.5 py-0.5 mb-2',
                series.status === 'PUBLISHED' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-500'
              )}>
                {series.status === 'PUBLISHED' ? '공개됨' : 'Draft'}
              </Badge>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">{series.title}</h1>
              <p className="text-gray-500 mt-1">{series.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleSaveDraft}
              variant="outline"
              className="rounded-xl h-10 px-5 font-bold border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-all"
            >
              {saved ? <Check className="h-4 w-4 mr-1.5" /> : <Save className="h-4 w-4 mr-1.5" />}
              {saved ? '저장됨' : '임시 저장'}
            </Button>
            <Button
              onClick={() => window.location.href = `/teacher/series/${series.id}/preview`}
              variant="outline"
              className="rounded-xl h-10 px-5 font-bold transition-all"
            >
              <Eye className="h-4 w-4 mr-1.5" /> 미리보기
            </Button>
            <Button
              onClick={handlePublish}
              className="rounded-xl h-10 px-6 font-bold bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 active:scale-95 transition-all"
            >
              <Globe className="h-4 w-4 mr-1.5" /> 공개하기
            </Button>
          </div>
        </div>

        {/* Lectures Section */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-emerald-500" />
            강좌 구성
            <span className="text-sm text-gray-400 font-medium ml-1">{series.lectures.length}개</span>
          </h2>
          <Button
            onClick={() => setShowAddLecture(true)}
            className="rounded-xl h-10 px-5 font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-all"
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-1.5" /> 강좌 추가
          </Button>
        </div>

        {series.lectures.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-[2rem]">
            <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-bold mb-1">아직 강좌가 없습니다</p>
            <p className="text-gray-400 text-sm mb-6">첫 번째 강좌를 추가하여 커리큘럼을 구성하세요</p>
            <Button
              onClick={() => setShowAddLecture(true)}
              className="rounded-xl px-6 font-bold bg-emerald-600 text-white hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4 mr-1.5" /> 강좌 추가하기
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {series.lectures.map(lecture => (
              <LectureCard
                key={lecture.id}
                lecture={lecture}
                onDelete={() => handleDeleteLecture(lecture.id)}
              />
            ))}
          </div>
        )}

        {/* AI Assist Hint */}
        {series.lectures.length > 0 && (
          <div className="mt-6 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-emerald-800">AI 보조 기능</p>
              <p className="text-xs text-emerald-600 mt-0.5">
                각 강좌의 "퀴즈 관리" 또는 "코딩테스트 관리" 버튼을 클릭하면 AI가 문제를 자동 생성할 수 있습니다.
              </p>
            </div>
          </div>
        )}
      </div>

      <AddLectureModal
        open={showAddLecture}
        onClose={() => setShowAddLecture(false)}
        onAdd={handleAddLecture}
      />

      <Footer />
    </main>
  )
}
