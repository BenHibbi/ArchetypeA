'use client'

import Image from 'next/image'
import { ThumbsUp } from 'lucide-react'
import { Inspiration } from '@/types'
import { cn } from '@/lib/utils'

interface InspirationCardProps {
  data: Inspiration
  isSelected: boolean
  onToggle: () => void
}

export function InspirationCard({ data, isSelected, onToggle }: InspirationCardProps) {
  return (
    <div
      onClick={onToggle}
      className={cn(
        'relative aspect-[4/3] rounded-xl border-2 transition-all cursor-pointer overflow-hidden group',
        isSelected
          ? 'border-teal-500 ring-2 ring-teal-200'
          : 'border-slate-100 bg-white hover:border-slate-300 hover:shadow-lg hover:-translate-y-1'
      )}
    >
      <div className="absolute top-2 right-2 z-10">
        {isSelected ? (
          <div className="bg-teal-500 text-white rounded-full p-1.5 shadow-sm animate-in zoom-in">
            <ThumbsUp size={14} />
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm text-slate-300 rounded-full p-1.5 group-hover:bg-white group-hover:text-slate-400 transition-colors">
            <ThumbsUp size={14} />
          </div>
        )}
      </div>

      <Image
        src={data.image}
        alt={data.label}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-300"
        sizes="(max-width: 768px) 50vw, 25vw"
      />

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-3 pt-8">
        <span className="text-xs font-bold tracking-wide text-white drop-shadow-md">
          {data.label}
        </span>
        <p className="text-[10px] text-white/80 mt-0.5 line-clamp-2">{data.concept}</p>
      </div>
    </div>
  )
}
