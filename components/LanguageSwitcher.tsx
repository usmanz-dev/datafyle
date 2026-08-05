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
  const [dropPos, setDropPos] = useState({ top: 0, right: 0 })
  const btnRef = useRef<HTMLButtonElement>(null)
  const dropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onPointer(e: MouseEvent) {
      if (
        dropRef.current && dropRef.current.contains(e.target as Node) ||
        btnRef.current && btnRef.current.contains(e.target as Node)
      ) return
      setOpen(false)
    }
    function onScroll() { setOpen(false) }
    document.addEventListener('mousedown', onPointer)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      document.removeEventListener('mousedown', onPointer)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  function handleToggle() {
    if (!open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect()
      setDropPos({ top: r.bottom + 8, right: window.innerWidth - r.right })
    }
    setOpen((o) => !o)
  }

  const isDark = variant === 'navbar-dark'
  const base = 'inline-flex items-center gap-1.5 rounded-full text-xs font-bold transition-all duration-200 select-none px-3 py-1.5 border'

  const btnCls = isDark
    ? `${base} border-white/30 text-white hover:border-white/60 hover:bg-white/10`
    : variant === 'dashboard'
    ? `${base} border-[#E2E8F0] text-slate-600 hover:border-[#2563EB]/50 hover:text-[#2563EB] bg-white shadow-sm`
    : `${base} border-[#E2E8F0] text-[#1E293B] hover:border-[#2563EB]/50 hover:text-[#2563EB] bg-white shadow-sm`

  return (
    <>
      <button
        ref={btnRef}
        onClick={handleToggle}
        className={btnCls}
        aria-label="Change language"
        aria-expanded={open}
      >
        <span className="text-sm leading-none">{LANGUAGES[lang].flag}</span>
        <span className="tracking-wider">{LANG_CODES[lang]}</span>
        <ChevronDown size={11} strokeWidth={2.5} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          ref={dropRef}
          className="fixed w-52 bg-white rounded-2xl border border-slate-200 py-1.5"
          style={{
            top: dropPos.top,
            right: dropPos.right,
            zIndex: 99999,
            boxShadow: '0 20px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.1)',
          }}
        >
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3.5 py-1.5 pb-1">
            Language
          </p>
          {(Object.entries(LANGUAGES) as [Language, { native: string; flag: string }][]).map(([code, info]) => {
            const active = lang === code
            return (
              <button
                key={code}
                onClick={() => { setLang(code); setOpen(false) }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-left transition-colors ${
                  active ? 'bg-[#EFF6FF]' : 'hover:bg-slate-50'
                }`}
              >
                <span className="text-lg leading-none w-6 text-center shrink-0">{info.flag}</span>
                <span className="flex-1 min-w-0">
                  <span className={`block text-sm font-semibold leading-tight ${active ? 'text-[#2563EB]' : 'text-[#1E293B]'}`}>
                    {info.native}
                  </span>
                  <span className="block text-[10px] text-slate-400 font-medium mt-0.5 uppercase tracking-wider">
                    {LANG_CODES[code]}
                  </span>
                </span>
                {active && <Check size={14} strokeWidth={3} className="text-[#2563EB] shrink-0" />}
              </button>
            )
          })}
        </div>
      )}
    </>
  )
}
