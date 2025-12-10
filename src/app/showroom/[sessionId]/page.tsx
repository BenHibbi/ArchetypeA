'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Check, Sparkles, Mail, Phone, Loader2, PartyPopper, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Logo } from '@/components/shared/logo'
import { LoadingScreen } from '@/components/shared/loading'
import { cn } from '@/lib/utils'

interface DesignProposal {
  id: string
  slot_number: number
  image_url: string | null
  html_code: string | null
  price: number | null
  title: string
}

interface ShowroomData {
  sessionId: string
  businessName: string | null
  designs: DesignProposal[]
  existingSelection: any | null
}

export default function ShowroomPage() {
  const params = useParams()
  const sessionId = params.sessionId as string

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<ShowroomData | null>(null)

  const [selectedDesign, setSelectedDesign] = useState<DesignProposal | null>(null)
  const [step, setStep] = useState<'select' | 'confirm' | 'success'>('select')
  const [actionType, setActionType] = useState<'quote_request' | 'signed' | null>(null)

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    async function loadShowroom() {
      try {
        const supabase = createClient()

        const { data: session, error: sessionError } = await supabase
          .from('sessions')
          .select('id, showroom_status')
          .eq('id', sessionId)
          .single()

        if (sessionError || !session) {
          setError('Showroom introuvable.')
          setIsLoading(false)
          return
        }

        if (session.showroom_status !== 'sent') {
          setError("Ce showroom n'est pas encore disponible.")
          setIsLoading(false)
          return
        }

        const { data: response } = await supabase
          .from('responses')
          .select('business_name')
          .eq('session_id', sessionId)
          .single()

        const { data: designs } = await supabase
          .from('design_proposals')
          .select('*')
          .eq('session_id', sessionId)
          .order('slot_number', { ascending: true })

        if (!designs || designs.length === 0) {
          setError('Aucun design disponible.')
          setIsLoading(false)
          return
        }

        const { data: existingSelection } = await supabase
          .from('showroom_selections')
          .select('*')
          .eq('session_id', sessionId)
          .single()

        setData({
          sessionId,
          businessName: response?.business_name || null,
          designs,
          existingSelection,
        })

        if (existingSelection) {
          setStep('success')
        }

        setIsLoading(false)
      } catch (err) {
        setError('Erreur de chargement')
        setIsLoading(false)
      }
    }

    loadShowroom()
  }, [sessionId])

  const handleSelectDesign = (design: DesignProposal) => {
    setSelectedDesign(design)
  }

  const handleAction = (action: 'quote_request' | 'signed') => {
    setActionType(action)
    setStep('confirm')
  }

  const handleSubmit = async () => {
    if (!selectedDesign || !actionType) return

    setIsSubmitting(true)
    try {
      const supabase = createClient()

      const finalPrice =
        actionType === 'signed' && selectedDesign.price
          ? selectedDesign.price * 0.85
          : selectedDesign.price

      await supabase.from('showroom_selections').insert({
        session_id: sessionId,
        selected_proposal_id: selectedDesign.id,
        action_type: actionType,
        discount_applied: actionType === 'signed',
        final_price: finalPrice,
        client_email: formData.email,
        client_phone: formData.phone,
        client_message: formData.message,
      })

      await supabase
        .from('sessions')
        .update({ showroom_status: actionType === 'signed' ? 'signed' : 'quote_requested' })
        .eq('id', sessionId)

      setStep('success')
    } catch (err) {
      console.error('Error submitting selection:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatPrice = (price: number | null) => {
    if (!price) return '-'
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Logo size="md" className="justify-center mb-6" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Oops!</h1>
          <p className="text-slate-500">{error}</p>
        </div>
      </div>
    )
  }

  if (!data) return null

  // Success Screen
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-12 max-w-md text-center animate-zoom-in">
          <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <PartyPopper className="text-teal-600" size={40} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4">Merci !</h2>
          <p className="text-slate-600 text-lg mb-2">
            {data.existingSelection?.action_type === 'signed' || actionType === 'signed'
              ? 'Votre commande a été confirmée.'
              : 'Votre demande a bien été envoyée.'}
          </p>
          <p className="text-slate-400">Notre équipe vous recontactera très rapidement.</p>
        </div>
      </div>
    )
  }

  // Confirm Screen (Form)
  if (step === 'confirm' && selectedDesign) {
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <header className="fixed top-0 w-full h-16 bg-white/80 backdrop-blur-md z-50 border-b border-slate-200 flex items-center justify-between px-6 md:px-12">
          <Logo size="sm" />
          {data.businessName && (
            <span className="text-sm text-slate-500 font-medium">{data.businessName}</span>
          )}
        </header>

        <main className="pt-32 pb-20 px-6 md:px-12">
          <div className="max-w-md mx-auto">
            <button
              onClick={() => setStep('select')}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition-colors"
            >
              <ArrowLeft size={16} />
              Retour
            </button>

            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              {/* Summary Header */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6">
                <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">
                  Votre sélection
                </p>
                <div className="flex items-baseline gap-3">
                  {actionType === 'signed' && selectedDesign.price ? (
                    <>
                      <span className="text-slate-500 line-through text-lg">
                        {formatPrice(selectedDesign.price)}
                      </span>
                      <span className="text-3xl font-black text-orange-400">
                        {formatPrice(selectedDesign.price * 0.85)}
                      </span>
                      <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        -15%
                      </span>
                    </>
                  ) : (
                    <span className="text-3xl font-black">{formatPrice(selectedDesign.price)}</span>
                  )}
                </div>
              </div>

              {/* Form */}
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Email <span className="text-orange-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <Input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Téléphone
                  </label>
                  <div className="relative">
                    <Phone
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="pl-10"
                      placeholder="06 12 34 56 78"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Message <span className="text-slate-400">(optionnel)</span>
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg p-3 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Des précisions sur votre projet..."
                  />
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={!formData.email || isSubmitting}
                  variant="orange"
                  size="xl"
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin mr-2" />
                      Envoi en cours...
                    </>
                  ) : actionType === 'signed' ? (
                    'Confirmer ma commande'
                  ) : (
                    'Envoyer ma demande'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Main Selection Screen
  const designCount = data.designs.length

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-orange-200 selection:text-orange-900">
      {/* Header */}
      <header className="fixed top-0 w-full h-16 bg-white/80 backdrop-blur-md z-50 border-b border-slate-200 flex items-center justify-between px-6 md:px-12">
        <Logo size="sm" />
        {data.businessName && (
          <span className="text-sm text-slate-500 font-medium">{data.businessName}</span>
        )}
      </header>

      <main className="pt-24 pb-40 px-4 md:px-8">
        <div className="max-w-[95vw] mx-auto">
          {/* Hero - Compact */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 mb-2">
              Vos propositions
            </h1>
            <p className="text-base text-slate-500">
              Cliquez pour sélectionner le design qui vous correspond.
            </p>
          </div>

          {/* Designs Grid - Full width with dynamic sizing */}
          <div
            className={cn(
              'flex flex-col md:flex-row gap-4 items-stretch justify-center transition-all duration-500',
              designCount === 1 && 'max-w-[80vw] mx-auto',
              designCount === 2 && 'max-w-[90vw] mx-auto',
              designCount === 3 && 'w-full'
            )}
          >
            {data.designs.map((design, index) => {
              const isSelected = selectedDesign?.id === design.id
              const hasSelection = selectedDesign !== null
              const isNotSelected = hasSelection && !isSelected

              return (
                <button
                  key={design.id}
                  onClick={() => handleSelectDesign(design)}
                  className={cn(
                    'group relative rounded-xl overflow-hidden transition-all duration-500 ease-out',
                    'hover:shadow-2xl',
                    // Dynamic sizing based on selection - more dramatic
                    isSelected && 'md:flex-[3] z-10',
                    isNotSelected && 'md:flex-[0.5] opacity-50 hover:opacity-80 scale-95',
                    !hasSelection && 'md:flex-1 hover:-translate-y-2',
                    // Ring styling
                    isSelected
                      ? 'ring-4 ring-orange-500 shadow-2xl shadow-orange-500/30'
                      : 'ring-1 ring-slate-200 hover:ring-slate-300'
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute top-4 right-4 z-10 bg-orange-500 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-xl animate-zoom-in">
                      <Check size={22} strokeWidth={3} />
                    </div>
                  )}

                  {/* Design Image - 16/9 format with min height for maximum size */}
                  <div
                    className={cn(
                      'bg-slate-100 overflow-hidden transition-all duration-500',
                      'aspect-video min-h-[50vh]',
                    )}
                  >
                    {design.image_url ? (
                      <img
                        src={design.image_url}
                        alt="Design"
                        className={cn(
                          'w-full h-full object-cover object-top transition-all duration-500',
                          'group-hover:scale-105',
                          isNotSelected && 'grayscale-[40%] group-hover:grayscale-0'
                        )}
                      />
                    ) : design.html_code ? (
                      <iframe
                        srcDoc={design.html_code}
                        className="w-full h-full border-0 pointer-events-none"
                        sandbox=""
                        title="Design"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                        <span className="text-slate-300 text-sm">Aperçu</span>
                      </div>
                    )}
                  </div>

                  {/* Subtle hover overlay */}
                  <div
                    className={cn(
                      'absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300',
                      'group-hover:opacity-100',
                      isSelected && 'opacity-0 group-hover:opacity-0'
                    )}
                  />
                </button>
              )
            })}
          </div>
        </div>
      </main>

      {/* Fixed Footer - Only visible when design is selected */}
      {selectedDesign && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl shadow-slate-900/10 animate-slide-in-from-bottom">
          <div className="max-w-5xl mx-auto px-6 py-5">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Price Display */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse" />
                  <span className="text-sm font-medium text-slate-600">Design sélectionné</span>
                </div>
                {selectedDesign.price && (
                  <div className="text-2xl font-black text-slate-900">
                    {formatPrice(selectedDesign.price)}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => handleAction('quote_request')}
                  className="flex-1 md:flex-none"
                >
                  Je suis intéressé
                </Button>

                <div className="relative">
                  {selectedDesign.price && (
                    <div className="absolute -top-6 right-0 flex items-center gap-1.5 text-xs whitespace-nowrap">
                      <span className="text-slate-400 line-through">
                        {formatPrice(selectedDesign.price)}
                      </span>
                      <span className="font-bold text-orange-500">
                        {formatPrice(selectedDesign.price * 0.85)}
                      </span>
                    </div>
                  )}
                  <Button
                    variant="orange"
                    size="lg"
                    onClick={() => handleAction('signed')}
                    className="flex-1 md:flex-none gap-2"
                  >
                    <Sparkles size={16} />
                    Signer (-15%)
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
