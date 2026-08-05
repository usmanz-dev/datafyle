'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  X, Mail, Clock, MapPin, CheckCircle2,
  Loader2, Send, ChevronDown,
} from 'lucide-react'
import { PublicNav } from '@/components/PublicNav'
import { PublicFooter } from '@/components/PublicFooter'
import { useLanguage } from '@/lib/i18n/context'

// ─── Contact Form ─────────────────────────────────────────────────────────────
const TEAM_SIZES = ['1–5', '6–20', '21–50', '51–200', '200+']
type Stage = 'idle' | 'sending' | 'sent' | 'error'

function ContactForm() {
  const { t } = useLanguage()
  const c = t.pages.contact

  const INQUIRY_TYPES = [
    { value: 'general',     label: c.iGeneral  },
    { value: 'sales',       label: c.iSales    },
    { value: 'technical',   label: c.iTech     },
    { value: 'enterprise',  label: c.iEnterprise },
    { value: 'partnership', label: c.iPartner  },
  ]

  const [form, setForm] = useState({
    name: '', email: '', company: '', phone: '',
    teamSize: '', inquiryType: 'general', message: '',
  })
  const [stage, setStage] = useState<Stage>('idle')
  const [errMsg, setErrMsg] = useState('')

  function set(field: string, val: string) {
    setForm(prev => ({ ...prev, [field]: val }))
  }

  async function submit(e: { preventDefault(): void }) {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setStage('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setErrMsg(data.error ?? 'Something went wrong.'); setStage('error'); return }
      setStage('sent')
    } catch {
      setErrMsg(c.networkErr)
      setStage('error')
    }
  }

  if (stage === 'sent') {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
        className="flex flex-col items-center justify-center gap-5 py-16 text-center">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center border-4 border-green-100">
          <CheckCircle2 size={36} className="text-green-500" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-[#1E293B] mb-2">{c.successTitle}</h3>
          <p className="text-slate-500 max-w-sm">{c.successDesc}</p>
        </div>
        <button onClick={() => { setForm({ name:'',email:'',company:'',phone:'',teamSize:'',inquiryType:'general',message:'' }); setStage('idle') }}
          className="mt-2 px-6 py-2.5 bg-[#2563EB] text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors">
          {c.sendAnother}
        </button>
      </motion.div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">{c.nameL} <span className="text-red-400">*</span></label>
          <input type="text" required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Jane Smith"
            className="w-full px-4 py-3 text-sm bg-white border border-[#E2E8F0] rounded-xl text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] transition-all min-h-[48px]" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">{c.emailL} <span className="text-red-400">*</span></label>
          <input type="email" required value={form.email} onChange={e => set('email', e.target.value)} placeholder="jane@company.com"
            className="w-full px-4 py-3 text-sm bg-white border border-[#E2E8F0] rounded-xl text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] transition-all min-h-[48px]" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">{c.companyL}</label>
          <input type="text" value={form.company} onChange={e => set('company', e.target.value)} placeholder="Smith & Co Accountants"
            className="w-full px-4 py-3 text-sm bg-white border border-[#E2E8F0] rounded-xl text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] transition-all min-h-[48px]" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">{c.phoneL} <span className="text-slate-400 font-normal">({c.optional})</span></label>
          <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+1 (555) 000-0000"
            className="w-full px-4 py-3 text-sm bg-white border border-[#E2E8F0] rounded-xl text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] transition-all min-h-[48px]" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">{c.teamL}</label>
          <div className="relative">
            <select value={form.teamSize} onChange={e => set('teamSize', e.target.value)}
              className="w-full px-4 py-3 text-sm bg-white border border-[#E2E8F0] rounded-xl text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] transition-all min-h-[48px] appearance-none cursor-pointer pr-10">
              <option value="">{c.teamPH}</option>
              {TEAM_SIZES.map(s => <option key={s} value={s}>{s} {c.people}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">{c.inquiryL} <span className="text-red-400">*</span></label>
          <div className="relative">
            <select required value={form.inquiryType} onChange={e => set('inquiryType', e.target.value)}
              className="w-full px-4 py-3 text-sm bg-white border border-[#E2E8F0] rounded-xl text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] transition-all min-h-[48px] appearance-none cursor-pointer pr-10">
              {INQUIRY_TYPES.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">{c.msgL} <span className="text-red-400">*</span></label>
        <textarea required value={form.message} onChange={e => set('message', e.target.value)} rows={5}
          placeholder={c.msgPH}
          className="w-full px-4 py-3 text-sm bg-white border border-[#E2E8F0] rounded-xl text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] transition-all resize-none" />
        <p className="text-right text-[11px] text-slate-300 mt-1">{form.message.length}/3000</p>
      </div>

      {stage === 'error' && (
        <div className="flex items-start gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
          <X size={15} className="text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{errMsg}</p>
        </div>
      )}

      <button type="submit" disabled={stage === 'sending' || !form.name || !form.email || !form.message}
        className="w-full inline-flex items-center justify-center gap-2 py-4 bg-[#2563EB] text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all shadow-sm hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 min-h-[52px]">
        {stage === 'sending'
          ? <><Loader2 size={16} className="animate-spin" /> {c.sending}</>
          : <><Send size={15} /> {c.send}</>}
      </button>
      <p className="text-center text-xs text-slate-400">{c.responseNote}</p>
    </form>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ContactClient() {
  const { t } = useLanguage()
  const c = t.pages.contact

  const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }
  const blobRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (blobRef.current) {
        blobRef.current.style.transform = `translate(${e.clientX - 260}px, ${e.clientY - 260}px)`
      }
    }
    window.addEventListener('mousemove', handler, { passive: true })
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <div
        ref={blobRef}
        className="fixed top-0 left-0 pointer-events-none"
        style={{
          width: 520, height: 520, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.65) 0%, transparent 70%)',
          filter: 'blur(60px)',
          transform: 'translate(-260px,-260px)',
          willChange: 'transform',
          zIndex: 30,
          mixBlendMode: 'screen',
        }}
      />

      <PublicNav />

      {/* Hero */}
      <section className="relative pt-16 pb-20 px-4 bg-[#0F172A] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(37,99,235,0.30) 0%, transparent 70%)' }} />

        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.5 }}
          className="relative z-10 max-w-2xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-blue-300 border border-white/10 mb-6">
            <Mail size={12} /> {c.badge}
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-5">
            {c.heroTitle}
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">{c.heroSub}</p>
        </motion.div>
      </section>

      {/* Contact section */}
      <section className="py-20 px-4 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">

            {/* Left — info */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5 }}
              className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-[#1E293B] mb-4 leading-tight">{c.leftHeading}</h2>
                <p className="text-slate-500 text-base leading-relaxed">{c.firmDesc}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <Clock size={18} className="text-[#2563EB]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1E293B]">{c.card1}</p>
                    <p className="text-sm text-slate-500 mt-0.5">{c.card1d}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <Mail size={18} className="text-[#2563EB]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1E293B]">{c.card2}</p>
                    <p className="text-sm text-slate-500 mt-0.5">{c.card2d} <a href="mailto:hello@datafyle.com" className="text-[#2563EB] hover:underline">hello@datafyle.com</a></p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-[#2563EB]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1E293B]">{c.card3}</p>
                    <p className="text-sm text-slate-500 mt-0.5">{c.card3d}</p>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-[#EFF6FF] border border-blue-100 rounded-2xl">
                <p className="text-xs font-bold text-[#2563EB] uppercase tracking-wide mb-3">{c.trustedTitle}</p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  {[
                    { num: '50+',   label: 'Accounting Firms',     sub: 'actively using Datafyle'              },
                    { num: '12K+',  label: 'Documents Processed',  sub: 'invoices, receipts & more'            },
                    { num: '4.9★',  label: 'Average Rating',       sub: 'across Capterra, G2 & Trustpilot'    },
                    { num: '99.7%', label: 'Platform Uptime',      sub: 'SLA-backed reliability'               },
                  ].map(({ num, label, sub }) => (
                    <div key={label} className="py-1">
                      <p className="text-xl font-black text-[#1E293B]">{num}</p>
                      <p className="text-[11px] font-semibold text-slate-600 mt-0.5">{label}</p>
                      <p className="text-[10px] text-slate-400">{sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right — form */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-3 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-8">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-[#1E293B]">{c.formTitle}</h3>
                <p className="text-sm text-slate-500 mt-1">{c.formSub}</p>
              </div>
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
