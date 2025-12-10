'use client'

interface VizAmbianceProps {
  type: string
}

export function VizAmbiance({ type }: VizAmbianceProps) {
  return (
    <div className="w-full h-24 bg-slate-50 border border-slate-100 rounded-lg overflow-hidden relative pointer-events-none mb-3">
      {type === 'minimal' && (
        <div className="flex flex-col items-center justify-center h-full gap-2">
          <div className="w-16 h-1 bg-slate-900 rounded-full" />
          <div className="w-8 h-1 bg-slate-300 rounded-full" />
        </div>
      )}
      {type === 'bold' && (
        <div className="h-full bg-slate-900 flex items-center justify-center">
          <span className="text-4xl font-black text-white tracking-tighter">Aa</span>
        </div>
      )}
      {type === 'corporate' && (
        <div className="h-full flex flex-col">
          <div className="h-1/3 bg-blue-100 w-full" />
          <div className="p-2 flex gap-1">
            <div className="w-1/3 h-8 bg-slate-200 rounded-sm" />
            <div className="w-2/3 h-8 bg-slate-200 rounded-sm" />
          </div>
        </div>
      )}
      {type === 'soft' && (
        <div className="h-full flex items-center justify-center gap-2 bg-orange-50">
          <div className="w-8 h-8 rounded-full bg-orange-200" />
          <div className="w-12 h-4 rounded-full bg-orange-200" />
        </div>
      )}
      {type === 'futuristic' && (
        <div className="h-full bg-slate-900 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-purple-500/20" />
          <div className="w-full h-[1px] bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,1)]" />
        </div>
      )}
      {type === 'editorial' && (
        <div className="h-full p-3 flex flex-col justify-between font-serif">
          <span className="text-3xl italic text-slate-900 leading-none">A.</span>
          <div className="w-full h-[1px] bg-slate-300" />
        </div>
      )}
    </div>
  )
}
