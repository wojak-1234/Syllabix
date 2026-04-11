'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatedBackground } from '@/components/animated-background'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { 
  CheckCircle2, 
  ChevronRight, 
  BrainCircuit, 
  Code2, 
  Trophy,
  ArrowRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Question {
  id: number
  question: string
  description: string
  options: {
    label: string
    value: string
  }[]
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "프로그래밍 경험이 어느 정도인가요?",
    description: "당신의 시작점을 파악하기 위한 질문입니다.",
    options: [
      { label: "처음 시작합니다 (비전공자/입문자)", value: "beginner" },
      { label: "기초 문법은 알고 있습니다 (변수, 조건문, 반복문)", value: "junior" },
      { label: "간단한 프로젝트를 구현해본 적이 있습니다", value: "intermediate" },
      { label: "현직 개발자 혹은 그에 준하는 실무 경험이 있습니다", value: "advanced" }
    ]
  },
  {
    id: 2,
    question: "가장 관심 있는 분야는 무엇인가요?",
    description: "학습 경로 설계에 반영됩니다.",
    options: [
      { label: "웹 프론트엔드 (React, CSS, 퍼블리싱)", value: "frontend" },
      { label: "백엔드 및 서버 (Node.js, DB, API)", value: "backend" },
      { label: "인공지능 및 데이터 분석", value: "ai" },
      { label: "모바일 앱 개발 (Flutter, React Native)", value: "mobile" }
    ]
  },
  {
    id: 3,
    question: "다음 코드의 출력 결과를 맞춰보세요.\nconsole.log(1 + '1')",
    description: "기초 자바스크립트 개념을 확인합니다.",
    options: [
      { label: "2", value: "wrong1" },
      { label: "'11'", value: "correct" },
      { label: "TypeError", value: "wrong2" },
      { label: "undefined", value: "wrong3" }
    ]
  },
  {
    id: 4,
    question: "클로저(Closure)에 대해 들어보거나 사용해본 적이 있나요?",
    description: "중급 이상의 개념 이해도를 체크합니다.",
    options: [
      { label: "전혀 모릅니다", value: "none" },
      { label: "이름만 들어봤습니다", value: "heard" },
      { label: "어떤 원리인지 설명할 수 있습니다", value: "explain" },
      { label: "실무에서 자유롭게 활용합니다", value: "master" }
    ]
  },
  {
    id: 5,
    question: "하루에 평균적으로 투자할 수 있는 학습 시간은?",
    description: "현실적인 커리큘럼 완주 계획을 위해 필요합니다.",
    options: [
      { label: "1시간 이내 (취미형)", value: "1h" },
      { label: "1~3시간 (집중형)", value: "3h" },
      { label: "4~6시간 (몰입형)", value: "6h" },
      { label: "전일 투자 가능 (부트캠프형)", value: "full" }
    ]
  }
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const progress = ((currentStep + 1) / QUESTIONS.length) * 100

  const handleSelectOption = (value: string) => {
    setAnswers(prev => ({ ...prev, [QUESTIONS[currentStep].id]: value }))
    
    // Auto-advance if not on the last question
    if (currentStep < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentStep(prev => prev + 1), 300)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      // API call to evaluate onboarding results
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers })
      })
      const result = await res.json()
      
      // Store result and transition
      sessionStorage.setItem('onboardingResult', JSON.stringify(result))
      setDone(true)
      
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50/50">
      <AnimatedBackground />
      <Navbar />

      <div className="relative z-10 container mx-auto max-w-2xl px-4 pt-32 pb-20">
        {!done ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header info */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider">
                <BrainCircuit className="h-3 w-3" />
                Level Diagnostic
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                나만을 위한 클래스 설계
              </h1>
              <p className="text-gray-500 text-sm">
                5개의 질문을 통해 AI가 최적의 학습 경로를 분석합니다.
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-gray-500">
                <span>진행 상황</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-1.5 w-full bg-gray-200/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <Card className="p-8 bg-white/80 backdrop-blur-xl border-white/60 shadow-2xl rounded-[2rem] min-h-[400px] flex flex-col">
              <div className="mb-8">
                <span className="text-xs font-bold text-orange-500 mb-2 block uppercase tracking-widest">
                  Question {QUESTIONS[currentStep].id}
                </span>
                <h2 className="text-xl font-bold text-gray-900 whitespace-pre-wrap leading-tight">
                  {QUESTIONS[currentStep].question}
                </h2>
                <p className="text-sm text-gray-400 mt-2">
                  {QUESTIONS[currentStep].description}
                </p>
              </div>

              <div className="space-y-3 flex-1">
                {QUESTIONS[currentStep].options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSelectOption(option.value)}
                    className={cn(
                      "w-full p-4 text-left rounded-2xl border-2 transition-all duration-200 group flex items-center justify-between",
                      answers[QUESTIONS[currentStep].id] === option.value
                        ? "bg-orange-50 border-orange-500 text-orange-700 shadow-md"
                        : "bg-white border-gray-100/50 hover:border-orange-200 hover:bg-orange-50/30 text-gray-600"
                    )}
                  >
                    <span className="font-medium">{option.label}</span>
                    <div className={cn(
                      "h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all",
                      answers[QUESTIONS[currentStep].id] === option.value
                        ? "border-orange-500 bg-orange-500"
                        : "border-gray-200 group-hover:border-orange-300"
                    )}>
                      {answers[QUESTIONS[currentStep].id] === option.value && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Navigation */}
              <div className="mt-8 flex items-center justify-between">
                <Button
                  variant="ghost"
                  disabled={currentStep === 0}
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="text-gray-400 hover:text-gray-600 rounded-xl"
                >
                  이전으로
                </Button>
                
                {currentStep === QUESTIONS.length - 1 ? (
                  <Button 
                    disabled={!answers[QUESTIONS[currentStep].id] || loading}
                    onClick={handleSubmit}
                    className="rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold px-8 shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
                  >
                    {loading ? "분석 중..." : "진단 완료하기"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    disabled={!answers[QUESTIONS[currentStep].id]}
                    onClick={() => setCurrentStep(prev => prev + 1)}
                    className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 active:scale-95 transition-all"
                  >
                    다음
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                )}
              </div>
            </Card>
          </div>
        ) : (
          /* Completion State */
          <div className="text-center space-y-6 py-12 animate-in zoom-in-95 fade-in duration-700">
            <div className="relative mx-auto h-24 w-24">
              <div className="absolute inset-0 bg-orange-500 rounded-full animate-ping opacity-20" />
              <div className="relative h-24 w-24 bg-gradient-to-br from-orange-500 to-amber-400 rounded-full flex items-center justify-center text-white shadow-xl shadow-orange-500/30">
                <Trophy className="h-10 w-10" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">진단이 완료되었습니다!</h2>
            <p className="text-gray-500 max-w-sm mx-auto">
              AI가 당신의 답변을 분석하여 최적의 학습 주차와 난이도를 구성하고 있습니다. 잠시 후 대시보드로 이동합니다.
            </p>
            <div className="flex items-center justify-center gap-2">
              {[0, 1, 2].map(i => (
                <div 
                  key={i} 
                  className="h-2 w-2 rounded-full bg-orange-500 animate-bounce" 
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
