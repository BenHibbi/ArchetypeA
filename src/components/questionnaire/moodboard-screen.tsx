'use client'

import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SKELETONS } from '@/config'
import { SkeletonCard } from './visualizations'

interface MoodboardScreenProps {
  likes: string[]
  onToggle: (id: string) => void
  onConfirm: () => void
}

export function MoodboardScreen({ likes, onToggle, onConfirm }: MoodboardScreenProps) {
  return (
    <div className="max-w-5xl mx-auto w-full animate-zoom-in h-[calc(100vh-180px)] flex flex-col">
      <div className="text-center mb-6 flex-shrink-0">
        <span className="text-teal-600 font-bold text-xs tracking-widest uppercase mb-2 block">
          Step 7
        </span>
        <h2 className="text-4xl font-bold text-slate-900">Moodboard Abstrait</h2>
        <p className="text-slate-500 text-lg mt-2">
          Sélectionnez les mises en page qui vous inspirent.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 flex-1 overflow-hidden">
        {SKELETONS.map((skel) => (
          <SkeletonCard
            key={skel.id}
            data={skel}
            isSelected={likes.includes(skel.id)}
            onToggle={() => onToggle(skel.id)}
          />
        ))}
      </div>

      <div className="flex justify-center pt-6 flex-shrink-0">
        <Button
          onClick={onConfirm}
          disabled={likes.length === 0}
          variant={likes.length > 0 ? 'default' : 'secondary'}
          size="xl"
          className={likes.length > 0 ? 'bg-slate-900 hover:bg-orange-500' : ''}
        >
          Confirmer ({likes.length}) <ArrowRight size={20} />
        </Button>
      </div>
    </div>
  )
}
