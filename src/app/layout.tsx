import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import { LocaleDetector } from '@/components/shared/locale-detector'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Archetype - Design Intelligence Profiler',
  description: 'Define your visual identity in 3 minutes.',
  openGraph: {
    title: 'Archetype - Design Intelligence Profiler',
    description: 'Define your visual identity in 3 minutes.',
    type: 'website',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <LocaleDetector />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
