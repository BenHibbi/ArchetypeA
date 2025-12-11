'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, CreditCard, HelpCircle, FileText, Shield, Scale } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { NotificationBell } from '@/components/studio/notification-bell'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export function TopBar() {
  const router = useRouter()
  const t = useTranslations('studio.nav')
  const tMenu = useTranslations('studio.userMenu')
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userInitials, setUserInitials] = useState('AD')

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user?.email) {
        setUserEmail(user.email)
        // Get initials from email (first letter of email)
        const initials = user.email.substring(0, 2).toUpperCase()
        setUserInitials(initials)
      }
    }
    fetchUser()
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <header className="sticky top-0 z-50 h-16 bg-slate-900 text-white flex items-center justify-between px-6">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          <div className="w-4 h-4 rounded-full bg-teal-500" />
          <div className="w-4 h-4 rounded-full bg-orange-500" />
          <div className="w-4 h-4 rounded-full bg-yellow-400" />
        </div>
        <span className="font-bold tracking-tight">archetype</span>
        <span className="text-xs bg-orange-500 px-2 py-0.5 rounded-full">Studio</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <NotificationBell />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-9 w-9 cursor-pointer hover:ring-2 hover:ring-orange-500 transition-all">
              <AvatarFallback className="bg-teal-500 text-white text-sm font-medium">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64" align="end" sideOffset={8}>
            {/* User Info */}
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{userEmail || 'User'}</p>
                <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* My Plan */}
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider">
                {tMenu('myPlan')}
              </DropdownMenuLabel>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/studio/subscription">
                  <CreditCard className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span className="font-medium">Early Adopter</span>
                    <span className="text-xs text-muted-foreground">Beta gratuite</span>
                  </div>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />

            {/* Help & Support with sub-menu */}
            <DropdownMenuGroup>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="cursor-pointer">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>{tMenu('helpSupport')}</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/legal/mentions-legales">
                        <FileText className="mr-2 h-4 w-4" />
                        <span>{tMenu('legalNotice')}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/legal/cgu-cgv">
                        <Scale className="mr-2 h-4 w-4" />
                        <span>{tMenu('terms')}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/legal/confidentialite">
                        <Shield className="mr-2 h-4 w-4" />
                        <span>{tMenu('privacyPolicy')}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/legal/faq">
                        <HelpCircle className="mr-2 h-4 w-4" />
                        <span>{tMenu('faq')}</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />

            {/* Logout */}
            <DropdownMenuItem
              className="cursor-pointer text-red-600 focus:text-red-600"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t('logout')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
