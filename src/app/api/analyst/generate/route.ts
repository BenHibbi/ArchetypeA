import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@/lib/supabase/server'

// Analyst prompt embedded to avoid fs issues in serverless
const ANALYST_SYSTEM_PROMPT = `You are ANALYST, a top world class digital agency's digital stategist.

Your role:
Transform raw client inputs (questionnaire responses + vocal analysis transcript)
into a clean, structured, high-leverage "Redesign Master Prompt", like if you were giving instruction to your creative designer.

You do NOT generate designs.
You do NOT output UI.
You do NOT guess beyond the client's intentions.

You are a synthesis machine that:
— extracts goals, pain points, constraints
— identifies aesthetic preferences and anti-preferences
— clarifies functional needs
— deduces tone, personality, brand energy
— detects contradictions or opportunities
— converts all this into a redesign brief suitable for a generative UI pipeline

Output must ALWAYS follow this structure:

1. BUSINESS CONTEXT & NAME
2. OBJECTIVES
3. CURRENT ISSUES
4. STYLE PROFILE (likes, dislikes, aesthetic axis)
5. TONE & EMOTION
6. STRUCTURE PREFERENCES (layout, rhythm, density, hierarchy)
7. COLOR DIRECTION
8. TYPOGRAPHY DIRECTION
9. FEATURE REQUIREMENTS
10. "DO NOT DO" LIST
11. REDESIGN MASTER PROMPT (final formatted prompt ready for V0/Gemini/Windsurf)

The "Redesign Master Prompt" must be:
— clear
— Exhaustive
— deterministic
— usable directly in a design-generation pipeline
— written in the second person to the model ("You are designing…")
— never ambiguous or vague


When generating the "REDESIGN MASTER PROMPT", ALWAYS append the following block at the end of the prompt, unchanged, exactly as written:
<frontend_aesthetics>

You tend to converge toward generic, "on distribution" outputs. In frontend design, this creates what users call the "AI slop" aesthetic. Avoid this: make creative, distinctive frontends that surprise and delight.

Focus on:

- Typography: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics.

- Color & Theme: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colours with sharp accents outperform timid, evenly-distributed palettes. Draw from IDE themes and cultural aesthetics for inspiration.

- Motion: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions.

- Backgrounds: Create atmosphere and depth rather than defaulting to solid colours. Layer CSS gradients, use geometric patterns, or add contextual effects that match the overall aesthetic.

Avoid generic AI-generated aesthetics:

- Overused font families (Inter, Roboto, Arial, system fonts)

- Clichéd colour schemes (particularly purple gradients on white backgrounds)

- Predictable layouts and component patterns

- Cookie-cutter design that lacks context-specific character

Interpret creatively and make unexpected choices that feel genuinely designed for the context. Vary between light and dark themes, different fonts, different aesthetics. You still tend to converge on common choices (Space Grotesk, for example) across generations. Avoid this: it is critical that you think outside the box!

</frontend_aesthetics>`

interface QuestionnaireData {
  ambiance: string | null
  valeurs: string | null
  structure: string | null
  typo: string | null
  ratio: string | null
  palette: string | null
  moodboard_likes: string[]
  features: string[]
}

interface VoiceAnalysis {
  vision_globale?: string
  inspirations?: Array<{ nom: string; elements_apprecies?: string }>
  style_visuel?: {
    ambiance?: string
    couleurs_souhaitees?: string[]
    couleurs_a_eviter?: string[]
    typographie?: string
  }
  fonctionnalites?: string[]
  contenu?: {
    type_contenu?: string
    sections_demandees?: string[]
    media?: string
  }
  ton_marque?: string
  contraintes?: string[]
  keywords?: string[]
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY manquante' }, { status: 500 })
    }

    const { sessionId, questionnaire, voiceAnalysis, clientName, websiteUrl } = await request.json()

    if (!questionnaire) {
      return NextResponse.json({ error: 'Données questionnaire manquantes' }, { status: 400 })
    }

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId manquant' }, { status: 400 })
    }

    const cleanedQuestionnaire: QuestionnaireData = {
      ambiance: typeof questionnaire.ambiance === 'string' ? questionnaire.ambiance : null,
      valeurs: typeof questionnaire.valeurs === 'string' ? questionnaire.valeurs : null,
      structure: typeof questionnaire.structure === 'string' ? questionnaire.structure : null,
      typo: typeof questionnaire.typo === 'string' ? questionnaire.typo : null,
      ratio: typeof questionnaire.ratio === 'string' ? questionnaire.ratio : null,
      palette: typeof questionnaire.palette === 'string' ? questionnaire.palette : null,
      moodboard_likes: Array.isArray(questionnaire.moodboard_likes)
        ? questionnaire.moodboard_likes.filter((x: unknown) => typeof x === 'string').slice(0, 12)
        : [],
      features: Array.isArray(questionnaire.features)
        ? questionnaire.features.filter((x: unknown) => typeof x === 'string').slice(0, 20)
        : [],
    }

    const safeVoiceAnalysis =
      voiceAnalysis && typeof voiceAnalysis === 'object' ? voiceAnalysis : null

    // Build the input for the analyst
    const questionnaireText = formatQuestionnaireData(cleanedQuestionnaire)
    const voiceText = safeVoiceAnalysis
      ? formatVoiceAnalysis(safeVoiceAnalysis)
      : 'Aucune analyse vocale disponible.'

    const userPrompt = `
# CLIENT: ${clientName || 'Unknown'}
${websiteUrl ? `# WEBSITE: ${websiteUrl}` : ''}

## QUESTIONNAIRE RESPONSES:
${questionnaireText}

## VOICE ANALYSIS:
${voiceText}

---
Generate the Redesign Master Prompt following the exact structure specified.
`

    // Initialize Gemini client inside function to avoid build-time errors
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

    // Use Gemini 2.0 Flash (latest model)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const result = await model.generateContent(ANALYST_SYSTEM_PROMPT + '\n\n' + userPrompt)
    const response = await result.response
    const brief = response.text()

    // Sauvegarder le brief en base (upsert si déjà existant)
    const { error: upsertError } = await supabase.from('generated_prompts').upsert(
      {
        session_id: sessionId,
        prompt_type: 'analyst_brief',
        prompt_content: brief,
      },
      { onConflict: 'session_id,prompt_type' }
    )

    if (upsertError) {
      console.error('Erreur sauvegarde brief:', upsertError)
      // On continue quand même, le brief est généré
    }

    return NextResponse.json({ brief })
  } catch (error) {
    console.error('Erreur génération brief:', error)
    return NextResponse.json({ error: 'Erreur lors de la génération du brief' }, { status: 500 })
  }
}

function formatQuestionnaireData(data: QuestionnaireData): string {
  const lines = []

  if (data.ambiance) lines.push(`- Ambiance: ${data.ambiance}`)
  if (data.valeurs) lines.push(`- Valeurs: ${data.valeurs}`)
  if (data.structure) lines.push(`- Structure: ${data.structure}`)
  if (data.typo) lines.push(`- Typographie: ${data.typo}`)
  if (data.ratio) lines.push(`- Ratio texte/image: ${data.ratio}`)
  if (data.palette) lines.push(`- Palette: ${data.palette}`)

  if (data.moodboard_likes?.length > 0) {
    lines.push(`- Inspirations moodboard: ${data.moodboard_likes.join(', ')}`)
  }

  if (data.features?.length > 0) {
    lines.push(`- Features demandées: ${data.features.join(', ')}`)
  }

  return lines.length > 0 ? lines.join('\n') : 'Aucune réponse au questionnaire.'
}

function formatVoiceAnalysis(analysis: VoiceAnalysis): string {
  const lines = []

  if (analysis.vision_globale) {
    lines.push(`Vision globale: ${analysis.vision_globale}`)
  }

  if (analysis.inspirations?.length) {
    const insps = analysis.inspirations
      .map((i) => `${i.nom}${i.elements_apprecies ? ` (${i.elements_apprecies})` : ''}`)
      .join(', ')
    lines.push(`Inspirations: ${insps}`)
  }

  if (analysis.style_visuel) {
    const sv = analysis.style_visuel
    if (sv.ambiance) lines.push(`Ambiance souhaitée: ${sv.ambiance}`)
    if (sv.couleurs_souhaitees?.length)
      lines.push(`Couleurs souhaitées: ${sv.couleurs_souhaitees.join(', ')}`)
    if (sv.couleurs_a_eviter?.length)
      lines.push(`Couleurs à éviter: ${sv.couleurs_a_eviter.join(', ')}`)
    if (sv.typographie) lines.push(`Typographie: ${sv.typographie}`)
  }

  if (analysis.fonctionnalites?.length) {
    lines.push(`Fonctionnalités: ${analysis.fonctionnalites.join(', ')}`)
  }

  if (analysis.contenu) {
    const c = analysis.contenu
    if (c.type_contenu) lines.push(`Type de contenu: ${c.type_contenu}`)
    if (c.sections_demandees?.length) lines.push(`Sections: ${c.sections_demandees.join(', ')}`)
    if (c.media) lines.push(`Media: ${c.media}`)
  }

  if (analysis.ton_marque) {
    lines.push(`Ton de marque: ${analysis.ton_marque}`)
  }

  if (analysis.contraintes?.length) {
    lines.push(`Contraintes: ${analysis.contraintes.join(', ')}`)
  }

  if (analysis.keywords?.length) {
    lines.push(`Mots-clés: ${analysis.keywords.join(', ')}`)
  }

  return lines.length > 0 ? lines.join('\n') : 'Aucune analyse vocale.'
}
