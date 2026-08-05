'use client'

import Link from 'next/link'
import { FileText, Mail } from 'lucide-react'
import { PublicNav } from '@/components/PublicNav'
import { PublicFooter } from '@/components/PublicFooter'
import { MouseBlobClient } from '@/components/MouseBlobClient'
import { useLanguage } from '@/lib/i18n/context'
import { termsBody, type LegalLang } from '@/lib/i18n/legal'

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

export default function TermsClient() {
  const { t, lang } = useLanguage()
  const tr = t.pages.terms
  const s = t.pages
  const b = termsBody[lang as LegalLang] ?? termsBody.en

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <MouseBlobClient />
      <PublicNav />
      <div className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
              <FileText size={20} className="text-[#2563EB]" />
            </div>
            <span className="text-xs font-semibold text-[#2563EB] uppercase tracking-wider">{s.legal}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1E293B] mb-3">{tr.title}</h1>
          <p className="text-slate-500 text-sm">{s.lastUpdated} January 2026</p>
          <p className="text-slate-600 mt-4 max-w-2xl leading-relaxed text-sm">{tr.desc}</p>
        </div>
      </div>
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10">
        <div className="space-y-4">
          <Section num="1" title={tr.s1}>
            <P>{b.b1}</P>
          </Section>
          <Section num="2" title={tr.s2}>
            <P>{b.b2}</P>
          </Section>
          <Section num="3" title={tr.s3}>
            <UL items={b.b3items} />
          </Section>
          <Section num="4" title={tr.s4}>
            <UL items={b.b4items} />
            <div className="mt-5 p-4 bg-amber-50 rounded-lg border border-amber-100">
              <p className="text-sm text-amber-800 font-medium">{b.b4note}</p>
            </div>
          </Section>
          <Section num="5" title={tr.s5}>
            <P>{b.b5i}</P>
            <div className="mt-4">
              <UL items={b.b5items} />
            </div>
          </Section>
          <Section num="6" title={tr.s6}>
            <P>{b.b6}</P>
          </Section>
          <Section num="7" title={tr.s7}>
            <P>{b.b7}</P>
          </Section>
          <Section num="8" title={tr.s8}>
            <P>{b.b8}{' '}<Link href="/privacy" className="text-[#2563EB] hover:underline font-medium">Privacy Policy</Link>.</P>
          </Section>
          <Section num="9" title={tr.s9}>
            <P>{b.b9}</P>
          </Section>
          <Section num="10" title={tr.s10}>
            <P>{b.b10}</P>
          </Section>
          <Section num="11" title={tr.s11}>
            <P>{b.b11}</P>
          </Section>
          <Section num="12" title={tr.s12}>
            <P>{b.b12}</P>
          </Section>
          <Section num="13" title={tr.s13}>
            <P>{b.b13}</P>
          </Section>
          <Section num="14" title={tr.s14}>
            <div className="flex items-start gap-3">
              <Mail size={18} className="text-[#2563EB] mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-slate-600">{b.b14}</p>
                <a href="mailto:legal@datafyle.com" className="text-sm text-[#2563EB] hover:underline font-medium mt-1 inline-block">legal@datafyle.com</a>
              </div>
            </div>
          </Section>
        </div>
      </main>
      <PublicFooter />
    </div>
  )
}
