'use client'

import { useState } from 'react'
import {
  X, HelpCircle, Send, CheckCircle2, Loader2,
  AlertCircle, Clock, Zap, Shield, Star,
} from 'lucide-react'

const CATEGORIES = [
  { value: 'technical', label: 'Technical Issue',   desc: 'Bug, error, or something not working'  },
  { value: 'billing',   label: 'Billing Question',  desc: 'Payments, invoices, plan changes'       },
  { value: 'feature',   label: 'Feature Request',   desc: 'Suggest something new'                  },
  { value: 'account',   label: 'Account Help',      desc: 'Login, team, settings, data'            },
  { value: 'other',     label: 'Other',             desc: 'Anything else'                          },
]

const PLAN_SLA = {
  free:         { label: 'Standard Support',    response: '5 business days', Icon: HelpCircle, color: 'text-slate-500',   bg: 'bg-slate-50',   border: 'border-slate-200'   },
  starter:      { label: 'Email Support',       response: '3 business days', Icon: HelpCircle, color: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-200'    },
  professional: { label: 'Priority Support',    response: '24 hours',        Icon: Zap,        color: 'text-violet-600',  bg: 'bg-violet-50',  border: 'border-violet-200'  },
  business:     { label: 'Priority Support',    response: '4 hours',         Icon: Shield,     color: 'text-purple-600',  bg: 'bg-purple-50',  border: 'border-purple-200'  },
  enterprise:   { label: 'Dedicated Support',   response: '1 hour',          Icon: Star,       color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
}

interface Props {
  isOpen: boolean
  onClose: () => void
  plan: string
  email: string
}

type Stage = 'form' | 'sending' | 'sent' | 'error'

export function SupportModal({ isOpen, onClose, plan, email }: Props) {
  const [category, setCategory] = useState('technical')
  const [subject,  setSubject]  = useState('')
  const [message,  setMessage]  = useState('')
  const [stage,    setStage]    = useState<Stage>('form')
  const [errMsg,   setErrMsg]   = useState('')

  const sla = PLAN_SLA[plan as keyof typeof PLAN_SLA] ?? PLAN_SLA.free

  function reset() {
    setCategory('technical')
    setSubject('')
    setMessage('')
    setStage('form')
    setErrMsg('')
  }

  function handleClose() {
    onClose()
    // Reset after animation
    setTimeout(reset, 300)
  }

  async function submit() {
    if (!subject.trim() || !message.trim()) return
    setStage('sending')
    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, subject: subject.trim(), message: message.trim() }),
      })
      if (!res.ok) {
        const data = await res.json()
        setErrMsg(data.error ?? 'Something went wrong. Please try again.')
        setStage('error')
        return
      }
      setStage('sent')
    } catch {
      setErrMsg('Network error. Please check your connection and try again.')
      setStage('error')
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
        <div className="w-full sm:max-w-lg bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl pointer-events-auto overflow-hidden animate-in slide-in-from-bottom-4 duration-300">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                <HelpCircle size={18} className="text-[#2563EB]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#1E293B]">Help &amp; Support</p>
                <p className="text-xs text-slate-400">{email}</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* SLA badge */}
          <div className={`mx-6 mt-4 flex items-center gap-3 px-4 py-3 rounded-xl border ${sla.bg} ${sla.border}`}>
            <sla.Icon size={15} className={sla.color} />
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-bold ${sla.color}`}>{sla.label}</p>
              <p className="text-xs text-slate-500">Expected response: <span className="font-semibold">{sla.response}</span></p>
            </div>
            <Clock size={13} className="text-slate-300 shrink-0" />
          </div>

          {/* Body */}
          <div className="px-6 py-5">

            {/* ── Sent state ──────────────────────────────────────────────────── */}
            {stage === 'sent' && (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={28} className="text-green-500" />
                </div>
                <div>
                  <p className="font-bold text-[#1E293B] text-base">Message sent!</p>
                  <p className="text-sm text-slate-500 mt-1">
                    We&apos;ll reply to <span className="font-medium">{email}</span><br />within {sla.response}.
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="mt-2 px-6 py-2.5 bg-[#2563EB] text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Done
                </button>
              </div>
            )}

            {/* ── Error state ──────────────────────────────────────────────────── */}
            {stage === 'error' && (
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-red-700">Failed to send</p>
                    <p className="text-xs text-red-500 mt-0.5">{errMsg}</p>
                  </div>
                </div>
                <button
                  onClick={() => setStage('form')}
                  className="w-full py-2.5 bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Try again
                </button>
              </div>
            )}

            {/* ── Form ──────────────────────────────────────────────────────────── */}
            {(stage === 'form' || stage === 'sending') && (
              <div className="space-y-4">

                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2">Category</label>
                  <div className="grid grid-cols-1 gap-1.5">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setCategory(cat.value)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all ${
                          category === cat.value
                            ? 'border-[#2563EB] bg-[#EFF6FF]'
                            : 'border-[#E2E8F0] hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
                          category === cat.value ? 'border-[#2563EB]' : 'border-slate-300'
                        }`}>
                          {category === cat.value && (
                            <div className="w-2 h-2 rounded-full bg-[#2563EB]" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-sm font-medium leading-none ${category === cat.value ? 'text-[#2563EB]' : 'text-[#1E293B]'}`}>
                            {cat.label}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5 truncate">{cat.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Brief description of your issue…"
                    maxLength={150}
                    disabled={stage === 'sending'}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E2E8F0] rounded-xl text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] transition-all disabled:opacity-60"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your issue in detail. Include any error messages or steps to reproduce…"
                    rows={4}
                    maxLength={3000}
                    disabled={stage === 'sending'}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E2E8F0] rounded-xl text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] transition-all resize-none disabled:opacity-60"
                  />
                  <p className="text-right text-[11px] text-slate-300 mt-1">{message.length}/3000</p>
                </div>

                {/* Submit */}
                <button
                  onClick={submit}
                  disabled={!subject.trim() || !message.trim() || stage === 'sending'}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 bg-[#2563EB] text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  {stage === 'sending'
                    ? <><Loader2 size={15} className="animate-spin" /> Sending…</>
                    : <><Send size={14} /> Send Message</>}
                </button>

              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
