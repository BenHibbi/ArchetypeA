'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

interface DeleteClientButtonProps {
  clientId: string
}

export function DeleteClientButton({ clientId }: DeleteClientButtonProps) {
  const t = useTranslations('studio.clients')
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(t('confirmDelete'))) return

    setIsDeleting(true)
    try {
      const supabase = createClient()
      await supabase.from('clients').delete().eq('id', clientId)
      router.refresh()
    } catch {
      // Error handled silently
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-slate-400 hover:text-red-500 hover:bg-red-50"
    >
      {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
    </Button>
  )
}
