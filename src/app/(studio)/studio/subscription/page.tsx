'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Check, CreditCard, Calendar, Zap, Mail } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function SubscriptionPage() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user?.email) {
        setUserEmail(user.email)
      }
      setLoading(false)
    }
    fetchUser()
  }, [])

  const PLAN_FEATURES = [
    'Clients illimités',
    'Questionnaires visuels personnalisés',
    'Génération de prompts IA',
    'Showroom client',
    'Enregistrement vocal avec transcription IA',
    'Support par email prioritaire',
    'Mises à jour gratuites',
  ]

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        <Link
          href="/studio"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition-colors"
        >
          <ArrowLeft size={18} />
          Retour au Studio
        </Link>

        <h1 className="text-3xl font-bold text-slate-900 mb-2">Mon Abonnement</h1>
        <p className="text-slate-500 mb-8">Gérez votre abonnement et votre facturation</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Plan */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-teal-100 text-sm font-medium">Plan actuel</p>
                    <h2 className="text-2xl font-bold mt-1">Early Adopter</h2>
                  </div>
                  <div className="bg-white/20 rounded-full px-4 py-2">
                    <span className="text-sm font-semibold">Beta</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-slate-900">Gratuit</span>
                  <span className="text-slate-500">pendant la beta</span>
                </div>

                <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-6">
                  <p className="text-teal-800 text-sm">
                    <strong>Merci d'être parmi les premiers !</strong> En tant qu'early adopter,
                    vous bénéficiez d'un accès gratuit pendant la phase de beta. Lorsque nous
                    passerons en version payante, vous aurez une offre spéciale réservée aux early
                    adopters.
                  </p>
                </div>

                <h3 className="font-semibold text-slate-900 mb-4">Ce qui est inclus :</h3>
                <ul className="space-y-3">
                  {PLAN_FEATURES.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3 text-slate-600">
                      <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                        <Check size={14} className="text-teal-600" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Usage Stats */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 mt-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Zap size={18} className="text-orange-500" />
                Utilisation ce mois
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">Clients créés</p>
                  <p className="text-2xl font-bold text-slate-900">-</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">Questionnaires complétés</p>
                  <p className="text-2xl font-bold text-slate-900">-</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">Prompts générés</p>
                  <p className="text-2xl font-bold text-slate-900">-</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">Showrooms envoyés</p>
                  <p className="text-2xl font-bold text-slate-900">-</p>
                </div>
              </div>
            </div>
          </div>

          {/* Billing Info */}
          <div className="space-y-6">
            {/* Account */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Compte</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Email</p>
                  <p className="text-slate-900 font-medium">
                    {loading ? '...' : userEmail || 'Non connecté'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Statut</p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    Actif
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Method - Coming Soon */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <CreditCard size={18} className="text-slate-400" />
                Moyen de paiement
              </h3>
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <p className="text-slate-500 text-sm">Pas de paiement requis pendant la beta</p>
              </div>
            </div>

            {/* Next Billing - Coming Soon */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Calendar size={18} className="text-slate-400" />
                Prochaine facturation
              </h3>
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <p className="text-slate-500 text-sm">
                  La facturation débutera à la fin de la beta
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-slate-900 rounded-2xl p-6 text-white">
              <h3 className="font-semibold mb-2">Une question ?</h3>
              <p className="text-slate-300 text-sm mb-4">Notre équipe est là pour vous aider</p>
              <a
                href="mailto:support@archetype.design"
                className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 text-sm font-medium transition-colors"
              >
                <Mail size={16} />
                support@archetype.design
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
