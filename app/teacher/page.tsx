'use client'

import { useState } from "react"
import { AnimatedBackground } from "@/components/animated-background"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Star,
  Users,
  Briefcase,
  BookOpen,
  Edit3,
  CheckCircle2,
  GraduationCap,
  Award,
  Video,
  X
} from "lucide-react"

// ── Mock Initial Profile Data ──────────────────────────────────────────

const INITIAL_PROFILE = {
  name: "김수현",
  role: "수석 인스트럭터",
  subject: "Python & AI Data Science",
  rating: 4.9,
  totalStudents: 1420,
  reviewCount: 384,
  introduction: "안녕하세요. 여러분의 프로그래밍 여정을 함께할 김수현입니다. 이론보다는 실무에 바로 적용할 수 있는 살아있는 코드를 작성하는 방법을 알려드립니다. 초보자도 쉽게 이해할 수 있는 비유와 함께 기초부터 탄탄하게 잡아드리겠습니다.",
  career: [
    "현) Syllabix 전임 AI/Data 강사",
    "전) 우아한형제들 데이터 엔지니어",
    "전) 삼성전자 SW 개발 선임 연구원",
    "카이스트 전산학 석사"
  ],
  courses: [
    {
      id: "1",
      title: "Python 기초부터 실전까지",
      students: 840,
      rating: 4.9,
      status: "진행중",
      thumbnail: "bg-gradient-to-br from-emerald-400 to-teal-500",
    },
    {
      id: "2",
      title: "React Hooks 마스터 클래스",
      students: 450,
      rating: 4.8,
      status: "진행중",
      thumbnail: "bg-gradient-to-br from-blue-400 to-indigo-500",
    },
    {
      id: "3",
      title: "초보자를 위한 데이터 구조",
      students: 130,
      rating: 5.0,
      status: "모집중",
      thumbnail: "bg-gradient-to-br from-purple-400 to-fuchsia-500",
    }
  ]
}

export default function TeacherProfilePage() {
  const [profile, setProfile] = useState(INITIAL_PROFILE)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({ introduction: profile.introduction, careerList: profile.career.join('\n') })
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const handleSave = () => {
    setProfile({
      ...profile,
      introduction: editData.introduction,
      career: editData.careerList.split('\n').filter(c => c.trim() !== '')
    })
    setIsEditing(false)
    setSuccessMsg("프로필이 성공적으로 업데이트되었습니다.")
    setTimeout(() => setSuccessMsg(null), 3000)
  }

  return (
    <main className="relative min-h-screen bg-slate-50/50 pb-20">
      <AnimatedBackground />
      <Navbar />

      {/* 성공 노티피케이션 */}
      {successMsg && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 duration-300">
           <div className="bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-2 font-bold ring-4 ring-gray-900/20">
             <CheckCircle2 className="h-5 w-5 text-emerald-400" /> {successMsg}
           </div>
        </div>
      )}

      {/* 상단 배너 (다이나믹 그라데이션) */}
      <div className="relative w-full h-[300px] bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
         <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/20 blur-3xl rounded-full"></div>
         <div className="absolute top-12 -right-12 w-64 h-64 bg-teal-400/20 blur-3xl rounded-full"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 max-w-5xl -mt-32">
        {/* 강사 프로필 카드 */}
        <div className="bg-white/90 backdrop-blur-2xl rounded-[3rem] p-8 md:p-12 border border-white/60 shadow-2xl shadow-emerald-900/5 mb-12">
          <div className="flex flex-col md:flex-row gap-8 items-start relative">
             
             {/* 수정 버튼 (강사 본인 로그인 시 노출 가정) */}
             <Button 
               onClick={() => {
                 setEditData({ introduction: profile.introduction, careerList: profile.career.join('\n') })
                 setIsEditing(true)
               }}
               variant="outline" 
               className="absolute top-0 right-0 rounded-2xl font-bold h-12 px-6 border-emerald-200 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-100 hidden md:flex items-center gap-2 transition-all hover:scale-105"
             >
               <Edit3 className="h-4 w-4" /> 프로필 편집
             </Button>
             <Button 
               onClick={() => {
                 setEditData({ introduction: profile.introduction, careerList: profile.career.join('\n') })
                 setIsEditing(true)
               }}
               variant="outline" 
               className="md:hidden absolute top-0 right-0 rounded-xl h-10 w-10 p-0 border-emerald-200 text-emerald-700 bg-emerald-50/50"
             >
               <Edit3 className="h-4 w-4" />
             </Button>

             {/* 강사 아바타 */}
             <div className="shrink-0 relative group">
                <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-[2.5rem] p-1.5 shadow-inner transition-transform duration-300 group-hover:scale-105">
                  <div className="w-full h-full bg-white rounded-[2.2rem] flex items-center justify-center overflow-hidden">
                     {/*TODO: 실제 이미지 연동*/}
                     <span className="text-5xl md:text-6xl font-black text-emerald-200 uppercase">{profile.name.substring(0,1)}</span>
                  </div>
                </div>
                <div className="absolute -bottom-3 -right-3 bg-emerald-500 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/30 transform rotate-3">
                  <Award className="h-6 w-6" />
                </div>
             </div>

             {/* 정보 섹션 */}
             <div className="flex-1 pt-2">
                <div className="flex items-center gap-3 mb-3">
                  <Badge className="bg-emerald-100 text-emerald-800 border-none px-3 py-1.5 text-xs font-black shadow-sm">{profile.role}</Badge>
                  <Badge className="bg-blue-50 text-blue-700 border-none px-3 py-1.5 text-xs font-black shadow-sm">{profile.subject}</Badge>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-6">
                  {profile.name} <span className="text-2xl font-bold text-gray-400">강사</span>
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 mt-4 p-5 bg-slate-50 rounded-[2rem] border border-slate-100/50 shadow-inner">
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-100 p-2.5 rounded-xl text-amber-500"><Star className="h-5 w-5 fill-amber-500" /></div>
                    <div>
                      <span className="text-xl font-black text-gray-900">{profile.rating}</span>
                      <span className="text-xs font-bold text-gray-400 ml-1">({profile.reviewCount} 리뷰)</span>
                    </div>
                  </div>
                  <div className="w-px h-8 bg-gray-200 hidden md:block" />
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-100 p-2.5 rounded-xl text-emerald-600"><Users className="h-5 w-5" /></div>
                    <div>
                      <span className="text-xl font-black text-gray-900">{profile.totalStudents.toLocaleString()}명</span>
                      <span className="text-xs font-bold text-gray-400 ml-1">수강생</span>
                    </div>
                  </div>
                  <div className="w-px h-8 bg-gray-200 hidden md:block" />
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2.5 rounded-xl text-blue-600"><Video className="h-5 w-5" /></div>
                    <div>
                      <span className="text-xl font-black text-gray-900">{profile.courses.length}개</span>
                      <span className="text-xs font-bold text-gray-400 ml-1">진행 강좌</span>
                    </div>
                  </div>
                </div>
             </div>
          </div>

          {/* 소개 및 경력 */}
          <div className="mt-10 pt-10 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-12">
             <div className="md:col-span-2 space-y-5">
                <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-emerald-500 p-1 bg-emerald-50 rounded-lg" /> 강사 소개
                </h3>
                <p className="text-gray-600 leading-relaxed font-medium whitespace-pre-wrap text-[15px]">
                  {profile.introduction}
                </p>
             </div>
             <div className="space-y-5">
                <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <Briefcase className="h-6 w-6 text-blue-500 p-1 bg-blue-50 rounded-lg" /> 주요 경력
                </h3>
                <ul className="space-y-3">
                  {profile.career.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-[15px] font-medium text-gray-600">
                      <div className="h-2 w-2 rounded-full bg-emerald-400 mt-2 shrink-0 shadow-sm" />
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
             </div>
          </div>
        </div>

        {/* 현재 진행 중인 강의 (Current Courses) */}
        <div className="mb-12">
          <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-2 px-2">
            <GraduationCap className="h-7 w-7 text-emerald-500 p-1 bg-emerald-50 rounded-lg" /> 현재 가르치는 강의
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {profile.courses.map(course => (
              <div key={course.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group cursor-pointer flex flex-col">
                <div className={cn("h-40 w-full relative", course.thumbnail)}>
                   <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                   <div className="absolute top-4 left-4">
                     <Badge className="bg-white/95 text-gray-900 border-none font-bold shadow-sm">{course.status}</Badge>
                   </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-black text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-emerald-700 transition-colors">
                      {course.title}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                      <Users className="h-4 w-4 text-emerald-600" /> {course.students.toLocaleString()}명 수강
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                      <Star className="h-4 w-4 text-amber-400 fill-amber-400" /> 평점 {course.rating}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 프로필 편집 모달 */}
      {isEditing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md transition-all duration-300 p-4 animate-in fade-in zoom-in-95">
           <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl border border-white/60 overflow-hidden flex flex-col max-h-[90vh]">
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-slate-50/80">
                 <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                   <Edit3 className="h-5 w-5 text-emerald-500" /> 프로필 편집창
                 </h3>
                 <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:bg-slate-200 p-1.5 rounded-xl transition-colors">
                   <X className="h-6 w-6" />
                 </button>
              </div>
              
              <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-8">
                <div>
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3 block">강사 소개</label>
                  <textarea 
                    value={editData.introduction}
                    onChange={e => setEditData({ ...editData, introduction: e.target.value })}
                    className="w-full min-h-[160px] p-5 rounded-[1.5rem] bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all resize-y shadow-inner text-gray-700 leading-relaxed"
                    placeholder="강사님의 매력을 어필할 수 있는 소개글을 작성해주세요."
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3 block">주요 경력 (줄바꿈 구분)</label>
                  <textarea 
                    value={editData.careerList}
                    onChange={e => setEditData({ ...editData, careerList: e.target.value })}
                    className="w-full min-h-[140px] p-5 rounded-[1.5rem] bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all resize-y shadow-inner text-gray-700 leading-relaxed whitespace-pre"
                    placeholder="현) 카카오페이 플랫폼 리드&#13;&#10;전) 네이버 파이낸셜..."
                  />
                  <p className="text-[11px] text-gray-400 font-bold mt-2 ml-1">엔터(줄바꿈)를 기준으로 경력 항목이 나뉩니다.</p>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 flex gap-4 bg-slate-50/80">
                 <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1 h-14 rounded-2xl font-black text-gray-500 border-gray-200 bg-white hover:bg-gray-50">취소</Button>
                 <Button 
                   onClick={handleSave}
                   className="flex-1 h-14 rounded-2xl font-black bg-gray-900 text-white hover:bg-black transition-all shadow-lg"
                 >
                   변경사항 적용
                 </Button>
              </div>
           </div>
        </div>
      )}

      <Footer />
    </main>
  )
}
