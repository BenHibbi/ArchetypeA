'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { Locale } from '@/i18n/config'

export function LocaleDetector() {
  const router = useRouter()

  useEffect(() => {
    // Only detect once
    const hasDetected = document.cookie.includes('LOCALE_DETECTED=true')
    if (hasDetected) return

    // Check if user already has a preference
    if (document.cookie.includes('NEXT_LOCALE=')) return

    // Detect based on timezone or navigator language
    const detectLocale = () => {
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

        router.refresh()
      } catch {
        // Locale detection failed silently
      }
    }

    detectLocale()
  }, [router])

  return null
}
