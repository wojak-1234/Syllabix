'use client'

import { useState } from "react"
import { Navbar } from "@/components/navbar"
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
  Moon
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
  
  // 테마 (light/dark)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  const handleRunCode = () => {
    if (attempts >= testBase.maxAttempts && result !== 'success') {
      setShowErrorNote(true)
      return
    }

    setIsEvaluating(true)
    
    setTimeout(() => {
      const newAttempts = attempts + 1
      setAttempts(newAttempts)

      if (code.includes("df['age']") && code.includes("30")) {
        setResult('success')
        setHint(null)
      } else {
        setResult('fail')
        if (newAttempts < testBase.maxAttempts) {
          setHint("조건문 인덱싱을 활용해본 적이 있나요? `df[조건]` 형태를 어떻게 적용할 수 있을지 생각해보세요.")
        } else {
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
              className="w-full h-12 rounded-xl font-bold bg-gray-900 text-white hover:bg-orange-600"
              onClick={() => window.location.href='/dashboard'}
            >
              대시보드로 돌아가기
            </Button>
          </div>
        </div>
      </main>
    )
  }

  const isDark = theme === 'dark'

  return (
    <main className={cn(
      "relative h-screen flex flex-col overflow-hidden transition-colors duration-500",
      isDark ? "bg-slate-900 text-slate-300" : "bg-slate-50 text-slate-900"
    )}>
      {/* 슬라이드 다운 네비게이션 : 화면 맨 위에 호버 존을 만들어 접근 시 내려오게 함 */}
      <div className="absolute top-0 left-0 right-0 h-4 z-50 group">
        <div className="absolute top-0 inset-x-0 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out shadow-xl">
          <Navbar />
        </div>
      </div>

      <div className="flex-1 flex h-full"> {/* 상단 Navbar 공간을 띄우지 않고 꽉 채움 */}
        
        {/* Left: Problem Description */}
        <div className={cn(
          "w-[400px] flex flex-col overflow-y-auto no-scrollbar border-r transition-colors duration-500",
          isDark ? "bg-slate-800/50 border-slate-700/50" : "bg-white border-slate-200 shadow-sm z-10"
        )}>
          <div className="p-8"> {/* 약간의 패딩 증가 (상단 여유) */}
            <div className="flex items-center justify-between mb-8">
               <button
                 onClick={() => window.history.back()}
                 className={cn(
                   "flex items-center gap-1.5 text-xs font-medium transition-colors",
                   isDark ? "text-slate-400 hover:text-white" : "text-gray-500 hover:text-orange-600"
                 )}
               >
                 <ChevronLeft className="h-3 w-3" /> 이전으로
               </button>
               
               {/* 테마 스위치 */}
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
        <div className="flex-1 flex flex-col z-0">
           <div className={cn(
             "h-12 border-b flex items-center justify-between px-4 transition-colors duration-500",
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
             
             {/* Submission Limit Indicator */}
             <div className="flex items-center gap-4">
               <div className="flex items-center gap-1.5">
                 <span className={cn(
                   "text-xs font-bold uppercase tracking-widest",
                   isDark ? "text-slate-400" : "text-slate-400"
                 )}>제출 기회</span>
                 <div className="flex gap-1">
                   {[...Array(testBase.maxAttempts)].map((_, i) => (
                     <div 
                       key={i} 
                       className={cn("h-1.5 w-6 rounded-full transition-all", 
                         i < attempts 
                           ? (isDark ? "bg-red-500/50" : "bg-red-200")
                           : (isDark ? "bg-emerald-500" : "bg-emerald-500")
                       )} 
                     />
                   ))}
                 </div>
               </div>
               <Button 
                  onClick={handleRunCode}
                  disabled={isEvaluating || result === 'success' || attempts >= testBase.maxAttempts}
                  className={cn(
                    "h-8 rounded-lg text-xs font-bold transition-all px-4 shadow-sm",
                    isEvaluating ? "bg-slate-400 text-white" :
                    result === 'success' ? "bg-emerald-600 text-white" :
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
               disabled={result === 'success' || attempts >= testBase.maxAttempts}
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
               isDark ? "border-amber-500/30 bg-amber-500/10 text-amber-200" : "border-amber-200 bg-amber-50 text-amber-800"
             )}>
               <div className="max-w-4xl mx-auto flex items-start gap-3">
                 <Lightbulb className={cn("h-5 w-5 shrink-0 mt-0.5", isDark ? "text-amber-400" : "text-amber-600")} />
                 <div>
                   <h4 className={cn("text-sm font-bold mb-1", isDark ? "text-amber-500" : "text-amber-700")}>
                     소크라테스 힌트 도착!
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
                       모든 테스트 케이스를 통과했습니다!
                     </h4>
                     <p className={cn("text-xs font-medium", isDark ? "text-emerald-200/70" : "text-emerald-600/80")}>
                       훌륭합니다. 다음 단계로 학습을 이어가세요.
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
