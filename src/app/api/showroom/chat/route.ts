import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { createClient } from '@/lib/supabase/server'

// Salesman prompt embedded to avoid fs issues in serverless
const SALESMAN_SYSTEM_PROMPT = `You are an expert design consultant for Archetype, a premium branding studio. You help clients understand their design brief and make decisions about their visual identity.

Be friendly, professional, and knowledgeable. Answer questions about branding, design choices, and the creative process.`

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(request: Request) {
  try {
    const { sessionId, messages, designBrief } = await request.json()

    if (!sessionId || !messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'Session ID and messages are required' },
        { status: 400 }
      )
    }

    // Get session context from database if brief not provided
    let contextBrief = designBrief
    if (!contextBrief) {
      const supabase = await createClient()

      const { data: response } = await supabase
        .from('responses')
        .select('generated_brief, business_name')
        .eq('session_id', sessionId)
        .single()

      contextBrief = response?.generated_brief || null
    }

    // Build system prompt with context
    const systemPrompt = contextBrief
      ? `${SALESMAN_SYSTEM_PROMPT}

## DESIGN BRIEF CONTEXT
The following is the complete design brief for this client. Use this to answer questions about design choices:

${contextBrief}`
      : SALESMAN_SYSTEM_PROMPT

    // Format messages for Groq
    const groqMessages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
      { role: 'system', content: systemPrompt },
      ...messages.map((msg: ChatMessage) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
    ]

    // Initialize Groq client inside function to avoid build-time errors
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    })

    // Use Groq with GPT OSS 120B
    const completion = await groq.chat.completions.create({
      model: 'openai/gpt-oss-120b',
      messages: groqMessages,
      temperature: 0.7,
      max_completion_tokens: 1024,
      top_p: 1,
    })

    const reply = completion.choices[0]?.message?.content || ''

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
}
