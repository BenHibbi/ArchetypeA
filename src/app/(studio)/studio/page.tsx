import { createClient } from '@/lib/supabase/server'
import { Header, StatsCards, ClientCard, CreateClientDialog } from '@/components/studio'
import { ClientWithSession, DashboardStats } from '@/types'

async function getStats(): Promise<DashboardStats> {
  const supabase = await createClient()

  const { count: totalClients } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })

  const { count: pendingSessions } = await supabase
    .from('sessions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  const { count: completedSessions } = await supabase
    .from('sessions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'completed')

  const { count: totalSessions } = await supabase
    .from('sessions')
    .select('*', { count: 'exact', head: true })

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

async function getRecentClients(): Promise<ClientWithSession[]> {
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
        responses (*)
      )
    `)
    .order('created_at', { ascending: false })
    .limit(6)

  if (!clients) return []

  return clients.map((client) => ({
    ...client,
    sessions: client.sessions || [],
    latest_session: client.sessions?.[0] || undefined,
  }))
}

export default async function DashboardPage() {
  const [stats, recentClients] = await Promise.all([
    getStats(),
    getRecentClients(),
  ])

  return (
    <>
      <Header
        title="Dashboard"
        subtitle="Vue d'ensemble de vos clients et questionnaires"
      />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <StatsCards stats={stats} />

        {/* Recent Clients */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Clients récents</h2>
            <CreateClientDialog />
          </div>

          {recentClients.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentClients.map((client) => (
                <ClientCard key={client.id} client={client} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
              <p className="text-slate-500 mb-4">
                Aucun client pour le moment.
              </p>
              <CreateClientDialog />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
