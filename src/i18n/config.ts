export const locales = ['fr', 'en'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

// France -> FR, everything else -> EN
export const localeNames: Record<Locale, string> = {
  fr: 'Fran\u00e7ais',
  en: 'English',
}

// Flag emojis for each locale
export const localeFlags: Record<Locale, string> = {
  fr: '\ud83c\uddeb\ud83c\uddf7', // French flag
  en: '\ud83c\udde8\ud83c\udde6', // Canadian flag
}
