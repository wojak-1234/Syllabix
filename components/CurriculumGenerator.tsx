'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Target,
  Clock,
  Trophy,
  Rocket,
  Sparkles,
  ChevronRight,
  BrainCircuit,
  XCircle,
  Lightbulb,
  MessageSquare
} from "lucide-react"
import { cn } from "@/lib/utils"

interface FormData {
  goal: string
  currentLevel: string
  hoursPerWeek: number
  excludes: string
}

export default function CurriculumGenerator() {
  const router = useRouter()
  const [form, setForm] = useState<FormData>({
    goal: '',
    currentLevel: 'beginner',
    hoursPerWeek: 10,
    excludes: ''
  })
  const [loading, setLoading] = useState(false)

  const handleGenerate = () => {
    if (!form.goal) return
    // Save form to sessionStorage and navigate to chatbot
    sessionStorage.setItem('curriculumForm', JSON.stringify(form))
    router.push('/chatbot')
  }

  const getSmoothColor = (val: number) => {
    // 0h: Emerald (142, 70%, 45%) -> 30h: Amber (48, 96%, 53%) -> 60h: Red (0, 84%, 60%)
    let h, s, l;
    if (val <= 30) {
      const p = val / 30;
      h = 142 + (48 - 142) * p;
      s = 70 + (96 - 70) * p;
      l = 45 + (53 - 45) * p;
    } else {
      const p = (val - 30) / 30;
      h = 48 + (0 - 48) * p;
      s = 96 + (84 - 96) * p;
      l = 53 + (60 - 53) * p;
    }
    return `hsl(${h} ${s}% ${l}%)`;
  }

  const sliderColor = getSmoothColor(form.hoursPerWeek);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500" />

        <CardHeader className="pt-10 pb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 shadow-inner">
            <BrainCircuit className="h-9 w-9" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent">
            AI 맞춤 커리큘럼 설계
          </CardTitle>
          <CardDescription className="text-gray-500 text-lg">
            당신의 목표와 현재 수준을 바탕으로 최적의 학습 로드맵을 생성합니다.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 pb-10 space-y-10">
          {/* Section 1: Goal */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-5 w-5 text-orange-500" />
              <Label className="text-lg font-semibold text-gray-800">최종 목표</Label>
            </div>
            <Input
              placeholder="예: 3개월 안에 풀스택 주니어 개발자로 취업하기"
              value={form.goal}
              onChange={e => setForm(p => ({ ...p, goal: e.target.value }))}
              className="h-14 rounded-2xl border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-orange-500/20 text-lg transition-all"
            />
          </section>

          {/* Section 2: Current Level */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-5 w-5 text-orange-500" />
              <Label className="text-lg font-semibold text-gray-800">현재 숙련도</Label>
            </div>
            <RadioGroup
              value={form.currentLevel}
              onValueChange={val => setForm(p => ({ ...p, currentLevel: val }))}
              className="grid grid-cols-3 gap-4"
            >
              {[
                { id: 'beginner', label: '입문자', desc: '해당 지식 전무/초보', icon: Rocket },
                { id: 'intermediate', label: '중급자', desc: '실습 경험 있음', icon: Sparkles },
                { id: 'advanced', label: '고급자', desc: '프로젝트 리딩', icon: Trophy }
              ].map((level) => (
                <div key={level.id}>
                  <RadioGroupItem value={level.id} id={level.id} className="peer sr-only" />
                  <Label
                    htmlFor={level.id}
                    className="flex flex-col items-center justify-center rounded-2xl border-2 border-gray-100 bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:bg-orange-50 cursor-pointer transition-all"
                  >
                    <level.icon className={cn("h-6 w-6 mb-2", form.currentLevel === level.id ? "text-orange-500" : "text-gray-400")} />
                    <span className="font-bold">{level.label}</span>
                    <span className="text-xs text-gray-500 mt-1">{level.desc}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </section>

          {/* Section 3: Time Investment */}
          <section className="space-y-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 transition-colors duration-300" style={{ color: sliderColor }} />
                <Label className="text-lg font-semibold text-gray-800">주 주간 학습 가능 시간</Label>
              </div>
              <Badge
                variant="secondary"
                className="font-bold text-sm px-3 py-1 transition-all duration-300"
                style={{
                  backgroundColor: sliderColor.replace('hsl', 'hsla').replace(')', ', 0.1)'),
                  color: sliderColor
                }}
              >
                {form.hoursPerWeek}시간
              </Badge>
            </div>
            <div className="px-2">
              <Slider
                value={[form.hoursPerWeek]}
                onValueChange={([val]) => setForm(p => ({ ...p, hoursPerWeek: val }))}
                max={60}
                step={1}
                className="py-4"
                style={{
                  // @ts-ignore
                  '--primary': sliderColor,
                  '--ring': sliderColor
                } as React.CSSProperties}
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>1시간 (여유)</span>
                <span>40시간 이상 (몰입)</span>
                <span>60시간 (열공)</span>
              </div>
            </div>
          </section>

          {/* Section 4: Excludes */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="h-5 w-5 text-gray-400" />
              <Label className="text-lg font-semibold text-gray-800">제외하고 싶은 내용 (선택)</Label>
            </div>
            <Textarea
              placeholder="이미 숙달했거나 관심 없는 기술을 적어주세요 (예: PHP, jQuery)"
              value={form.excludes}
              onChange={e => setForm(p => ({ ...p, excludes: e.target.value }))}
              className="resize-none rounded-2xl border-gray-200 bg-gray-50/50 focus:bg-white min-h-[100px]"
            />
          </section>
        </CardContent>

        <CardFooter className="px-8 pb-10">
          <Button
            onClick={handleGenerate}
            disabled={loading || !form.goal}
            className="w-full h-16 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold text-lg shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-1 transition-all group"
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                이동 중...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                AI 상담 받고 커리큘럼 생성하기
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </div>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Info Tip */}
      <div className="flex items-center gap-3 p-6 rounded-3xl bg-blue-50 border border-blue-100 text-blue-800">
        <Lightbulb className="h-6 w-6 text-blue-500 shrink-0" />
        <p className="text-sm">
          <strong>Tip:</strong> 버튼을 누르면 AI 상담 채팅이 시작됩니다. 몇 가지 추가 질문에 답하면 더 정확한 커리큘럼이 만들어져요!
        </p>
      </div>
    </div>
  )
}

