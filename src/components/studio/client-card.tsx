'use client'

import Link from 'next/link'
import { ExternalLink, Mail, Globe, MoreVertical } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ClientWithSession } from '@/types'
import {
  formatDate,
  getInitials,
  generateSessionUrl,
} from '@/lib/utils'

interface ClientCardProps {
  client: ClientWithSession
}

export function ClientCard({ client }: ClientCardProps) {
  const t = useTranslations('studio.card')
  const tStatus = useTranslations('studio.clients.status')
  const latestSession = client.latest_session
  const status = latestSession?.status || 'no_session'

  const statusVariant =
    status === 'completed'
      ? 'success'
      : status === 'in_progress'
      ? 'warning'
      : 'pending'

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-teal-100 text-teal-700 font-bold">
                {getInitials(client.company_name || client.email)}
              </AvatarFallback>
            </Avatar>
            <div>
              <Link
                href={`/studio/clients/${client.id}`}
                className="font-bold text-slate-900 hover:text-teal-600 transition-colors"
              >
                {client.company_name || client.email}
              </Link>
              {client.contact_name && (
                <p className="text-sm text-slate-500">{client.contact_name}</p>
              )}
            </div>
          </div>
          <Badge variant={statusVariant}>
            {latestSession ? tStatus(status) : t('noSession')}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {/* Contact info */}
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-1">
              <Mail size={14} />
              <span className="truncate max-w-[150px]">{client.email}</span>
            </div>
            {client.website_url && (
              <a
                href={client.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-teal-600"
              >
                <Globe size={14} />
                <span>{t('website')}</span>
              </a>
            )}
          </div>

          {/* Session info */}
          {latestSession && (
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-400">
                {t('createdAt')} {formatDate(client.created_at)}
              </span>
              {latestSession.status === 'pending' && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-teal-600 hover:text-teal-700"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      generateSessionUrl(latestSession.id)
                    )
                  }}
                >
                  <ExternalLink size={14} className="mr-1" />
                  {t('copyLink')}
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
