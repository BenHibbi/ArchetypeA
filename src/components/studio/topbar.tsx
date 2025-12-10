'use client'

import Link from 'next/link'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export function TopBar() {
  return (
    <header className="sticky top-0 z-50 h-16 bg-slate-900 text-white flex items-center justify-between px-6">
      {/* Logo */}
      <Link href="/studio/clients">
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

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative text-slate-300 hover:text-white hover:bg-slate-800">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full" />
        </Button>

        <Avatar className="h-9 w-9 cursor-pointer">
          <AvatarFallback className="bg-teal-500 text-white text-sm font-medium">AD</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
