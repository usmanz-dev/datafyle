'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, Home, LayoutDashboard } from 'lucide-react'
import { LazyMotion, domAnimation, m } from 'framer-motion'

export default function NotFound() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const blobRef   = useRef<HTMLDivElement>(null)
  const mouseRef  = useRef({ x: -9999, y: -9999 })
  const animRef   = useRef<number | undefined>(undefined)
  const rectRef   = useRef<DOMRect | null>(null)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      rectRef.current = canvas.getBoundingClientRect()
    }
    resize()

    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
      if (blobRef.current)
        blobRef.current.style.transform = `translate(${e.clientX - 260}px, ${e.clientY - 260}px)`
    }

    const draw = () => {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)
      const rect = rectRef.current
      const mx = rect ? mouseRef.current.x - rect.left  : -9999
      const my = rect ? mouseRef.current.y - rect.top   : -9999
      const spacing = 28
      for (let cx = spacing / 2; cx < w; cx += spacing) {
        for (let cy = spacing / 2; cy < h; cy += spacing) {
          const dist = Math.hypot(cx - mx, cy - my)
          const lit  = Math.max(0, 1 - dist / 100)
          ctx.beginPath()
          ctx.arc(cx, cy, 1 + lit * 2, 0, Math.PI * 2)
          ctx.fillStyle = lit > 0.05
            ? `rgba(59,130,246,${0.12 + lit * 0.6})`
            : `rgba(255,255,255,0.07)`
          ctx.fill()
        }
      }
      animRef.current = requestAnimationFrame(draw)
    }
    draw()

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('resize', resize,  { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', resize)
      if (animRef.current !== undefined) cancelAnimationFrame(animRef.current)
    }
  }, [])

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">

        {/* Blue radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(37,99,235,0.45) 0%, rgba(37,99,235,0.12) 55%, transparent 78%)',
          }}
        />

        {/* Interactive dot-grid canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

        {/* Mouse-tracking blue blob */}
        <div
          ref={blobRef}
          className="fixed top-0 left-0 pointer-events-none"
          style={{
            width: 520, height: 520, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(37,99,235,0.65) 0%, transparent 70%)',
            filter: 'blur(60px)',
            transform: 'translate(-9999px, -9999px)',
            mixBlendMode: 'screen',
          }}
        />

        {/* Floating blue orb (mobile / ambient) */}
        <m.div
          animate={{ y: [0, -18, 0], opacity: [0.3, 0.55, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(37,99,235,0.3) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />

        {/* Content */}
        <div className="relative z-10 text-center max-w-lg mx-auto">

          {/* 404 */}
          <m.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <span
              className="text-[9rem] sm:text-[12rem] font-black leading-none select-none"
              style={{
                background: 'linear-gradient(135deg, #93c5fd 0%, #3b82f6 40%, #2563EB 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              404
            </span>
          </m.div>

          {/* Divider */}
          <m.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent mb-8"
          />

          {/* Text */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Page not found
            </h1>
            <p className="text-slate-400 text-base leading-relaxed mb-10">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
              <br className="hidden sm:block" />
              Let&apos;s get you back on track.
            </p>
          </m.div>

          {/* Buttons */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#2563EB] text-white font-bold rounded-xl min-h-[52px] w-full sm:w-auto transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_32px_rgba(37,99,235,0.6)] hover:bg-blue-600"
            >
              <Home size={17} />
              Go Home
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-slate-300 hover:text-white font-medium rounded-xl border border-white/10 hover:border-white/25 min-h-[52px] w-full sm:w-auto transition-all duration-300 hover:bg-white/5"
            >
              <LayoutDashboard size={17} />
              Dashboard
              <ArrowRight size={15} />
            </Link>
          </m.div>

          {/* Footer note */}
          <m.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75, duration: 0.5 }}
            className="mt-10 text-xs text-slate-600"
          >
            datafyle.com — AI Document Processing
          </m.p>
        </div>
      </div>
    </LazyMotion>
  )
}
