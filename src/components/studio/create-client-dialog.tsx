'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Rocket, Copy, Check, ExternalLink } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { generateSessionUrl, copyToClipboard } from '@/lib/utils'

export function CreateClientDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [createdSession, setCreatedSession] = useState<{ id: string; url: string } | null>(null)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Créer le client avec juste l'email
      const clientRes = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!clientRes.ok) throw new Error('Failed to create client')
      const client = await clientRes.json()

      // Créer une session pour ce client
      const sessionRes = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id: client.id }),
      })

      if (!sessionRes.ok) throw new Error('Failed to create session')
      const session = await sessionRes.json()

      // Afficher le lien généré
      const url = generateSessionUrl(session.id)
      setCreatedSession({ id: session.id, url })

      router.refresh()
    } catch (error) {
      console.error('Error creating client:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async () => {
    if (createdSession) {
      await copyToClipboard(createdSession.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setEmail('')
    setCreatedSession(null)
    setCopied(false)
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) handleClose()
      else setOpen(true)
    }}>
      <DialogTrigger asChild>
        <Button variant="orange">
          <Rocket size={18} className="mr-2" />
          Nouvel Archetype
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        {!createdSession ? (
          // Étape 1 : Saisie de l'email
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Nouveau prospect</DialogTitle>
              <DialogDescription>
                Entrez l'email du prospect pour générer son lien personnalisé.
              </DialogDescription>
            </DialogHeader>

            <div className="py-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email du prospect</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="prospect@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  className="text-lg h-12"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="orange"
              className="w-full"
              size="lg"
              disabled={isLoading || !email}
            >
              {isLoading ? (
                'Création...'
              ) : (
                <>
                  <Rocket size={18} className="mr-2" />
                  Nouvel Archetype
                </>
              )}
            </Button>
          </form>
        ) : (
          // Étape 2 : Lien généré
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="text-green-600" size={18} />
                </div>
                Lien créé !
              </DialogTitle>
              <DialogDescription>
                Envoyez ce lien à <strong>{email}</strong> pour qu'il remplisse son questionnaire.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <p className="text-xs text-slate-500 mb-2">Lien personnel</p>
                <code className="text-sm text-teal-600 break-all block mb-4">
                  {createdSession.url}
                </code>
                <div className="flex gap-2">
                  <Button
                    variant="orange"
                    className="flex-1"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <>
                        <Check size={16} className="mr-2" />
                        Copié !
                      </>
                    ) : (
                      <>
                        <Copy size={16} className="mr-2" />
                        Copier le lien
                      </>
                    )}
                  </Button>
                  <a
                    href={createdSession.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline">
                      <ExternalLink size={16} />
                    </Button>
                  </a>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={handleClose}
            >
              Fermer
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
