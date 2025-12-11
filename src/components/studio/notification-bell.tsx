'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Bell, CheckCheck, User } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { createClient } from '@/lib/supabase/client'

interface Notification {
  id: string
  clientId: string
  clientEmail: string
  companyName: string | null
  completedAt: string
  isRead: boolean
}

function getTimeAgo(dateString: string, t: ReturnType<typeof useTranslations>): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMinutes < 1) return t('justNow')
  if (diffMinutes < 60) return t('minutesAgo', { count: diffMinutes })
  if (diffHours < 24) return t('hoursAgo', { count: diffHours })
  return t('daysAgo', { count: diffDays })
}

export function NotificationBell() {
  const t = useTranslations('studio.notifications')
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasUnread, setHasUnread] = useState(false)

  const fetchNotifications = async () => {
    const supabase = createClient()

    // Get recently completed sessions with client info (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { data: sessions, error } = await supabase
      .from('sessions')
      .select(
        `
        id,
        completed_at,
        client_id,
        clients (
          id,
          email,
          company_name
        )
      `
      )
      .eq('status', 'completed')
      .not('completed_at', 'is', null)
      .gte('completed_at', sevenDaysAgo.toISOString())
      .order('completed_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error('Error fetching notifications:', error)
      setIsLoading(false)
      return
    }

    // Get read notification IDs from localStorage
    const readIds = JSON.parse(localStorage.getItem('readNotifications') || '[]')

    const notifs: Notification[] = (sessions || []).map((session: any) => ({
      id: session.id,
      clientId: session.client_id,
      clientEmail: session.clients?.email || 'Unknown',
      companyName: session.clients?.company_name,
      completedAt: session.completed_at,
      isRead: readIds.includes(session.id),
    }))

    setNotifications(notifs)
    setHasUnread(notifs.some((n) => !n.isRead))
    setIsLoading(false)
  }

  useEffect(() => {
    fetchNotifications()

    // Set up realtime subscription for new completions
    const supabase = createClient()
    const channel = supabase
      .channel('session-completions')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'sessions',
          filter: 'status=eq.completed',
        },
        () => {
          fetchNotifications()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const markAllAsRead = () => {
    const allIds = notifications.map((n) => n.id)
    localStorage.setItem('readNotifications', JSON.stringify(allIds))
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    setHasUnread(false)
  }

  const markAsRead = (id: string) => {
    const readIds = JSON.parse(localStorage.getItem('readNotifications') || '[]')
    if (!readIds.includes(id)) {
      readIds.push(id)
      localStorage.setItem('readNotifications', JSON.stringify(readIds))
    }
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
    setHasUnread(notifications.some((n) => n.id !== id && !n.isRead))
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-slate-300 hover:text-white hover:bg-slate-800"
        >
          <Bell size={20} />
          {hasUnread && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full" />
          )}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-orange-500 rounded-full text-[10px] font-bold flex items-center justify-center text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" sideOffset={8}>
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>{t('title')}</span>
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
              onClick={markAllAsRead}
            >
              <CheckCheck size={14} className="mr-1" />
              {t('markAllRead')}
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {isLoading ? (
          <div className="py-6 text-center text-sm text-muted-foreground">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            {t('noNotifications')}
          </div>
        ) : (
          <div className="max-h-[300px] overflow-y-auto">
            {notifications.map((notif) => (
              <DropdownMenuItem key={notif.id} className="cursor-pointer p-0" asChild>
                <Link
                  href={`/studio/clients/${notif.clientId}`}
                  onClick={() => markAsRead(notif.id)}
                  className="flex items-start gap-3 p-3 w-full"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      notif.isRead ? 'bg-slate-100' : 'bg-orange-100'
                    }`}
                  >
                    <User
                      size={16}
                      className={notif.isRead ? 'text-slate-500' : 'text-orange-600'}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm ${notif.isRead ? 'text-muted-foreground' : 'font-medium'}`}
                    >
                      <span className="font-semibold">
                        {notif.companyName || notif.clientEmail}
                      </span>{' '}
                      {t('questionnaireCompleted')}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {getTimeAgo(notif.completedAt, t)}
                    </p>
                  </div>
                  {!notif.isRead && (
                    <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-2" />
                  )}
                </Link>
              </DropdownMenuItem>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
