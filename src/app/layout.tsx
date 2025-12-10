import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Archetype - Design Intelligence Profiler',
  description: 'Définissez votre identité visuelle en 3 minutes.',
  openGraph: {
    title: 'Archetype - Design Intelligence Profiler',
    description: 'Définissez votre identité visuelle en 3 minutes.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
