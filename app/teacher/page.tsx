import { AnimatedBackground } from "@/components/animated-background"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function TeacherPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />
      <Navbar />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pt-20 text-center">
        <h1 className="bg-gradient-to-r from-[var(--primary)] to-emerald-400 bg-clip-text text-4xl font-bold text-transparent sm:text-6xl">
          교사 관리 플랫폼
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-foreground/70">
          강의 콘텐츠를 관리하고 수강생들의 공통적인 약점과 실패 지점을 모니터링합니다.
        </p>
        <div className="mt-10 h-64 w-full max-w-4xl rounded-3xl border border-white/60 bg-white/40 shadow-xl backdrop-blur-md transition-all duration-300 hover:shadow-orange-500/10" />
      </div>
      <Footer />
    </main>
  )
}
