import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { audio } = await request.json()

    if (!audio || typeof audio !== 'string') {
      return NextResponse.json({ error: 'Audio manquant' }, { status: 400 })
    }

    // Taille max ~10MB pour éviter les abus (base64 => ~33% overhead)
    const estimatedBytes = Math.ceil((audio.length * 3) / 4)
    if (estimatedBytes > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'Fichier audio trop volumineux' }, { status: 413 })
    }

    // Convert base64 to buffer
    const audioBuffer = Buffer.from(audio, 'base64')

    // Create a File object for Groq API (requires name and lastModified properties)
    const audioFile = new File([audioBuffer], 'recording.webm', {
      type: 'audio/webm',
      lastModified: Date.now(),
    })

    // Step 1: Transcribe with Whisper
    const transcription = await groq.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-large-v3-turbo',
      temperature: 0,
      response_format: 'verbose_json',
    })

    const transcribedText = transcription.text

    if (!transcribedText || transcribedText.trim().length === 0) {
      return NextResponse.json({
        transcription: '',
        analysis: JSON.stringify({
          vision_globale: 'Aucun contenu audio détecté.',
          inspirations: [],
          style_visuel: {},
          fonctionnalites: [],
          contenu: {},
          ton_marque: '',
          contraintes: [],
          keywords: [],
        }),
      })
    }

    // Step 2: Analyze with GPT-OSS-120B - Extract structured design information
    const analysisCompletion = await groq.chat.completions.create({
      model: 'openai/gpt-oss-120b',
      messages: [
        {
          role: 'system',
          content: `Tu es un expert en design web et UX. On te donne la transcription d'un message vocal d'un prospect qui décrit son site web idéal.

Ton rôle est d'EXTRAIRE et STRUCTURER toutes les informations pertinentes pour le design dans un format JSON strict.

Tu dois retourner UNIQUEMENT un objet JSON valide avec cette structure exacte :

{
  "vision_globale": "Résumé en 1-2 phrases de ce que veut le prospect",
  "inspirations": [
    {
      "nom": "Nom du site/marque/style mentionné",
      "elements_apprecies": "Ce qu'il aime de cette inspiration"
    }
  ],
  "style_visuel": {
    "ambiance": "minimaliste / luxueux / moderne / vintage / etc.",
    "couleurs_souhaitees": ["liste des couleurs mentionnées"],
    "couleurs_a_eviter": ["couleurs à éviter si mentionnées"],
    "typographie": "style de typo souhaité si mentionné"
  },
  "fonctionnalites": [
    "Liste des fonctionnalités/pages/éléments demandés"
  ],
  "contenu": {
    "type_contenu": "e-commerce / portfolio / blog / vitrine / etc.",
    "sections_demandees": ["header", "about", "services", etc.],
    "media": "photos / vidéos / illustrations / 3D mentionnés"
  },
  "ton_marque": "Description du ton souhaité : professionnel / décontracté / premium / etc.",
  "contraintes": [
    "Budget, délais, contraintes techniques mentionnées"
  ],
  "keywords": [
    "Mots-clés importants extraits du message"
  ]
}

IMPORTANT:
- Extrais TOUTES les informations utiles pour un designer
- Si une catégorie n'a pas d'info, mets une valeur vide (string vide, array vide, ou objet vide)
- Ne mets que les informations RÉELLEMENT mentionnées, pas d'interprétation
- Retourne UNIQUEMENT le JSON, pas de texte avant ou après`,
        },
        {
          role: 'user',
          content: `Voici la transcription du message vocal du prospect :\n\n"${transcribedText}"`,
        },
      ],
      temperature: 0.3,
      max_completion_tokens: 2048,
    })

    let analysis = analysisCompletion.choices[0]?.message?.content || '{}'

    // Clean up the response - remove markdown code blocks if present
    analysis = analysis
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim()

    // Validate it's valid JSON
    try {
      JSON.parse(analysis)
    } catch {
      // If not valid JSON, wrap in a basic structure
      analysis = JSON.stringify({
        vision_globale: analysis,
        inspirations: [],
        style_visuel: {},
        fonctionnalites: [],
        contenu: {},
        ton_marque: '',
        contraintes: [],
        keywords: [],
      })
    }

    return NextResponse.json({
      transcription: transcribedText,
      analysis,
    })
  } catch (error) {
    console.error('Erreur traitement vocal:', error)
    return NextResponse.json({ error: 'Erreur lors du traitement' }, { status: 500 })
  }
}
