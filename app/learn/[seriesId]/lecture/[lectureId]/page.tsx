"use client";

import { useState, use } from "react"
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

const LECTURES_DATA: Record<string, any> = {
  "l1": {
    id: "l1",
    title: "파이썬 환경 설정",
    learningObjective: "파이썬을 설치하고 개발 환경(VS Code)을 구성하여 코드를 실행할 수 있다.",
    conceptTags: ["Python", "Installation", "VSCode", "Setup"],
    content: `
# 파이썬 설치 및 환경 구성
데이터 분석의 첫 걸음은 도구를 준비하는 것입니다.

### 1. 파이썬 설치
공식 홈페이지(python.org)에서 최신 버전을 다운로드합니다. 설치 시 꼭 **'Add Python to PATH'** 옵션을 체크해주세요.

### 2. IDE(통합 개발 환경) 설정
우리는 가장 대중적인 **Visual Studio Code**를 사용합니다. 
확장 탭에서 'Python' 익스텐션을 설치하면 준비 완료!

### 3. 첫 코드 실행
\`\`\`python
print("Hello, Syllabix!")
\`\`\`
터미널에 위 메시지가 찍힌다면 성공입니다.
    `,
    quizzes: [
      {
        id: "q1",
        question: "파이썬 설치 시 환경 변수 설정을 위해 반드시 체크해야 할 항목은?",
        choices: [
          { label: "Install for all users", isCorrect: false },
          { label: "Add Python to PATH", isCorrect: true },
          { label: "Download debug symbols", isCorrect: false },
          { label: "Precompile standard library", isCorrect: false }
        ],
        explanation: "PATH에 추가해야 터미널 어디서든 python 명령어를 사용할 수 있습니다.",
        conceptTag: "Setup"
      }
    ],
    hasCodingTest: false
  },
  "l2": {
    id: "l2",
    title: "자료형과 변수",
    learningObjective: "데이터를 저장하는 변수의 개념을 이해하고, 숫자형과 문자열 자료형을 다룰 수 있다.",
    conceptTags: ["Variable", "DataType", "Integer", "String"],
    content: `
# 자료형과 변수
컴퓨터는 정보를 기억하기 위해 '변수'라는 상자를 사용합니다.

### 1. 변수 선언
파이썬은 자료형을 따로 선언할 필요가 없이 대입하는 순간 결정됩니다.
\`\`\`python
name = "Alice"  # 문자열(String)
age = 25        # 정수형(Integer)
\`\`\`

### 2. 기본 자료형
- **int**: 정수 (1, 2, -5)
- **float**: 실수 (3.14, 0.5)
- **str**: 문자열 ("Hello")
- **bool**: 참/거짓 (True, False)
    `,
    quizzes: [
      {
        id: "q1",
        question: "다음 중 실수(Floating point) 자료형인 것은?",
        choices: [
          { label: "10", isCorrect: false },
          { label: "3.14", isCorrect: true },
          { label: "'100'", isCorrect: false },
          { label: "True", isCorrect: false }
        ],
        explanation: "소수점이 포함된 숫자는 float 자료형입니다.",
        conceptTag: "DataType"
      }
    ],
    hasCodingTest: false
  },
  "l3": {
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
}

export default function LectureLearnPage({ params }: { params: Promise<{ seriesId: string, lectureId: string }> }) {
  const resolvedParams = use(params)
  const lecture = LECTURES_DATA[resolvedParams.lectureId] || LECTURES_DATA["l3"]
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
      window.location.href = `/learn/${resolvedParams.seriesId}/lecture/${lecture.id}/coding-test`
    } else {
      window.location.href = `/learn/${resolvedParams.seriesId}`
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
              onClick={() => window.location.href = `/learn/${resolvedParams.seriesId}`}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-600 font-medium mb-8 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" /> 커리큘럼 리스트로 돌아가기
            </button>

            {/* Title & Meta */}
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                {lecture.conceptTags.map((tag: string) => (
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

            {/* Content Area (Dynamic) */}
            <div className="prose prose-slate prose-orange max-w-none whitespace-pre-wrap font-medium text-gray-700 leading-relaxed">
               {lecture.content}
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
                  {lecture.quizzes[0].choices.map((choice: any, idx: number) => (
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
