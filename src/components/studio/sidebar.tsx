'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { Logo } from '@/components/shared/logo'
import { Button } from '@/components/ui/button'
import { STUDIO_NAV } from '@/config/navigation'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <Link href="/studio">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              <div className="w-4 h-4 rounded-full bg-teal-500" />
              <div className="w-4 h-4 rounded-full bg-orange-500" />
              <div className="w-4 h-4 rounded-full bg-yellow-400" />
            </div>
            <span className="font-bold tracking-tight">archetype</span>
            <span className="text-xs bg-orange-500 px-2 py-0.5 rounded-full">Studio</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {STUDIO_NAV.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                    isActive
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  )}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.title}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800">
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800"
          onClick={handleLogout}
        >
          <LogOut size={20} className="mr-3" />
          Déconnexion
        </Button>
      </div>
    </aside>
  )
}
