import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function CGUCGVPage() {
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

        <h1 className="text-4xl font-bold text-slate-900 mb-8">Conditions Générales d'Utilisation et de Vente</h1>

        <div className="prose prose-slate max-w-none">
          {/* PARTIE 1 - CGU */}
          <div className="bg-white rounded-xl p-8 shadow-sm mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Conditions Générales d'Utilisation (CGU)</h2>

            <section className="mb-8">
              <h3 className="text-xl font-bold text-slate-800 mb-3">Article 1 - Objet</h3>
              <p className="text-slate-600 leading-relaxed">
                Les présentes Conditions Générales d'Utilisation (CGU) ont pour objet de définir les modalités
                et conditions d'utilisation de la plateforme Archetype, ainsi que de définir les droits et
                obligations des parties dans ce cadre.
              </p>
              <p className="text-slate-600 leading-relaxed mt-3">
                Archetype est une plateforme SaaS permettant aux freelances et agences de créer des questionnaires
                visuels pour qualifier les préférences design de leurs clients, et de générer des prompts IA
                personnalisés pour la création de sites web.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-bold text-slate-800 mb-3">Article 2 - Accès au service</h3>
              <p className="text-slate-600 leading-relaxed">
                L'accès à la plateforme Archetype nécessite la création d'un compte utilisateur. L'utilisateur
                s'engage à fournir des informations exactes et à jour lors de son inscription.
              </p>
              <p className="text-slate-600 leading-relaxed mt-3">
                L'utilisateur est responsable de la confidentialité de ses identifiants de connexion et de
                toutes les activités effectuées depuis son compte.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-bold text-slate-800 mb-3">Article 3 - Utilisation du service</h3>
              <p className="text-slate-600 leading-relaxed">
                L'utilisateur s'engage à utiliser la plateforme conformément à sa destination et dans le
                respect des lois et règlements en vigueur. Il est notamment interdit :
              </p>
              <ul className="list-disc pl-6 mt-3 text-slate-600 space-y-2">
                <li>D'utiliser le service à des fins illégales ou frauduleuses</li>
                <li>De collecter des données personnelles sans le consentement des personnes concernées</li>
                <li>De porter atteinte aux droits de propriété intellectuelle de tiers</li>
                <li>De tenter de contourner les mesures de sécurité de la plateforme</li>
                <li>De revendre ou sous-licencier le service sans autorisation préalable</li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-bold text-slate-800 mb-3">Article 4 - Propriété intellectuelle</h3>
              <p className="text-slate-600 leading-relaxed">
                La plateforme Archetype et tous ses éléments (code, design, contenu, marques, etc.) sont la
                propriété exclusive de Crush Digital Atelier LLC. L'utilisateur dispose d'un droit d'utilisation
                personnel, non exclusif et non transférable, limité à la durée de son abonnement.
              </p>
              <p className="text-slate-600 leading-relaxed mt-3">
                Les contenus créés par l'utilisateur (questionnaires, prompts générés) restent sa propriété.
                L'utilisateur accorde toutefois à Archetype une licence d'utilisation à des fins d'amélioration
                du service.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-bold text-slate-800 mb-3">Article 5 - Données personnelles</h3>
              <p className="text-slate-600 leading-relaxed">
                Le traitement des données personnelles est régi par notre{' '}
                <Link href="/legal/confidentialite" className="text-teal-600 hover:underline">
                  Politique de confidentialité
                </Link>.
                L'utilisateur garantit avoir obtenu le consentement de ses clients pour la collecte et le
                traitement de leurs données via la plateforme.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-bold text-slate-800 mb-3">Article 6 - Responsabilité</h3>
              <p className="text-slate-600 leading-relaxed">
                Archetype s'engage à mettre en œuvre tous les moyens nécessaires pour assurer la disponibilité
                et la sécurité du service. Toutefois, Archetype ne peut garantir une disponibilité permanente
                et ne saurait être tenu responsable des interruptions de service, pertes de données ou dommages
                indirects résultant de l'utilisation du service.
              </p>
            </section>
          </div>

          {/* PARTIE 2 - CGV */}
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Conditions Générales de Vente (CGV)</h2>

            <section className="mb-8">
              <h3 className="text-xl font-bold text-slate-800 mb-3">Article 1 - Prix et paiement</h3>
              <p className="text-slate-600 leading-relaxed">
                Les prix sont indiqués en euros, hors taxes. L'abonnement à Archetype est facturé mensuellement
                au tarif en vigueur au moment de la souscription :
              </p>
              <div className="bg-slate-50 rounded-lg p-4 mt-3">
                <p className="font-semibold text-slate-800">Abonnement Standard : 19,90€ HT/mois</p>
                <p className="text-slate-600 text-sm mt-1">+ Frais d'utilisation selon consommation (API IA, stockage)</p>
              </div>
              <p className="text-slate-600 leading-relaxed mt-3">
                Le paiement s'effectue par carte bancaire via notre prestataire de paiement sécurisé Stripe.
                L'abonnement est renouvelé automatiquement chaque mois, sauf résiliation.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-bold text-slate-800 mb-3">Article 2 - Durée et résiliation</h3>
              <p className="text-slate-600 leading-relaxed">
                L'abonnement est conclu pour une durée indéterminée avec une période minimale d'engagement d'un
                mois. L'utilisateur peut résilier son abonnement à tout moment depuis son espace client.
                La résiliation prendra effet à la fin de la période en cours.
              </p>
              <p className="text-slate-600 leading-relaxed mt-3">
                En cas de non-paiement, Archetype se réserve le droit de suspendre ou résilier l'accès au
                service après mise en demeure restée sans effet pendant 15 jours.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-bold text-slate-800 mb-3">Article 3 - Droit de rétractation</h3>
              <p className="text-slate-600 leading-relaxed">
                Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne
                s'applique pas aux contrats de fourniture de contenu numérique non fourni sur un support
                matériel dont l'exécution a commencé avec l'accord préalable exprès du consommateur.
              </p>
              <p className="text-slate-600 leading-relaxed mt-3">
                En créant un compte et en souscrivant à un abonnement, vous acceptez que l'exécution du
                service commence immédiatement et renoncez à votre droit de rétractation.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-bold text-slate-800 mb-3">Article 4 - Garanties</h3>
              <p className="text-slate-600 leading-relaxed">
                Archetype garantit la conformité du service aux fonctionnalités décrites sur le site.
                En cas de dysfonctionnement avéré, l'utilisateur peut contacter le support pour obtenir
                une résolution du problème ou, à défaut, un remboursement prorata temporis.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-bold text-slate-800 mb-3">Article 5 - Modifications des conditions</h3>
              <p className="text-slate-600 leading-relaxed">
                Archetype se réserve le droit de modifier les présentes conditions. Les utilisateurs seront
                informés de toute modification substantielle avec un préavis de 30 jours. La poursuite de
                l'utilisation du service après ce délai vaut acceptation des nouvelles conditions.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-bold text-slate-800 mb-3">Article 6 - Litiges</h3>
              <p className="text-slate-600 leading-relaxed">
                Les présentes conditions sont régies par le droit français. En cas de litige, les parties
                s'engagent à rechercher une solution amiable. À défaut, les tribunaux de Paris seront seuls
                compétents.
              </p>
              <p className="text-slate-600 leading-relaxed mt-3">
                Conformément à l'article L612-1 du Code de la consommation, vous pouvez recourir gratuitement
                au service de médiation de la consommation. Médiateur : [Nom du médiateur] - [Contact]
              </p>
            </section>
          </div>

          <p className="text-sm text-slate-400 mt-12">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  )
}
