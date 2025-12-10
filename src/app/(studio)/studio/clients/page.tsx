import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Header, CreateClientDialog, CopyButton } from '@/components/studio'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Eye } from 'lucide-react'
import {
  formatDate,
  getInitials,
  getStatusLabel,
  generateSessionUrl,
} from '@/lib/utils'

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
        created_at
      )
    `)
    .order('created_at', { ascending: false })

  return clients || []
}

export default async function ClientsPage() {
  const clients = await getClients()

  return (
    <>
      <Header title="Clients" subtitle="Gérez vos clients et leurs questionnaires" />

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <p className="text-slate-500">{clients.length} client(s)</p>
          <CreateClientDialog />
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
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

                return (
                  <tr key={client.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-teal-100 text-teal-700 text-sm font-bold">
                            {getInitials(client.company_name || client.email)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <Link
                            href={`/studio/clients/${client.id}`}
                            className="font-medium text-slate-900 hover:text-teal-600"
                          >
                            {client.company_name || 'Sans nom'}
                          </Link>
                          {client.contact_name && (
                            <p className="text-sm text-slate-500">
                              {client.contact_name}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {client.email}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={statusVariant}>
                        {latestSession ? getStatusLabel(status) : 'Pas de session'}
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
              <p className="text-slate-500 mb-4">Aucun client pour le moment.</p>
              <CreateClientDialog />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
