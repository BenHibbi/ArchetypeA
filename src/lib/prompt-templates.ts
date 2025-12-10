import { Response, Client } from '@/types'
import { QUESTIONS, SKELETONS } from '@/config'

interface PromptContext {
  client: Client
  response: Response
}

function getOptionLabel(questionId: string, optionId: string | null): string {
  if (!optionId) return 'Non défini'
  const question = QUESTIONS.find((q) => q.id === questionId)
  const option = question?.options.find((o) => o.id === optionId)
  return option?.label || optionId
}

function getSkeletonLabels(ids: string[]): string[] {
  return ids.map((id) => {
    const skeleton = SKELETONS.find((s) => s.id === id)
    return skeleton?.label || id
  })
}

export function generateV0Prompt(ctx: PromptContext): string {
  const { client, response } = ctx

  return `Create a modern, professional landing page for "${client.company_name || 'a business'}".

## Design Direction
- **Ambiance**: ${getOptionLabel('ambiance', response.ambiance)} style
- **Core Value**: ${getOptionLabel('valeurs', response.valeurs)}
- **Color Palette**: ${getOptionLabel('palette', response.palette)}
- **Typography**: ${getOptionLabel('typo', response.typo)}

## Layout Structure
- **Density**: ${getOptionLabel('structure', response.structure)}
- **Image/Text Ratio**: ${getOptionLabel('ratio', response.ratio)}
- **Inspired by these layouts**: ${getSkeletonLabels(response.moodboard_likes || []).join(', ')}

## Required Features
${(response.features || []).map((f) => `- ${f}`).join('\n')}

## Technical Requirements
- Use React with Tailwind CSS
- Mobile-first responsive design
- Smooth animations and micro-interactions
- Clean, semantic HTML structure
- Accessible (ARIA labels, proper contrast)

${client.website_url ? `Reference: ${client.website_url}` : ''}
`
}

export function generateLovablePrompt(ctx: PromptContext): string {
  const { client, response } = ctx

  return `Build a complete website for ${client.company_name || 'my client'}.

STYLE:
- ${getOptionLabel('ambiance', response.ambiance)} aesthetic
- ${getOptionLabel('palette', response.palette)} color scheme
- ${getOptionLabel('typo', response.typo)} typography

LAYOUT:
- ${getOptionLabel('structure', response.structure)} page structure
- ${getOptionLabel('ratio', response.ratio)} content balance
- Include these section types: ${getSkeletonLabels(response.moodboard_likes || []).join(', ')}

FEATURES NEEDED:
${(response.features || []).map((f) => `- ${f} functionality`).join('\n')}

The design should convey ${getOptionLabel('valeurs', response.valeurs)}.
Make it modern, professional, and fully responsive.
`
}

export function generateBoltPrompt(ctx: PromptContext): string {
  const { client, response } = ctx

  return `Create a ${getOptionLabel('ambiance', response.ambiance).toLowerCase()} website.

Company: ${client.company_name || 'Client'}
${client.website_url ? `Current site: ${client.website_url}` : ''}

Design specs:
- Colors: ${getOptionLabel('palette', response.palette)}
- Typography: ${getOptionLabel('typo', response.typo)}
- Structure: ${getOptionLabel('structure', response.structure)}
- Content ratio: ${getOptionLabel('ratio', response.ratio)}

Must include: ${(response.features || []).join(', ')}

Key layouts to include:
${getSkeletonLabels(response.moodboard_likes || []).map((l) => `- ${l}`).join('\n')}

Core message: ${getOptionLabel('valeurs', response.valeurs)}

Use React + Tailwind. Make it pixel-perfect and responsive.
`
}

export function generateMidjourneyPrompt(ctx: PromptContext): string {
  const { client, response } = ctx

  const ambianceKeywords: Record<string, string> = {
    minimal: 'minimalist, clean lines, whitespace, simple',
    bold: 'bold, high contrast, dramatic, impactful',
    corporate: 'professional, trustworthy, clean, business',
    soft: 'warm, friendly, approachable, soft colors',
    futuristic: 'futuristic, tech, neon accents, dark mode',
    editorial: 'editorial, magazine style, typography focused, elegant',
  }

  const paletteKeywords: Record<string, string> = {
    cold: 'cool blue tones, cyan accents, dark backgrounds',
    warm: 'warm orange, amber, earthy tones',
    bw: 'black and white, monochrome, grayscale',
    accent: 'neutral with teal accent color',
    pastel: 'soft pastel colors, pink, purple, mint',
    neutral: 'neutral grays, corporate, subtle',
  }

  return `Website UI design mockup for ${client.company_name || 'a modern brand'}, ${ambianceKeywords[response.ambiance || 'minimal']}, ${paletteKeywords[response.palette || 'neutral']}, ${getOptionLabel('typo', response.typo)} typography, hero section, feature blocks, professional layout, Figma style, 4K, detailed --ar 16:9 --v 6`
}

export function generateCustomPrompt(ctx: PromptContext): string {
  const { client, response } = ctx

  return `# Design Brief for ${client.company_name || 'Client'}

## Contact
- Email: ${client.email}
- Website: ${client.website_url || 'N/A'}

## Design Preferences

### Visual Identity
| Aspect | Choice |
|--------|--------|
| Ambiance | ${getOptionLabel('ambiance', response.ambiance)} |
| Core Value | ${getOptionLabel('valeurs', response.valeurs)} |
| Palette | ${getOptionLabel('palette', response.palette)} |
| Typography | ${getOptionLabel('typo', response.typo)} |

### Structure
| Aspect | Choice |
|--------|--------|
| Density | ${getOptionLabel('structure', response.structure)} |
| Image/Text | ${getOptionLabel('ratio', response.ratio)} |

### Layout Inspirations
${getSkeletonLabels(response.moodboard_likes || []).map((l) => `- ${l}`).join('\n')}

### Required Features
${(response.features || []).map((f) => `- ${f}`).join('\n')}

## Notes
${client.notes || 'Aucune note additionnelle.'}

---
Generated by Archetype
`
}

export const PROMPT_GENERATORS = {
  v0: { label: 'V0 (Vercel)', generate: generateV0Prompt },
  lovable: { label: 'Lovable', generate: generateLovablePrompt },
  bolt: { label: 'Bolt.new', generate: generateBoltPrompt },
  midjourney: { label: 'Midjourney', generate: generateMidjourneyPrompt },
  custom: { label: 'Brief Complet', generate: generateCustomPrompt },
} as const

export type PromptType = keyof typeof PROMPT_GENERATORS
