'use client'

import { Image as ImageIcon } from 'lucide-react'

interface VizRatioProps {
  type: string
}

export function VizRatio({ type }: VizRatioProps) {
  return (
    <div className="w-full h-32 flex flex-col rounded overflow-hidden border border-slate-200 pointer-events-none bg-white">
      {type === 'img' && (
        <>
          <div className="flex-1 bg-teal-50 flex items-center justify-center">
            <ImageIcon className="text-teal-300" size={32} />
          </div>
          <div className="h-2 bg-slate-100 w-full" />
        </>
      )}
      {type === 'mix' && (
        <>
          <div className="h-1/2 bg-teal-50 border-b border-teal-100 flex items-center justify-center">
            <ImageIcon className="text-teal-300" size={24} />
          </div>
          <div className="h-1/2 bg-slate-50 p-2 flex flex-col gap-2 justify-center">
            <div className="h-1.5 bg-slate-200 w-full rounded" />
            <div className="h-1.5 bg-slate-200 w-2/3 rounded" />
          </div>
        </>
      )}
      {type === 'txt' && (
        <div className="w-full h-full bg-slate-50 p-3 flex flex-col gap-3 justify-center">
          <div className="h-2 bg-slate-800 w-1/3 rounded" />
          <div className="space-y-1.5">
            <div className="h-1.5 bg-slate-300 w-full rounded" />
            <div className="h-1.5 bg-slate-300 w-full rounded" />
            <div className="h-1.5 bg-slate-300 w-full rounded" />
            <div className="h-1.5 bg-slate-300 w-5/6 rounded" />
          </div>
        </div>
      )}
    </div>
  )
}
