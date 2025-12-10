'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { Check, Sparkles, Mail, Phone, Loader2, PartyPopper, ArrowLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Logo } from '@/components/shared/logo'
import { LoadingScreen } from '@/components/shared/loading'
import { ShowroomChat } from '@/components/showroom/showroom-chat'
import { cn } from '@/lib/utils'

interface DesignProposal {
  id: string
  slot_number: number
  image_url: string | null
  html_code: string | null
  price: number | null
  title: string
}

interface ShowroomSelection {
  id: string
  session_id: string
  selected_proposal_id: string
  action_type: 'quote_request' | 'signed'
  discount_applied: boolean
  final_price: number | null
  client_email: string | null
  client_phone: string | null
  client_message: string | null
  created_at: string
}

interface ShowroomData {
  sessionId: string
  businessName: string | null
  designBrief: string | null
  designs: DesignProposal[]
  existingSelection: ShowroomSelection | null
}

export default function ShowroomPage() {
  const params = useParams()
  const sessionId = params.sessionId as string
  const t = useTranslations('showroom')
  const tCommon = useTranslations('common')

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
          setError('notFound')
          setIsLoading(false)
          return
        }

        if (session.showroom_status !== 'sent') {
          setError('notAvailable')
          setIsLoading(false)
          return
        }

        const { data: response } = await supabase
          .from('responses')
          .select('business_name, generated_brief')
          .eq('session_id', sessionId)
          .single() as { data: { business_name: string | null; generated_brief: string | null } | null }

        const { data: designs } = await supabase
          .from('design_proposals')
          .select('*')
          .eq('session_id', sessionId)
          .order('slot_number', { ascending: true })

        if (!designs || designs.length === 0) {
          setError('noDesigns')
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
          designBrief: response?.generated_brief || null,
          designs: designs || [],
          existingSelection,
        })

        if (existingSelection) {
          setStep('success')
        }

        setIsLoading(false)
      } catch (err) {
        setError('notFound')
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

      // Send notification email to admin + confirmation to client
      await fetch('/api/email/notify-interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientEmail: formData.email,
          clientPhone: formData.phone,
          clientMessage: formData.message,
          businessName: data?.businessName,
          designTitle: selectedDesign.title,
          actionType,
          finalPrice,
        }),
      })

      setStep('success')
    } catch {
      // Error handled silently
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
          <p className="text-slate-500">{t(error)}</p>
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
          <h2 className="text-3xl font-black text-slate-900 mb-4">{t('thankYou')}</h2>
          <p className="text-slate-600 text-lg mb-2">
            {data.existingSelection?.action_type === 'signed' || actionType === 'signed'
              ? t('orderConfirmed')
              : t('requestSent')}
          </p>
          <p className="text-slate-400">{t('teamWillContact')}</p>
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
              {tCommon('back')}
            </button>

            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              {/* Summary Header */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6">
                <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">
                  {t('yourSelection')}
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
                    {t('email')} <span className="text-orange-500">*</span>
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
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    {t('phone')}
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
                      placeholder="+1 234 567 890"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    {t('message')} <span className="text-slate-400">{t('messageOptional')}</span>
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg p-3 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder={t('messagePlaceholder')}
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
                      {t('sending')}
                    </>
                  ) : actionType === 'signed' ? (
                    t('confirmOrder')
                  ) : (
                    t('sendRequest')
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

      <main className={cn(
        'px-4 md:px-8',
        selectedDesign ? 'pt-20 pb-32' : 'pt-24 pb-40'
      )}>
        <div className="max-w-[95vw] mx-auto">
          {/* Hero - Compact, hidden when design selected */}
          <div className={cn(
            'text-center transition-all duration-300 overflow-hidden',
            selectedDesign ? 'h-0 opacity-0 mb-0' : 'mb-8'
          )}>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 mb-2">
              {t('title')}
            </h1>
            <p className="text-base text-slate-500">
              {t('subtitle')}
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
                <div
                  key={design.id}
                  onClick={() => handleSelectDesign(design)}
                  className={cn(
                    'group relative rounded-xl transition-all duration-500 ease-out cursor-pointer',
                    'hover:shadow-2xl',
                    // Dynamic sizing based on selection
                    isSelected && 'md:flex-none w-fit mx-auto z-10',
                    isNotSelected && 'md:flex-[0.5] opacity-50 hover:opacity-80 scale-95 overflow-hidden',
                    !hasSelection && 'md:flex-1 hover:-translate-y-2 overflow-hidden',
                    // Ring styling
                    isSelected
                      ? 'ring-4 ring-orange-500 shadow-2xl shadow-orange-500/30'
                      : 'ring-1 ring-slate-200 hover:ring-slate-300'
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute top-4 right-4 z-20 bg-orange-500 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-xl animate-zoom-in">
                      <Check size={22} strokeWidth={3} />
                    </div>
                  )}

                  {/* Design Image - always maintain dimensions */}
                  <div
                    className={cn(
                      'relative bg-slate-100 transition-all duration-500 rounded-xl overflow-hidden',
                      'aspect-video min-h-[40vh] max-h-[70vh]',
                    )}
                  >
                    {design.image_url ? (
                      <Image
                        src={design.image_url}
                        alt="Design proposal"
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        priority={index === 0}
                        className={cn(
                          'transition-all duration-500 object-cover object-top',
                          !isSelected && 'group-hover:scale-105',
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
                        <span className="text-slate-300 text-sm">Preview</span>
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
                </div>
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
                  <span className="text-sm font-medium text-slate-600">{t('designSelected')}</span>
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
                  {t('interested')}
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
                    disabled
                    className="flex-1 md:flex-none gap-2 opacity-50 cursor-not-allowed"
                  >
                    <Sparkles size={16} />
                    {t('signDiscount')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chatbot */}
      <ShowroomChat sessionId={sessionId} designBrief={data.designBrief} />
    </div>
  )
}
