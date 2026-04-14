'use client'

import { useState, useEffect, Suspense, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  ChevronLeft,
  BarChart3,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  BrainCircuit,
  MessageSquareWarning,
  ArrowUpRight,
  RefreshCw,
  Search,
  ChevronDown
} from "lucide-react"

// ── Mock Analytics Data ──────────────────────────────────────────────

const MOCK_SERIES_LIST = [
  { id: "1", title: "Python 기초부터 실전까지" },
  { id: "2", title: "React Hooks 마스터 클래스" }
]

const MOCK_ANALYTICS: Record<string, any> = {
  "1": {
    seriesId: "1",
    seriesTitle: "Python 기초부터 실전까지",
    stats: { totalStudents: 124, avgProgress: 68 },
    heatmap: [
      { id: "l1", title: "변수와 자료형", score: 95, errorCount: 12 },
      { id: "l2", title: "조건문과 반복문", score: 82, errorCount: 45 },
      { id: "l3", title: "함수와 모듈", score: 64, errorCount: 89 },
      { id: "l4", title: "클래스와 객체", score: 45, errorCount: 120 },
    ],
    blindPoints: [
      {
        id: "bp1",
        lectureTitle: "함수와 모듈",
        concept: "전역 변수 vs 지역 변수 (Scope)",
        failRate: 67,
        studentDifficulties: [
          "전역 변수가 함수 내에서 global 없이 수정되지 않는 점에 대해 80% 이상의 수강생이 의문을 제기함",
          "메모리 구조(Stack/Heap) 상에서 변수가 저장되는 위치를 혼동하고 있음"
        ],
        aiDeepFeedback: "함수 내부에서의 'Shadowing' 개념을 설명할 때 시각적 스택 프레임 다이어그램을 활용하세요. 단순히 global 키워드를 가르치기보다, 불변성(Immutability) 관점에서 왜 지역 변수 사용이 권장되는지 철학적인 접근이 필요합니다.",
        ragAnchor: "이 오답은 2장 3절 '로컬 스코프의 이해' 파트의 예제 코드와 89% 일치합니다."
      }
    ]
  },
  "2": {
    seriesId: "2",
    seriesTitle: "React Hooks 마스터 클래스",
    stats: { totalStudents: 89, avgProgress: 54 },
    heatmap: [
      { id: "l5", title: "useState 이해하기", score: 88, errorCount: 15 },
      { id: "l6", title: "useEffect 입문", score: 42, errorCount: 156 },
    ],
    blindPoints: [
      {
        id: "bp2",
        lectureTitle: "useEffect 입문",
        concept: "의존성 배열(Dependency Array)",
        failRate: 91,
        studentDifficulties: [
          "객체나 배열을 의존성으로 넣었을 때 매 렌더링마다 참조가 바뀌어 무한 루프가 발생하는 원리를 대부분의 학생이 파악하지 못함",
          "클로저 문제로 인한 'Stale Closure' 현상을 useEffect 내에서 디버깅하는 데 어려움을 겪음"
        ],
        aiDeepFeedback: "참조 타입의 메모이제이션(useMemo, useCallback)을 먼저 학습시킨 후 useEffect에 적용하는 순서로 커리큘럼을 조정하세요. 특히 '의존성 배열은 필터링이 아니라 선언적 연결'임을 강조하는 것이 좋습니다.",
        ragAnchor: "3장 'useEffect 라이프사이클' 섹션의 클린업 함수 설명 부분과 연관성이 높습니다."
      }
    ]
  },
  "mock-파이썬으로-시작하는-자동화의-세계": {
    seriesId: "mock-파이썬으로-시작하는-자동화의-세계",
    seriesTitle: "파이썬으로 시작하는 자동화의 세계",
    stats: { totalStudents: 42, avgProgress: 75 },
    heatmap: [
      { id: "l1", title: "파이썬 환경 설정", score: 98, errorCount: 2 },
      { id: "l2", title: "변수와 데이터 타입", score: 72, errorCount: 45 },
      { id: "l3", title: "엑셀 자동화 첫걸음", score: 58, errorCount: 88 },
      { id: "l4", title: "이메일 대량 발송", score: 41, errorCount: 112 },
    ],
    blindPoints: [
      {
        id: "bp-py-1",
        lectureTitle: "변수와 데이터 타입",
        concept: "동적 타이핑과 형변환 (Type Casting)",
        failRate: 64,
        studentDifficulties: [
          "input()으로 받은 값이 문자열임을 인지하지 못하고 바로 숫자 연산을 시도함",
          "문자열과 숫자를 + 연산자로 합치려 할 때 발생하는 TypeError를 해결하지 못함"
        ],
        aiDeepFeedback: "입력값의 타입을 확인하는 type() 함수 활용법을 먼저 가르치세요. f-string을 활용한 문자열 포매팅을 대안으로 제시하면 형변환 실수를 크게 줄일 수 있습니다.",
        ragAnchor: "1장 2절 '변수와 타입' 섹션의 int() 변환 예제와 밀접한 관련이 있습니다."
      }
    ]
  },
  "mock-Next.js-15:-완벽한-풀스택-가이드": {
    seriesId: "mock-Next.js-15:-완벽한-풀스택-가이드",
    seriesTitle: "Next.js 15: 완벽한 풀스택 가이드",
    stats: { totalStudents: 64, avgProgress: 42 },
    heatmap: [
      { id: "nx1", title: "App Router", score: 85, errorCount: 12 },
      { id: "nx2", title: "Server Components", score: 45, errorCount: 98 },
      { id: "nx3", title: "Data Fetching", score: 62, errorCount: 54 },
    ],
    blindPoints: [
      {
        id: "bp-nx-1",
        lectureTitle: "Server Components vs Client Components",
        concept: "서버/클라이언트 컴포넌트 경계 및 직렬화",
        failRate: 88,
        studentDifficulties: [
          "Server Component에서 'use client'가 필요한 이벤트 핸들러를 직접 사용하려 함",
          "클라이언트 컴포넌트로 전달할 수 없는 데이터(함수 등)를 Props로 넘겨서 발생하는 에러"
        ],
        aiDeepFeedback: "컴포넌트 상단에 'use client'를 선언해야 하는 상황을 결정 트리(Decision Tree) 형태로 제공하세요. Props 직렬화 개념을 설명할 때 'JSON으로 변환 가능한가?'를 기준으로 삼도록 가이드하는 것이 좋습니다.",
        ragAnchor: "Next.js 공식 문서 2-4 'Rendering' 섹션의 설명과 예제가 필요합니다."
      }
    ]
  },
  "mock-로블록스-게임-제작-입문-(Lua-코딩)": {
    seriesId: "mock-로블록스-게임-제작-입문-(Lua-코딩)",
    seriesTitle: "로블록스 게임 제작 입문 (Lua 코딩)",
    stats: { totalStudents: 156, avgProgress: 88 },
    heatmap: [
      { id: "rb1", title: "Roblox Studio 기초", score: 95, errorCount: 5 },
      { id: "rb2", title: "Part 속성 제어", score: 88, errorCount: 15 },
      { id: "rb3", title: "이벤트와 함수", score: 72, errorCount: 64 },
    ],
    blindPoints: [
      {
        id: "bp-rb-1",
        lectureTitle: "이벤트와 함수",
        concept: "이벤트 연결 (Event Connection)",
        failRate: 52,
        studentDifficulties: [
          "Touched 이벤트를 연결한 후 인자로 들어오는 hit 파트가 캐릭터의 일부인지 검증하는 단계를 생략함",
          "Connect() 함수 내부에 익명 함수를 복잡하게 작성하다 괄호 실수가 잦음"
        ],
        aiDeepFeedback: "코드 구조화를 위해 외부에서 정의된 함수를 연결하는 방식을 먼저 연습시키세요. hit.Parent:FindFirstChild('Humanoid')와 같은 방어 코드(Guard) 작성을 습관화하도록 강조해야 합니다.",
        ragAnchor: "로블록스 개발자 허브 'Scripting Events' 섹션과 관련이 깊습니다."
      }
    ]
  },
  "mock-Node.js-백엔드-아키텍처": {
    seriesId: "mock-Node.js-백엔드-아키텍처",
    seriesTitle: "Node.js 백엔드 아키텍처",
    stats: { totalStudents: 38, avgProgress: 35 },
    heatmap: [
      { id: "nd1", title: "Event Loop", score: 38, errorCount: 145 },
      { id: "nd2", title: "Express 기초", score: 82, errorCount: 12 },
      { id: "nd3", title: "Prisma ORM", score: 55, errorCount: 67 },
    ],
    blindPoints: []
  },
  "mock-자료구조와-알고리즘-(C++)": {
    seriesId: "mock-자료구조와-알고리즘-(C++)",
    seriesTitle: "자료구조와 알고리즘 (C++)",
    stats: { totalStudents: 12, avgProgress: 92 },
    heatmap: [
      { id: "al1", title: "시간 복잡도", score: 92, errorCount: 1 },
      { id: "al2", title: "Linked List", score: 64, errorCount: 23 },
    ],
    blindPoints: []
  }
}

function AnalyticsContent() {
  const searchParams = useSearchParams()
  const [seriesList, setSeriesList] = useState<any[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [realBlindPoints, setRealBlindPoints] = useState<any[] | null>(null)

  // 1. 실데이터 기반 시리즈 목록 로드
  useEffect(() => {
     const fetchSeries = async () => {
        try {
           const res = await fetch('/api/teacher/series?teacherId=teacher-1')
           if (res.ok) {
              const { data } = await res.json()
              setSeriesList(data)
              // URL에 seriesId가 있으면 그것을, 없으면 첫 번째 시리즈를 기본 선택
              const targetId = searchParams.get('seriesId') || (data.length > 0 ? data[0].id : null)
              setSelectedId(targetId)
           }
        } catch (e) {
           console.error("Failed to load real series list", e)
        }
     }
     fetchSeries()
  }, [])

  const currentSeries = seriesList.find(s => s.id === selectedId) || (seriesList.length > 0 ? seriesList[0] : null)

  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    setIsDropdownOpen(true)
  }
  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false)
    }, 300)
  }

  const handleRunAgent = async () => {
    setIsAnalyzing(true)
    
    // 개발 단계: 실제 API 호출 대신 더미 데이터 반환 (사용자 요청)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    try {
      let dummyPoints = [
        {
          id: "dummy-bp-1",
          lectureTitle: currentSeries?.title || "선택된 강의",
          concept: "비동기 처리와 상태 업데이트 (Race Condition)",
          failRate: 78,
          studentDifficulties: [
            "연속적인 API 호출 시 이전 요청이 완료되기 전에 상태를 변경하여 데이터가 꼬이는 현상",
            "useEffect 내에서 클린업 함수를 작성하지 않아 메모리 누수가 발생하는 패턴이 다수 발견됨"
          ],
          aiDeepFeedback: "상태 업데이트 로직에 AbortController를 도입하는 방법을 실습 과제로 구성하세요. 단순 문법보다 브라우저의 이벤트 루프와 리액트 렌더링 사이클의 선후 관계를 시각화하여 설명하는 것이 효과적입니다.",
          ragAnchor: "심화 세션 4장 '성능 최적화' 파트의 비동기 제어 섹션과 연결됩니다."
        }
      ]

      // 파이썬 강좌인 경우 좀 더 구체적인 더미 데이터 제공
      if (selectedId?.includes("파이썬")) {
        dummyPoints = [
          {
            id: "dummy-py-1",
            lectureTitle: "엑셀 데이터 자동 처리",
            concept: "파일 시스템 경로와 절대/상대 경로",
            failRate: 82,
            studentDifficulties: [
              "파일이 존재하는 폴더에서 스크립트를 실행하지 않아 발생하는 FileNotFoundError가 지배적임",
              "Windows와 Mac/Linux의 경로 구분자(\\/) 차이로 인한 코드 호환성 문제"
            ],
            aiDeepFeedback: "os.path 대신 pathlib 라이브러리 사용을 적극 권장하세요. 경로를 하드코딩하기보다 스크립트 위치 기준(file)으로 상대 경로를 추출하는 전형적인 'Base Path' 패턴을 템플릿화하여 제공하는 것이 좋습니다.",
            ragAnchor: "2장 1절 '파일 다루기' 기초 예제와 92% 연관되어 있습니다."
          }
        ]
      }
      
      setRealBlindPoints(dummyPoints)
      setSuccess("AI 에이전트가 분석을 완료했습니다. (테스트 모드: 더미 데이터)")
      setTimeout(() => setSuccess(null), 4000)
    } catch (err: any) {
      console.error(err)
      alert("분석 중 오류 발생: " + err.message)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const data = (selectedId && MOCK_ANALYTICS[selectedId]) || MOCK_ANALYTICS["1"]
  // 실제 분석 데이터가 있다면 그것을 우선 사용
  const displayBlindPoints = realBlindPoints || data.blindPoints;

  const handleDetailedFeedback = async (bpId: string) => {
    // 향후 실제 AI 상세 리포트 생성 로직 자리
    setSuccess("해당 취약점에 대한 AI 상세 코칭 가이드가 생성되었습니다.")
    setTimeout(() => setSuccess(null), 3000)
  }

  return (
    <div className="relative z-10 container mx-auto px-4 pt-28 max-w-5xl">
      {success && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 duration-300">
           <div className="bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-2 font-bold ring-4 ring-emerald-500/20">
             <CheckCircle2 className="h-5 w-5" /> {success}
           </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <button
               onClick={() => window.location.href='/teacher/dashboard'}
               className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-emerald-600 transition-colors"
             >
               <ChevronLeft className="h-4 w-4" /> 교사 대시보드
             </button>
             <span className="text-gray-300 text-xs">/</span>
             <span className="text-xs font-bold text-emerald-600">통합 분석 리포트</span>
             <div className="relative group ml-1">
               <button onClick={() => alert('실제 동작: \n1. 학생들의 수강(Enrollment) 기록과 각 강좌별 풀이 점수를 평균 냅니다.\n2. 누적된 오답(Blind Points) 리스트를 AI 에이전트가 훑고 RAG로 강의 자료와 연계하여 지도 조언을 생성합니다.\n(현재는 심사용 임시 가상 데이터 기반입니다)')} className="p-1 rounded-full bg-slate-200 text-slate-500 hover:bg-emerald-100 hover:text-emerald-600 transition-colors cursor-pointer">
                 <AlertTriangle className="h-3 w-3" />
               </button>
             </div>
             <span className="text-[10px] text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">데모 데이터(임시)</span>
          </div>
          
          <div 
            className="relative inline-block"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button className="text-3xl font-black text-gray-900 flex items-center gap-2 hover:text-emerald-600 transition-colors py-1">
              {currentSeries?.title || "강좌 선택"}
              <ChevronDown className={cn("h-6 w-6 text-gray-300 transition-transform duration-300", isDropdownOpen && "rotate-180")} />
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-slate-100 shadow-2xl rounded-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {seriesList.length === 0 && <p className="p-3 text-xs text-gray-400">등록된 강좌가 없습니다.</p>}
                {seriesList.map((s: any) => (
                  <button 
                    key={s.id}
                    onClick={() => {
                      setSelectedId(s.id)
                      setRealBlindPoints(null) // 시리즈 변경 시 분석 결과 초기화
                      setIsDropdownOpen(false)
                    }}
                    className={cn(
                      "w-full text-left p-3 rounded-xl text-sm font-bold transition-colors",
                      selectedId === s.id ? "bg-emerald-50 text-emerald-700" : "text-gray-600 hover:bg-slate-50"
                    )}
                  >
                    {s.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <Button 
          onClick={handleRunAgent}
          disabled={isAnalyzing || !selectedId}
          className="bg-gray-900 hover:bg-black text-white rounded-xl font-bold flex items-center gap-2 px-5 h-12 shadow-md shrink-0"
        >
          <RefreshCw className={cn("h-4 w-4", isAnalyzing && "animate-spin")} />
          {isAnalyzing ? "에이전트 분석 중..." : "AI 취약점 정밀 분석"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
         <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-rose-500" /> 강좌별 이해도
              </h3>
              
              {!MOCK_ANALYTICS[selectedId || ""] ? (
                <div className="py-20 text-center relative z-10">
                  <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="h-8 w-8 text-slate-300" />
                  </div>
                  <p className="text-gray-500 font-bold text-lg">데이터가 존재하지 않습니다.</p>
                  <p className="text-gray-400 text-sm mt-1">이는 테스트 데이터입니다. 🤖</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {MOCK_ANALYTICS[selectedId || ""].heatmap.map((lec: any) => (
                    <div key={lec.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 relative group overflow-hidden">
                       <div className={cn(
                          "absolute inset-0 opacity-10 transition-opacity group-hover:opacity-20",
                          lec.score > 80 ? "bg-emerald-500" : lec.score > 60 ? "bg-amber-500" : "bg-rose-500"
                       )} />
                       <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">{lec.title}</p>
                       <p className={cn("text-xl font-black", lec.score > 80 ? "text-emerald-600" : lec.score > 60 ? "text-amber-600" : "text-rose-600")}>
                         {lec.score}%
                       </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 px-2">
                <MessageSquareWarning className="h-5 w-5 text-amber-500" /> 발견된 Blind Points
                <Badge variant="outline" className="ml-auto text-[10px] border-emerald-200 text-emerald-600 bg-emerald-50">
                  {realBlindPoints ? "AI 실시간 분석 결과" : "분석 전 가이드 데이터"}
                </Badge>
              </h3>
              
              {!MOCK_ANALYTICS[selectedId || ""] && !realBlindPoints ? (
                <div className="bg-white rounded-[2rem] border border-dashed border-slate-200 p-16 text-center">
                  <p className="text-gray-400 font-bold">분석 결과가 아직 없습니다.</p>
                  <p className="text-xs text-gray-300 mt-1">상단의 'AI 취약점 정밀 분석' 버튼을 눌러보세요.</p>
                </div>
              ) : (
                (realBlindPoints || MOCK_ANALYTICS[selectedId || ""].blindPoints).map((bp: any) => (
                  <div key={bp.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-xl p-8 relative overflow-hidden group">
                    {/* ... (기존과 동일한 블라인드 포인트 렌더링 로직) */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div>
                            <Badge className="bg-amber-50 text-amber-600 border-none mb-2">{bp.lectureTitle}</Badge>
                            <h4 className="text-2xl font-black text-gray-900 leading-tight">{bp.concept}</h4>
                          </div>
                          <div className="text-right">
                             <div className="inline-block p-3 rounded-2xl bg-rose-50 border border-rose-100 text-center min-w-[80px]">
                               <p className="text-[10px] font-bold text-rose-400 uppercase">실패율</p>
                               <p className="text-lg font-black text-rose-600">{bp.failRate}%</p>
                             </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h5 className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                              <AlertTriangle className="h-3 w-3" /> 학생들이 어려워하는 핵심 원인
                            </h5>
                            <ul className="space-y-2">
                               {bp.studentDifficulties.map((diff: string, i: number) => (
                                 <li key={i} className="text-sm text-gray-600 font-medium flex items-start gap-2">
                                   <span className="mt-1 h-1 w-1 rounded-full bg-rose-300 shrink-0" />
                                   {diff}
                                 </li>
                               ))}
                            </ul>
                          </div>

                          <div className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-100">
                            <h5 className="text-sm font-bold text-emerald-800 flex items-center gap-2 mb-2">
                              <BrainCircuit className="h-4 w-4" /> AI 원인 분석 및 교수법 제안
                            </h5>
                            <p className="text-sm text-gray-700 leading-relaxed font-medium italic">
                              "{bp.aiDeepFeedback}"
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                           <p className="text-[11px] text-gray-400 flex items-center gap-1.5 font-medium">
                             <Search className="h-3 w-3" /> {bp.ragAnchor}
                           </p>
                           <Button 
                             onClick={() => handleDetailedFeedback(bp.id)}
                             className="bg-gray-900 hover:bg-black text-white rounded-xl font-bold h-10 px-6 shadow-md transition-all active:scale-95"
                           >
                             상세 피드백 리포트 생성
                           </Button>
                        </div>
                    </div>
                  </div>
                ))
              )}
            </div>
         </div>

         <div className="space-y-6">
            <div className="bg-gray-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
              <div className="absolute top-10 right-10 opacity-10">
                <BarChart3 className="h-32 w-32" />
              </div>
              <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-6">운영 인사이트</h4>
              <div className="space-y-6 relative">
                 <div>
                   <p className="text-3xl font-black text-white mb-1">{MOCK_ANALYTICS[selectedId || ""]?.stats.totalStudents || 0}명</p>
                   <p className="text-xs text-gray-400">현재 학습 중인 수강생</p>
                 </div>
                 <div className="h-px bg-white/10 w-full" />
                 <div>
                   <p className="text-3xl font-black text-emerald-400 mb-1">{MOCK_ANALYTICS[selectedId || ""]?.stats.avgProgress || 0}%</p>
                   <p className="text-xs text-gray-400">평균 학습 완주율</p>
                 </div>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
               <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">최근 오답 키워드</h4>
               <div className="flex flex-wrap gap-2">
                  {["SyntaxError", "클로저", "스코프", "useEffect", "인덱싱"].map(k => (
                    <Badge key={k} variant="outline" className="rounded-lg h-8 px-3 border-slate-200 text-gray-600 font-bold">{k}</Badge>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  )
}

export default function GeneralAnalyticsPage() {
  return (
    <main className="relative min-h-screen bg-slate-50/50 pb-20">
      <Navbar />
      <Suspense fallback={
        <div className="pt-40 flex flex-col items-center justify-center gap-4">
           <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
           <p className="font-bold text-gray-400">데이터를 불러오는 중...</p>
        </div>
      }>
        <AnalyticsContent />
      </Suspense>
      <Footer />
    </main>
  )
}
