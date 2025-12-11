'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import {
  Upload,
  Code,
  X,
  Send,
  Loader2,
  Check,
  Euro,
  Image as ImageIcon,
  Copy,
  Link,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { COPY_FEEDBACK_DURATION, SAVE_FEEDBACK_DURATION } from '@/config'

interface DesignSlot {
  id?: string
  slotNumber: number
  imageUrl: string | null
  htmlCode: string | null
  price: number | null
  title: string
}

interface ClientInfo {
  email: string
  name?: string
  businessName?: string
}

interface ShowroomBuilderProps {
  sessionId: string
  initialDesigns?: DesignSlot[]
  showroomStatus?: string | null
  onShowroomSent?: () => void
  client: ClientInfo
}

export function ShowroomBuilder({
  sessionId,
  initialDesigns = [],
  showroomStatus,
  onShowroomSent,
  client,
}: ShowroomBuilderProps) {
  const t = useTranslations('studio.showroom')
  const tCommon = useTranslations('common')
  const [designs, setDesigns] = useState<DesignSlot[]>(() => {
    // Initialize 3 slots
    const slots: DesignSlot[] = [1, 2, 3].map((num) => {
      const existing = initialDesigns.find((d) => d.slotNumber === num)
      return (
        existing || {
          slotNumber: num,
          imageUrl: null,
          htmlCode: null,
          price: null,
          title: `Design ${num}`,
        }
      )
    })
    return slots
  })

  const [activeTab, setActiveTab] = useState<Record<number, 'image' | 'html'>>({
    1: 'image',
    2: 'image',
    3: 'image',
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [saved, setSaved] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({})

  const handleImageUpload = async (slotNumber: number, file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const base64 = e.target?.result as string
      updateSlot(slotNumber, { imageUrl: base64, htmlCode: null })
    }
    reader.readAsDataURL(file)
  }

  const handlePaste = async (slotNumber: number, e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (!items) return

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item.type.startsWith('image/')) {
        e.preventDefault()
        const file = item.getAsFile()
        if (file) {
          handleImageUpload(slotNumber, file)
        }
        return
      }
    }
  }

  const updateSlot = (slotNumber: number, updates: Partial<DesignSlot>) => {
    setDesigns((prev) => prev.map((d) => (d.slotNumber === slotNumber ? { ...d, ...updates } : d)))
    setSaved(false)
  }

  const clearSlot = (slotNumber: number) => {
    updateSlot(slotNumber, {
      imageUrl: null,
      htmlCode: null,
      price: null,
      title: `Design ${slotNumber}`,
    })
  }

  const saveDesigns = async () => {
    setIsSaving(true)
    try {
      const supabase = createClient()

      for (const design of designs) {
        if (design.imageUrl || design.htmlCode) {
          await supabase.from('design_proposals').upsert(
            {
              session_id: sessionId,
              slot_number: design.slotNumber,
              image_url: design.imageUrl,
              html_code: design.htmlCode,
              price: design.price,
              title: design.title,
            },
            { onConflict: 'session_id,slot_number' }
          )
        } else if (design.id) {
          // Remove if cleared
          await supabase
            .from('design_proposals')
            .delete()
            .eq('session_id', sessionId)
            .eq('slot_number', design.slotNumber)
        }
      }

      setSaved(true)
      setTimeout(() => setSaved(false), SAVE_FEEDBACK_DURATION)
    } catch {
      // Error handled silently
    } finally {
      setIsSaving(false)
    }
  }

  const sendShowroom = async () => {
    // First save
    await saveDesigns()

    setIsSending(true)
    try {
      const supabase = createClient()

      await supabase
        .from('sessions')
        .update({
          showroom_status: 'sent',
          showroom_sent_at: new Date().toISOString(),
        })
        .eq('id', sessionId)

      // Send email to client
      await fetch('/api/email/send-showroom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          clientEmail: client.email,
          clientName: client.name || client.email.split('@')[0],
          businessName: client.businessName,
        }),
      })

      onShowroomSent?.()
    } catch {
      // Error handled silently
    } finally {
      setIsSending(false)
    }
  }

  const hasDesigns = designs.some((d) => d.imageUrl || d.htmlCode)
  const showroomUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/showroom/${sessionId}`

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-6 py-4 flex items-center justify-between">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <ImageIcon size={20} />
          {t('title')}
        </h3>
        {showroomStatus === 'sent' && (
          <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium">
            {t('sent')}
          </span>
        )}
      </div>

      {/* Design Slots */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {designs.map((design) => (
          <div
            key={design.slotNumber}
            className="border-2 border-dashed border-slate-200 rounded-xl p-4 hover:border-yellow-400 transition-colors"
            onPaste={(e) => handlePaste(design.slotNumber, e)}
          >
            {/* Slot Header */}
            <div className="flex items-center justify-between mb-3">
              <Input
                value={design.title}
                onChange={(e) => updateSlot(design.slotNumber, { title: e.target.value })}
                className="font-semibold text-sm border-0 p-0 h-auto focus-visible:ring-0"
                placeholder={`Design ${design.slotNumber}`}
              />
              {(design.imageUrl || design.htmlCode) && (
                <button
                  onClick={() => clearSlot(design.slotNumber)}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-3">
              <button
                onClick={() => setActiveTab((prev) => ({ ...prev, [design.slotNumber]: 'image' }))}
                className={`flex-1 text-xs py-1.5 rounded transition-colors ${
                  activeTab[design.slotNumber] === 'image'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                <Upload size={12} className="inline mr-1" /> {t('image')}
              </button>
              <button
                onClick={() => setActiveTab((prev) => ({ ...prev, [design.slotNumber]: 'html' }))}
                className={`flex-1 text-xs py-1.5 rounded transition-colors ${
                  activeTab[design.slotNumber] === 'html'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                <Code size={12} className="inline mr-1" /> {t('html')}
              </button>
            </div>

            {/* Content Area */}
            <div className="relative aspect-[4/3] bg-slate-50 rounded-lg overflow-hidden mb-3">
              {design.imageUrl ? (
                <Image
                  src={design.imageUrl}
                  alt={design.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  className="object-cover"
                />
              ) : design.htmlCode ? (
                <iframe
                  srcDoc={design.htmlCode}
                  className="w-full h-full border-0"
                  sandbox="allow-scripts"
                  title={design.title}
                />
              ) : activeTab[design.slotNumber] === 'image' ? (
                <label className="flex flex-col items-center justify-center h-full cursor-pointer hover:bg-slate-100 transition-colors">
                  <Upload size={24} className="text-slate-400 mb-2" />
                  <span className="text-xs text-slate-500">{t('dragOrPaste')}</span>
                  <input
                    ref={(el) => {
                      fileInputRefs.current[design.slotNumber] = el
                    }}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(design.slotNumber, file)
                    }}
                  />
                </label>
              ) : (
                <textarea
                  placeholder={t('pasteHtml')}
                  className="w-full h-full p-3 text-xs font-mono bg-transparent resize-none focus:outline-none"
                  onChange={(e) =>
                    updateSlot(design.slotNumber, { htmlCode: e.target.value, imageUrl: null })
                  }
                />
              )}
            </div>

            {/* Price Input */}
            <div className="flex items-center gap-2">
              <Euro size={14} className="text-slate-400" />
              <Input
                type="number"
                placeholder={t('price')}
                value={design.price || ''}
                onChange={(e) =>
                  updateSlot(design.slotNumber, { price: parseFloat(e.target.value) || null })
                }
                className="h-8 text-sm"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-t border-slate-200">
        <div className="text-sm text-slate-500">
          {hasDesigns ? (
            <span>
              {designs.filter((d) => d.imageUrl || d.htmlCode).length} {t('designsConfigured')}
            </span>
          ) : (
            <span>{t('addDesignPrompt')}</span>
          )}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={saveDesigns} disabled={isSaving || !hasDesigns}>
            {isSaving ? (
              <Loader2 size={16} className="animate-spin mr-2" />
            ) : saved ? (
              <Check size={16} className="mr-2 text-green-500" />
            ) : null}
            {saved ? tCommon('saved') : tCommon('save')}
          </Button>

          <Button onClick={sendShowroom} disabled={isSending || !hasDesigns} variant="orange">
            {isSending ? (
              <Loader2 size={16} className="animate-spin mr-2" />
            ) : (
              <Send size={16} className="mr-2" />
            )}
            {t('sendShowroom')}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              navigator.clipboard.writeText(showroomUrl)
              setLinkCopied(true)
              setTimeout(() => setLinkCopied(false), COPY_FEEDBACK_DURATION)
            }}
            className="relative"
            title={t('showroomLink')}
          >
            {linkCopied ? <Check size={16} className="text-green-500" /> : <Link size={16} />}
          </Button>
        </div>
      </div>

      {/* Showroom URL if sent */}
      {showroomStatus === 'sent' && (
        <div className="px-6 py-3 bg-amber-50 border-t border-amber-100">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-amber-700 font-medium">{t('showroomLink')}</span>
            <code className="bg-white px-2 py-1 rounded text-amber-800 font-mono text-xs">
              {showroomUrl}
            </code>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigator.clipboard.writeText(showroomUrl)}
              className="text-amber-600 hover:text-amber-700"
            >
              {tCommon('copy')}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
