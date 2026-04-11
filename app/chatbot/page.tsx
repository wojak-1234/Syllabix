'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AnimatedBackground } from '@/components/animated-background'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  BrainCircuit, Send, Sparkles, Trophy, Clock, Target,
  ChevronRight, Check, BookOpen, AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface CurriculumPhase {
  phaseNumber: number
  title: string
  weekRange: string
  topics: string[]
  milestone: string
  riskLevel: 'low' | 'medium' | 'high'
  riskReason: string
  linkedCourseIds: string[]
}

interface Curriculum {
  title: string
  totalWeeks: number
  totalHours: number
  phases: CurriculumPhase[]
  aiInsight: string
}

export default function CurriculumChatPage() {
  return (
    <Suspense fallback={
      <main className="relative min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
      </main>
    }>
      <CurriculumChatInner />
    </Suspense>
  )
}

function CurriculumChatInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const chatBottomRef = useRef<HTMLDivElement>(null)

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [chatDone, setChatDone] = useState(false)
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null)
  const [saved, setSaved] = useState(false)
  const [initialForm, setInitialForm] = useState<any>(null)

  // Parse initial form from URL params (sessionStorage fallback)
  useEffect(() => {
    const raw = sessionStorage.getItem('curriculumForm')
    if (raw) {
      const form = JSON.parse(raw)
      setInitialForm(form)
    } else {
      // No form data, redirect back
      router.replace('/dashboard')
    }
  }, [])

  // Kick off first question when form is loaded
  useEffect(() => {
    if (!initialForm) return
    const greeting: Message = {
      role: 'assistant',
      content: `반가워요! 👋 **${initialForm.goal}**에 대해 아주 열정적이시네요! 🎓\n\n최근 교육 트렌드와 당신의 학습 성향을 매칭해 최상의 커리큘럼을 짜 드리려고 합니다. 몇 가지 **학습 방법론** 관련 질문을 드릴게요!`
    }
    setMessages([greeting])

    const sendFirstQuestion = async () => {
      setLoading(true)
      const res = await fetch('/api/curriculum/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [], initialForm, action: 'chat' })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
      setProgress(data.progress ?? 0)
      setLoading(false)
    }
    sendFirstQuestion()
  }, [initialForm])

  // Auto-scroll to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMsg: Message = { role: 'user', content: input }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    const res = await fetch('/api/curriculum/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: newMessages.filter(m => m.role !== 'assistant' || newMessages.indexOf(m) > 0),
        initialForm,
        action: 'chat'
      })
    })
    const data = await res.json()
    setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    setProgress(data.progress ?? progress)
    if (data.done) setChatDone(true)
    setLoading(false)
  }

  const handleGenerateCurriculum = async () => {
    setGenerating(true)
    const res = await fetch('/api/curriculum/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, initialForm, action: 'generate' })
    })
    const data = await res.json()
    setCurriculum(data.curriculum)
    setGenerating(false)
  }

  const handleSaveToDashboard = () => {
    if (!curriculum) return
    sessionStorage.setItem('savedCurriculum', JSON.stringify(curriculum))
    setSaved(true)
    setTimeout(() => router.push('/dashboard'), 1200)
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50/50">
      <AnimatedBackground />
      <Navbar />

      <div className="relative z-10 container mx-auto max-w-4xl px-4 pt-24 pb-12">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-medium mb-4">
            <BrainCircuit className="h-4 w-4" />
            AI 상담 · 커리큘럼 맞춤 설계
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            당신을 더 잘 알아볼게요
          </h1>

          {/* Progress Bar */}
          <div className="mt-4 mx-auto max-w-sm">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>설문 진행률</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Form Summary Card */}
        {initialForm && (
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            <div className="flex items-center gap-1.5 text-xs bg-white border border-gray-100 rounded-full px-3 py-1.5 shadow-sm text-gray-600">
              <Target className="h-3 w-3 text-orange-500" />
              {initialForm.goal}
            </div>
            <div className="flex items-center gap-1.5 text-xs bg-white border border-gray-100 rounded-full px-3 py-1.5 shadow-sm text-gray-600">
              <Clock className="h-3 w-3 text-orange-500" />
              주 {initialForm.hoursPerWeek}시간
            </div>
            <div className="flex items-center gap-1.5 text-xs bg-white border border-gray-100 rounded-full px-3 py-1.5 shadow-sm text-gray-600">
              <Trophy className="h-3 w-3 text-orange-500" />
              {initialForm.currentLevel === 'beginner' ? '초급' : initialForm.currentLevel === 'intermediate' ? '중급' : '고급'}
            </div>
          </div>
        )}

        {/* Chat Window */}
        {!curriculum && (
          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl overflow-hidden border border-white/60">
            {/* Messages */}
            <div className="h-[480px] overflow-y-auto p-6 space-y-4 scroll-smooth">
              {messages.map((msg, i) => (
                <div key={i} className={cn('flex gap-3', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}>
                  {/* Avatar */}
                  <div className={cn(
                    'shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold',
                    msg.role === 'assistant' ? 'bg-gradient-to-br from-orange-500 to-amber-400' : 'bg-gradient-to-br from-gray-500 to-gray-600'
                  )}>
                    {msg.role === 'assistant' ? '✦' : 'ME'}
                  </div>

                  {/* Bubble */}
                  <div className={cn(
                    'max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                    msg.role === 'assistant'
                      ? 'bg-orange-50 text-gray-800 border border-orange-100'
                      : 'bg-gray-800 text-white'
                  )}>
                    {msg.content.split('\n').map((line, j) => (
                      <span key={j}>
                        {line.split(/\*\*(.*?)\*\*/).map((part, k) =>
                          k % 2 === 1 ? <strong key={k}>{part}</strong> : part
                        )}
                        {j < msg.content.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                </div>
              ))}

              {/* Loading dots */}
              {loading && (
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-white text-xs">✦</div>
                  <div className="bg-orange-50 border border-orange-100 rounded-2xl px-4 py-3 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-100 p-4 bg-white/60">
              {chatDone ? (
                <Button
                  onClick={handleGenerateCurriculum}
                  disabled={generating}
                  className="w-full h-14 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold text-base shadow-lg shadow-orange-500/20 hover:-translate-y-0.5 hover:shadow-orange-500/40 transition-all group"
                >
                  {generating ? (
                    <div className="flex items-center gap-3">
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      AI가 최종 커리큘럼을 설계하는 중...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      수집 완료 · 나만의 커리큘럼 생성하기
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </Button>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                    placeholder="자유롭게 답변해 주세요..."
                    disabled={loading}
                    className="flex-1 h-12 px-4 rounded-2xl border border-gray-200 bg-white/80 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-300 transition-all"
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={loading || !input.trim()}
                    className="h-12 w-12 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white shadow-md"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Curriculum Result ─────────────────────────────────────── */}
        {curriculum && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-6">
            {/* Header */}
            <div className="bg-white/85 backdrop-blur-xl rounded-[2rem] shadow-2xl p-8 border border-white/60">
              <div className="flex items-start justify-between mb-4">
                <Badge className="bg-emerald-100 text-emerald-700 border-none px-3 py-1">
                  ✓ 설계 완료
                </Badge>
                <div className="text-sm text-gray-500 font-medium">
                  총 {curriculum.totalWeeks}주 · 예상 {curriculum.totalHours}시간
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-2">
                <Sparkles className="h-6 w-6 text-amber-500" />
                {curriculum.title}
              </h2>

              {/* AI Insight */}
              {curriculum.aiInsight && (
                <div className="mt-4 p-4 rounded-2xl bg-purple-50 border border-purple-100">
                  <div className="flex items-start gap-3">
                    <BrainCircuit className="h-5 w-5 text-purple-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-purple-700 mb-1">AI 종합 학습 분석</p>
                      <p className="text-sm text-purple-900 leading-relaxed">{curriculum.aiInsight}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Phases Timeline */}
            <div className="bg-white/85 backdrop-blur-xl rounded-[2rem] shadow-2xl p-8 border border-white/60">
              <h3 className="font-bold text-lg text-gray-800 mb-6 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-orange-500" />
                단계별 학습 로드맵
              </h3>
              <div className="space-y-8">
                {curriculum.phases.map((phase, idx) => (
                  <div key={idx} className="relative pl-8 border-l-2 border-orange-100 last:border-transparent pb-2">
                    <div className="absolute left-[-9px] top-0 h-4 w-4 rounded-full bg-orange-500 border-4 border-orange-100" />
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="text-xs font-bold text-orange-600 block mb-0.5">
                          Phase {phase.phaseNumber} · {phase.weekRange}
                        </span>
                        <h4 className="font-bold text-lg text-gray-900">{phase.title}</h4>
                      </div>
                      <Badge className={cn(
                        'border-none shrink-0 ml-3',
                        phase.riskLevel === 'high' ? 'bg-red-50 text-red-700' :
                          phase.riskLevel === 'medium' ? 'bg-amber-50 text-amber-700' :
                            'bg-emerald-50 text-emerald-700'
                      )}>
                        위험도: {phase.riskLevel.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                      {phase.topics.map((t, ti) => (
                        <div key={ti} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-orange-400 shrink-0" />
                          {t}
                        </div>
                      ))}
                    </div>
                    {phase.milestone && (
                      <div className="mt-3 flex items-center gap-2 text-sm text-gray-600 bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-sm">
                        <Trophy className="h-4 w-4 text-emerald-500" />
                        <span className="font-medium">목표:</span> {phase.milestone}
                      </div>
                    )}
                    {phase.riskReason && (
                      <div className="mt-2 flex items-start gap-2 text-sm text-gray-500 ml-1">
                        <AlertCircle className="h-4 w-4 mt-0.5 text-gray-400 shrink-0" />
                        <span><span className="font-medium text-gray-600">위험 요인:</span> {phase.riskReason}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <Button
              onClick={handleSaveToDashboard}
              disabled={saved}
              className={cn(
                'w-full h-16 rounded-2xl font-bold text-lg shadow-xl transition-all',
                saved
                  ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                  : 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-1 group'
              )}
            >
              {saved ? (
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  저장되었습니다! 대시보드로 이동 중...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  대시보드에 커리큘럼 저장하기
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}
