import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mail, Globe, Calendar, CheckCircle } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import {
  Header,
  ResponseSummary,
  PromptGenerator,
  CopyButton,
  ShowroomBuilder,
} from '@/components/studio'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { generateSessionUrl, formatDateTime } from '@/lib/utils'

async function getClient(id: string) {
  const supabase = await createClient()

  // Récupérer le client
  const { data: client, error: clientError } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single()

  if (clientError || !client) return null

  // Récupérer la session la plus récente avec ses réponses
  const { data: sessions } = await supabase
    .from('sessions')
    .select(`
      id,
      status,
      started_at,
      completed_at,
      created_at,
      showroom_status,
      showroom_sent_at,
      responses (*)
    `)
    .eq('client_id', id)
    .order('created_at', { ascending: false })
    .limit(1)

  const latestSession = sessions?.[0] || null

  // Récupérer les design proposals si session existe
  let designProposals: any[] = []
  if (latestSession) {
    const { data: designs } = await supabase
      .from('design_proposals')
      .select('*')
      .eq('session_id', latestSession.id)
      .order('slot_number', { ascending: true })

    designProposals = designs || []
  }

  return { ...client, latestSession, designProposals }
}

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const client = await getClient(id)
  const t = await getTranslations('studio.clients')

  if (!client) {
    notFound()
  }

  const latestSession = client.latestSession
  // responses peut être un objet ou un array selon la config Supabase
  const response = Array.isArray(latestSession?.responses)
    ? latestSession.responses[0]
    : latestSession?.responses
  const status = latestSession?.status || 'no_session'
  const statusVariant =
    status === 'completed'
      ? 'success'
      : status === 'in_progress'
      ? 'warning'
      : 'pending'

  const sessionUrl = latestSession ? generateSessionUrl(latestSession.id) : ''

  return (
    <>
      <Header
        title={client.company_name || client.email}
        subtitle={client.contact_name || undefined}
      />

      <div className="p-6 space-y-6">
        {/* Back button + Status + Dates */}
        <div className="flex items-center justify-between">
          <Link href="/studio/clients">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft size={16} />
              {t('backToClients')}
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            {latestSession && (
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  <span>{t('sentAt')} {formatDateTime(latestSession.created_at)}</span>
                </div>
                {latestSession.completed_at && (
                  <div className="flex items-center gap-1.5 text-green-600">
                    <CheckCircle size={14} />
                    <span>{t('completedAt')} {formatDateTime(latestSession.completed_at)}</span>
                  </div>
                )}
              </div>
            )}
            <Badge variant={statusVariant} className="text-sm px-4 py-1">
              {t(`status.${status}`)}
            </Badge>
          </div>
        </div>

        {/* Responses - En premier et en pleine largeur si complété */}
        {response ? (
          <ResponseSummary response={response} />
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-slate-500 mb-4">
                {t('notYetResponded')}
              </p>
              {latestSession && (
                <div className="flex items-center justify-center gap-2">
                  <code className="text-sm font-mono text-teal-600 bg-slate-100 px-3 py-2 rounded">
                    {sessionUrl}
                  </code>
                  <CopyButton text={sessionUrl} />
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Prompt Generator - si complété */}
        {response && status === 'completed' && (
          <PromptGenerator client={client} response={response} />
        )}

        {/* Showroom Builder - si session existe et questionnaire complété */}
        {latestSession && status === 'completed' && (
          <ShowroomBuilder
            sessionId={latestSession.id}
            initialDesigns={client.designProposals.map((d: any) => ({
              id: d.id,
              slotNumber: d.slot_number,
              imageUrl: d.image_url,
              htmlCode: d.html_code,
              price: d.price,
              title: d.title || `Design ${d.slot_number}`,
            }))}
            showroomStatus={latestSession.showroom_status}
          />
        )}

        {/* Contact - affiché seulement si infos supplémentaires */}
        {(client.website_url || client.notes) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('contact')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail size={16} className="text-slate-400" />
                <a
                  href={`mailto:${client.email}`}
                  className="text-teal-600 hover:underline"
                >
                  {client.email}
                </a>
              </div>

              {client.website_url && (
                <div className="flex items-center gap-3 text-sm">
                  <Globe size={16} className="text-slate-400" />
                  <a
                    href={client.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-600 hover:underline truncate"
                  >
                    {client.website_url}
                  </a>
                </div>
              )}

              {client.notes && (
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">{t('notes')}</p>
                  <p className="text-sm text-slate-600">{client.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}
