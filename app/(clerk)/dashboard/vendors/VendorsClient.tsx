'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, TrendingUp, AlertTriangle, ChevronRight, BarChart3 } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface VendorPattern {
  id: string
  vendorName: string
  avgAmount: number | null
  invoiceCount: number
  lastSeen: string | Date
}

interface Props {
  vendors: VendorPattern[]
}

interface VendorDetail {
  chartData: { date: string; amount: number }[]
  anomaliesCount: number
  docs: { id: string; fileName: string; createdAt: string }[]
}

export function VendorsClient({ vendors }: Props) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<VendorPattern | null>(null)
  const [detail, setDetail] = useState<VendorDetail | null>(null)
  const [loading, setLoading] = useState(false)

  const filtered = vendors.filter((v) =>
    v.vendorName.toLowerCase().includes(search.toLowerCase())
  )

  async function openVendor(vendor: VendorPattern) {
    setSelected(vendor)
    setDetail(null)
    setLoading(true)
    try {
      const res = await fetch(`/api/vendors?name=${encodeURIComponent(vendor.vendorName)}`)
      const data = await res.json()
      setDetail(data)
    } catch {
      setDetail(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative">
      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search vendors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-[#E2E8F0] rounded-lg bg-white text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <th className="text-left px-4 py-3 font-medium text-[#1E293B]">Vendor Name</th>
              <th className="text-right px-4 py-3 font-medium text-[#1E293B]">Invoices</th>
              <th className="text-right px-4 py-3 font-medium text-[#1E293B]">Avg Amount</th>
              <th className="text-left px-4 py-3 font-medium text-[#1E293B]">Last Seen</th>
              <th className="text-left px-4 py-3 font-medium text-[#1E293B]">Trend</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-400 text-sm">
                  {search ? 'No vendors match your search' : 'No vendor data yet — process some documents first'}
                </td>
              </tr>
            ) : (
              filtered.map((vendor) => (
                <tr
                  key={vendor.id}
                  onClick={() => openVendor(vendor)}
                  className="border-b border-[#E2E8F0] last:border-0 hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-[#1E293B]">{vendor.vendorName}</td>
                  <td className="px-4 py-3 text-right text-[#1E293B]">{vendor.invoiceCount}</td>
                  <td className="px-4 py-3 text-right text-[#1E293B]">
                    {vendor.avgAmount != null ? `$${vendor.avgAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(vendor.lastSeen).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3">
                    {vendor.invoiceCount >= 3 ? (
                      <span className="inline-flex items-center gap-1 text-xs text-green-700">
                        <TrendingUp size={14} /> Consistent
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-yellow-600">
                        <AlertTriangle size={14} /> New
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <ChevronRight size={16} className="text-slate-400" />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Slide-out Panel */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 bg-black/30 z-40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-[#1E293B]">{selected.vendorName}</h2>
                    <p className="text-sm text-slate-500">{selected.invoiceCount} invoices processed</p>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="p-2 rounded-lg hover:bg-[#F8FAFC] transition-colors"
                  >
                    <X size={20} className="text-slate-500" />
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-[#F8FAFC] rounded-lg p-4 border border-[#E2E8F0]">
                    <p className="text-xs text-slate-500 mb-1">Average Amount</p>
                    <p className="text-lg font-bold text-[#1E293B]">
                      {selected.avgAmount != null ? `$${selected.avgAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : '—'}
                    </p>
                  </div>
                  <div className="bg-[#F8FAFC] rounded-lg p-4 border border-[#E2E8F0]">
                    <p className="text-xs text-slate-500 mb-1">Anomalies Detected</p>
                    <p className="text-lg font-bold text-[#1E293B]">
                      {loading ? '...' : detail?.anomaliesCount ?? 0}
                    </p>
                  </div>
                </div>

                {/* Chart */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart3 size={16} className="text-[#2563EB]" />
                    <h3 className="text-sm font-semibold text-[#1E293B]">Amount Trend</h3>
                  </div>
                  {loading ? (
                    <div className="h-48 flex items-center justify-center bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                      <div className="w-6 h-6 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : detail?.chartData && detail.chartData.length > 0 ? (
                    <div className="h-48 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] p-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={detail.chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                          <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B' }} />
                          <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                          <Tooltip
                            contentStyle={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 12 }}
                          />
                          <Line type="monotone" dataKey="amount" stroke="#2563EB" strokeWidth={2} dot={{ fill: '#2563EB', r: 3 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-48 flex items-center justify-center bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                      <p className="text-sm text-slate-400">Not enough data for chart</p>
                    </div>
                  )}
                </div>

                {/* Recent Documents */}
                {detail?.docs && detail.docs.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-[#1E293B] mb-3">Recent Documents</h3>
                    <div className="space-y-2">
                      {detail.docs.slice(0, 10).map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between py-2 border-b border-[#E2E8F0] last:border-0">
                          <span className="text-sm text-[#1E293B] truncate max-w-[60%]">{doc.fileName}</span>
                          <span className="text-xs text-slate-400">
                            {new Date(doc.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
