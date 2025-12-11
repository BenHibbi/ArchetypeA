import { Resend } from 'resend'

let resend: Resend | null = null

function getResend() {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY)
  }
  return resend
}

const ADMIN_EMAIL = 'ben@crushhh.co'
const FROM_EMAIL = 'onboarding@resend.dev' // Using Resend's default until domain is verified

interface SendShowroomEmailParams {
  clientEmail: string
  clientName: string
  showroomUrl: string
  businessName?: string
}

interface NotifyInterestParams {
  clientEmail: string
  clientPhone?: string
  clientMessage?: string
  businessName?: string
  designTitle?: string
  actionType: 'quote_request' | 'signed'
  finalPrice?: number
}

export async function sendShowroomEmail({
  clientEmail,
  clientName,
  showroomUrl,
  businessName,
}: SendShowroomEmailParams) {
  const displayName = businessName || clientName

  return getResend().emails.send({
    from: `Archetype <${FROM_EMAIL}>`,
    to: clientEmail,
    subject: `${displayName}, votre showroom design est prêt !`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: white; letter-spacing: -0.5px;">
                ARCHETYPE
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #0f172a;">
                Bonjour ${displayName},
              </h2>
              <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #475569;">
                Votre showroom personnalisé est maintenant disponible !
                Découvrez les propositions de design créées spécialement pour vous.
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 16px 0;">
                    <a href="${showroomUrl}" style="display: inline-block; background: linear-gradient(135deg, #f97316 0%, #f59e0b 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-size: 16px; font-weight: 600;">
                      Voir mon showroom
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 24px 0 0 0; font-size: 14px; color: #94a3b8;">
                Ce lien est personnel et ne doit pas être partagé.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 30px; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8; text-align: center;">
                Archetype - Design sur mesure pour votre marque
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  })
}

export async function notifyAdminOfInterest({
  clientEmail,
  clientPhone,
  clientMessage,
  businessName,
  designTitle,
  actionType,
  finalPrice,
}: NotifyInterestParams) {
  const actionLabel = actionType === 'signed' ? 'COMMANDE SIGNEE (-15%)' : 'Demande de devis'
  const priceDisplay = finalPrice ? `${finalPrice.toLocaleString('fr-FR')}€` : 'Non spécifié'

  return getResend().emails.send({
    from: `Archetype Notifications <${FROM_EMAIL}>`,
    to: ADMIN_EMAIL,
    subject: `[${actionLabel}] ${businessName || clientEmail}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: ${actionType === 'signed' ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)' : 'linear-gradient(135deg, #f97316 0%, #f59e0b 100%)'}; padding: 24px 30px;">
              <h1 style="margin: 0; font-size: 18px; font-weight: 700; color: white;">
                ${actionLabel}
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 30px;">
              <h2 style="margin: 0 0 24px 0; font-size: 20px; font-weight: 700; color: #0f172a;">
                ${businessName || 'Client'}
              </h2>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                    <span style="font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Email</span><br>
                    <a href="mailto:${clientEmail}" style="font-size: 16px; color: #0f172a; text-decoration: none;">${clientEmail}</a>
                  </td>
                </tr>
                ${
                  clientPhone
                    ? `
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                    <span style="font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Téléphone</span><br>
                    <a href="tel:${clientPhone}" style="font-size: 16px; color: #0f172a; text-decoration: none;">${clientPhone}</a>
                  </td>
                </tr>
                `
                    : ''
                }
                ${
                  designTitle
                    ? `
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                    <span style="font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Design sélectionné</span><br>
                    <span style="font-size: 16px; color: #0f172a;">${designTitle}</span>
                  </td>
                </tr>
                `
                    : ''
                }
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                    <span style="font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Prix final</span><br>
                    <span style="font-size: 20px; font-weight: 700; color: ${actionType === 'signed' ? '#059669' : '#f97316'};">${priceDisplay}</span>
                  </td>
                </tr>
              </table>

              ${
                clientMessage
                  ? `
              <div style="background-color: #f8fafc; border-radius: 8px; padding: 16px; margin-top: 16px;">
                <span style="font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Message du client</span>
                <p style="margin: 8px 0 0 0; font-size: 14px; color: #0f172a; line-height: 1.5;">${clientMessage}</p>
              </div>
              `
                  : ''
              }
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  })
}

export async function sendConfirmationToClient({
  clientEmail,
  businessName,
  actionType,
}: {
  clientEmail: string
  businessName?: string
  actionType: 'quote_request' | 'signed'
}) {
  const displayName = businessName || 'cher client'
  const subject =
    actionType === 'signed'
      ? 'Confirmation de votre commande'
      : 'Votre demande de devis a été reçue'

  return getResend().emails.send({
    from: `Archetype <${FROM_EMAIL}>`,
    to: clientEmail,
    subject,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: white; letter-spacing: -0.5px;">
                ARCHETYPE
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px; text-align: center;">
              <div style="width: 80px; height: 80px; background: ${actionType === 'signed' ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)' : 'linear-gradient(135deg, #f97316 0%, #f59e0b 100%)'}; border-radius: 50%; margin: 0 auto 24px auto; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 40px;">
                  ${actionType === 'signed' ? '✓' : '📨'}
                </span>
              </div>

              <h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #0f172a;">
                ${actionType === 'signed' ? 'Merci pour votre confiance !' : 'Demande bien reçue !'}
              </h2>

              <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #475569;">
                ${
                  actionType === 'signed'
                    ? `Bonjour ${displayName}, votre commande a été confirmée avec succès. Notre équipe vous contactera très prochainement pour démarrer votre projet.`
                    : `Bonjour ${displayName}, nous avons bien reçu votre demande de devis. Nous reviendrons vers vous dans les plus brefs délais.`
                }
              </p>

              <p style="margin: 0; font-size: 14px; color: #94a3b8;">
                L'équipe Archetype
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 30px; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8; text-align: center;">
                Archetype - Design sur mesure pour votre marque
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  })
}
