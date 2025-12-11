'use client'

import { Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Input } from '@/components/ui/input'

interface HeaderProps {
  title: string
  subtitle?: string
}

export function Header({ title, subtitle }: HeaderProps) {
  const t = useTranslations('studio.header')

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <Input placeholder={t('search')} className="pl-10 w-64 bg-slate-50 border-slate-200" />
      </div>
    </header>
  )
}
