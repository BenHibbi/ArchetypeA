'use client'

import { Logo } from '@/components/shared/logo'

interface ProgressHeaderProps {
  step: number
  totalSteps?: number
}

export function ProgressHeader({ step, totalSteps = 8 }: ProgressHeaderProps) {
  const showProgress = step > 0 && step <= totalSteps

  return (
    <header className="fixed top-0 w-full h-16 bg-white/80 backdrop-blur-md z-50 border-b border-slate-200 flex items-center justify-between px-6 md:px-12">
      <Logo size="sm" />

      {showProgress && (
        <div className="flex gap-1">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-6 rounded-full transition-all duration-500 ${
                step > i ? 'bg-orange-500' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      )}
    </header>
  )
}
