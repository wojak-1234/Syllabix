'use client'

import { useState } from "react"
import { AnimatedBackground } from "@/components/animated-background"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  HelpCircle,
  Code2,
  CheckCircle2,
  XCircle,
  Lightbulb
} from "lucide-react"

// ── Mock Data ────────────────────────────────────────────────────────

const MOCK_LECTURE_CONTENT = {
  id: "l3",
  title: "Pandas 기초 다지기",
  learningObjective: "데이터 분석의 핵심 도구인 Pandas의 DataFrame 구조를 파악하고 기본 조작을 수행할 수 있다.",
  conceptTags: ["Pandas", "DataFrame", "Series", "Data_Analysis"],
  content: `
# Pandas 란?
Pandas는 파이썬에서 데이터 분석을 위해 사용하는 가장 강력한 라이브러리입니다. 
주로 표(Table) 형식의 데이터를 다루며, 엑셀과 스프레드시트의 프로그래밍 버전이라고 생각하시면 됩니다.

### 핵심 자료구조
1. **Series**: 1차원 배열 형태의 데이터 구조
2. **DataFrame**: 2차원 테이블 형태의 데이터 구조 (로우와 컬럼으로 구성)

### 데이터 불러오기
\`\`\`python
import pandas as pd
df = pd.read_csv('data.csv')
print(df.head())
\`\`\`
  `,
  quizzes: [
    {
      id: "q1",
      question: "Pandas에서 2차원 테이블 형태의 데이터를 다루는 핵심 자료구조는 무엇인가요?",
      choices: [
        { label: "Series", isCorrect: false },
        { label: "DataFrame", isCorrect: true },
        { label: "List", isCorrect: false },
        { label: "Dictionary", isCorrect: false }
      ],
      explanation: "DataFrame은 행(row)과 열(column)을 가지는 2차원 구조이며, 1차원 구조는 Series입니다.",
      conceptTag: "DataFrame"
    }
  ],
  hasCodingTest: true
}

export default function LectureLearnPage() {
  const [lecture] = useState(MOCK_LECTURE_CONTENT)
  const [showQuiz, setShowQuiz] = useState(false)
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null)
  const [quizResult, setQuizResult] = useState<'pending' | 'correct' | 'wrong'>('pending')
  const [quizPassed, setQuizPassed] = useState(false)

  const handleQuizSubmit = () => {
    if (selectedChoice === null) return
    const isCorrect = lecture.quizzes[0].choices[selectedChoice].isCorrect
    setQuizResult(isCorrect ? 'correct' : 'wrong')
    if (isCorrect) setQuizPassed(true)
  }

  const handleNextStep = () => {
    // 코딩테스트가 있으면 코딩테스트 페이지로 이동
    if (lecture.hasCodingTest) {
      window.location.href = `/learn/s1/lecture/${lecture.id}/coding-test`
    } else {
      window.location.href = `/learn/s1`
    }
  }

  return (
    <main className="relative min-h-screen bg-white">
      <Navbar />

      <div className="flex h-screen pt-16">
        {/* Left: Content Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar relative custom-bottom-shadow z-10 border-r border-slate-100">
          <div className="max-w-3xl mx-auto px-8 py-12 pb-32">
            <button
              onClick={() => window.location.href = '/learn/s1'}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-600 font-medium mb-8 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" /> 커리큘럼 리스트로 돌아가기
            </button>

            {/* Title & Meta */}
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                {lecture.conceptTags.map(tag => (
                  <Badge key={tag} className="bg-orange-50 text-orange-700 hover:bg-orange-100 border-none px-2.5 py-0.5 rounded-md font-bold text-[10px]">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-tight mb-4">
                {lecture.title}
              </h1>
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">학습 목표</p>
                  <p className="text-sm font-medium text-gray-700">{lecture.learningObjective}</p>
                </div>
              </div>
            </div>

            {/* Markdown Content (Mock Rendered View) */}
            <div className="prose prose-slate prose-orange max-w-none">
              <h2>Pandas 란?</h2>
              <p>Pandas는 파이썬에서 데이터 분석을 위해 사용하는 가장 강력한 라이브러리입니다. 주로 표(Table) 형식의 데이터를 다루며, 엑셀과 스프레드시트의 프로그래밍 버전이라고 생각하시면 됩니다.</p>
              
              <h3>핵심 자료구조</h3>
              <ul>
                <li><strong>Series</strong>: 1차원 배열 형태의 데이터 구조</li>
                <li><strong>DataFrame</strong>: 2차원 테이블 형태의 데이터 구조 (로우와 컬럼으로 구성)</li>
              </ul>

              <h3>데이터 불러오기</h3>
              <pre className="bg-slate-900 text-slate-50 p-4 rounded-2xl overflow-x-auto text-sm leading-relaxed shadow-inner">
                <code className="text-orange-300">import</code> pandas <span className="text-orange-300">as</span> pd<br/>
                df <span className="text-orange-300">=</span> pd.read_csv(<span className="text-emerald-300">'data.csv'</span>)<br/>
                <span className="text-blue-300">print</span>(df.head())
              </pre>
            </div>
          </div>
        </div>

        {/* Right: Assessment Sidebar */}
        <div className="w-96 bg-slate-50 overflow-y-auto no-scrollbar relative flex flex-col">
          <div className="p-6 border-b border-slate-200 bg-white sticky top-0 z-10 shadow-sm">
            <h3 className="font-black text-gray-900 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-orange-500" /> 지식 점검
            </h3>
            <p className="text-xs text-gray-500 mt-1">학습한 내용을 바탕으로 퀴즈를 풀어보세요.</p>
          </div>

          <div className="p-6 flex-1">
            {!showQuiz ? (
              <div className="text-center py-20 px-4">
                <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-sm font-bold text-gray-600 mb-2">본문을 먼저 충분히 읽어주세요</p>
                <p className="text-xs text-gray-400 mb-6">준비가 되면 퀴즈 풀기를 시작하세요.</p>
                <Button 
                  onClick={() => setShowQuiz(true)}
                  className="w-full h-12 rounded-xl font-bold bg-gray-900 hover:bg-orange-600 text-white shadow-lg transition-colors"
                >
                  퀴즈 시작하기
                </Button>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-2">
                  <Badge variant="outline" className="text-[10px] font-bold text-orange-600 border-orange-200 bg-orange-50 mb-2 px-2.5">
                    핵심 확인 문제
                  </Badge>
                  <h4 className="text-base font-bold text-gray-900 leading-snug">
                    {lecture.quizzes[0].question}
                  </h4>
                </div>

                <div className="space-y-2.5">
                  {lecture.quizzes[0].choices.map((choice, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (quizResult === 'pending') setSelectedChoice(idx)
                      }}
                      disabled={quizResult !== 'pending'}
                      className={cn(
                        "w-full text-left p-4 rounded-xl border-2 transition-all font-medium text-sm",
                        quizResult === 'pending' && selectedChoice === idx 
                          ? "border-orange-500 bg-orange-50 text-orange-900 shadow-sm"
                          : quizResult === 'pending'
                          ? "border-slate-200 bg-white text-gray-600 hover:border-slate-300 hover:bg-slate-50"
                          : quizResult !== 'pending' && choice.isCorrect
                          ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                          : quizResult !== 'pending' && selectedChoice === idx && !choice.isCorrect
                          ? "border-red-500 bg-red-50 text-red-800"
                          : "border-slate-200 bg-white/50 text-gray-400 opacity-50"
                      )}
                    >
                      <span className="mr-3 text-xs opacity-50 font-black">{idx + 1}.</span> {choice.label}
                    </button>
                  ))}
                </div>

                {quizResult === 'pending' ? (
                  <Button
                    onClick={handleQuizSubmit}
                    disabled={selectedChoice === null}
                    className="w-full h-12 rounded-xl font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-500/20"
                  >
                    정답 확인
                  </Button>
                ) : (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className={cn(
                      "p-4 rounded-xl mb-6 flex items-start gap-3",
                      quizResult === 'correct' ? "bg-emerald-100 text-emerald-900" : "bg-red-100 text-red-900"
                    )}>
                      {quizResult === 'correct' ? <CheckCircle2 className="shrink-0 mt-0.5" /> : <XCircle className="shrink-0 mt-0.5" />}
                      <div>
                        <p className="font-bold mb-1">{quizResult === 'correct' ? '정답입니다!' : '오답입니다.'}</p>
                        <p className="text-xs font-medium opacity-90 leading-relaxed">{lecture.quizzes[0].explanation}</p>
                      </div>
                    </div>

                    {quizPassed && (
                      <Button
                        onClick={handleNextStep}
                        className="w-full h-12 rounded-xl font-bold bg-gray-900 hover:bg-orange-600 text-white shadow-lg transition-colors flex items-center justify-center gap-2 group"
                      >
                       {lecture.hasCodingTest ? (
                         <>다음 코딩테스트로 이동 <Code2 className="h-4 w-4 ml-1" /></>
                       ) : (
                         <>목차로 돌아가기 <ChevronRight className="h-4 w-4 ml-1" /></>
                       )}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
