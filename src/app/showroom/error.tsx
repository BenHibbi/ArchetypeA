'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Logo } from '@/components/shared'

export default function ShowroomError({
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 p-6">
      <Logo className="mb-8" />
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-amber-100 flex items-center justify-center">
          <AlertTriangle className="w-7 h-7 text-amber-600" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">{t('showroomTitle')}</h1>
        <p className="text-slate-500 text-sm mb-6">{t('showroomDescription')}</p>
        <Button onClick={reset} className="gap-2 bg-amber-500 hover:bg-amber-600">
          <RefreshCw size={16} />
          {t('retry')}
        </Button>
      </div>
    </div>
  )
}
