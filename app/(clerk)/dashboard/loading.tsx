import Image from 'next/image'

export default function DashboardLoading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">

      <div className="flex flex-col items-center gap-8">
        <Image
          src="/images/datafyle-ai-invoice-data-extraction.png"
          alt="Datafyle"
          width={200}
          height={52}
          className="h-12 w-auto object-contain"
          priority
        />

        {/* Bouncing dots */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-bounce [animation-delay:0ms]" />
          <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-bounce [animation-delay:150ms]" />
          <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-bounce [animation-delay:300ms]" />
        </div>
      </div>

      {/* Sliding progress bar at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-100 overflow-hidden">
        <div
          className="h-full w-48 bg-[#2563EB] rounded-full"
          style={{ animation: 'slideBar 1.4s ease-in-out infinite' }}
        />
      </div>

      <style>{`
        @keyframes slideBar {
          0%   { transform: translateX(-200px); }
          100% { transform: translateX(100vw); }
        }
      `}</style>
    </div>
  )
}
