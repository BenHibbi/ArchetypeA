import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { readFileSync } from 'fs'
import { join } from 'path'
import { createClient } from '@/lib/supabase/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

// Load analyst prompt from external file
const ANALYST_SYSTEM_PROMPT = readFileSync(join(process.cwd(), 'src/prompts/analyst.md'), 'utf-8')

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
