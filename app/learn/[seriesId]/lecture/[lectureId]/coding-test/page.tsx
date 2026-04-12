'use client'

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
// Monaco 에디터는 이 MVP에 맞춰 textarea나 간단한 pre로 모사합니다. 실제 서비스시 @monaco-editor/react 등을 붙입니다.
import {
  Code2,
  ChevronLeft,
  PlayCircle,
  AlertCircle,
  Lightbulb,
  CheckCircle2,
  RefreshCcw,
  Sparkles
} from "lucide-react"

// ── Mock Data ────────────────────────────────────────────────────────

const MOCK_TEST = {
  id: "ct1",
  title: "Pandas DataFrame 행 필터링",
  description: "주어진 DataFrame `df`에서 'age'가 30 이상인 데이터만 필터링하여 반환하는 함수를 완성하세요.",
  starterCode: `import pandas as pd

def solution(df):
    # 코드를 작성하세요.
    pass
`,
  testCases: [
    { input: "df = pd.DataFrame({'age': [20, 30, 40]})", expectedOutput: "   age\n1   30\n2   40" }
  ],
  maxAttempts: 3
}

export default function CodingTestPage() {
  const [testBase] = useState(MOCK_TEST)
  const [code, setCode] = useState(MOCK_TEST.starterCode)
  const [attempts, setAttempts] = useState(0)
  const [result, setResult] = useState<'pending' | 'success' | 'fail'>('pending')
  const [hint, setHint] = useState<string | null>(null)
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [showErrorNote, setShowErrorNote] = useState(false)

  const handleRunCode = () => {
    if (attempts >= testBase.maxAttempts && result !== 'success') {
      setShowErrorNote(true)
      return
    }

    setIsEvaluating(true)
    
    // 모의 채점 로직 (시간차)
    setTimeout(() => {
      const newAttempts = attempts + 1
      setAttempts(newAttempts)

      // 아주 간단한 정답 판별 트리거 ('df['age'] >= 30' 이 코드에 있는지 확인)
      if (code.includes("df['age']") && code.includes("30")) {
        setResult('success')
        setHint(null)
      } else {
        setResult('fail')
        if (newAttempts < testBase.maxAttempts) {
          // AI 소크라테스식 힌트 모의 생성
          setHint("조건문 인덱싱을 활용해본 적이 있나요? `df[조건]` 형태를 어떻게 적용할 수 있을지 생각해보세요.")
        } else {
          // 3회 포기 -> 오답 노트
          setShowErrorNote(true)
        }
      }
      setIsEvaluating(false)
    }, 1500)
  }

  if (showErrorNote) {
    return (
      <main className="relative h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-lg w-full shadow-2xl border border-slate-100 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-orange-500" />
            <div className="h-16 w-16 mx-auto bg-red-50 rounded-2xl flex items-center justify-center mb-6">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">오답 노트가 생성되었습니다</h2>
            <p className="text-gray-500 mb-8">
              제출 횟수 설정치({testBase.maxAttempts}회)를 초과하였습니다.<br/>
              AI가 분석한 나의 약점을 인지하고 오답 노트를 복습해보세요.
            </p>
            
            <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-5 mb-8 text-left">
               <h4 className="text-sm font-bold text-orange-900 flex items-center gap-2 mb-2">
                 <Sparkles className="h-4 w-4 text-orange-500" /> AI의 약점 분석
               </h4>
               <p className="text-sm text-orange-800 leading-relaxed">
                 DataFrame의 인덱싱 문법에 대한 이해가 부족한 것으로 보입니다. 불리언 인덱싱의 원리를 다시 한번 확인해보는 것이 좋습니다.
               </p>
            </div>

            <Button 
              className="w-full h-12 rounded-xl font-bold bg-gray-900 text-white"
              onClick={() => window.location.href='/dashboard'}
            >
              대시보드로 돌아가기
            </Button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="relative h-screen bg-slate-900 flex flex-col overflow-hidden text-slate-300">
      <Navbar />

      <div className="flex-1 flex pt-16 mt-2">
        {/* Left: Problem Description */}
        <div className="w-[400px] bg-slate-800/50 border-r border-slate-700/50 flex flex-col overflow-y-auto no-scrollbar">
          <div className="p-6">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-medium mb-6 transition-colors"
            >
              <ChevronLeft className="h-3 w-3" /> 이전 강의로
            </button>

            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-emerald-500/10 text-emerald-400 border-none px-2 py-0.5 rounded-md font-bold text-[10px]">
                실전 코딩테스트
              </Badge>
              <Badge className="bg-slate-700/50 text-slate-300 border-none px-2 py-0.5 rounded-md font-bold text-[10px]">
                Pandas
              </Badge>
            </div>
            
            <h1 className="text-2xl font-black text-white mb-6 leading-tight">
              {testBase.title}
            </h1>

            <div className="prose prose-invert prose-sm max-w-none mb-10 text-slate-300">
              <p>{testBase.description}</p>
            </div>

            <div className="space-y-4 mb-10">
              <h3 className="text-sm font-bold text-slate-200">테스트 케이스</h3>
              {testBase.testCases.map((tc, idx) => (
                <div key={idx} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                  <div className="mb-3">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Input</span>
                    <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap">{tc.input}</pre>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Expected Output</span>
                    <pre className="text-xs text-emerald-400 font-mono whitespace-pre-wrap">{tc.expectedOutput}</pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Code Editor & Runner */}
        <div className="flex-1 flex flex-col">
           <div className="h-12 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4">
             <div className="flex items-center gap-3">
               <div className="flex gap-1.5">
                 <div className="h-3 w-3 rounded-full bg-red-400/20" />
                 <div className="h-3 w-3 rounded-full bg-amber-400/20" />
                 <div className="h-3 w-3 rounded-full bg-emerald-400/20" />
               </div>
               <span className="text-xs font-mono text-slate-500">solution.py</span>
             </div>
             
             {/* Submission Limit Indicator */}
             <div className="flex items-center gap-4">
               <div className="flex items-center gap-1.5">
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">제출 기회</span>
                 <div className="flex gap-1">
                   {[...Array(testBase.maxAttempts)].map((_, i) => (
                     <div 
                       key={i} 
                       className={cn("h-1.5 w-6 rounded-full transition-all", 
                         i < attempts ? "bg-red-500/50" : "bg-emerald-500"
                       )} 
                     />
                   ))}
                 </div>
               </div>
               <Button 
                  onClick={handleRunCode}
                  disabled={isEvaluating || result === 'success' || attempts >= testBase.maxAttempts}
                  className={cn(
                    "h-8 rounded-lg text-xs font-bold transition-all px-4",
                    isEvaluating ? "bg-slate-700 text-slate-400" :
                    result === 'success' ? "bg-emerald-600 text-white" :
                    "bg-orange-500 hover:bg-orange-600 text-white"
                  )}
               >
                 {isEvaluating ? (
                   <span className="flex items-center gap-1.5"><RefreshCcw className="h-3 w-3 animate-spin"/> 채점 중...</span>
                 ) : result === 'success' ? (
                   <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3"/> 정답 통과</span>
                 ) : (
                   <span className="flex items-center gap-1.5"><PlayCircle className="h-3 w-3"/> 코드 실행</span>
                 )}
               </Button>
             </div>
           </div>

           {/* Editor Mock */}
           <div className="flex-1 bg-slate-900 relative">
             <textarea
               value={code}
               onChange={(e) => setCode(e.target.value)}
               disabled={result === 'success' || attempts >= testBase.maxAttempts}
               spellCheck="false"
               className="absolute inset-0 w-full h-full p-6 bg-transparent text-slate-300 font-mono text-sm leading-relaxed resize-none focus:outline-none focus:ring-0 disabled:opacity-50"
             />
           </div>

           {/* Feedback/Hint Bar */}
           {hint && result !== 'success' && (
             <div className="border-t border-amber-500/30 bg-amber-500/10 p-4 animate-in slide-in-from-bottom-2 duration-300">
               <div className="max-w-4xl mx-auto flex items-start gap-3">
                 <Lightbulb className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                 <div>
                   <h4 className="text-sm font-bold text-amber-500 mb-1">소크라테스 힌트 도착!</h4>
                   <p className="text-sm text-amber-200/80 leading-relaxed">{hint}</p>
                 </div>
               </div>
             </div>
           )}

           {/* Success Bar */}
           {result === 'success' && (
             <div className="border-t border-emerald-500/30 bg-emerald-500/10 p-4 animate-in slide-in-from-bottom-2 duration-300">
               <div className="max-w-4xl mx-auto flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                   <div>
                     <h4 className="text-sm font-bold text-emerald-400">모든 테스트 케이스를 통과했습니다!</h4>
                     <p className="text-xs text-emerald-200/70">훌륭합니다. 다음 단계로 학습을 이어가세요.</p>
                   </div>
                 </div>
                 <Button className="font-bold bg-white text-emerald-900 hover:bg-slate-100" onClick={() => window.location.href='/dashboard'}>
                   다음 레슨으로
                 </Button>
               </div>
             </div>
           )}
        </div>
      </div>
    </main>
  )
}
