import { AnimatedBackground } from "@/components/animated-background"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function BlundersPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />
      <Navbar />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pt-20 text-center">
        <h1 className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-4xl font-bold text-transparent sm:text-6xl">
          다빈도 실수 분석
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-foreground/70">
          학습 과정에서 반복되는 주요 실수 패턴을 파악하여 실력을 개선합니다.
        </p>
        <div className="mt-10 h-64 w-full max-w-4xl rounded-3xl border border-white/60 bg-white/40 shadow-xl backdrop-blur-md transition-all duration-300 hover:shadow-orange-500/10" />
      </div>
      <Footer />
    </main>
  )
}
