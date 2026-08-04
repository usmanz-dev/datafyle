'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { type Language, type T, LANGUAGES, translations } from './translations'

interface LanguageCtx {
  lang: Language
  setLang: (l: Language) => void
  t: T
}

const Ctx = createContext<LanguageCtx>({
  lang: 'en',
  setLang: () => {},
  t: translations.en,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('en')

  useEffect(() => {
    try {
      const stored = localStorage.getItem('datafyle_lang') as Language | null
      if (stored && stored in LANGUAGES) setLangState(stored)
    } catch {}
  }, [])

  function setLang(l: Language) {
    setLangState(l)
    try { localStorage.setItem('datafyle_lang', l) } catch {}
  }

  return (
    <Ctx.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </Ctx.Provider>
  )
}

export function useLanguage() {
  return useContext(Ctx)
}
