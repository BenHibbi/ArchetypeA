import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import {
  Header,
  StatsCards,
  CreateClientDialog,
  DeleteClientButton,
  ClickableRow,
} from '@/components/studio'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Check } from 'lucide-react'
import { DashboardStats } from '@/types'
import { formatDate, getInitials } from '@/lib/utils'

interface SessionResponse {
  business_name: string | null
  website_url: string | null
}

interface ClientSession {
  id: string
  status: string | null
  showroom_status: string | null
  started_at: string | null
  completed_at: string | null
  created_at: string
  responses: SessionResponse | SessionResponse[] | null
}

interface ClientWithSessions {
  id: string
  email: string
  company_name: string | null
  contact_name: string | null
  website_url: string | null
  created_at: string
  sessions: ClientSession[] | null
}

async function getStats(): Promise<DashboardStats> {
  const supabase = await createClient()

  // Execute all queries in parallel for better performance
  const [
    { count: totalClients },
    { count: pendingSessions },
    { count: completedSessions },
    { count: totalSessions },
  ] = await Promise.all([
    supabase.from('clients').select('*', { count: 'exact', head: true }),
    supabase.from('sessions').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('sessions').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
    supabase.from('sessions').select('*', { count: 'exact', head: true }),
  ])

  const completionRate =
    totalSessions && totalSessions > 0
      ? Math.round(((completedSessions || 0) / totalSessions) * 100)
      : 0

  return {
    total_clients: totalClients || 0,
    pending_sessions: pendingSessions || 0,
    completed_sessions: completedSessions || 0,
    completion_rate: completionRate,
  }
}

async function getRecentClients(): Promise<ClientWithSessions[]> {
  const supabase = await createClient()

  const { data: clients } = (await supabase
    .from('clients')
    .select(
      `
      *,
      sessions (
        id,
        status,
        showroom_status,
        started_at,
        completed_at,
        created_at,
        responses (
          business_name,
          website_url
        )
      )
    `
    )
    .order('created_at', { ascending: false })
    .order('created_at', { ascending: false, referencedTable: 'sessions' })
    .limit(6)) as { data: ClientWithSessions[] | null }

  return clients || []
}

export default async function DashboardPage() {
  const t = await getTranslations('studio.dashboard')
  const tClients = await getTranslations('studio.clients')
  const [stats, recentClients] = await Promise.all([getStats(), getRecentClients()])

  return (
    <>
      <Header title={t('title')} subtitle={t('subtitle')} />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <StatsCards stats={stats} />

        {/* Recent Clients */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">{tClients('title')}</h2>
            <CreateClientDialog />
          </div>

          {recentClients.length > 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      {tClients('client')}
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      {tClients('email')}
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      {tClients('website')}
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      {tClients('date')}
                    </th>
                    <th className="text-center px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      {tClients('showroomSent')}
                    </th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      {tClients('actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentClients.map((client) => {
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
                    const response = Array.isArray(rawResponses) ? rawResponses[0] : rawResponses

                    const businessName = response?.business_name || client.company_name
                    const websiteUrl = response?.website_url || client.website_url
                    const showroomSent = latestSession?.showroom_status === 'sent'

                    return (
                      <ClickableRow
                        key={client.id}
                        href={`/studio/${client.id}`}
                        className="hover:bg-slate-50 cursor-pointer"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-teal-100 text-teal-700 text-sm font-bold">
                                {getInitials(businessName || client.email)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <span className="font-medium text-slate-900">
                                {businessName || client.email}
                              </span>
                              {client.contact_name && (
                                <p className="text-sm text-slate-500">{client.contact_name}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{client.email}</td>
                        <td className="px-6 py-4 text-sm">
                          {websiteUrl ? (
                            <a
                              href={
                                websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`
                              }
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
                          <Badge variant={statusVariant}>{tClients(`status.${status}`)}</Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                          {formatDate(client.created_at)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {showroomSent ? (
                            <div className="inline-flex items-center justify-center w-5 h-5 rounded bg-teal-500 text-white">
                              <Check size={14} />
                            </div>
                          ) : (
                            <div className="inline-flex items-center justify-center w-5 h-5 rounded border-2 border-slate-200" />
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <DeleteClientButton clientId={client.id} />
                        </td>
                      </ClickableRow>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
              <p className="text-slate-500 mb-4">{tClients('noClients')}</p>
              <CreateClientDialog />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
