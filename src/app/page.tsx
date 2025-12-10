import Link from 'next/link'
import { ArrowRight, Users, Sparkles, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/shared/logo'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="fixed top-0 w-full h-16 bg-white/80 backdrop-blur-md z-50 border-b border-slate-200 flex items-center justify-between px-6 md:px-12">
        <Logo size="sm" />
        <div className="flex gap-4">
          <Link href="/auth/login">
            <Button variant="ghost">Connexion</Button>
          </Link>
          <Link href="/studio">
            <Button variant="orange">Studio</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="pt-32 pb-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <Logo size="lg" showText={false} className="justify-center mb-6" />
            <h1 className="text-6xl md:text-7xl font-black tracking-tight text-slate-900 mb-4">
              archetype
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 font-medium">
              Design Intelligence Profiler
            </p>
          </div>

          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10">
            Qualifiez vos prospects en 3 minutes. Récupérez leurs préférences design
            et générez des prompts IA personnalisés pour créer des sites web sur-mesure.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link href="/demo">
              <Button variant="orange" size="xl">
                Voir la démo <ArrowRight size={20} />
              </Button>
            </Link>
            <Link href="/studio">
              <Button variant="outline" size="xl">
                Accéder au Studio
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                <Users className="text-teal-600" size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Qualification Client</h3>
              <p className="text-slate-500 text-sm">
                Envoyez un lien unique à vos prospects. Ils remplissent un questionnaire
                visuel qui capture leurs préférences.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="text-orange-600" size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Génération de Prompts</h3>
              <p className="text-slate-500 text-sm">
                Transformez les réponses en prompts optimisés pour V0, Lovable,
                Bolt.new ou Midjourney.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4">
                <BarChart3 className="text-yellow-600" size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Dashboard Studio</h3>
              <p className="text-slate-500 text-sm">
                Gérez vos clients, suivez les réponses et augmentez votre taux
                de conversion avec des propositions ciblées.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 px-6 text-center text-sm text-slate-500">
        <p>© 2024 Archetype. Built with Next.js & Supabase.</p>
      </footer>
    </div>
  )
}
