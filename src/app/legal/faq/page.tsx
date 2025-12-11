'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ChevronDown, ChevronUp, Search, Mail } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
  category: string
}

const FAQ_ITEMS: FAQItem[] = [
  // Général
  {
    category: 'Général',
    question: "Qu'est-ce qu'Archetype ?",
    answer:
      'Archetype est une plateforme SaaS conçue pour les freelances et agences web. Elle permet de créer des questionnaires visuels pour qualifier les préférences design de vos clients, puis de générer automatiquement des prompts IA personnalisés pour créer des sites web sur-mesure avec des outils comme V0, Lovable ou Bolt.new.',
  },
  {
    category: 'Général',
    question: "À qui s'adresse Archetype ?",
    answer:
      "Archetype s'adresse principalement aux web designers freelances, agences digitales, et développeurs no-code qui souhaitent professionnaliser leur processus de qualification client et accélérer la création de maquettes grâce à l'IA.",
  },
  {
    category: 'Général',
    question: 'Comment fonctionne le questionnaire ?',
    answer:
      "Vous créez un client dans votre Studio, puis vous obtenez un lien unique à envoyer. Votre client répond à 6 questions visuelles sur ses préférences (ambiance, typographie, couleurs, etc.), sélectionne des inspirations dans un moodboard, et peut optionnellement décrire son projet à l'oral. Toutes les réponses sont compilées dans un brief design structuré.",
  },

  // Fonctionnalités
  {
    category: 'Fonctionnalités',
    question: "Qu'est-ce que le Showroom ?",
    answer:
      "Le Showroom est une galerie privée que vous pouvez envoyer à votre client pour lui présenter vos propositions de design. Il peut visualiser les maquettes, sélectionner celle qu'il préfère, et même signer directement un devis dans l'application.",
  },
  {
    category: 'Fonctionnalités',
    question: 'Comment sont générés les prompts IA ?',
    answer:
      "Notre agent ANALYST analyse toutes les réponses du questionnaire (préférences visuelles, inspirations, description vocale) et génère un prompt optimisé et structuré que vous pouvez copier-coller directement dans V0, Lovable, Bolt.new ou d'autres outils de création IA.",
  },
  {
    category: 'Fonctionnalités',
    question: "L'enregistrement vocal est-il obligatoire ?",
    answer:
      "Non, l'étape d'enregistrement vocal est entièrement optionnelle. Elle permet simplement à vos clients de décrire leur vision de manière plus libre et naturelle. L'IA transcrit et analyse automatiquement le contenu pour enrichir le brief.",
  },
  {
    category: 'Fonctionnalités',
    question: 'Puis-je personnaliser le questionnaire ?',
    answer:
      'Actuellement, le questionnaire utilise un set de questions optimisées pour la qualification design. La personnalisation avancée (ajout de questions, modification des options) est prévue dans une future mise à jour.',
  },

  // Tarification
  {
    category: 'Tarification',
    question: 'Combien coûte Archetype ?',
    answer:
      "L'abonnement Archetype est à 19,90€ HT/mois, avec un système de facturation à l'usage pour les fonctionnalités IA (transcription vocale, génération de prompts). Vous ne payez que ce que vous utilisez réellement.",
  },
  {
    category: 'Tarification',
    question: 'Y a-t-il un essai gratuit ?',
    answer:
      "Vous pouvez tester la démo publique pour découvrir l'expérience questionnaire. Pour accéder au Studio complet avec vos propres clients, un abonnement est nécessaire.",
  },
  {
    category: 'Tarification',
    question: 'Comment fonctionne la facturation ?',
    answer:
      "L'abonnement est facturé mensuellement par carte bancaire via Stripe. Les frais d'usage (API IA) sont calculés à la fin de chaque mois et ajoutés à votre facture suivante.",
  },
  {
    category: 'Tarification',
    question: 'Puis-je annuler mon abonnement ?',
    answer:
      "Oui, vous pouvez annuler à tout moment depuis les paramètres de votre compte. L'annulation prendra effet à la fin de la période de facturation en cours. Vos données restent accessibles pendant 30 jours après l'annulation.",
  },

  // Technique
  {
    category: 'Technique',
    question: 'Mes données sont-elles sécurisées ?',
    answer:
      'Absolument. Nous utilisons le chiffrement SSL/TLS pour toutes les communications, vos données sont hébergées sur des serveurs sécurisés (Supabase), et nous sommes conformes au RGPD. Consultez notre Politique de confidentialité pour plus de détails.',
  },
  {
    category: 'Technique',
    question: 'Quels navigateurs sont supportés ?',
    answer:
      "Archetype fonctionne sur tous les navigateurs modernes : Chrome, Firefox, Safari, Edge. Pour une expérience optimale, nous recommandons d'utiliser la dernière version de votre navigateur.",
  },
  {
    category: 'Technique',
    question: "L'application fonctionne-t-elle sur mobile ?",
    answer:
      'Oui, Archetype est entièrement responsive. Vos clients peuvent remplir le questionnaire sur mobile, tablette ou ordinateur. Le Studio est optimisé pour une utilisation sur desktop.',
  },

  // Support
  {
    category: 'Support',
    question: 'Comment contacter le support ?',
    answer:
      'Vous pouvez nous contacter par email à support@archetype.design. Nous nous engageons à répondre sous 24h ouvrées.',
  },
  {
    category: 'Support',
    question: 'Proposez-vous des formations ?',
    answer:
      "Nous préparons une série de tutoriels vidéo et une documentation complète pour vous aider à tirer le meilleur parti d'Archetype. Abonnez-vous à notre newsletter pour être informé de leur disponibilité.",
  },
]

const CATEGORIES = ['Tous', 'Général', 'Fonctionnalités', 'Tarification', 'Technique', 'Support']

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Tous')

  const filteredFAQ = FAQ_ITEMS.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'Tous' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link
          href="/studio"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition-colors"
        >
          <ArrowLeft size={18} />
          Retour au Studio
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Questions Fréquentes</h1>
          <p className="text-lg text-slate-600">
            Trouvez rapidement les réponses à vos questions sur Archetype
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher une question..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-slate-900"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {filteredFAQ.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500">Aucune question trouvée pour votre recherche.</p>
            </div>
          ) : (
            filteredFAQ.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-teal-600 bg-teal-50 px-2 py-1 rounded">
                      {item.category}
                    </span>
                    <span className="font-medium text-slate-900">{item.question}</span>
                  </div>
                  {openIndex === index ? (
                    <ChevronUp className="text-slate-400 flex-shrink-0" size={20} />
                  ) : (
                    <ChevronDown className="text-slate-400 flex-shrink-0" size={20} />
                  )}
                </button>
                {openIndex === index && (
                  <div className="px-5 pb-5 pt-0">
                    <div className="pl-[72px]">
                      <p className="text-slate-600 leading-relaxed">{item.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            Vous n'avez pas trouvé votre réponse ?
          </h2>
          <p className="text-slate-300 mb-6">Notre équipe support est là pour vous aider</p>
          <a
            href="mailto:support@archetype.design"
            className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            <Mail size={18} />
            Contacter le support
          </a>
        </div>
      </div>
    </div>
  )
}
