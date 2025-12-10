'use client'

import { cn } from '@/lib/utils'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

const sizeMap = {
  sm: { circle: 'w-4 h-4', text: 'text-lg', spacing: '-space-x-2' },
  md: { circle: 'w-6 h-6', text: 'text-xl', spacing: '-space-x-2' },
  lg: { circle: 'w-16 h-16', text: 'text-6xl', spacing: '-space-x-4' },
}

export function Logo({ size = 'md', showText = true, className }: LogoProps) {
  const s = sizeMap[size]

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn('flex', s.spacing)}>
        <div
          className={cn(
            s.circle,
            'rounded-full bg-teal-500 ring-2 ring-white z-10'
          )}
        />
        <div
          className={cn(
            s.circle,
            'rounded-full bg-orange-500 ring-2 ring-white z-20',
            size === 'lg' ? '-mt-2' : '-mt-1'
          )}
        />
        <div
          className={cn(
            s.circle,
            'rounded-full bg-yellow-400 ring-2 ring-white z-10'
          )}
        />
      </div>
      {showText && (
        <span
          className={cn(
            'font-black tracking-tight text-slate-900',
            s.text
          )}
        >
          archetype
        </span>
      )}
    </div>
  )
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <div className={cn('flex -space-x-2', className)}>
      <div className="w-3 h-3 rounded-full bg-teal-500" />
      <div className="w-3 h-3 rounded-full bg-orange-500" />
      <div className="w-3 h-3 rounded-full bg-yellow-400" />
    </div>
  )
}
