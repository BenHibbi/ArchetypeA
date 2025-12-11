'use client'

import { ThumbsUp } from 'lucide-react'
import { Skeleton, SkeletonType } from '@/types'
import { cn } from '@/lib/utils'

interface SkeletonCardProps {
  data: Skeleton
  isSelected: boolean
  onToggle: () => void
}

function SkeletonArt({ type }: { type: SkeletonType }) {
  switch (type) {
    case 'hero':
      return (
        <div className="flex flex-col items-center justify-center h-full gap-2">
          <div className="w-12 h-2 bg-slate-800 rounded-full" />
          <div className="w-8 h-2 bg-slate-300 rounded-full" />
        </div>
      )
    case 'split':
      return (
        <div className="flex h-full">
          <div className="w-1/2 flex items-center justify-center px-1">
            <div className="w-full h-2 bg-slate-800 rounded-full" />
          </div>
          <div className="w-1/2 bg-slate-200 h-full" />
        </div>
      )
    case 'typo':
      return (
        <div className="p-2 h-full flex items-center">
          <div className="text-[8px] font-black leading-tight text-slate-900">
            BIG
            <br />
            TYPE
            <br />
            HERE
          </div>
        </div>
      )
    case 'grid':
      return (
        <div className="grid grid-cols-2 gap-1 h-full content-center p-1">
          <div className="bg-slate-200 aspect-square rounded-sm" />
          <div className="bg-slate-200 aspect-square rounded-sm" />
          <div className="bg-slate-200 aspect-square rounded-sm" />
          <div className="bg-slate-200 aspect-square rounded-sm" />
        </div>
      )
    case 'blocks':
      return (
        <div className="flex flex-col gap-1 p-1 h-full">
          <div className="h-1/3 bg-slate-800 rounded-sm" />
          <div className="h-1/3 bg-slate-300 rounded-sm" />
          <div className="h-1/3 bg-slate-200 rounded-sm" />
        </div>
      )
    case 'pricing':
      return (
        <div className="flex gap-1 h-full items-end p-1">
          <div className="w-1/3 h-1/2 bg-slate-200 rounded-t-sm" />
          <div className="w-1/3 h-3/4 bg-slate-800 rounded-t-sm" />
          <div className="w-1/3 h-1/2 bg-slate-200 rounded-t-sm" />
        </div>
      )
    case 'quote':
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="w-4 h-4 rounded-full bg-slate-300 mb-1" />
          <div className="w-10 h-1 bg-slate-200 rounded" />
        </div>
      )
    case 'footer':
      return (
        <div className="flex flex-col justify-end h-full">
          <div className="h-1/3 bg-slate-900 w-full p-1 flex gap-1">
            <div className="w-2 h-2 rounded-full bg-slate-600" />
          </div>
        </div>
      )
    case 'nav':
      return (
        <div className="flex flex-col h-full">
          <div className="h-4 border-b flex items-center justify-between px-1">
            <div className="w-4 h-1 bg-black" />
            <div className="w-2 h-1 bg-slate-300" />
          </div>
        </div>
      )
    case 'asym':
      return (
        <div className="relative h-full w-full overflow-hidden">
          <div className="absolute top-0 left-0 w-2/3 h-1/2 bg-slate-200" />
          <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-slate-800 opacity-20 z-10" />
        </div>
      )
    case 'full':
      return (
        <div className="w-full h-full bg-slate-800 flex items-center justify-center">
          <div className="w-full h-1 bg-white opacity-20" />
        </div>
      )
    case 'col':
      return (
        <div className="flex h-full gap-[1px]">
          <div className="flex-1 bg-slate-100" />
          <div className="flex-1 bg-slate-100" />
          <div className="flex-1 bg-slate-100" />
        </div>
      )
    default:
      return null
  }
}

export function SkeletonCard({ data, isSelected, onToggle }: SkeletonCardProps) {
  return (
    <div
      onClick={onToggle}
      className={cn(
        'relative aspect-square rounded-xl border-2 transition-all cursor-pointer overflow-hidden group',
        isSelected
          ? 'border-teal-500 bg-teal-50'
          : 'border-slate-100 bg-white hover:border-slate-300 hover:shadow-lg hover:-translate-y-1'
      )}
    >
      <div className="absolute top-2 right-2 z-10">
        {isSelected ? (
          <div className="bg-teal-500 text-white rounded-full p-1 shadow-sm animate-in zoom-in">
            <ThumbsUp size={12} />
          </div>
        ) : (
          <div className="bg-slate-100 text-slate-300 rounded-full p-1 group-hover:bg-white group-hover:text-slate-400 transition-colors">
            <ThumbsUp size={12} />
          </div>
        )}
      </div>

      <div className="w-full h-full p-4 opacity-80 group-hover:opacity-100 transition-opacity">
        <div className="w-full h-full border border-dashed border-slate-200 rounded flex flex-col overflow-hidden bg-slate-50/50">
          <SkeletonArt type={data.type} />
        </div>
      </div>

      <div className="absolute bottom-2 left-0 w-full text-center">
        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 group-hover:text-slate-600">
          {data.label}
        </span>
      </div>
    </div>
  )
}
