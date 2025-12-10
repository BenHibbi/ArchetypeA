import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { readFileSync } from 'fs'
import { join } from 'path'
import { createClient } from '@/lib/supabase/server'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

// Load salesman prompt from external file
const SALESMAN_SYSTEM_PROMPT = readFileSync(
  join(process.cwd(), 'src/prompts/salesman.md'),
  'utf-8'
)

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
