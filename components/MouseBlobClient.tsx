'use client'

import { useRef, useEffect } from 'react'

export function MouseBlobClient() {
  const blobRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (blobRef.current)
        blobRef.current.style.transform = `translate(${e.clientX - 260}px, ${e.clientY - 260}px)`
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div
      ref={blobRef}
      className="fixed top-0 left-0 pointer-events-none"
      style={{
        width: 520,
        height: 520,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(37,99,235,0.65) 0%, transparent 70%)',
        filter: 'blur(60px)',
        transform: 'translate(-260px,-260px)',
        willChange: 'transform',
        zIndex: 30,
        mixBlendMode: 'screen',
      }}
    />
  )
}
