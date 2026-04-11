"use client"

import { DotAnimation } from "@/components/dot-animation"

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-light)] via-[var(--brand-muted)] to-background/50 opacity-40" />

      {/* Animated blobs */}
      <div
        className="absolute top-[-20%] left-[-10%] h-[600px] w-[600px] rounded-full bg-[var(--brand-blob-1)] blur-3xl animate-blob"
      />
      <div
        className="absolute top-[20%] right-[-15%] h-[500px] w-[500px] rounded-full bg-[var(--brand-blob-2)] blur-3xl animate-blob-delay-1"
      />
      <div
        className="absolute bottom-[-10%] left-[30%] h-[550px] w-[550px] rounded-full bg-[var(--brand-blob-3)] blur-3xl animate-blob-delay-2"
      />

      {/* Dynamic Dot Animation */}
      <DotAnimation />

      {/* Radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-white/50" />
    </div>
  )
}
