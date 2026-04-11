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
  // 사전 생성된 질문 Queue (API 호출 횟수 절감)
  const [questionQueue, setQuestionQueue] = useState<string[]>([])

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

  // form 로드 시 질문을 사전에 일괄 생성 (prefetch) — API 1회로 3개 질문 확보
  useEffect(() => {
    if (!initialForm) return
    const greeting: Message = {
      role: 'assistant',
      content: `반가워요! 👋 **${initialForm.goal}**에 대해 아주 열정적이시네요! 🎓\n\n최근 교육 트렌드와 당신의 학습 성향을 매칭해 최상의 커리큘럼을 짜 드리려고 합니다. 몇 가지 **학습 방법론** 관련 질문을 드릴게요!`
    }
    setMessages([greeting])

    const prefetchQuestions = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/curriculum/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ initialForm, action: 'prefetch', messages: [] })
        })
        const data = await res.json()
        const questions: string[] = data.questions || []
        if (questions.length > 0) {
          // 첫 질문 즉시 표시, 나머지는 Queue에 보관
          setMessages(prev => [...prev, { role: 'assistant', content: questions[0] }])
          setQuestionQueue(questions.slice(1))
          setProgress(0)
        } else {
          setMessages(prev => [...prev, { role: 'assistant', content: '학습자님의 목표를 위해 어떤 언어나 도구를 사용하고 싶으신가요?' }])
        }
      } catch (err) {
        console.error('Prefetch error:', err)
        setMessages(prev => [...prev, { role: 'assistant', content: '죄송해요, 잠시 연결이 원활하지 않네요. 다시 한번 대화를 시작해볼까요?' }])
      } finally {
        setLoading(false)
      }
    }
    prefetchQuestions()
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

    const userCount = newMessages.filter(m => m.role === 'user').length
    const MAX_TURNS = 3
    const newProgress = Math.round((userCount / MAX_TURNS) * 100)
    setProgress(newProgress)

    if (userCount >= MAX_TURNS) {
      // 모든 질문 완료
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '완벽해요! 모든 정보를 수집했습니다. 조금 전 분석한 데이터를 바탕으로 당신만을 위한 💡 예리한 진단 테스트를 준비할게요. 하단의 시작하기 버튼을 눌러주세요!'
      }])
      setChatDone(true)
      return
    }

    // Queue에 남은 질문이 있으면 API 호출 없이 즉시 표시
    if (questionQueue.length > 0) {
      const [nextQ, ...rest] = questionQueue
      setMessages(prev => [...prev, { role: 'assistant', content: nextQ }])
      setQuestionQueue(rest)
      return
    }

    // Queue 소진 시 폴백: 개별 API 호출
    setLoading(true)
    try {
      const res = await fetch('/api/curriculum/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, initialForm, action: 'chat' })
      })
      const data = await res.json()
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
        if (data.done) setChatDone(true)
      }
    } catch (err) {
      console.error('Chat error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleGoToOnboarding = () => {
    setGenerating(true)
    const chatContext = {
      initialForm,
      messages: messages.filter(m => m.role === 'user')
    }
    sessionStorage.setItem('chatContext', JSON.stringify(chatContext))
    setTimeout(() => router.push('/onboarding'), 800)
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
                    {(msg.content || '').split('\n').map((line, j) => (
                      <span key={j}>
                        {(line || '').split(/\*\*(.*?)\*\*/).map((part, k) =>
                          k % 2 === 1 ? <strong key={k}>{part}</strong> : part
                        )}
                        {j < (msg.content || '').split('\n').length - 1 && <br />}
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
                  onClick={handleGoToOnboarding}
                  disabled={generating}
                  className="w-full h-14 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold text-base shadow-lg shadow-orange-500/20 hover:-translate-y-0.5 hover:shadow-orange-500/40 transition-all group"
                >
                  {generating ? (
                    <div className="flex items-center gap-3">
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      상담 내용 분석 중...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      상담 완료 · 맞춤형 진단 테스트 시작하기
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


      </div>
    </main>
  )
}
