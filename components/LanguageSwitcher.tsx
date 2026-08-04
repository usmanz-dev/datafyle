'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { LANGUAGES, type Language } from '@/lib/i18n/translations'
import { useLanguage } from '@/lib/i18n/context'

const LANG_CODES: Record<Language, string> = {
  en: 'EN', es: 'ES', fr: 'FR', de: 'DE',
  zh: 'ZH', ja: 'JA', pt: 'PT', it: 'IT',
}

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

  const btnBase = 'inline-flex items-center gap-1.5 rounded-full text-xs font-bold transition-all duration-200 select-none'

  const btnStyle = isDark
    ? `${btnBase} px-3 py-1.5 border border-white/20 text-white/90 hover:border-white/50 hover:bg-white/10`
    : variant === 'dashboard'
    ? `${btnBase} px-3 py-1.5 border border-[#E2E8F0] text-slate-600 hover:border-[#2563EB]/50 hover:text-[#2563EB] bg-white shadow-sm`
    : `${btnBase} px-3 py-1.5 border border-[#E2E8F0] text-[#1E293B] hover:border-[#2563EB]/50 hover:text-[#2563EB] bg-white/80 shadow-sm`

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={btnStyle}
        aria-label="Change language"
        aria-expanded={open}
      >
        <span className="text-sm leading-none">{LANGUAGES[lang].flag}</span>
        <span className="tracking-wider">{LANG_CODES[lang]}</span>
        <ChevronDown
          size={11}
          strokeWidth={2.5}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-[#E2E8F0] shadow-xl z-[200] overflow-hidden py-1.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3.5 py-1.5 pb-1">
            Language / Sprache
          </p>
          {(Object.entries(LANGUAGES) as [Language, { native: string; flag: string }][]).map(([code, info]) => {
            const isActive = lang === code
            return (
              <button
                key={code}
                onClick={() => { setLang(code); setOpen(false) }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-left transition-colors ${
                  isActive
                    ? 'bg-[#EFF6FF] text-[#2563EB]'
                    : 'text-[#1E293B] hover:bg-[#F8FAFC]'
                }`}
              >
                <span className="text-lg leading-none w-6 shrink-0">{info.flag}</span>
                <span className="flex-1 min-w-0">
                  <span className={`block text-sm font-semibold leading-tight ${isActive ? 'text-[#2563EB]' : 'text-[#1E293B]'}`}>
                    {info.native}
                  </span>
                  <span className="block text-[10px] text-slate-400 font-medium mt-0.5">
                    {LANG_CODES[code]}
                  </span>
                </span>
                {isActive && (
                  <span className="shrink-0">
                    <Check size={14} strokeWidth={3} className="text-[#2563EB]" />
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
