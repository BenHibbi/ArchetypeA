'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CopyButtonProps {
  text: string
  label?: string
  variant?: 'outline' | 'ghost'
}

export function CopyButton({ text, label, variant = 'outline' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const iconOnly = !label

  return (
    <Button variant={variant} size="sm" onClick={handleCopy}>
      {copied ? (
        <>
          <Check size={14} className={iconOnly ? '' : 'mr-1'} />
          {!iconOnly && 'Copié'}
        </>
      ) : (
        <>
          <Copy size={14} className={iconOnly ? '' : 'mr-1'} />
          {label}
        </>
      )}
    </Button>
  )
}
