'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  ChevronLeft,
  PlayCircle,
  AlertCircle,
  Lightbulb,
  CheckCircle2,
  RefreshCcw,
  Sparkles,
  Sun,
  Moon,
  ChevronRight,
  X
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
  const [dismissErrorNote, setDismissErrorNote] = useState(false)
  
  // 테마 (light/dark)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  const handleRunCode = async () => {
    setIsEvaluating(true)
    setHint(null)
    
    try {
      const response = await fetch('/api/student/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          questionTitle: testBase.title,
          questionDescription: testBase.description,
          attempts
        })
      })
      
      if (!response.ok) throw new Error('Network response was not ok')
      
      const data = await response.json()
      const newAttempts = attempts + 1
      setAttempts(newAttempts)

      if (data.isCorrect) {
        setResult('success')
        setHint(data.feedback)
      } else {
        setResult('fail')
        setHint(data.feedback)
        
        if (newAttempts >= testBase.maxAttempts) {
          setShowErrorNote(true)
        }
      }
    } catch (error) {
      console.error('Evaluation failed:', error)
      setHint("AI 튜터가 잠시 자리를 비웠네요. 코드를 다시 점검하고 제출해 보세요.")
    } finally {
      setIsEvaluating(false)
    }
  }

  const isDark = theme === 'dark'

  return (
    <main className={cn(
      "relative h-screen flex flex-col overflow-hidden transition-colors duration-500",
      isDark ? "bg-slate-900 text-slate-300" : "bg-slate-50 text-slate-900"
    )}>

      {/* 오답 노트 생성 Notification (기회 소진 시 표시) */}
      {showErrorNote && !dismissErrorNote && (
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top-4 fade-in duration-500">
          <div className="bg-white rounded-2xl shadow-2xl border border-red-100 flex items-start gap-4 p-4 pr-12 max-w-lg relative">
            <button 
              onClick={() => setDismissErrorNote(true)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="h-10 w-10 flex-shrink-0 bg-red-50 rounded-full flex items-center justify-center mt-1">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm font-black text-slate-900 mb-1">오답 노트가 자동 생성되었습니다.</p>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">제출 횟수({testBase.maxAttempts}회)를 초과하여 약점 분석과 오답 노트가 기록되었습니다. <br/>물론 코딩테스트는 정답을 맞출 때까지 <b className="text-slate-900">계속해서 시도</b>하실 수 있습니다.</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex h-full"> 
        
        {/* Left: Problem Description */}
        <div className={cn(
          "w-[400px] flex flex-col overflow-y-auto no-scrollbar border-r transition-colors duration-500",
          isDark ? "bg-slate-800/50 border-slate-700/50" : "bg-white border-slate-200 shadow-sm z-10"
        )}>
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
               <button
                 onClick={() => window.location.href = '/learn/s1'}
                 className={cn(
                   "flex items-center gap-1.5 text-xs font-medium transition-colors",
                   isDark ? "text-slate-400 hover:text-white" : "text-gray-500 hover:text-orange-600"
                 )}
               >
                 <ChevronLeft className="h-3 w-3" /> 이전으로
               </button>
               
               <button 
                 onClick={() => setTheme(isDark ? 'light' : 'dark')}
                 className={cn(
                   "flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all",
                   isDark ? "bg-slate-700 text-slate-300 hover:bg-slate-600" : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                 )}
               >
                 {isDark ? <Sun className="h-3 w-3" /> : <Moon className="h-3 w-3" />}
                 {isDark ? '라이트 테마' : '다크 모드'}
               </button>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <Badge className={cn(
                "border-none px-2 py-0.5 rounded-md font-bold text-[10px]",
                isDark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-100 text-emerald-700"
              )}>
                실전 코딩테스트
              </Badge>
              <Badge className={cn(
                "border-none px-2 py-0.5 rounded-md font-bold text-[10px]",
                isDark ? "bg-slate-700/50 text-slate-300" : "bg-slate-100 text-slate-600"
              )}>
                Pandas
              </Badge>
            </div>
            
            <h1 className={cn(
              "text-2xl font-black leading-tight mb-6",
              isDark ? "text-white" : "text-gray-900"
            )}>
              {testBase.title}
            </h1>

            <div className={cn(
              "prose prose-sm max-w-none mb-10 transition-colors",
              isDark ? "prose-invert text-slate-300" : "prose-slate text-gray-700"
            )}>
              <p>{testBase.description}</p>
            </div>

            <div className="space-y-4 mb-10">
              <h3 className={cn("text-sm font-bold", isDark ? "text-slate-200" : "text-gray-900")}>
                테스트 케이스
              </h3>
              {testBase.testCases.map((tc, idx) => (
                <div key={idx} className={cn(
                  "rounded-xl p-4 border transition-colors",
                  isDark ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"
                )}>
                  <div className="mb-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Input</span>
                    <pre className={cn(
                      "text-xs font-mono whitespace-pre-wrap",
                      isDark ? "text-slate-300" : "text-slate-800"
                    )}>{tc.input}</pre>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Expected Output</span>
                    <pre className={cn(
                      "text-xs font-mono whitespace-pre-wrap",
                      isDark ? "text-emerald-400" : "text-emerald-600 font-bold"
                    )}>{tc.expectedOutput}</pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Code Editor & Runner */}
        <div className="flex-1 flex flex-col z-0 relative">
           <div className={cn(
             "h-14 border-b flex items-center justify-between px-4 transition-colors duration-500",
             isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200 shadow-sm z-10"
           )}>
             <div className="flex items-center gap-3">
               <div className="flex gap-1.5">
                 <div className="h-3 w-3 rounded-full bg-red-400 opacity-60" />
                 <div className="h-3 w-3 rounded-full bg-amber-400 opacity-60" />
                 <div className="h-3 w-3 rounded-full bg-emerald-400 opacity-60" />
               </div>
               <span className={cn(
                 "text-xs font-mono font-medium",
                 isDark ? "text-slate-500" : "text-slate-500"
               )}>solution.py</span>
             </div>
             
             {/* Submission Panel */}
             <div className="flex items-center gap-4">
               {/* 3회 시도가 넘어가면 스킵 버튼을 노출 */}
               {showErrorNote && result !== 'success' && (
                 <Button 
                   variant="ghost" 
                   onClick={() => window.location.href='/dashboard'}
                   className={cn(
                     "h-8 rounded-lg text-xs font-bold transition-all px-3 flex items-center gap-1.5",
                     isDark ? "text-slate-400 hover:bg-slate-700 hover:text-white" : "text-slate-500 hover:bg-slate-100"
                   )}
                 >
                   넘어가기 <ChevronRight className="h-3 w-3" />
                 </Button>
               )}
               
               <div className="flex items-center gap-2">
                 <span className={cn(
                   "text-[10px] font-bold uppercase tracking-widest",
                   isDark ? "text-slate-500" : "text-slate-400"
                 )}>
                   시도 횟수 : {attempts} {attempts >= testBase.maxAttempts && '(오답 반영)'}
                 </span>
               </div>

               <Button 
                  onClick={handleRunCode}
                  disabled={isEvaluating || result === 'success'}
                  className={cn(
                    "h-8 rounded-lg text-xs font-bold transition-all px-4 shadow-sm",
                    isEvaluating ? "bg-slate-400 text-white" :
                    result === 'success' ? "bg-emerald-600 text-white hover:bg-emerald-700" :
                    "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20"
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
           <div className={cn(
             "flex-1 relative transition-colors duration-500",
             isDark ? "bg-slate-900" : "bg-slate-50/50"
           )}>
             <textarea
               value={code}
               onChange={(e) => setCode(e.target.value)}
               disabled={result === 'success'}
               spellCheck="false"
               className={cn(
                 "absolute inset-0 w-full h-full p-6 bg-transparent font-mono text-sm leading-relaxed resize-none focus:outline-none focus:ring-0 disabled:opacity-50 transition-colors",
                 isDark ? "text-slate-300" : "text-slate-800 font-medium"
               )}
             />
           </div>

           {/* Feedback/Hint Bar */}
           {hint && result !== 'success' && (
             <div className={cn(
               "border-t p-4 animate-in slide-in-from-bottom-2 duration-300",
               isDark ? (showErrorNote ? "border-red-500/30 bg-red-500/10 text-red-200" : "border-amber-500/30 bg-amber-500/10 text-amber-200") 
                      : (showErrorNote ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")
             )}>
               <div className="max-w-4xl mx-auto flex items-start gap-3">
                 {showErrorNote ? (
                   <AlertCircle className={cn("h-5 w-5 shrink-0 mt-0.5", isDark ? "text-red-400" : "text-red-600")} />
                 ) : (
                   <Lightbulb className={cn("h-5 w-5 shrink-0 mt-0.5", isDark ? "text-amber-400" : "text-amber-600")} />
                 )}
                 <div>
                   <h4 className={cn(
                     "text-sm font-bold mb-1", 
                     isDark ? (showErrorNote ? "text-red-400" : "text-amber-500") : (showErrorNote ? "text-red-700" : "text-amber-700")
                   )}>
                     {showErrorNote ? "AI 약점 피드백" : "소크라테스 힌트 도착!"}
                   </h4>
                   <p className="text-sm font-medium leading-relaxed opacity-90">{hint}</p>
                 </div>
               </div>
             </div>
           )}

           {/* Success Bar */}
           {result === 'success' && (
             <div className={cn(
               "border-t p-4 animate-in slide-in-from-bottom-2 duration-300",
               isDark ? "border-emerald-500/30 bg-emerald-500/10" : "border-emerald-200 bg-emerald-50"
             )}>
               <div className="max-w-4xl mx-auto flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <CheckCircle2 className={cn("h-6 w-6", isDark ? "text-emerald-400" : "text-emerald-600")} />
                   <div>
                     <h4 className={cn("text-sm font-bold", isDark ? "text-emerald-400" : "text-emerald-800")}>
                       정답입니다! AI 튜터의 리뷰를 확인하세요.
                     </h4>
                     <p className={cn("text-xs font-medium leading-relaxed", isDark ? "text-emerald-200/70" : "text-emerald-600/80")}>
                       {hint}
                     </p>
                   </div>
                 </div>
                 <Button 
                   className={cn(
                     "font-bold shadow-sm", 
                     isDark ? "bg-white text-emerald-900 hover:bg-slate-100" : "bg-emerald-600 text-white hover:bg-emerald-700"
                   )} 
                   onClick={() => window.location.href='/dashboard'}
                 >
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
