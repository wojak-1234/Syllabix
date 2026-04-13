'use client'

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
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
  ImagePlus,
  Loader2,
} from "lucide-react"

// ── 타입 정의 ────────────────────────────────────────────────────────

interface QuizItem {
  id?: string
  order: number
  question: string
  choices: { label: string; isCorrect: boolean }[]
  explanation?: string
  conceptTag?: string
}

interface CodingTestItem {
  id?: string
  order: number
  title: string
  description: string
  starterCode?: string
  testCases: { input: string; expectedOutput: string }[]
  solutionCode?: string
  gradingCriteria?: string
  conceptTag?: string
}

interface LectureItem {
  id: string
  order: number
  title: string
  learningObjective: string
  conceptTags: string[]
  quizCount: number
  codingTestCount: number
  content?: string
  quizzes?: QuizItem[]
  codingTests?: CodingTestItem[]
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

// ── 시리즈 정보 편집 모달 ──────────────────────────────────────────────

function EditSeriesModal({
  open,
  onClose,
  onUpdate,
  initialData,
}: {
  open: boolean
  onClose: () => void
  onUpdate: (data: { title: string; description: string; targetLevel: string }) => Promise<void>
  initialData: { title: string; description: string; targetLevel: string }
}) {
  const [title, setTitle] = useState(initialData.title)
  const [description, setDescription] = useState(initialData.description)
  const [targetLevel, setTargetLevel] = useState(initialData.targetLevel)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setTitle(initialData.title)
    setDescription(initialData.description)
    setTargetLevel(initialData.targetLevel)
  }, [initialData])

  if (!open) return null

  const handleSubmit = async () => {
    if (!title.trim()) return
    setSaving(true)
    try {
      await onUpdate({ title, description, targetLevel })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[2rem] p-8 w-full max-w-lg shadow-2xl border border-white/60 animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
        <h3 className="text-xl font-black text-gray-900 flex items-center gap-2 mb-6">
          <BookOpen className="h-5 w-5 text-emerald-500" /> 기본 정보 편집
        </h3>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">커리큘럼 제목 *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="예: 파이썬 기초 마스터링"
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">설명</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="이 커리큘럼에 대한 상세 설명"
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all resize-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">대상 수준</label>
            <div className="flex gap-2">
              {['beginner', 'intermediate', 'advanced'].map((lv) => (
                <button
                  key={lv}
                  onClick={() => setTargetLevel(lv)}
                  className={cn(
                    "flex-1 h-10 rounded-xl text-xs font-bold border transition-all",
                    targetLevel === lv 
                      ? "bg-emerald-600 text-white border-emerald-600" 
                      : "bg-slate-50 text-gray-500 border-slate-200 hover:border-emerald-200"
                  )}
                >
                  {lv === 'beginner' ? '입문' : lv === 'intermediate' ? '중급' : '고급'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <Button variant="outline" onClick={onClose} className="flex-1 h-12 rounded-2xl font-bold">취소</Button>
          <Button
            onClick={handleSubmit}
            disabled={!title.trim() || saving}
            className="flex-1 h-12 rounded-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 active:scale-95 transition-all"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            저장하기
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
  onEditContent,
  onManageItems
}: {
  lecture: LectureItem
  onDelete: () => void
  onEditContent: () => void
  onManageItems: (tab: 'quiz' | 'coding') => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [attachments, setAttachments] = useState<{name: string, type: string}[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAddFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setAttachments([...attachments, { name: file.name, type: 'file' }])
      // 동일한 파일을 다시 선택할 수 있도록 value 초기화
      e.target.value = ''
    }
  }

  return (
    <>
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
            <span className="flex items-center gap-0.5" title="퀴즈">
              <HelpCircle className="h-3 w-3" /> {lecture.quizCount}
            </span>
            <span className="flex items-center gap-0.5" title="코딩테스트">
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
          <div className="mt-4 mb-4">
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">강좌 본문 미리보기</p>
             <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100 min-h-[60px]">
                {lecture.content ? (
                  <div className="text-xs text-gray-600 font-medium leading-relaxed whitespace-pre-wrap line-clamp-4">
                    {lecture.content}
                  </div>
                ) : (
                  <p className="text-xs text-gray-300 font-medium italic">작성된 본문이 없습니다. '강좌 본문 편집'을 통해 내용을 추가해주세요.</p>
                )}
             </div>
          </div>
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
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={onEditContent}
                size="sm" variant="outline" className="rounded-xl text-xs h-8 flex items-center gap-1.5 border-emerald-100 text-emerald-700 bg-emerald-50/30"
              >
                <FileText className="h-3 w-3" /> 강좌 본문 편집
              </Button>
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleAddFile}
                className="hidden"
              />
              <Button 
                onClick={() => fileInputRef.current?.click()}
                size="sm" variant="outline" className="rounded-xl text-xs h-8 flex items-center gap-1.5 border-blue-100 text-blue-700 bg-blue-50/30"
              >
                <Plus className="h-3 w-3" /> 첨부파일 추가
              </Button>
              
              {attachments.length > 0 && (
                <div className="w-full mt-2 bg-slate-50/50 rounded-xl p-3 border border-slate-100 space-y-1">
                   <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">첨부파일 ({attachments.length})</p>
                   {attachments.map((at, i) => (
                     <div key={i} className="flex items-center justify-between text-[11px] text-gray-600 font-medium">
                        <span className="flex items-center gap-1.5"><FileText className="h-3 w-3 text-blue-500" /> {at.name}</span>
                        <button onClick={() => setAttachments(attachments.filter((_, idx)=>idx!==i))} className="text-gray-300 hover:text-red-500 transition-colors">✕</button>
                     </div>
                   ))}
                </div>
              )}

              <div className="w-full flex gap-2">
                <Button 
                  onClick={onManageItems.bind(null, 'quiz')}
                  size="sm" variant="outline" className="rounded-xl text-xs h-8 flex items-center gap-1.5 flex-1"
                >
                  <HelpCircle className="h-3 w-3" /> 퀴즈 관리
                </Button>
                <Button 
                  onClick={onManageItems.bind(null, 'coding')}
                  size="sm" variant="outline" className="rounded-xl text-xs h-8 flex items-center gap-1.5 flex-1"
                >
                  <Code2 className="h-3 w-3" /> 코딩테스트 관리
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  )
}

// ── 퀴즈 / 코딩테스트 관리 모달 ────────────────────────────────────────

function LectureItemsModal({
  open,
  onClose,
  lecture,
  targetLevel,
  onUpdateCounts,
}: {
  open: boolean
  onClose: () => void
  lecture: LectureItem | null
  targetLevel: string
  onUpdateCounts: (lectureId: string, quizCount: number, codingCount: number) => void
}) {
  const [activeTab, setActiveTab] = useState<'quiz' | 'coding'>('quiz')
  const [items, setItems] = useState<{ quizzes: QuizItem[], codingTests: CodingTestItem[] }>({ quizzes: [], codingTests: [] })
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open && lecture && !lecture.id.startsWith('new-')) {
      fetchItems()
    } else if (open && lecture) {
      setItems({ quizzes: [], codingTests: [] })
    }
  }, [open, lecture])

  const fetchItems = async () => {
    if (!lecture) return
    setLoading(true)
    try {
      const res = await fetch(`/api/teacher/series/dummy/lectures/${lecture.id}`)
      const { data } = await res.json()
      setItems({
        quizzes: (data.quizzes || []).map((q: any) => ({
          ...q,
          choices: typeof q.choices === 'string' ? JSON.parse(q.choices) : q.choices
        })),
        codingTests: (data.codingTests || []).map((c: any) => ({
          ...c,
          testCases: typeof c.testCases === 'string' ? JSON.parse(c.testCases) : c.testCases
        }))
      })
    } catch (err) {
      console.error(err)
    } finally {
       setLoading(false)
    }
  }

  const handleGenerateAI = async () => {
    if (!lecture) return
    setGenerating(true)
    try {
      const res = await fetch('/api/teacher/generate-lecture-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lectureTitle: lecture.title,
          learningObjective: lecture.learningObjective,
          targetLevel
        })
      })
      const { data } = await res.json()
      setItems({
        quizzes: data.quizzes.map((q: any, i: number) => ({ ...q, order: i + 1 })),
        codingTests: data.codingTests.map((c: any, i: number) => ({ ...c, order: i + 1 }))
      })
    } catch (err) {
      console.error(err)
      alert("AI 생성 중 오류가 발생했습니다.")
    } finally {
      setGenerating(false)
    }
  }

  const handleSave = async () => {
    if (!lecture) return
    setSaving(true)
    try {
      onUpdateCounts(lecture.id, items.quizzes.length, items.codingTests.length)
      alert("저장되었습니다. (현재는 로컬 상에서만 반영됩니다)")
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (!open || !lecture) return null

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
        
        {/* Modal Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-xl font-black text-gray-900 tracking-tight">{lecture.title}</h3>
            <p className="text-xs text-gray-500 font-bold mt-0.5 uppercase tracking-widest">문제 및 평가 관리</p>
          </div>
          <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
            <button 
              onClick={() => setActiveTab('quiz')}
              className={cn(
                "px-6 py-2 rounded-xl text-xs font-black transition-all",
                activeTab === 'quiz' ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20" : "text-gray-400 hover:text-gray-600"
              )}
            >
              퀴즈 ({items.quizzes.length})
            </button>
            <button 
              onClick={() => setActiveTab('coding')}
              className={cn(
                "px-6 py-2 rounded-xl text-xs font-black transition-all",
                activeTab === 'coding' ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20" : "text-gray-400 hover:text-gray-600"
              )}
            >
              코딩테스트 ({items.codingTests.length})
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-white">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 text-emerald-500 animate-spin mb-4" />
              <p className="text-sm font-bold text-gray-400">데이터를 불러오는 중...</p>
            </div>
          ) : items.quizzes.length === 0 && items.codingTests.length === 0 && !generating ? (
            <div className="h-64 flex flex-col items-center justify-center text-center">
              <div className="h-16 w-16 bg-emerald-50 rounded-3xl flex items-center justify-center mb-4">
                <Sparkles className="h-8 w-8 text-emerald-500" />
              </div>
              <p className="text-lg font-black text-gray-900 mb-1">아직 생성된 문항이 없습니다</p>
              <p className="text-sm text-gray-400 mb-6 font-medium">강의 목표를 바탕으로 AI가 자동으로 문제를 출제해드립니다</p>
              <Button 
                onClick={handleGenerateAI}
                className="rounded-2xl px-8 h-12 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-black shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
              >
                <Sparkles className="h-4 w-4 mr-2" /> AI로 문제 자동 생성하기
              </Button>
            </div>
          ) : generating ? (
            <div className="h-64 flex flex-col items-center justify-center text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" />
                <div className="relative h-20 w-20 bg-emerald-500 text-white rounded-[2rem] flex items-center justify-center shadow-2xl shadow-emerald-500/40">
                  <Sparkles className="h-10 w-10 animate-pulse" />
                </div>
              </div>
              <p className="text-xl font-black text-gray-900 mb-2">AI가 강의 내용을 분석 중입니다</p>
              <p className="text-sm text-gray-400 font-medium">잠시만 기다려주시면 퀴즈와 코딩 테스트를 생성합니다...</p>
            </div>
          ) : (
            <div className="space-y-8">
              {activeTab === 'quiz' ? (
                <div className="space-y-6">
                  {items.quizzes.map((quiz, idx) => (
                    <div key={idx} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 group relative">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="h-6 w-10 rounded-lg bg-emerald-100 text-emerald-700 text-[10px] font-black flex items-center justify-center uppercase">QUIZ {idx + 1}</span>
                        <input 
                          value={quiz.conceptTag} 
                          onChange={e => {
                            const newQuizzes = [...items.quizzes]
                            newQuizzes[idx].conceptTag = e.target.value
                            setItems({...items, quizzes: newQuizzes})
                          }}
                          placeholder="개념 태그" 
                          className="bg-transparent border-none text-[10px] font-bold text-gray-400 focus:ring-0 w-32" 
                        />
                      </div>
                      <textarea 
                        value={quiz.question}
                        onChange={e => {
                          const newQuizzes = [...items.quizzes]
                          newQuizzes[idx].question = e.target.value
                          setItems({...items, quizzes: newQuizzes})
                        }}
                        rows={2}
                        className="w-full bg-white rounded-2xl p-4 text-sm font-bold text-gray-800 border-none shadow-sm focus:ring-2 focus:ring-emerald-500/50 transition-all resize-none mb-4"
                        placeholder="질문을 입력하세요"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        {quiz.choices.map((choice, cIdx) => (
                          <div key={cIdx} className="relative flex items-center">
                            <input 
                              type="text" 
                              value={choice.label}
                              onChange={e => {
                                const newQuizzes = [...items.quizzes]
                                newQuizzes[idx].choices[cIdx].label = e.target.value
                                setItems({...items, quizzes: newQuizzes})
                              }}
                              className={cn(
                                "w-full h-11 pl-4 pr-10 rounded-xl text-xs font-bold transition-all border-none shadow-sm",
                                choice.isCorrect ? "bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/30" : "bg-white text-gray-600"
                              )}
                            />
                            <button 
                              onClick={() => {
                                const newQuizzes = [...items.quizzes]
                                newQuizzes[idx].choices.forEach((c, i) => c.isCorrect = i === cIdx)
                                setItems({...items, quizzes: newQuizzes})
                              }}
                              className={cn(
                                "absolute right-3 h-5 w-5 rounded-full flex items-center justify-center transition-all",
                                choice.isCorrect ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-300 hover:bg-gray-200"
                              )}
                            >
                              <Check className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">정답 해설</p>
                        <textarea 
                          value={quiz.explanation}
                          onChange={e => {
                            const newQuizzes = [...items.quizzes]
                            newQuizzes[idx].explanation = e.target.value
                            setItems({...items, quizzes: newQuizzes})
                          }}
                          className="w-full bg-slate-100/50 rounded-2xl p-4 text-[11px] font-medium text-gray-500 border-none focus:ring-1 focus:ring-gray-300 transition-all resize-none"
                        />
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full rounded-2xl border-dashed border-2 border-slate-200 h-14 text-gray-400 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-all font-bold">
                    <Plus className="h-4 w-4 mr-2" /> 새 퀴즈 추가
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.codingTests.map((test, idx) => (
                    <div key={idx} className="space-y-6">
                      <div className="p-8 rounded-[2.5rem] bg-indigo-50/30 border border-indigo-100">
                        <div className="flex items-center gap-2 mb-6">
                          <span className="h-6 w-20 rounded-lg bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center uppercase">Coding Test</span>
                          <input 
                            value={test.title}
                            onChange={e => {
                              const newTests = [...items.codingTests]
                              newTests[idx].title = e.target.value
                              setItems({...items, codingTests: newTests})
                            }}
                            className="bg-transparent border-none text-lg font-black text-indigo-900 focus:ring-0 flex-1 px-1" 
                            placeholder="테스트 제목"
                          />
                        </div>
                        
                        <div className="space-y-5">
                          <div>
                            <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 block ml-1">문제 설명</label>
                            <textarea 
                              value={test.description}
                              onChange={e => {
                                const newTests = [...items.codingTests]
                                newTests[idx].description = e.target.value
                                setItems({...items, codingTests: newTests})
                              }}
                              rows={4}
                              className="w-full bg-white rounded-3xl p-5 text-sm font-medium text-gray-700 border-none shadow-sm focus:ring-2 focus:ring-indigo-500/30 transition-all"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 block ml-1">초기 코드</label>
                              <textarea 
                                value={test.starterCode}
                                onChange={e => {
                                  const newTests = [...items.codingTests]
                                  newTests[idx].starterCode = e.target.value
                                  setItems({...items, codingTests: newTests})
                                }}
                                className="w-full bg-slate-900 rounded-2xl p-4 text-[11px] font-mono text-emerald-400 border-none h-40 custom-scrollbar"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 block ml-1">정답 코드</label>
                              <textarea 
                                value={test.solutionCode}
                                onChange={e => {
                                  const newTests = [...items.codingTests]
                                  newTests[idx].solutionCode = e.target.value
                                  setItems({...items, codingTests: newTests})
                                }}
                                className="w-full bg-slate-900 rounded-2xl p-4 text-[11px] font-mono text-blue-400 border-none h-40 custom-scrollbar"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 block ml-1">테스트 케이스 (입력 | 출력)</label>
                            <div className="space-y-2">
                              {test.testCases.map((tc, tcIdx) => (
                                <div key={tcIdx} className="flex gap-2">
                                  <input 
                                    value={tc.input}
                                    onChange={e => {
                                      const newTests = [...items.codingTests]
                                      newTests[idx].testCases[tcIdx].input = e.target.value
                                      setItems({...items, codingTests: newTests})
                                    }}
                                    placeholder="Input" 
                                    className="flex-1 h-10 px-4 rounded-xl bg-white border-none shadow-sm text-xs font-mono"
                                  />
                                  <input 
                                    value={tc.expectedOutput}
                                    onChange={e => {
                                      const newTests = [...items.codingTests]
                                      newTests[idx].testCases[tcIdx].expectedOutput = e.target.value
                                      setItems({...items, codingTests: newTests})
                                    }}
                                    placeholder="Output" 
                                    className="flex-1 h-10 px-4 rounded-xl bg-white border-none shadow-sm text-xs font-mono"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full rounded-2xl border-dashed border- Indigo-200 hover:text-indigo-600 hover:bg-indigo-50 border-2 h-14 text-indigo-300 transition-all font-bold">
                    <Plus className="h-4 w-4 mr-2" /> 새 코딩테스트 추가
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-8 py-6 border-t border-gray-100 bg-white flex items-center justify-between">
          <Button 
            onClick={onClose}
            variant="ghost" className="rounded-xl font-bold text-gray-400"
          >
            이미 충분해요, 닫기
          </Button>
          <div className="flex gap-3">
            <Button 
              onClick={handleGenerateAI}
              disabled={generating || loading}
              variant="outline"
              className="rounded-xl font-bold border-emerald-200 text-emerald-600 h-11 px-6 hover:bg-emerald-50"
            >
              <Sparkles className="h-4 w-4 mr-2" /> AI가 다른 버전 생성
            </Button>
            <Button 
              onClick={handleSave}
              disabled={saving || (items.quizzes.length === 0 && items.codingTests.length === 0)}
              className="rounded-xl font-black bg-gray-900 text-white h-11 px-8 hover:bg-black shadow-xl shadow-black/10 transition-all"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              문항 저장하고 마무리
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}


// ── 메인 페이지 ──────────────────────────────────────────────────────

export default function SeriesEditPage() {
  const params = useParams()
  const id = params.id as string

  const [series, setSeries] = useState<SeriesData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAddLecture, setShowAddLecture] = useState(false)
  const [showEditSeries, setShowEditSeries] = useState(false)
  const [manageItemsLecture, setManageItemsLecture] = useState<{lecture: LectureItem, tab: 'quiz' | 'coding'} | null>(null)
  const [saved, setSaved] = useState(false)
  const [editingLecture, setEditingLecture] = useState<LectureItem | null>(null)
  const [editorContent, setEditorContent] = useState('')
  const imageInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/teacher/series/${id}`)
        if (!res.ok) throw new Error("Failed to fetch series")
        const { data } = await res.json()
        
        // 데이터 매핑 (API 응답 구조에 맞춤)
        const mappedLectures = (data.lectures || []).map((l: any) => ({
          ...l,
          conceptTags: typeof l.conceptTags === 'string' ? JSON.parse(l.conceptTags) : (l.conceptTags || []),
          quizCount: l.quizzes?.length || 0,
          codingTestCount: l.codingTests?.length || 0
        }))

        setSeries({
          ...data,
          lectures: mappedLectures
        })
      } catch (error) {
        console.error("Error fetching series:", error)
        alert("데이터를 가져오는 중 오류가 발생했습니다.")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchSeries()
    }
  }, [id])

  const handleAddLecture = (data: { title: string; learningObjective: string; conceptTags: string[] }) => {
    if (!series) return
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
    if (!series) return
    const filtered = series.lectures.filter(l => l.id !== lectureId)
    const reordered = filtered.map((l, idx) => ({ ...l, order: idx + 1 }))
    setSeries({ ...series, lectures: reordered })
  }

  const handlePublish = async () => {
    if (!series) return
    try {
      const res = await fetch(`/api/teacher/series/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PUBLISHED', visibility: 'PUBLIC' }),
      })
      if (!res.ok) throw new Error("Failed to publish")

      setSeries({ ...series, status: 'PUBLISHED', visibility: 'PUBLIC' })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error(err)
      alert("공개 처리 중 오류가 발생했습니다.")
    }
  }

  const handleUnpublish = async () => {
    if (!series) return
    if (!confirm("정말 공개를 중단하시겠습니까? 학생들의 수강 신청이 불가능해집니다.")) return

    try {
      const res = await fetch(`/api/teacher/series/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'DRAFT', visibility: 'PRIVATE' }),
      })
      if (!res.ok) throw new Error("Failed to unpublish")

      setSeries({ ...series, status: 'DRAFT', visibility: 'PRIVATE' })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error(err)
      alert("공개 중단 처리 중 오류가 발생했습니다.")
    }
  }

  const handleSaveDraft = async () => {
    if (!series) return
    try {
      // 실제로는 본문 및 강좌 리스트를 저장하는 로직이 필요
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error(err)
    }
  }

  const handleUpdateSeries = async (data: { title: string; description: string; targetLevel: string }) => {
    if (!series) return
    try {
      const res = await fetch(`/api/teacher/series/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Failed to update series")
      
      const updated = await res.json()
      setSeries({ ...series, ...updated.data })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error(err)
      alert("정보 수정 중 오류가 발생했습니다.")
    }
  }

  const handleUpdateLectureCounts = (lectureId: string, quizCount: number, codingCount: number) => {
    if (!series) return
    const updatedLectures = series.lectures.map(l => 
      l.id === lectureId ? { ...l, quizCount, codingTestCount: codingCount } : l
    )
    setSeries({ ...series, lectures: updatedLectures })
  }

  const handleSaveLectureContent = async () => {
    if (!editingLecture || !series) return
    try {
      const res = await fetch(`/api/teacher/series/${id}/lectures/${editingLecture.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editorContent }),
      })
      if (!res.ok) throw new Error("Failed to save lecture content")
      
      const updatedLectures = series.lectures.map(l => 
        l.id === editingLecture.id ? { ...l, content: editorContent } : l
      )
      setSeries({ ...series, lectures: updatedLectures })
      setEditingLecture(null)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error(err)
      alert("본문 저장 중 오류가 발생했습니다.")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 text-emerald-500 animate-spin mb-4" />
        <p className="text-gray-500 font-bold">커리큘럼을 불러오는 중...</p>
      </div>
    )
  }

  if (!series) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <p className="text-gray-500 font-bold">커리큘럼을 찾을 수 없습니다.</p>
        <Button onClick={() => window.location.href = '/teacher/dashboard'} className="mt-4">
          대시보드로 돌아가기
        </Button>
      </div>
    )
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
        <div className={cn(
          "relative overflow-hidden transition-all duration-500 rounded-[2.5rem] p-10 border shadow-2xl mb-8",
          series.status === 'PUBLISHED' 
            ? "bg-slate-900 text-white border-slate-800 ring-4 ring-emerald-500/10" 
            : "bg-white/80 backdrop-blur-2xl border-white/60 text-gray-900"
        )}>
          {series.status === 'PUBLISHED' && (
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 via-transparent to-teal-500/20 opacity-50" />
          )}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-32 -mt-32 blur-[100px]" />

          <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <Badge className={cn(
                  'border-none font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-widest',
                  series.status === 'PUBLISHED' ? 'bg-emerald-500 text-white animate-pulse' : 'bg-gray-100 text-gray-500'
                )}>
                  {series.status === 'PUBLISHED' ? '● LIVE / 공개됨' : 'Draft / 작성 중'}
                </Badge>
                {series.status === 'PUBLISHED' && (
                   <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                      <Globe className="h-3 w-3" /> 전체 공개 상태
                   </div>
                )}
              </div>
              
              <h1 className={cn(
                "text-4xl font-black tracking-tight mb-3 leading-tight",
                series.status === 'PUBLISHED' ? "text-white" : "text-gray-900"
              )}>
                {series.title}
              </h1>
              <p className={cn(
                "text-lg font-medium opacity-70 max-w-2xl leading-relaxed",
                series.status === 'PUBLISHED' ? "text-slate-300" : "text-gray-500"
              )}>
                {series.description}
              </p>
            </div>

            {/* 별도 박스로 분리된 관리 도구 */}
            <div className={cn(
               "shrink-0 p-4 rounded-3xl flex flex-col gap-2 min-w-[200px]",
               series.status === 'PUBLISHED' ? "bg-white/10 border border-white/10 backdrop-blur-md" : "bg-slate-50 border border-slate-100"
            )}>
              <p className={cn(
                "text-[10px] font-black uppercase tracking-widest mb-1 px-1",
                series.status === 'PUBLISHED' ? "text-emerald-400/80" : "text-gray-400"
              )}>매니지먼트</p>
              
              <Button
                onClick={() => setShowEditSeries(true)}
                variant="ghost"
                className={cn(
                  "justify-start h-10 px-3 rounded-xl font-bold text-xs gap-2 transition-all",
                  series.status === 'PUBLISHED' ? "text-white hover:bg-white/20" : "text-gray-600 hover:bg-white"
                )}
              >
                <Plus className="h-4 w-4" /> 기본 정보 편집
              </Button>

              <Button
                onClick={handleSaveDraft}
                variant="ghost"
                className={cn(
                  "justify-start h-10 px-3 rounded-xl font-bold text-xs gap-2 transition-all",
                  series.status === 'PUBLISHED' ? "text-white hover:bg-white/20" : "text-emerald-700 hover:bg-white"
                )}
              >
                {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                {saved ? '저장 완료' : '중간 저장'}
              </Button>

              {series.status !== 'PUBLISHED' && (
                <Button
                  onClick={handlePublish}
                  className="mt-2 h-11 rounded-xl font-black text-xs bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 active:scale-95 transition-all w-full"
                >
                  <Globe className="h-4 w-4 mr-2" /> 커리큘럼 공개하기
                </Button>
              )}
              {series.status === 'PUBLISHED' && (
                <button
                  onClick={handleUnpublish}
                  className="mt-2 h-11 rounded-xl font-black text-xs border border-rose-500/40 text-rose-400 hover:bg-rose-500 hover:text-white transition-all w-full flex items-center justify-center gap-2"
                >
                  <Lock className="h-3.5 w-3.5" /> 공개 중단하기
                </button>
              )}
            </div>
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
                onEditContent={() => {
                  setEditingLecture(lecture)
                  setEditorContent(lecture.content || '')
                }}
                onManageItems={(tab) => setManageItemsLecture({ lecture, tab })}
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

      <EditSeriesModal
        open={showEditSeries}
        onClose={() => setShowEditSeries(false)}
        onUpdate={handleUpdateSeries}
        initialData={{
          title: series.title,
          description: series.description,
          targetLevel: series.targetLevel
        }}
      />

      <LectureItemsModal
        open={!!manageItemsLecture}
        onClose={() => setManageItemsLecture(null)}
        lecture={manageItemsLecture?.lecture || null}
        targetLevel={series.targetLevel}
        onUpdateCounts={handleUpdateLectureCounts}
      />

      {/* Notion Style Fullscreen Editor */}
      {editingLecture && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-slate-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
             <button onClick={() => setEditingLecture(null)} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold transition-colors">
               <ChevronLeft className="h-5 w-5" /> 돌아가기
             </button>
             <div className="flex items-center gap-3">
                <input 
                  type="file" 
                  ref={imageInputRef} 
                  accept="image/*" 
                  className="hidden" 
                  onChange={async (e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      const file = e.target.files[0];
                      const formData = new FormData();
                      formData.append('file', file);
                      
                      try {
                        const res = await fetch('/api/upload', {
                          method: 'POST',
                          body: formData
                        });
                        const data = await res.json();
                        setEditorContent(prev => prev + `\n![${file.name}](${data.url})\n`);
                      } catch (err) {
                        console.error('Upload failed:', err);
                        alert('이미지 업로드에 실패했습니다.');
                      }
                      
                      e.target.value = '';
                    }
                  }}
                />
                <Button 
                  variant="outline" 
                  onClick={() => imageInputRef.current?.click()}
                  className="h-10 rounded-xl font-bold flex items-center gap-2 text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100"
                >
                  <ImagePlus className="h-4 w-4" /> 이미지 첨부
                </Button>
                <Button 
                  onClick={handleSaveLectureContent}
                  className="h-10 rounded-xl font-black bg-gray-900 text-white hover:bg-black px-6"
                >
                  저장하기
                </Button>
              </div>
          </div>
          <div className="flex-1 overflow-auto p-12 w-full max-w-4xl mx-auto custom-scrollbar">
            <h1 className="text-4xl font-black mb-8 text-gray-900">{editingLecture.title}</h1>
            <textarea 
              className="w-full h-full min-h-[500px] border-none outline-none focus:ring-0 bg-transparent resize-none text-lg text-gray-700 placeholder:text-gray-400 font-medium whitespace-pre-wrap leading-relaxed"
              placeholder="이곳에 마크다운과 텍스트를 입력하세요. '/'를 입력하여 명령어(제목, 강조, 코드블록 등)를 사용할 수 있습니다. (Notion 스타일 지원)"
              value={editorContent}
              onChange={(e) => setEditorContent(e.target.value)}
            />
          </div>
        </div>
      )}

      <Footer />
    </main>
  )
}
