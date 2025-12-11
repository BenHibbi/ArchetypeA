import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function MentionsLegalesPage() {
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

        <h1 className="text-4xl font-bold text-slate-900 mb-8">Mentions Légales</h1>

        <div className="prose prose-slate max-w-none">
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">1. Éditeur du site</h2>
            <p className="text-slate-600 leading-relaxed">
              Le site Archetype est édité par :<br />
              <strong>Crush Digital Atelier LLC</strong>
              <br />
              Adresse : [Adresse de l'entreprise]
              <br />
              Email : contact@archetype.design
              <br />
              Téléphone : [Numéro de téléphone]
              <br />
              SIRET : [Numéro SIRET]
              <br />
              Capital social : [Montant du capital]
            </p>
            <p className="text-slate-600 leading-relaxed mt-4">
              Directeur de la publication : [Nom du directeur]
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">2. Hébergement</h2>
            <p className="text-slate-600 leading-relaxed">
              Le site est hébergé par :<br />
              <strong>Vercel Inc.</strong>
              <br />
              340 S Lemon Ave #4133
              <br />
              Walnut, CA 91789
              <br />
              États-Unis
              <br />
              Site web : vercel.com
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">3. Propriété intellectuelle</h2>
            <p className="text-slate-600 leading-relaxed">
              L'ensemble des éléments constituant ce site (textes, graphismes, logiciels,
              photographies, images, vidéos, sons, plans, noms, logos, marques, créations et œuvres
              protégeables diverses, bases de données, etc.) ainsi que le site lui-même, relèvent
              des législations françaises et internationales sur le droit d'auteur et la propriété
              intellectuelle.
            </p>
            <p className="text-slate-600 leading-relaxed mt-4">
              Ces éléments sont la propriété exclusive de Crush Digital Atelier LLC. Toute
              reproduction, représentation, utilisation ou adaptation, sous quelque forme que ce
              soit, de tout ou partie de ces éléments, sans l'accord préalable et écrit de Crush
              Digital Atelier LLC, est strictement interdite.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">4. Données personnelles</h2>
            <p className="text-slate-600 leading-relaxed">
              Les données personnelles collectées sur ce site sont traitées conformément au
              Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et
              Libertés. Pour plus d'informations, veuillez consulter notre{' '}
              <Link href="/legal/confidentialite" className="text-teal-600 hover:underline">
                Politique de confidentialité
              </Link>
              .
            </p>
            <p className="text-slate-600 leading-relaxed mt-4">
              Conformément à la loi, vous disposez d'un droit d'accès, de rectification, de
              suppression et d'opposition aux données vous concernant. Pour exercer ces droits, vous
              pouvez nous contacter à l'adresse : contact@archetype.design
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">5. Cookies</h2>
            <p className="text-slate-600 leading-relaxed">
              Ce site utilise des cookies pour améliorer l'expérience utilisateur et réaliser des
              statistiques de visites. En naviguant sur ce site, vous acceptez l'utilisation de ces
              cookies. Vous pouvez configurer votre navigateur pour refuser les cookies ou être
              alerté lorsqu'un cookie est envoyé.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              6. Limitation de responsabilité
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Crush Digital Atelier LLC s'efforce de fournir des informations aussi précises que
              possible. Toutefois, elle ne pourra être tenue responsable des omissions, des
              inexactitudes et des carences dans la mise à jour, qu'elles soient de son fait ou du
              fait des tiers partenaires qui lui fournissent ces informations.
            </p>
            <p className="text-slate-600 leading-relaxed mt-4">
              Tous les informations indiquées sur le site sont données à titre indicatif, et sont
              susceptibles d'évoluer. Par ailleurs, les renseignements figurant sur le site ne sont
              pas exhaustifs. Ils sont donnés sous réserve de modifications ayant été apportées
              depuis leur mise en ligne.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">7. Liens hypertextes</h2>
            <p className="text-slate-600 leading-relaxed">
              Le site peut contenir des liens hypertextes vers d'autres sites. Crush Digital Atelier
              LLC n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur
              contenu ou aux pratiques de confidentialité de leurs exploitants.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">8. Droit applicable</h2>
            <p className="text-slate-600 leading-relaxed">
              Les présentes mentions légales sont régies par le droit français. En cas de litige,
              les tribunaux français seront seuls compétents.
            </p>
          </section>

          <p className="text-sm text-slate-400 mt-12">
            Dernière mise à jour :{' '}
            {new Date().toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>
    </div>
  )
}
