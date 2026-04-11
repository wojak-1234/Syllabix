'use client'

import { useState, useEffect } from "react"
import { AnimatedBackground } from "@/components/animated-background"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import {
  Sparkles,
  BrainCircuit,
  BookOpen,
  Code2,
  Lightbulb,
  ChevronRight,
  ChevronDown,
  Check,
  Loader2,
  FileText,
  HelpCircle,
  Save,
  RotateCcw,
  GraduationCap,
  Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Section {
  sectionNumber: number
  title: string
  learningObjective: string
  keyTopics: string[]
  explanation: string
  codeExample: string
  teacherTip: string
}

interface Quiz {
  questionNumber: number
  relatedSection: number
  question: string
  options: { label: string; isCorrect: boolean }[]
  explanation: string
  difficulty: string
}

interface LectureDraft {
  lectureTitle: string
  lectureDescription: string
  targetAudience: string
  estimatedHours: number
  sections: Section[]
  quizzes: Quiz[]
}

// ─── 생성 중 로딩 UI ────────────────────────────────────────────────────
function GeneratingView({ step }: { step: number }) {
  const steps = [
    { label: "강의 목차 설계 중", icon: FileText, detail: "테마와 키워드를 분석하여 최적의 커리큘럼 구조를 짜고 있습니다..." },
    { label: "섹션별 강의 내용 작성 중", icon: BookOpen, detail: "각 섹션의 교육 콘텐츠와 코드 예제를 생성하고 있습니다..." },
    { label: "진단 문제 세트 출제 중", icon: HelpCircle, detail: "개념 이해도를 평가할 수 있는 퀴즈를 설계하고 있습니다..." },
  ]

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-10 animate-in fade-in duration-700">
      <div className="relative">
        <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-20" />
        <div className="relative h-24 w-24 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/20 rotate-12">
          <BrainCircuit className="h-12 w-12 text-white animate-pulse" />
        </div>
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-gray-900">AI가 강의를 설계하고 있습니다</h2>
        <p className="text-gray-500 font-medium">Multi-step Chain이 순차적으로 실행 중입니다</p>
      </div>

      <div className="w-full max-w-md space-y-4">
        {steps.map((s, idx) => {
          const Icon = s.icon
          const isActive = idx === step
          const isDone = idx < step

          return (
            <div key={idx} className={cn(
              "flex items-center gap-4 p-4 rounded-2xl border transition-all duration-500",
              isDone ? "bg-emerald-50 border-emerald-200" :
              isActive ? "bg-white border-emerald-300 shadow-lg shadow-emerald-500/10 scale-[1.02]" :
              "bg-slate-50/50 border-slate-100 opacity-50"
            )}>
              <div className={cn(
                "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                isDone ? "bg-emerald-500 text-white" :
                isActive ? "bg-emerald-100 text-emerald-600" :
                "bg-slate-100 text-slate-400"
              )}>
                {isDone ? <Check className="h-5 w-5" /> :
                 isActive ? <Loader2 className="h-5 w-5 animate-spin" /> :
                 <Icon className="h-5 w-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "text-sm font-bold",
                  isDone ? "text-emerald-700" : isActive ? "text-gray-900" : "text-gray-400"
                )}>
                  Step {idx + 1}: {s.label}
                </p>
                {isActive && (
                  <p className="text-xs text-gray-500 mt-0.5 animate-in fade-in duration-500">{s.detail}</p>
                )}
              </div>
              {isDone && <span className="text-xs font-bold text-emerald-600">완료</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}


// ─── 섹션 카드 (검토/수정 가능) ──────────────────────────────────────────
function SectionCard({ section, index }: { section: Section; index: number }) {
  const [expanded, setExpanded] = useState(index === 0)

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] border border-white/60 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-6 text-left group"
      >
        <div className="flex items-center gap-4">
          <div className="h-11 w-11 rounded-2xl bg-emerald-50 text-emerald-600 font-black flex items-center justify-center text-lg shrink-0 group-hover:bg-emerald-100 transition-colors">
            {section.sectionNumber}
          </div>
          <div>
            <h4 className="text-lg font-bold text-gray-900">{section.title}</h4>
            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
              <GraduationCap className="h-3 w-3" /> {section.learningObjective}
            </p>
          </div>
        </div>
        <ChevronDown className={cn(
          "h-5 w-5 text-gray-400 transition-transform duration-300 shrink-0",
          expanded ? "rotate-180" : ""
        )} />
      </button>

      {/* Expandable Content */}
      <div className={cn(
        "transition-all duration-500 overflow-hidden",
        expanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="px-6 pb-6 space-y-5">
          {/* Topics */}
          <div className="flex flex-wrap gap-2">
            {section.keyTopics.map(topic => (
              <span key={topic} className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                {topic}
              </span>
            ))}
          </div>

          {/* Explanation */}
          <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-black text-gray-500 uppercase tracking-wider">강의 내용</span>
            </div>
            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-medium">
              {section.explanation}
            </div>
          </div>

          {/* Code Example */}
          {section.codeExample && (
            <div className="p-5 rounded-2xl bg-gray-900 border border-gray-800">
              <div className="flex items-center gap-2 mb-3">
                <Code2 className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-black text-gray-400 uppercase tracking-wider">코드 예제</span>
              </div>
              <pre className="text-sm text-emerald-300 font-mono overflow-x-auto leading-relaxed">
                <code>{section.codeExample}</code>
              </pre>
            </div>
          )}

          {/* Teacher Tip */}
          {section.teacherTip && (
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50/80 border border-amber-100">
              <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-black text-amber-700 uppercase tracking-wider mb-0.5">강사 팁</p>
                <p className="text-sm text-amber-800 font-medium">{section.teacherTip}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


// ─── 퀴즈 카드 ──────────────────────────────────────────────────────────
function QuizCard({ quiz }: { quiz: Quiz }) {
  const [showAnswer, setShowAnswer] = useState(false)
  const diffColor = quiz.difficulty === 'easy' ? 'emerald' : quiz.difficulty === 'medium' ? 'amber' : 'red'

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/60 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Badge className={cn(
            "border-none text-[10px] font-black",
            `bg-${diffColor}-50 text-${diffColor}-600`
          )}>
            {quiz.difficulty === 'easy' ? '기초' : quiz.difficulty === 'medium' ? '중급' : '심화'}
          </Badge>
          <span className="text-[10px] text-gray-400 font-bold">섹션 {quiz.relatedSection} 연관</span>
        </div>
        <span className="text-xs font-black text-gray-400">Q{quiz.questionNumber}</span>
      </div>

      <p className="text-sm font-bold text-gray-900 mb-4 leading-relaxed">{quiz.question}</p>

      <div className="space-y-2 mb-4">
        {quiz.options.map((opt, oidx) => (
          <div key={oidx} className={cn(
            "px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors",
            showAnswer && opt.isCorrect
              ? "bg-emerald-50 border-emerald-300 text-emerald-800"
              : "bg-slate-50 border-slate-100 text-gray-600"
          )}>
            <span className="text-xs font-bold text-gray-400 mr-2">{String.fromCharCode(65 + oidx)}.</span>
            {opt.label}
            {showAnswer && opt.isCorrect && <Check className="inline h-3.5 w-3.5 ml-2 text-emerald-500" />}
          </div>
        ))}
      </div>

      <button
        onClick={() => setShowAnswer(!showAnswer)}
        className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
      >
        {showAnswer ? "해설 숨기기" : "정답 및 해설 보기"}
      </button>

      {showAnswer && (
        <div className="mt-3 p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 animate-in fade-in slide-in-from-top-2 duration-300">
          <p className="text-xs text-emerald-800 font-medium leading-relaxed">{quiz.explanation}</p>
        </div>
      )}
    </div>
  )
}


// ─── 메인 페이지 ────────────────────────────────────────────────────────
export default function LectureDraftPage() {
  const [draft, setDraft] = useState<LectureDraft | null>(null)
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState(0)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState<'outline' | 'quiz'>('outline')

  useEffect(() => {
    const raw = sessionStorage.getItem('lectureGenRequest')
    if (!raw) {
      setLoading(false)
      return
    }

    const request = JSON.parse(raw)
    generateLecture(request)
  }, [])

  const generateLecture = async (request: any) => {
    setLoading(true)
    setStep(0)

    // Step 진행 시뮬레이션 (AI 응답이 한 번에 오므로 타이머로 시각적 피드백)
    const stepTimer1 = setTimeout(() => setStep(1), 4000)
    const stepTimer2 = setTimeout(() => setStep(2), 9000)

    try {
      const res = await fetch('/api/teacher/generate-lecture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      })
      const data = await res.json()

      clearTimeout(stepTimer1)
      clearTimeout(stepTimer2)
      setStep(3)

      if (data.success && data.lecture) {
        setTimeout(() => {
          setDraft(data.lecture)
          setLoading(false)
        }, 800)
      } else {
        console.error("Lecture generation failed:", data.error)
        setLoading(false)
      }
    } catch (err) {
      clearTimeout(stepTimer1)
      clearTimeout(stepTimer2)
      console.error("Fetch error:", err)
      setLoading(false)
    }
  }

  const handleSave = () => {
    setSaved(true)
    // 실제론 DB 저장 API 호출
    sessionStorage.removeItem('lectureGenRequest')
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50/50 pb-20">
      <AnimatedBackground />
      <Navbar />

      <div className="relative z-10 container mx-auto px-4 pt-28 max-w-5xl">
        {/* Loading State */}
        {loading && <GeneratingView step={step} />}

        {/* Empty State */}
        {!loading && !draft && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6">
            <div className="h-20 w-20 bg-slate-100 rounded-3xl flex items-center justify-center">
              <FileText className="h-10 w-10 text-slate-300" />
            </div>
            <p className="text-gray-400 font-medium">생성할 강의 데이터가 없습니다.</p>
            <Button
              onClick={() => window.location.href = '/teacher/dashboard'}
              className="rounded-2xl bg-emerald-500 text-white font-bold"
            >
              대시보드로 돌아가기
            </Button>
          </div>
        )}

        {/* Result View */}
        {!loading && draft && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl p-10 border border-white/60 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/30 rounded-full -mr-32 -mt-32 blur-3xl" />
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-emerald-100 text-emerald-700 border-none px-3 py-1 text-xs font-bold flex items-center gap-1.5">
                      <Sparkles className="h-3 w-3" /> AI 자동 생성 초안
                    </Badge>
                  </div>
                  <h1 className="text-3xl font-black text-gray-900 tracking-tight">{draft.lectureTitle}</h1>
                  <p className="text-gray-500 font-medium text-sm">{draft.lectureDescription}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-center px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">대상</p>
                    <p className="text-sm font-black text-gray-900">{draft.targetAudience}</p>
                  </div>
                  <div className="text-center px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">예상 시간</p>
                    <p className="text-sm font-black text-gray-900">{draft.estimatedHours}시간</p>
                  </div>
                </div>
              </div>

              {/* AI 생성 결과 안내 */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100/50">
                <div className="flex items-start gap-3">
                  <BrainCircuit className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-black text-emerald-700 mb-1">Multi-step Chain 완료</p>
                    <p className="text-sm text-emerald-800 font-medium">
                      {draft.sections.length}개 섹션의 강의 내용과 {draft.quizzes.length}개의 진단 문제가 자동 생성되었습니다.
                      아래 내용을 검토하신 후 수정이 필요한 부분을 편집해주세요.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 px-2">
              <button
                onClick={() => setActiveTab('outline')}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
                  activeTab === 'outline'
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                    : "bg-white text-gray-500 hover:bg-emerald-50 hover:text-emerald-600"
                )}
              >
                <BookOpen className="h-4 w-4 inline mr-2" />
                강의 목차·내용 ({draft.sections.length})
              </button>
              <button
                onClick={() => setActiveTab('quiz')}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
                  activeTab === 'quiz'
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                    : "bg-white text-gray-500 hover:bg-emerald-50 hover:text-emerald-600"
                )}
              >
                <HelpCircle className="h-4 w-4 inline mr-2" />
                진단 문제 ({draft.quizzes.length})
              </button>
            </div>

            {/* Sections Tab */}
            {activeTab === 'outline' && (
              <div className="space-y-4">
                {draft.sections.map((section, idx) => (
                  <SectionCard key={idx} section={section} index={idx} />
                ))}
              </div>
            )}

            {/* Quiz Tab */}
            {activeTab === 'quiz' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {draft.quizzes.map((quiz, idx) => (
                  <QuizCard key={idx} quiz={quiz} />
                ))}
              </div>
            )}

            {/* Sticky Bottom Actions */}
            <div className="sticky bottom-6 z-20">
              <div className="bg-white/90 backdrop-blur-2xl rounded-2xl p-4 border border-white/60 shadow-2xl flex items-center justify-between max-w-lg mx-auto">
                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/teacher/dashboard'}
                  className="rounded-xl border-slate-200 text-gray-600 font-bold"
                >
                  <RotateCcw className="h-4 w-4 mr-2" /> 다시 생성
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saved}
                  className={cn(
                    "rounded-xl font-bold px-8 transition-all",
                    saved
                      ? "bg-emerald-500 text-white"
                      : "bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5 active:scale-95"
                  )}
                >
                  {saved ? <><Check className="h-4 w-4 mr-2" /> 저장 완료</> : <><Save className="h-4 w-4 mr-2" /> 강의 등록</>}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
