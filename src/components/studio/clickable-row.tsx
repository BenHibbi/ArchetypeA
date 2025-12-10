'use client'

import { useRouter } from 'next/navigation'
import { ReactNode, MouseEvent } from 'react'

interface ClickableRowProps {
  href: string
  children: ReactNode
  className?: string
}

export function ClickableRow({ href, children, className = '' }: ClickableRowProps) {
  const router = useRouter()

  const handleClick = (e: MouseEvent<HTMLTableRowElement>) => {
    // Ne pas naviguer si on clique sur un bouton ou un lien
    const target = e.target as HTMLElement
    if (
      target.tagName === 'BUTTON' ||
      target.tagName === 'A' ||
      target.closest('button') ||
      target.closest('a')
    ) {
      return
    }
    router.push(href)
  }

  return (
    <tr className={className} onClick={handleClick}>
      {children}
    </tr>
  )
}
