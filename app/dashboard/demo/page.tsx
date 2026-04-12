'use client'

import { useState } from "react"
import { AnimatedBackground } from "@/components/animated-background"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { 
  Sparkles, 
  BrainCircuit, 
  Trophy, 
  BookOpen, 
  AlertCircle,
  ChevronRight,
  Check,
  Zap,
  Clock,
  PlayCircle,
  ExternalLink,
  Star
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { MOCK_KNOWLEDGE_BASE } from "@/data/mock-courses"

// 🏁 멋진 데모용 샘플 커리큘럼 데이터
const DEMO_CURRICULUM = {
  title: "React 프론트엔드 전문가 마스터리",
  totalWeeks: 8,
  totalHours: 120,
  aiInsight: "학습자님은 기초 문법보다는 ' Virtual DOM의 동작 원리'와 '함수형 프로그래밍' 개념에 더 흥미를 느끼시는 타입입니다. 따라서 코드를 단순히 따라 하기보다, 내부 동작을 파고드는 이론 중심의 심화 강의를 초반에 배치하여 탄탄한 기반을 잡도록 설계했습니다.",
  phases: [
    {
      phaseNumber: 1,
      title: "Javascript Core & Modern Syntax",
      weekRange: "Week 1-2",
      topics: ["실행 컨텍스트", "클로저(Closure)", "ES6+ 문법", "비동기 프로그래밍"],
      milestone: "JS 엔진의 동작 원리를 이해하고 비동기 로직을 능숙하게 다룸",
      riskLevel: "medium",
      riskReason: "클로저와 비동기 이터레이터 부분에서 개념적 혼동이 올 수 있음. 도해를 그려가며 이해할 것.",
      linkedCourseIds: ["course_js_deep_001"]
    },
    {
      phaseNumber: 2,
      title: "React Fundamentals & Hooks",
      weekRange: "Week 3-5",
      topics: ["JSX", "Virtual DOM", "useEffect 심화", "Custom Hooks 설계"],
      milestone: "재사용 가능한 컴포넌트 라이브러리 기초 설계 완료",
      riskLevel: "low",
      riskReason: "컴포넌트 생명주기와 렌더링 최적화의 상관관계 파악이 핵심 포인트.",
      linkedCourseIds: ["course_react_001"]
    },
    {
      phaseNumber: 3,
      title: "Next.js & Server Side Strategy",
      weekRange: "Week 6-8",
      topics: ["SSR vs CSR", "App Router", "Server Components", "SEO 최적화"],
      milestone: "Lighthouse 점수 90점 이상의 Next.js 포트폴리오 완성",
      riskLevel: "high",
      riskReason: "Hydration 에러와 서버/클라이언트 컴포넌트 경계 구분이 가장 큰 병목이 될 수 있음.",
      linkedCourseIds: ["course_react_001"]
    }
  ]
}

export default function DemoDashboardPage() {
  const [curriculum] = useState(DEMO_CURRICULUM)

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50/50 pb-20">
      <AnimatedBackground />
      <Navbar />
      
      <div className="relative z-10 container mx-auto px-4 pt-28 max-w-5xl">
        <div className="mb-8 flex items-center justify-between bg-orange-500/10 border border-orange-200 p-4 rounded-2xl">
           <p className="text-sm font-bold text-orange-700 flex items-center gap-2">
             <BrainCircuit className="h-4 w-4" /> 
             이 화면은 데모(Mock) 페이지입니다. 실제 AI 상담 후 생성되는 결과와 동일한 UI입니다.
           </p>
           <Button variant="outline" size="sm" className="bg-white border-orange-200 text-orange-600 font-bold" onClick={() => window.location.href='/dashboard'}>
             실계 설계하기
           </Button>
        </div>

        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          {/* Summary Card */}
          <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl p-10 border border-white/60 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100/30 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-orange-200/40 transition-colors duration-700" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-none px-3 py-1 flex items-center gap-1.5">
                    <Zap className="h-3 w-3" /> AI 개인화 설계 (데모)
                  </Badge>
                </div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight text-balance">
                  {curriculum.title}
                </h1>
              </div>
              <div className="flex items-center gap-6 bg-slate-50/80 p-5 rounded-3xl border border-slate-100 shadow-inner shrink-0">
                <div className="text-center px-4 border-r border-slate-200">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">전체 기간</p>
                  <p className="text-xl font-black text-gray-900 flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-orange-500" /> {curriculum.totalWeeks}주
                  </p>
                </div>
                <div className="text-center px-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">총 학습 시간</p>
                  <p className="text-xl font-black text-gray-900 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-amber-500" /> {curriculum.totalHours}시간
                  </p>
                </div>
              </div>
            </div>

            {/* AI Deep Insight */}
            <div className="p-6 rounded-[2rem] bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100/50 shadow-sm relative overflow-hidden group/insight">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/insight:opacity-20 transition-opacity">
                <BrainCircuit className="h-20 w-20 text-indigo-600" />
              </div>
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
                  <Sparkles className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-bold text-indigo-950 mb-1 flex items-center gap-2">AI 컨설턴트 한마디</h4>
                  <p className="text-sm text-indigo-800 leading-relaxed font-medium">{curriculum.aiInsight}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 px-4 flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-orange-500" /> 단계별 학습 로드맵
              </h3>
              <div className="space-y-4">
                {curriculum.phases.map((phase, idx) => (
                  <div key={idx} className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-8 border border-white/60 shadow-lg hover:shadow-xl hover:translate-x-1 transition-all duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-orange-50 text-orange-600 font-black flex items-center justify-center text-xl shrink-0">
                          {idx + 1}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-orange-500/80 tracking-widest uppercase">{phase.weekRange}</span>
                          <h4 className="text-xl font-bold text-gray-900">{phase.title}</h4>
                        </div>
                      </div>
                      <Badge className={cn(
                        "px-4 py-1.5 rounded-full border-none font-bold text-xs shadow-sm",
                        phase.riskLevel === 'high' ? "bg-red-50 text-red-600" :
                        phase.riskLevel === 'medium' ? "bg-amber-50 text-amber-600" :
                        "bg-emerald-50 text-emerald-600"
                      )}>
                        난이도 {phase.riskLevel.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                      {phase.topics.map((topic, tidx) => (
                        <div key={tidx} className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/50 border border-slate-100 text-slate-700 text-sm font-medium hover:bg-orange-50/50 hover:border-orange-100 transition-colors group/topic">
                          <div className="h-2 w-2 rounded-full bg-orange-300 group-hover/topic:scale-125 transition-transform" />
                          {topic}
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4 pt-6 border-t border-slate-100/50">
                      <div className="flex items-start gap-3">
                        <Trophy className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] font-black text-emerald-700 uppercase tracking-wider mb-0.5">도달 목표</p>
                          <p className="text-sm text-gray-700 font-medium leading-snug">{phase.milestone}</p>
                        </div>
                      </div>
                      {phase.riskReason && (
                        <div className="flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[10px] font-black text-amber-700 uppercase tracking-wider mb-0.5">학습 포인트</p>
                            <p className="text-sm text-gray-600 font-medium leading-relaxed">{phase.riskReason}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* RAG Demo Widget */}
                    {phase.linkedCourseIds && phase.linkedCourseIds.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-dashed border-slate-200 space-y-4">
                        <h5 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                          <Sparkles className="h-3 w-3 text-orange-400" /> AI 추천 학습 리소스
                        </h5>
                        <div className="grid grid-cols-1 gap-3">
                          {phase.linkedCourseIds.map(courseId => {
                            const course = MOCK_KNOWLEDGE_BASE.find(c => c.id === courseId);
                            if (!course) return null;
                            return (
                              <div key={courseId} className="group/course relative flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl bg-white border border-slate-100 hover:border-orange-200 hover:shadow-md transition-all duration-300 gap-4">
                                <div className="flex items-center gap-4 flex-1">
                                  <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 group-hover/course:bg-orange-500 group-hover/course:text-white transition-colors">
                                    <PlayCircle className="h-5 w-5" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                      <h6 className="text-sm font-bold text-gray-900 leading-none truncate">{course.title}</h6>
                                      <Badge variant="secondary" className="text-[9px] h-4 px-1.5 bg-slate-100 text-slate-500 border-none font-bold shrink-0">
                                        {course.provider}
                                      </Badge>
                                    </div>
                                    <p className="text-[11px] text-gray-400 line-clamp-1">{course.description}</p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-slate-50">
                                   <div className="flex items-center gap-2">
                                      {course.instructorImage && (
                                        <img src={course.instructorImage} alt={course.instructor} className="h-7 w-7 rounded-lg border border-slate-100 object-cover" />
                                      )}
                                      <div>
                                         <p className="text-[8px] font-bold text-gray-400 uppercase leading-none mb-0.5">Teacher</p>
                                         <p className="text-[10px] font-bold text-gray-700">{course.instructor || '익명 강사'}</p>
                                      </div>
                                   </div>
                                   <div className="flex items-center gap-3">
                                      <div className="text-right">
                                         <p className="text-[8px] font-bold text-gray-400 uppercase leading-none mb-0.5">Rating</p>
                                         <div className="flex items-center gap-0.5 text-amber-500">
                                            <Star className="h-3 w-3 fill-amber-500" />
                                            <span className="text-[10px] font-black">{course.rating || '0.0'}</span>
                                         </div>
                                      </div>
                                      <Button size="sm" variant="ghost" className="h-9 w-9 p-0 rounded-full hover:bg-orange-100 hover:text-orange-600 transition-colors shrink-0">
                                        <ExternalLink className="h-4 w-4" />
                                      </Button>
                                   </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="sticky top-28 space-y-6">
                <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/60 shadow-xl relative overflow-hidden group/actions">
                  <div className="absolute -bottom-10 -right-10 p-4 opacity-5 group-hover/actions:opacity-10 transition-opacity">
                    <Sparkles className="h-40 w-40 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                     <Zap className="h-5 w-5 text-orange-500" />
                     맞춤형 학습 관리
                  </h3>
                  <div className="space-y-4 relative z-10">
                    <Button className="w-full h-14 rounded-2xl font-bold text-base bg-gradient-to-r from-orange-600 to-amber-500 text-white">
                      커리큘럼 저장하기
                    </Button>
                    <Button variant="outline" className="w-full h-14 rounded-2xl bg-white border-orange-100 text-orange-600 font-bold">
                      새로운 목표 설정하기
                    </Button>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/60 shadow-lg">
                  <h4 className="font-bold text-gray-900 mb-4">학습 가이드</h4>
                  <ul className="space-y-4">
                    {[
                      "매일 정해진 분량을 꾸준히 해내는 것이 중요합니다.",
                      "이해가 안 되는 부분은 AI 챗봇에게 즉시 질문하세요.",
                      "이론보다는 실습 위주로 프로젝트를 완성해보세요."
                    ].map((tip, idx) => (
                      <li key={idx} className="flex gap-3 text-sm text-gray-600 font-medium">
                        <div className="h-5 w-5 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                          <Check className="h-3 w-3 text-orange-600" />
                        </div>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
