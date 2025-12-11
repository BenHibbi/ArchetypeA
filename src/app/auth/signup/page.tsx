'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Logo } from '@/components/shared/logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    if (password.length < 6) {
      setError('Le mot de passe doit faire au moins 6 caractères')
      setIsLoading(false)
      return
    }

    try {
      const supabase = createClient()

      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) {
        setError(authError.message)
        return
      }

      setSuccess(true)
    } catch (err) {
      setError('Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  const handleMagicLink = async () => {
    if (!email) {
      setError('Entrez votre email')
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      const supabase = createClient()

      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (authError) {
        setError(authError.message)
        return
      }

      setSuccess(true)
    } catch (err) {
      setError('Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Logo size="md" />
            </div>
            <CardTitle className="text-2xl text-green-600">Compte créé !</CardTitle>
            <CardDescription>
              Vérifiez votre email pour confirmer votre compte, puis connectez-vous.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="orange" className="w-full" onClick={() => router.push('/auth/login')}>
              Aller à la connexion
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Logo size="md" />
          </div>
          <CardTitle className="text-2xl">Créer un compte</CardTitle>
          <CardDescription>Accédez au Studio Archetype</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="vous@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="Min. 6 caractères"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" variant="orange" className="w-full" disabled={isLoading}>
              {isLoading ? 'Création...' : 'Créer mon compte'}
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-500">ou</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleMagicLink}
              disabled={isLoading}
            >
              {isLoading ? 'Envoi...' : 'Recevoir un lien par email'}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Déjà un compte ?{' '}
            <Link href="/auth/login" className="text-teal-600 hover:underline">
              Se connecter
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
