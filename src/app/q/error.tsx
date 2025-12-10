'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Logo } from '@/components/shared'

export default function QuestionnaireError({
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <Logo className="mb-8 text-white" />
      <div className="max-w-md w-full bg-white/10 backdrop-blur rounded-2xl p-8 text-center">
        <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-red-500/20 flex items-center justify-center">
          <AlertTriangle className="w-7 h-7 text-red-400" />
        </div>
        <h1 className="text-xl font-bold text-white mb-2">
          {t('questionnaireTitle')}
        </h1>
        <p className="text-slate-300 text-sm mb-6">
          {t('questionnaireDescription')}
        </p>
        <Button
          onClick={reset}
          className="gap-2 bg-teal-500 hover:bg-teal-600"
        >
          <RefreshCw size={16} />
          {t('retry')}
        </Button>
      </div>
    </div>
  )
}
