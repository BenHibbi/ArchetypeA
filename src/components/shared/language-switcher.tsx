'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { locales, localeFlags, type Locale } from '@/i18n/config'

interface LanguageSwitcherProps {
  currentLocale: Locale
}

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const switchLocale = (newLocale: Locale) => {
    // Set cookie
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`

    startTransition(() => {
      router.refresh()
    })
  }

  const otherLocale = currentLocale === 'fr' ? 'en' : 'fr'

  return (
    <button
      onClick={() => switchLocale(otherLocale)}
      disabled={isPending}
      className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-slate-100 transition-colors text-sm disabled:opacity-50"
      title={otherLocale === 'fr' ? 'Passer en Fran\u00e7ais' : 'Switch to English'}
    >
      <span className="text-lg">{localeFlags[otherLocale]}</span>
      <span className="hidden sm:inline text-slate-600 font-medium">
        {otherLocale.toUpperCase()}
      </span>
    </button>
  )
}

// Auto-detect locale based on user's country
export function useAutoDetectLocale() {
  const [detected, setDetected] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Only detect once
    const hasDetected = document.cookie.includes('LOCALE_DETECTED=true')
    if (hasDetected) return

    // Check if user already has a preference
    if (document.cookie.includes('NEXT_LOCALE=')) return

    // Detect based on timezone or navigator language
    const detectLocale = async () => {
      try {
        // Try to detect France via timezone
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
        const isFrance = timezone.includes('Paris') || timezone.includes('Europe/Paris')

        // Or check navigator language
        const browserLang = navigator.language.toLowerCase()
        const isFrenchBrowser = browserLang.startsWith('fr')

        const detectedLocale: Locale = (isFrance || isFrenchBrowser) ? 'fr' : 'en'

        // Set cookies
        document.cookie = `NEXT_LOCALE=${detectedLocale};path=/;max-age=31536000`
        document.cookie = `LOCALE_DETECTED=true;path=/;max-age=31536000`

        setDetected(true)
        router.refresh()
      } catch {
        // Locale detection failed silently
      }
    }

    detectLocale()
  }, [router])

  return detected
}
