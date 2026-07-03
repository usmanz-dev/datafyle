export default function DashboardLoading() {
  return (
    <div className="flex-1 bg-[#F8FAFC] p-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="h-6 w-40 bg-slate-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-28 bg-slate-100 rounded animate-pulse" />
        </div>
        <div className="h-10 w-32 bg-slate-200 rounded-lg animate-pulse" />
      </div>

      {/* Usage bar skeleton */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-5 mb-6">
        <div className="flex justify-between mb-3">
          <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
          <div className="h-4 w-20 bg-slate-100 rounded animate-pulse" />
        </div>
        <div className="h-3 w-full bg-slate-100 rounded-full">
          <div className="h-3 w-1/4 bg-[#2563EB]/30 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Stats row skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Array(4).fill(null).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-5">
            <div className="h-3 w-16 bg-slate-100 rounded animate-pulse mb-3" />
            <div className="h-7 w-12 bg-slate-200 rounded animate-pulse mb-1" />
            <div className="h-3 w-20 bg-slate-100 rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Action buttons skeleton */}
      <div className="flex gap-3 mb-6">
        {Array(3).fill(null).map((_, i) => (
          <div key={i} className="h-10 w-28 bg-slate-200 rounded-lg animate-pulse" />
        ))}
      </div>

      {/* Documents table skeleton */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#E2E8F0]">
          <div className="h-5 w-32 bg-slate-200 rounded animate-pulse" />
        </div>
        {Array(5).fill(null).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 border-b border-[#E2E8F0] last:border-0">
            <div className="h-8 w-8 bg-slate-100 rounded animate-pulse shrink-0" />
            <div className="flex-1">
              <div className="h-4 w-48 bg-slate-200 rounded animate-pulse mb-1.5" />
              <div className="h-3 w-24 bg-slate-100 rounded animate-pulse" />
            </div>
            <div className="h-6 w-16 bg-slate-100 rounded-full animate-pulse" />
            <div className="h-4 w-8 bg-slate-100 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}
