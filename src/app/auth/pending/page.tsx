'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Clock, Mail, CheckCircle, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export default function PendingApprovalPage() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected' | 'loading'>('loading')

  useEffect(() => {
    const checkStatus = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/login')
        return
      }

      setUserEmail(user.email || null)

      // Check approval status
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('status')
        .eq('user_id', user.id)
        .single()

      if (profile?.status === 'approved') {
        router.push('/studio')
        return
      }

      setStatus(profile?.status || 'pending')
    }

    checkStatus()

    // Poll every 30 seconds to check if approved
    const interval = setInterval(checkStatus, 30000)
    return () => clearInterval(interval)
  }, [router])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (status === 'rejected') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">❌</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-3">Demande refusée</h1>
          <p className="text-slate-600 mb-6">
            Votre demande d'accès a été refusée. Si vous pensez qu'il s'agit d'une erreur,
            contactez-nous à support@archetype.design.
          </p>
          <Button onClick={handleLogout} variant="outline" className="w-full">
            <LogOut size={18} className="mr-2" />
            Se déconnecter
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex -space-x-2">
            <div className="w-4 h-4 rounded-full bg-teal-500" />
            <div className="w-4 h-4 rounded-full bg-orange-500" />
            <div className="w-4 h-4 rounded-full bg-yellow-400" />
          </div>
          <span className="font-bold tracking-tight text-slate-900">archetype</span>
        </div>

        {/* Pending Icon */}
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock size={40} className="text-orange-500" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-3">
          En attente d'approbation
        </h1>

        <p className="text-slate-600 mb-6">
          Merci pour votre inscription ! Votre demande d'accès est en cours de validation.
          Vous recevrez un email dès que votre compte sera approuvé.
        </p>

        <div className="bg-slate-50 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-center gap-2 text-slate-500">
            <Mail size={18} />
            <span className="font-medium">{userEmail}</span>
          </div>
        </div>

        <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <CheckCircle size={20} className="text-teal-600 mt-0.5 flex-shrink-0" />
            <div className="text-left">
              <p className="text-sm font-medium text-teal-800">Beta Early Adopter</p>
              <p className="text-xs text-teal-600 mt-1">
                Vous faites partie des premiers utilisateurs ! Une fois approuvé, vous aurez accès
                gratuitement à toutes les fonctionnalités pendant la phase de beta.
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-400 mb-6">
          La validation est généralement effectuée sous 24h.
        </p>

        <Button onClick={handleLogout} variant="outline" className="w-full">
          <LogOut size={18} className="mr-2" />
          Se déconnecter
        </Button>
      </div>
    </div>
  )
}
