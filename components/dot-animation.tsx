"use client"

import React, { useEffect, useRef } from "react"

export function DotAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    class Particle {
      x: number
      y: number
      vx: number
      vy: number
      size: number
      color: string

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.vx = (Math.random() - 0.5) * 0.5
        this.vy = (Math.random() - 0.5) * 0.5
        this.size = Math.random() * 2 + 1
        
        // Determine theme colors dynamically
        const isTeacher = document.documentElement.classList.contains("teacher-theme")
        const colors = isTeacher 
          ? ["rgba(16, 185, 129, 0.4)", "rgba(5, 150, 105, 0.4)", "rgba(4, 120, 87, 0.4)"] // Green
          : ["rgba(249, 116, 22, 0.4)", "rgba(245, 159, 11, 0.4)", "rgba(234, 178, 8, 0.4)"] // Orange
          
        this.color = colors[Math.floor(Math.random() * colors.length)]
      }

      update() {
        this.x += this.vx
        this.y += this.vy

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1
      }

      draw() {
        if (!ctx) return
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
      }
    }
    let particles: Particle[] = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      init()
    }



    const init = () => {
      particles = []
      const numberOfParticles = Math.floor((canvas.width * canvas.height) / 8000)
      for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle())
      }
    }

    const connect = () => {
      const maxDistance = 150
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x
          const dy = particles[a].y - particles[b].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < maxDistance) {
            const opacity = 1 - distance / maxDistance
            const isTeacher = document.documentElement.classList.contains("teacher-theme")
            const color = isTeacher ? "16, 185, 129" : "251, 146, 60"
            ctx.strokeStyle = `rgba(${color}, ${opacity * 0.2})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particles[a].x, particles[a].y)
            ctx.lineTo(particles[b].x, particles[b].y)
            ctx.stroke()
          }
        }
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        particle.update()
        particle.draw()
      })

      connect()
      animationFrameId = requestAnimationFrame(animate)
    }

    resize()
    animate()

    window.addEventListener("resize", resize)

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-90"
    />
  )
}
