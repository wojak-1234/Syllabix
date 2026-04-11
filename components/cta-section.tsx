"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Check, Loader2 } from "lucide-react"

export function CTASection() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 teacher:from-emerald-500 teacher:via-teal-500 teacher:to-cyan-500 p-12 shadow-2xl shadow-orange-500/25 teacher:shadow-emerald-500/25 sm:p-16 lg:p-20">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-blob" />
            <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-yellow-300/20 blur-3xl animate-blob-delay-1" />
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                backgroundSize: '32px 32px'
              }}
            />
          </div>

          <div className="relative z-10 mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl text-balance">
              망설여지신다고요?
            </h2>
            <p className="mt-4 text-lg text-white/90 text-pretty">
              지금 바로 만나보세요
            </p>

            {/* Email form */}
            <form onSubmit={handleSubmit} className="mt-8">
              <div
                className={`relative mx-auto flex max-w-md flex-col gap-3 rounded-2xl bg-white/20 p-2 backdrop-blur-sm transition-all duration-300 sm:flex-row ${isFocused ? 'bg-white/30 shadow-lg shadow-black/10' : ''
                  }`}
              >
                <div className="relative flex-1">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    disabled={isSubmitted}
                    className="h-12 border-0 bg-white/90 px-4 text-foreground placeholder:text-foreground/50 focus-visible:ring-2 focus-visible:ring-white/50 rounded-xl"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting || isSubmitted || !email}
                  className={`group h-12 rounded-xl px-6 font-semibold transition-all duration-300 ${isSubmitted
                    ? 'bg-green-500 hover:bg-green-500'
                    : 'bg-foreground hover:bg-foreground/90 hover:scale-105'
                    }`}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : isSubmitted ? (
                    <span className="flex items-center gap-2">
                      <Check className="h-5 w-5" />
                      완료!
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      시작하기
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  )}
                </Button>
              </div>
            </form>

            {/* Trust indicators */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-white/80">
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4" />
                무료 체험
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4" />
                신용카드 불필요
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4" />
                언제든지 해지 가능
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
