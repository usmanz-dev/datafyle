'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Globe } from 'lucide-react'
import { LANGUAGES, type Language } from '@/lib/i18n/translations'
import { useLanguage } from '@/lib/i18n/context'

interface Props {
  variant?: 'navbar-dark' | 'navbar-light' | 'dashboard'
}

export function LanguageSwitcher({ variant = 'navbar-light' }: Props) {
  const { lang, setLang } = useLanguage()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const isDark = variant === 'navbar-dark'
  const isDash = variant === 'dashboard'

  const btnClass = isDark
    ? 'text-white/80 hover:text-white hover:bg-white/10'
    : isDash
    ? 'text-slate-600 hover:text-[#2563EB] hover:bg-[#EFF6FF] border border-[#E2E8F0]'
    : 'text-[#1E293B] hover:text-[#2563EB] hover:bg-[#EFF6FF]'

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-all ${btnClass}`}
        aria-label="Change language"
      >
        <Globe size={14} className="shrink-0" />
        <span className="hidden sm:inline">{LANGUAGES[lang].flag}</span>
        <span className="hidden md:inline text-[13px]">{LANGUAGES[lang].native}</span>
        <ChevronDown size={12} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl border border-[#E2E8F0] shadow-lg z-[200] overflow-hidden py-1">
          {(Object.entries(LANGUAGES) as [Language, { native: string; flag: string }][]).map(([code, info]) => (
            <button
              key={code}
              onClick={() => { setLang(code); setOpen(false) }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors text-left ${
                lang === code
                  ? 'bg-[#EFF6FF] text-[#2563EB] font-semibold'
                  : 'text-[#1E293B] hover:bg-[#F8FAFC]'
              }`}
            >
              <span className="text-base">{info.flag}</span>
              <span>{info.native}</span>
              {lang === code && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#2563EB]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
