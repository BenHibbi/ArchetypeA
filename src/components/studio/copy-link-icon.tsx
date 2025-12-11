'use client'

import { useState } from 'react'
import { Link2, Check } from 'lucide-react'
import { COPY_FEEDBACK_DURATION } from '@/config'
import { cn } from '@/lib/utils'

interface CopyLinkIconProps {
  url: string
  className?: string
  disabled?: boolean
}

export function CopyLinkIcon({ url, disabled = false, className }: CopyLinkIconProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (disabled || !url) return
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), COPY_FEEDBACK_DURATION)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center w-7 h-7 rounded-md transition-colors',
        disabled
          ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
          : copied
            ? 'bg-green-100 text-green-600'
            : 'bg-orange-100 text-orange-600 hover:bg-orange-200',
        className
      )}
      title={
        disabled
          ? 'Lien non disponible'
          : copied
            ? 'Lien copié !'
            : 'Copier le lien du questionnaire'
      }
    >
      {copied ? <Check size={14} /> : <Link2 size={14} />}
    </button>
  )
}
