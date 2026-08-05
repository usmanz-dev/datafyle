'use client'

import Link from 'next/link'
import { RotateCcw } from 'lucide-react'
import { PublicNav } from '@/components/PublicNav'
import { PublicFooter } from '@/components/PublicFooter'
import { MouseBlobClient } from '@/components/MouseBlobClient'
import { useLanguage } from '@/lib/i18n/context'
import { refundBody, type LegalLang } from '@/lib/i18n/legal'

function Section({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 sm:p-8">
      <div className="flex items-start gap-4 mb-5">
        <span className="shrink-0 w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#2563EB] text-sm font-bold flex items-center justify-center">{num}</span>
        <h2 className="text-lg font-bold text-[#1E293B] pt-1">{title}</h2>
      </div>
      <div className="pl-12">{children}</div>
    </div>
  )
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="text-slate-600 leading-relaxed text-sm">{children}</p>
}
function UL({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-sm text-slate-600">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#2563EB] shrink-0" />
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  )
}

export default function RefundClient() {
  const { t, lang } = useLanguage()
  const r = t.pages.refund
  const s = t.pages
  const b = refundBody[lang as LegalLang] ?? refundBody.en

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <MouseBlobClient />
      <PublicNav />
      <div className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
              <RotateCcw size={20} className="text-[#2563EB]" />
            </div>
            <span className="text-xs font-semibold text-[#2563EB] uppercase tracking-wider">{s.legal}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1E293B] mb-3">{r.title}</h1>
          <p className="text-slate-500 text-sm">{s.lastUpdated} July 2026</p>
          <p className="text-slate-600 mt-4 max-w-2xl leading-relaxed text-sm">{r.desc}</p>
        </div>
      </div>
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10">
        <div className="space-y-4">
          <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-6 flex items-start gap-4">
            <div className="w-10 h-10 bg-[#2563EB] rounded-xl flex items-center justify-center shrink-0">
              <RotateCcw size={18} className="text-white" />
            </div>
            <div>
              <p className="text-[#1E293B] font-bold text-base mb-1">{r.guarantee}</p>
              <p className="text-slate-600 text-sm leading-relaxed">{r.guaranteeNote}</p>
            </div>
          </div>
          <Section num="1" title={r.s1}>
            <div className="space-y-4">
              <P>{b.b1i}</P>
              <UL items={b.b1items} />
            </div>
          </Section>
          <Section num="2" title={r.s2}>
            <P>{b.b2}</P>
          </Section>
          <Section num="3" title={r.s3}>
            <div className="space-y-4">
              <UL items={b.b3items} />
            </div>
          </Section>
          <Section num="4" title={r.s4}>
            <P>{b.b4}</P>
          </Section>
          <Section num="5" title={r.s5}>
            <div className="space-y-4">
              <P>{b.b5i}</P>
              <UL items={b.b5items} />
              <div className="pt-2">
                <a
                  href="mailto:support@datafyle.com"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                  support@datafyle.com
                </a>
              </div>
              <P>{b.b5note}</P>
            </div>
          </Section>
          <Section num="6" title={r.s6}>
            <P>{b.b6}</P>
          </Section>
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 sm:p-8">
            <h2 className="text-base font-bold text-[#1E293B] mb-2">{r.contactQ}</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              {b.bq.split('support@datafyle.com')[0]}
              <a href="mailto:support@datafyle.com" className="text-[#2563EB] font-medium hover:underline">support@datafyle.com</a>
              {b.bq.split('support@datafyle.com')[1]?.split('/contact')[0]}
              <Link href="/contact" className="text-[#2563EB] font-medium hover:underline">{lang === 'ja' ? 'お問い合わせページ' : lang === 'zh' ? '联系页面' : lang === 'de' ? 'Kontaktseite' : lang === 'fr' ? 'page Contact' : lang === 'es' ? 'página de Contacto' : lang === 'pt' ? 'página de Contato' : lang === 'it' ? 'pagina Contatti' : 'Contact page'}</Link>
              {b.bq.split('/contact')[1] ?? ''}
            </p>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  )
}
