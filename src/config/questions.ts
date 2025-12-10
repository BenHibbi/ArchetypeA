import { Question } from '@/types'

export const QUESTIONS: Question[] = [
  {
    id: 'ambiance',
    question: "Quelle ambiance générale ?",
    subtitle: "L'atmosphère immédiate.",
    layout: 'grid-cols-2 sm:grid-cols-3',
    options: [
      { id: 'minimal', label: 'Minimal', desc: 'Less is more.', viz: 'minimal' },
      { id: 'bold', label: 'Bold', desc: 'Fort et bruyant.', viz: 'bold' },
      { id: 'corporate', label: 'Corporate', desc: 'Sérieux & fiable.', viz: 'corporate' },
      { id: 'soft', label: 'Soft', desc: 'Accueillant.', viz: 'soft' },
      { id: 'futuristic', label: 'Futuristic', desc: 'High-tech.', viz: 'futuristic' },
      { id: 'editorial', label: 'Editorial', desc: 'Style magazine.', viz: 'editorial' },
    ]
  },
  {
    id: 'valeurs',
    question: "Que doit transmettre le site ?",
    subtitle: "L'émotion clé.",
    layout: 'grid-cols-2',
    options: [
      { id: 'confiance', label: 'Confiance' },
      { id: 'creativite', label: 'Créativité' },
      { id: 'performance', label: 'Performance' },
      { id: 'simplicite', label: 'Simplicité' },
      { id: 'luxe', label: 'Luxe Discret' },
      { id: 'accessibilite', label: 'Accessibilité' },
    ]
  },
  {
    id: 'structure',
    question: "Structure désirée ?",
    subtitle: "La densité de l'information.",
    layout: 'grid-cols-2 sm:grid-cols-3',
    options: [
      { id: 'simple', label: 'Focus', desc: '1-3 sections', viz: 'simple' },
      { id: 'standard', label: 'Standard', desc: 'Classique', viz: 'standard' },
      { id: 'rich', label: 'Dense', desc: 'Portail complet', viz: 'rich' },
      { id: 'fullscreen', label: 'Immersif', desc: 'Plein écran', viz: 'fullscreen' },
      { id: 'masonry', label: 'Masonry', desc: 'Style Pinterest', viz: 'masonry' },
      { id: 'bento', label: 'Bento', desc: 'Grille modulaire', viz: 'bento' },
    ]
  },
  {
    id: 'typo',
    question: "Typographie ?",
    subtitle: "La voix du texte.",
    layout: 'grid-cols-2',
    options: [
      { id: 'fine', label: 'Fine / Légère', style: 'font-sans font-light tracking-wide' },
      { id: 'bold', label: 'Bold / Impactante', style: 'font-sans font-black tracking-tight uppercase' },
      { id: 'serif', label: 'Serif Élégante', style: 'font-serif italic' },
      { id: 'modern', label: 'Sans-serif Moderne', style: 'font-sans font-medium' },
      { id: 'variable', label: 'Variable / Tech', style: 'font-mono' },
      { id: 'retro', label: 'Retro / Soft', style: 'font-serif font-bold text-orange-700' },
    ]
  },
  {
    id: 'ratio',
    question: "Ratio Image / Texte ?",
    subtitle: "L'équilibre visuel.",
    layout: 'grid-cols-3',
    options: [
      { id: 'image_heavy', label: 'Visuel', viz: 'img' },
      { id: 'mix', label: 'Équilibré', viz: 'mix' },
      { id: 'text_heavy', label: 'Textuel', viz: 'txt' },
    ]
  },
  {
    id: 'palette',
    question: "Palette ?",
    subtitle: "L'univers colorimétrique.",
    layout: 'grid-cols-2 sm:grid-cols-3',
    options: [
      { id: 'cold', label: 'Froid / Tech', colors: ['bg-slate-900', 'bg-blue-600', 'bg-cyan-400', 'bg-indigo-500', 'bg-sky-300'] },
      { id: 'warm', label: 'Chaud / Convivial', colors: ['bg-orange-500', 'bg-amber-400', 'bg-red-400', 'bg-yellow-300', 'bg-stone-200'] },
      { id: 'bw', label: 'Noir & Blanc', colors: ['bg-black', 'bg-zinc-800', 'bg-zinc-500', 'bg-zinc-300', 'bg-white'] },
      { id: 'accent', label: 'Minimal Coloré', colors: ['bg-white', 'bg-zinc-100', 'bg-zinc-200', 'bg-teal-500', 'bg-emerald-400'] },
      { id: 'pastel', label: 'Pastel', colors: ['bg-rose-200', 'bg-pink-200', 'bg-purple-200', 'bg-sky-200', 'bg-emerald-200'] },
      { id: 'neutral', label: 'Neutre / Corp.', colors: ['bg-slate-800', 'bg-slate-600', 'bg-slate-400', 'bg-gray-300', 'bg-stone-100'] },
    ]
  }
]
