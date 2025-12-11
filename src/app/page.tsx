import Link from 'next/link'
import { ArrowRight, Users, Sparkles, BarChart3, Store } from 'lucide-react'
import { getTranslations, getLocale } from 'next-intl/server'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/shared/logo'
import { LanguageSwitcher } from '@/components/shared/language-switcher'
import type { Locale } from '@/i18n/config'

export default async function HomePage() {
  const t = await getTranslations('home')
  const tCommon = await getTranslations('common')
  const locale = (await getLocale()) as Locale

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="fixed top-0 w-full h-16 bg-white/80 backdrop-blur-md z-50 border-b border-slate-200 flex items-center justify-between px-6 md:px-12">
        <Logo size="sm" />
        <div className="flex items-center gap-4">
          <LanguageSwitcher currentLocale={locale} />
          <Link href="/auth/login">
            <Button variant="ghost">{tCommon('login')}</Button>
          </Link>
          <Link href="/studio">
            <Button variant="orange">{tCommon('studio')}</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="pt-32 pb-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <Logo size="lg" showText={false} className="justify-center mb-6" />
            <h1 className="text-6xl md:text-7xl font-black tracking-tight text-slate-900 mb-4">
              {t('title')}
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 font-medium">{t('subtitle')}</p>
          </div>

          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10">{t('description')}</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link href="/demo">
              <Button variant="orange" size="xl">
                {t('demo')} <ArrowRight size={20} />
              </Button>
            </Link>
            <Link href="/studio">
              <Button variant="outline" size="xl">
                {t('accessStudio')}
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-2 gap-6 text-left max-w-3xl mx-auto">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                <Users className="text-teal-600" size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">{t('features.qualification.title')}</h3>
              <p className="text-slate-500 text-sm">{t('features.qualification.description')}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="text-orange-600" size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">{t('features.prompts.title')}</h3>
              <p className="text-slate-500 text-sm">{t('features.prompts.description')}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4">
                <BarChart3 className="text-yellow-600" size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">{t('features.dashboard.title')}</h3>
              <p className="text-slate-500 text-sm">{t('features.dashboard.description')}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                <Store className="text-amber-600" size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">{t('features.showroom.title')}</h3>
              <p className="text-slate-500 text-sm">{t('features.showroom.description')}</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 px-6 text-center text-sm text-slate-500">
        <p>{t('footer')}</p>
      </footer>
    </div>
  )
}
