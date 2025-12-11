import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function ConfidentialitePage() {
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

        <h1 className="text-4xl font-bold text-slate-900 mb-8">Politique de Confidentialité</h1>

        <div className="prose prose-slate max-w-none">
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-6 mb-8">
            <p className="text-teal-800 text-sm leading-relaxed">
              Chez Archetype, nous prenons la protection de vos données personnelles très au sérieux.
              Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons
              vos informations lorsque vous utilisez notre plateforme.
            </p>
          </div>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">1. Responsable du traitement</h2>
            <p className="text-slate-600 leading-relaxed">
              Le responsable du traitement des données personnelles est :<br />
              <strong>Crush Digital Atelier LLC</strong><br />
              Email : contact@archetype.design<br />
              Délégué à la protection des données (DPO) : [Nom] - dpo@archetype.design
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">2. Données collectées</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Nous collectons les données suivantes dans le cadre de l'utilisation de notre service :
            </p>

            <div className="bg-white rounded-lg p-5 border border-slate-200 mb-4">
              <h4 className="font-semibold text-slate-800 mb-2">Données d'inscription</h4>
              <ul className="list-disc pl-5 text-slate-600 space-y-1 text-sm">
                <li>Adresse email</li>
                <li>Mot de passe (chiffré)</li>
                <li>Nom de l'entreprise (optionnel)</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-5 border border-slate-200 mb-4">
              <h4 className="font-semibold text-slate-800 mb-2">Données des questionnaires clients</h4>
              <ul className="list-disc pl-5 text-slate-600 space-y-1 text-sm">
                <li>Préférences design (ambiance, couleurs, typographie, etc.)</li>
                <li>Sélections du moodboard</li>
                <li>Fonctionnalités souhaitées</li>
                <li>Enregistrements vocaux (optionnels) et leur transcription</li>
                <li>URL du site web existant (optionnel)</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-5 border border-slate-200">
              <h4 className="font-semibold text-slate-800 mb-2">Données techniques</h4>
              <ul className="list-disc pl-5 text-slate-600 space-y-1 text-sm">
                <li>Adresse IP</li>
                <li>Type de navigateur</li>
                <li>Pages visitées et durée des sessions</li>
                <li>Données de cookies (voir section dédiée)</li>
              </ul>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">3. Finalités du traitement</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Vos données sont collectées et traitées pour les finalités suivantes :
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li><strong>Fourniture du service :</strong> Permettre la création et la gestion de questionnaires, la génération de prompts IA, et la création de showrooms</li>
              <li><strong>Gestion de compte :</strong> Authentification, facturation, support client</li>
              <li><strong>Amélioration du service :</strong> Analyse d'usage, développement de nouvelles fonctionnalités</li>
              <li><strong>Communication :</strong> Notifications de service, newsletters (avec consentement)</li>
              <li><strong>Sécurité :</strong> Détection des fraudes et protection contre les abus</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">4. Base légale du traitement</h2>
            <p className="text-slate-600 leading-relaxed">
              Nous traitons vos données sur les bases légales suivantes :
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2 mt-3">
              <li><strong>Exécution du contrat :</strong> Traitement nécessaire à la fourniture du service</li>
              <li><strong>Consentement :</strong> Pour les cookies non essentiels et les communications marketing</li>
              <li><strong>Intérêt légitime :</strong> Amélioration du service et sécurité</li>
              <li><strong>Obligation légale :</strong> Conservation des factures et documents comptables</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">5. Partage des données</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Nous pouvons partager vos données avec les tiers suivants, dans le respect strict du RGPD :
            </p>
            <div className="grid gap-3">
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="font-semibold text-slate-800">Supabase</p>
                <p className="text-sm text-slate-600">Hébergement de la base de données - UE</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="font-semibold text-slate-800">Vercel</p>
                <p className="text-sm text-slate-600">Hébergement de l'application - États-Unis (Clauses contractuelles types)</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="font-semibold text-slate-800">Stripe</p>
                <p className="text-sm text-slate-600">Traitement des paiements - États-Unis (Certifié Privacy Shield)</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="font-semibold text-slate-800">OpenAI / Groq</p>
                <p className="text-sm text-slate-600">Services IA pour la transcription et l'analyse - États-Unis (Clauses contractuelles types)</p>
              </div>
            </div>
            <p className="text-slate-600 leading-relaxed mt-4">
              Nous ne vendons jamais vos données personnelles à des tiers.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">6. Durée de conservation</h2>
            <p className="text-slate-600 leading-relaxed">
              Nous conservons vos données pour les durées suivantes :
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2 mt-3">
              <li><strong>Données de compte :</strong> Jusqu'à la suppression du compte + 3 ans (prescription)</li>
              <li><strong>Données des questionnaires :</strong> Jusqu'à suppression par l'utilisateur ou fermeture du compte</li>
              <li><strong>Enregistrements vocaux :</strong> 30 jours après transcription, puis supprimés</li>
              <li><strong>Données de facturation :</strong> 10 ans (obligation légale)</li>
              <li><strong>Logs techniques :</strong> 12 mois</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">7. Vos droits</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Conformément au RGPD, vous disposez des droits suivants :
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <p className="font-semibold text-slate-800">Droit d'accès</p>
                <p className="text-sm text-slate-600">Obtenir une copie de vos données</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <p className="font-semibold text-slate-800">Droit de rectification</p>
                <p className="text-sm text-slate-600">Corriger vos données inexactes</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <p className="font-semibold text-slate-800">Droit à l'effacement</p>
                <p className="text-sm text-slate-600">Supprimer vos données</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <p className="font-semibold text-slate-800">Droit à la portabilité</p>
                <p className="text-sm text-slate-600">Récupérer vos données dans un format lisible</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <p className="font-semibold text-slate-800">Droit d'opposition</p>
                <p className="text-sm text-slate-600">S'opposer au traitement</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <p className="font-semibold text-slate-800">Droit de limitation</p>
                <p className="text-sm text-slate-600">Limiter le traitement</p>
              </div>
            </div>
            <p className="text-slate-600 leading-relaxed mt-4">
              Pour exercer ces droits, contactez-nous à : <strong>dpo@archetype.design</strong>
            </p>
            <p className="text-slate-600 leading-relaxed mt-2">
              Vous pouvez également déposer une réclamation auprès de la CNIL : <a href="https://www.cnil.fr" className="text-teal-600 hover:underline" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">8. Cookies</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Notre site utilise des cookies pour fonctionner correctement et améliorer votre expérience :
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="px-4 py-2 text-left font-semibold text-slate-800">Cookie</th>
                    <th className="px-4 py-2 text-left font-semibold text-slate-800">Type</th>
                    <th className="px-4 py-2 text-left font-semibold text-slate-800">Durée</th>
                    <th className="px-4 py-2 text-left font-semibold text-slate-800">Finalité</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600">
                  <tr className="border-b border-slate-100">
                    <td className="px-4 py-2">sb-*</td>
                    <td className="px-4 py-2">Essentiel</td>
                    <td className="px-4 py-2">Session</td>
                    <td className="px-4 py-2">Authentification Supabase</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="px-4 py-2">NEXT_LOCALE</td>
                    <td className="px-4 py-2">Essentiel</td>
                    <td className="px-4 py-2">1 an</td>
                    <td className="px-4 py-2">Préférence de langue</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">9. Sécurité</h2>
            <p className="text-slate-600 leading-relaxed">
              Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données :
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2 mt-3">
              <li>Chiffrement des données en transit (HTTPS/TLS)</li>
              <li>Chiffrement des données au repos</li>
              <li>Authentification sécurisée avec hashage des mots de passe</li>
              <li>Accès restreint aux données selon le principe du moindre privilège</li>
              <li>Surveillance et détection des intrusions</li>
              <li>Sauvegardes régulières</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">10. Modifications</h2>
            <p className="text-slate-600 leading-relaxed">
              Nous pouvons mettre à jour cette politique de confidentialité. En cas de modification
              substantielle, nous vous en informerons par email ou via une notification sur la plateforme
              au moins 30 jours avant l'entrée en vigueur des changements.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">11. Contact</h2>
            <p className="text-slate-600 leading-relaxed">
              Pour toute question concernant cette politique ou vos données personnelles :<br />
              <strong>Email :</strong> dpo@archetype.design<br />
              <strong>Adresse :</strong> [Adresse postale]
            </p>
          </section>

          <p className="text-sm text-slate-400 mt-12">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  )
}
