'use client'

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Logo } from '@/components/shared/logo'

interface IntroScreenProps {
  onStart: (businessName: string, websiteUrl: string) => void
}

export function IntroScreen({ onStart }: IntroScreenProps) {
  const [businessName, setBusinessName] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (businessName.trim()) {
      onStart(businessName.trim(), websiteUrl.trim())
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-fade-in">
      <div className="relative mb-4">
        <Logo size="lg" showText={false} />
      </div>

      <div className="space-y-2">
        <h1 className="text-6xl font-black tracking-tight text-slate-900">archetype</h1>
        <p className="text-xl text-slate-500 font-medium tracking-wide">
          DESIGN INTELLIGENCE PROFILER
        </p>
      </div>

      <p className="max-w-md text-slate-400">
        Définissez votre identité visuelle en 3 minutes.
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <div className="text-left space-y-2">
          <Label htmlFor="businessName" className="text-slate-700">
            Quel est le nom de votre business ? <span className="text-orange-500">*</span>
          </Label>
          <Input
            id="businessName"
            type="text"
            placeholder="Mon Entreprise"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            required
            className="h-12 text-lg"
          />
        </div>

        <div className="text-left space-y-2">
          <Label htmlFor="websiteUrl" className="text-slate-700">
            Site web actuel <span className="text-slate-400 text-sm">(optionnel)</span>
          </Label>
          <Input
            id="websiteUrl"
            type="url"
            placeholder="https://monsite.com"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            className="h-12 text-lg"
          />
        </div>

        <Button
          type="submit"
          variant="orange"
          size="xl"
          className="w-full mt-6"
          disabled={!businessName.trim()}
        >
          Commencer <ArrowRight size={20} />
        </Button>
      </form>
    </div>
  )
}
