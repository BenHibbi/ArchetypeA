'use client'

import { Maximize } from 'lucide-react'

interface VizStructureProps {
  type: string
}

export function VizStructure({ type }: VizStructureProps) {
  return (
    <div className="w-full h-24 bg-slate-50 border border-slate-200 rounded flex flex-col gap-1 p-1 overflow-hidden pointer-events-none">
      {type === 'simple' && (
        <div className="w-full h-full bg-slate-200 rounded flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-slate-300" />
        </div>
      )}
      {type === 'standard' && (
        <>
          <div className="w-full h-1/2 bg-slate-200 rounded" />
          <div className="flex gap-1 h-1/2">
            <div className="flex-1 bg-slate-100 rounded" />
            <div className="flex-1 bg-slate-100 rounded" />
          </div>
        </>
      )}
      {type === 'rich' && (
        <div className="grid grid-cols-4 gap-1 h-full">
          <div className="col-span-1 bg-slate-200 rounded h-full" />
          <div className="col-span-3 flex flex-col gap-1">
            <div className="h-8 bg-slate-100 rounded" />
            <div className="flex-1 grid grid-cols-3 gap-1">
              <div className="bg-slate-50 border rounded" />
              <div className="bg-slate-50 border rounded" />
              <div className="bg-slate-50 border rounded" />
            </div>
          </div>
        </div>
      )}
      {type === 'fullscreen' && (
        <div className="w-full h-full bg-slate-800 rounded flex items-center justify-center">
          <Maximize size={16} className="text-white/50" />
        </div>
      )}
      {type === 'masonry' && (
        <div className="flex gap-1 h-full items-start">
          <div className="w-1/3 h-full bg-slate-200 rounded" />
          <div className="w-1/3 h-2/3 bg-slate-200 rounded" />
          <div className="w-1/3 h-4/5 bg-slate-200 rounded" />
        </div>
      )}
      {type === 'bento' && (
        <div className="grid grid-cols-3 grid-rows-2 gap-1 h-full p-1">
          <div className="col-span-2 row-span-2 bg-slate-200 rounded border border-slate-300" />
          <div className="bg-slate-100 rounded border border-slate-200" />
          <div className="bg-slate-100 rounded border border-slate-200" />
        </div>
      )}
    </div>
  )
}
