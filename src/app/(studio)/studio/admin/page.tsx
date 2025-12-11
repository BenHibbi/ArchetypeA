'use client'

import { useEffect, useState } from 'react'
import { Check, X, Clock, UserCheck, UserX, Shield, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface UserProfile {
  id: string
  user_id: string
  email: string
  status: 'pending' | 'approved' | 'rejected'
  requested_at: string
  approved_at: string | null
  approved_by: string | null
  notes: string | null
}

export default function AdminPage() {
  const [profiles, setProfiles] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchProfiles = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/users')
      if (!res.ok) {
        if (res.status === 401) {
          setError('Accès non autorisé. Cette page est réservée aux administrateurs.')
        } else {
          setError('Erreur lors du chargement des utilisateurs')
        }
        return
      }
      const data = await res.json()
      setProfiles(data.profiles || [])
    } catch {
      setError('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfiles()
  }, [])

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    setUpdating(id)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      if (res.ok) {
        // Rafraîchir la liste
        fetchProfiles()
      }
    } catch {
      console.error('Erreur lors de la mise à jour')
    } finally {
      setUpdating(null)
    }
  }

  const pendingProfiles = profiles.filter((p) => p.status === 'pending')
  const approvedProfiles = profiles.filter((p) => p.status === 'approved')
  const rejectedProfiles = profiles.filter((p) => p.status === 'rejected')

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <Shield className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-red-800 mb-2">Accès refusé</h2>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Administration</h1>
            <p className="text-slate-500">Gérer les demandes d'accès</p>
          </div>
          <Button onClick={fetchProfiles} variant="outline" size="sm" disabled={loading}>
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Clock className="text-orange-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">{pendingProfiles.length}</p>
                <p className="text-sm text-orange-700">En attente</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <UserCheck className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{approvedProfiles.length}</p>
                <p className="text-sm text-green-700">Approuvés</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                <UserX className="text-slate-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-600">{rejectedProfiles.length}</p>
                <p className="text-sm text-slate-700">Refusés</p>
              </div>
            </div>
          </div>
        </div>

        {/* En attente */}
        <div className="bg-white rounded-xl border border-slate-200 mb-6">
          <div className="px-6 py-4 border-b border-slate-200 bg-orange-50">
            <h2 className="font-semibold text-slate-900 flex items-center gap-2">
              <Clock size={18} className="text-orange-500" />
              En attente d'approbation ({pendingProfiles.length})
            </h2>
          </div>
          {loading ? (
            <div className="p-8 text-center text-slate-500">Chargement...</div>
          ) : pendingProfiles.length === 0 ? (
            <div className="p-8 text-center text-slate-500">Aucune demande en attente</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {pendingProfiles.map((profile) => (
                <div key={profile.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{profile.email}</p>
                    <p className="text-sm text-slate-500">
                      Inscrit le {formatDate(profile.requested_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:bg-red-50 hover:border-red-300"
                      onClick={() => updateStatus(profile.id, 'rejected')}
                      disabled={updating === profile.id}
                    >
                      <X size={16} />
                    </Button>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => updateStatus(profile.id, 'approved')}
                      disabled={updating === profile.id}
                    >
                      <Check size={16} className="mr-1" />
                      Approuver
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Approuvés */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="font-semibold text-slate-900 flex items-center gap-2">
              <UserCheck size={18} className="text-green-500" />
              Utilisateurs approuvés ({approvedProfiles.length})
            </h2>
          </div>
          {approvedProfiles.length === 0 ? (
            <div className="p-8 text-center text-slate-500">Aucun utilisateur approuvé</div>
          ) : (
            <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
              {approvedProfiles.map((profile) => (
                <div key={profile.id} className="px-6 py-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{profile.email}</p>
                    <p className="text-xs text-slate-400">
                      Approuvé le {profile.approved_at ? formatDate(profile.approved_at) : '-'}
                    </p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    Actif
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
