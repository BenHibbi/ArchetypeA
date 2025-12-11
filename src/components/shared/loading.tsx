'use client'

import { cn } from '@/lib/utils'

interface LoadingProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Loading({ className, size = 'md' }: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-slate-200 border-t-teal-500',
          sizeClasses[size]
        )}
      />
    </div>
  )
}

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="flex -space-x-2">
          <div
            className="w-6 h-6 rounded-full bg-teal-500 animate-bounce"
            style={{ animationDelay: '0ms' }}
          />
          <div
            className="w-6 h-6 rounded-full bg-orange-500 animate-bounce"
            style={{ animationDelay: '150ms' }}
          />
          <div
            className="w-6 h-6 rounded-full bg-yellow-400 animate-bounce"
            style={{ animationDelay: '300ms' }}
          />
        </div>
        <p className="text-sm text-slate-500">Chargement...</p>
      </div>
    </div>
  )
}
