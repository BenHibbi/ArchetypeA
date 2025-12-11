'use client'

import { useState } from 'react'
import { Link2, Check } from 'lucide-react'
import { COPY_FEEDBACK_DURATION } from '@/config'
import { cn } from '@/lib/utils'

interface CopyLinkIconProps {
  url: string
  className?: string
}

export function CopyLinkIcon({ url, className }: CopyLinkIconProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), COPY_FEEDBACK_DURATION)
  }

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'inline-flex items-center justify-center w-7 h-7 rounded-md transition-colors',
        copied
          ? 'bg-green-100 text-green-600'
          : 'bg-orange-100 text-orange-600 hover:bg-orange-200',
        className
      )}
      title={copied ? 'Lien copié !' : 'Copier le lien du questionnaire'}
    >
      {copied ? <Check size={14} /> : <Link2 size={14} />}
    </button>
  )
}
