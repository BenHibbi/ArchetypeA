import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import { Header, CreateClientDialog, CopyButton } from '@/components/studio'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'
import { formatDate, generateSessionUrl } from '@/lib/utils'

async function getClients() {
  const supabase = await createClient()

  const { data: clients } = await supabase
    .from('clients')
    .select(`
      *,
      sessions (
        id,
        status,
        started_at,
        completed_at,
        created_at,
        responses (
          business_name,
          website_url
        )
      )
    `)
    .order('created_at', { ascending: false })
    .order('created_at', { ascending: false, referencedTable: 'sessions' })

  return clients || []
}

export default async function ClientsPage() {
  const t = await getTranslations('studio.clients')
  const clients = await getClients()

  const getStatusLabel = (status: string) => {
    return t(`status.${status}`)
  }

  return (
    <>
      <Header title={t('title')} subtitle={t('subtitle')} />

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <p className="text-slate-500">{t('clientCount', { count: clients.length })}</p>
          <CreateClientDialog />
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                  {t('client')}
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                  {t('email')}
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                  {t('website')}
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                  {t('date')}
                </th>
                <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                  {t('actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clients.map((client) => {
                const latestSession = client.sessions?.[0]
                const status = latestSession?.status || 'no_session'
                const statusVariant =
                  status === 'completed'
                    ? 'success'
                    : status === 'in_progress'
                    ? 'warning'
                    : 'pending'

                // responses peut être un objet ou un array selon Supabase
                const rawResponses = latestSession?.responses
                const response = Array.isArray(rawResponses)
                  ? rawResponses[0]
                  : rawResponses

                const businessName = response?.business_name || client.company_name
                const websiteUrl = response?.website_url || client.website_url

                return (
                  <tr key={client.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div>
                        <Link
                          href={`/studio/clients/${client.id}`}
                          className="font-medium text-slate-900 hover:text-teal-600"
                        >
                          {businessName || client.email}
                        </Link>
                        {client.contact_name && (
                          <p className="text-sm text-slate-500">
                            {client.contact_name}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {client.email}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {websiteUrl ? (
                        <a
                          href={websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-600 hover:text-teal-700 hover:underline truncate max-w-[200px] block"
                        >
                          {websiteUrl.replace(/^https?:\/\//, '')}
                        </a>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={statusVariant}>
                        {getStatusLabel(status)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {formatDate(client.created_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {latestSession && (
                          <CopyButton
                            text={generateSessionUrl(latestSession.id)}
                            variant="ghost"
                          />
                        )}
                        <Link href={`/studio/clients/${client.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye size={14} />
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {clients.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-slate-500 mb-4">{t('noClients')}</p>
              <CreateClientDialog />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
