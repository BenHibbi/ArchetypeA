'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

export default function StudioError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('error')

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to error tracking service
    }
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-red-100 flex items-center justify-center">
          <AlertTriangle className="w-7 h-7 text-red-600" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">
          {t('studioTitle')}
        </h1>
        <p className="text-slate-500 text-sm mb-6">
          {t('studioDescription')}
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={reset} className="gap-2">
            <RefreshCw size={16} />
            {t('retry')}
          </Button>
          <Link href="/studio">
            <Button className="gap-2">
              <Home size={16} />
              {t('backToStudio')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
