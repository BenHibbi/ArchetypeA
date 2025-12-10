'use client'

import { Users, Clock, CheckCircle, TrendingUp } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Card, CardContent } from '@/components/ui/card'
import { DashboardStats } from '@/types'

interface StatsCardsProps {
  stats: DashboardStats
}

export function StatsCards({ stats }: StatsCardsProps) {
  const t = useTranslations('studio.stats')

  const cards = [
    {
      key: 'totalClients',
      value: stats.total_clients,
      icon: Users,
      color: 'text-teal-600 bg-teal-100',
    },
    {
      key: 'pending',
      value: stats.pending_sessions,
      icon: Clock,
      color: 'text-yellow-600 bg-yellow-100',
    },
    {
      key: 'completed',
      value: stats.completed_sessions,
      icon: CheckCircle,
      color: 'text-green-600 bg-green-100',
    },
    {
      key: 'completionRate',
      value: `${stats.completion_rate}%`,
      icon: TrendingUp,
      color: 'text-orange-600 bg-orange-100',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.key}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 mb-1">{t(card.key)}</p>
                  <p className="text-3xl font-bold text-slate-900">{card.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${card.color}`}>
                  <Icon size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
