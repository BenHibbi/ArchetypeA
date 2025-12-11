'use client'

import { useState, ReactNode } from 'react'
import { Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { COPY_FEEDBACK_DURATION } from '@/config'

interface CopyButtonProps {
  text: string
  label?: string
  variant?: 'outline' | 'ghost' | 'orange'
  className?: string
  children?: ReactNode
}

export function CopyButton({ text, label, variant = 'outline', className, children }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), COPY_FEEDBACK_DURATION)
  }

  const iconOnly = !label && !children

  return (
    <Button variant={variant} size="sm" onClick={handleCopy} className={className}>
      {copied ? (
        <>
          <Check size={14} className={iconOnly ? '' : 'mr-1'} />
          {children ? 'Lien copié !' : (!iconOnly && 'Copié')}
        </>
      ) : (
        <>
          {!children && <Copy size={14} className={iconOnly ? '' : 'mr-1'} />}
          {children || label}
        </>
      )}
    </Button>
  )
}
