'use client'

import { Mic, Square, Loader2 } from 'lucide-react'
import { useState, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { LogoMark } from '@/components/shared/logo'

interface VoiceScreenProps {
  onComplete: (transcription: string, analysis: string) => void
  onSkip: () => void
}

export function VoiceScreen({ onComplete, onSkip }: VoiceScreenProps) {
  const t = useTranslations('questionnaire.voice')
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState<'transcribing' | 'analyzing' | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })
        stream.getTracks().forEach((track) => track.stop())
        await processAudio(audioBlob)
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch {
      alert(t('microphoneError'))
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsProcessing(true)
    }
  }

  const processAudio = async (audioBlob: Blob) => {
    try {
      setProcessingStep('transcribing')

      // Convert blob to base64
      const reader = new FileReader()
      const base64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1]
          resolve(base64)
        }
      })
      reader.readAsDataURL(audioBlob)
      const base64Audio = await base64Promise

      // Send to API for transcription + analysis
      const response = await fetch('/api/voice/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audio: base64Audio }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors du traitement')
      }

      const data = await response.json()
      setProcessingStep('analyzing')

      // Small delay to show the analyzing step
      await new Promise((resolve) => setTimeout(resolve, 500))

      onComplete(data.transcription, data.analysis)
    } catch {
      alert(t('processingError'))
      setIsProcessing(false)
      setProcessingStep(null)
    }
  }

  if (isProcessing) {
    return (
      <div className="max-w-2xl mx-auto w-full animate-zoom-in text-center">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-12">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <Loader2 className="text-orange-500 animate-spin" size={48} />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            {processingStep === 'transcribing' ? t('transcribing') : t('analyzing')}
          </h2>

          <div className="flex justify-center gap-2 mb-6">
            <div
              className={`w-3 h-3 rounded-full transition-colors ${processingStep === 'transcribing' ? 'bg-orange-500 animate-pulse' : 'bg-teal-500'}`}
            />
            <div
              className={`w-3 h-3 rounded-full transition-colors ${processingStep === 'analyzing' ? 'bg-orange-500 animate-pulse' : 'bg-slate-200'}`}
            />
          </div>

          <p className="text-slate-500">
            {processingStep === 'transcribing' ? t('whisperTranscribing') : t('aiExtracting')}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto w-full animate-zoom-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header - Style Archetype */}
        <div className="bg-slate-900 text-white p-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <LogoMark />
            <span className="font-bold tracking-tight">archetype</span>
          </div>
          <h2 className="text-3xl font-bold mb-2">{t('title')}</h2>
          <p className="text-slate-400">{t('subtitle')}</p>
        </div>

        {/* Content */}
        <div className="p-10 text-center">
          <div className="bg-slate-50 rounded-2xl p-6 mb-8 text-left border border-slate-100">
            <p className="text-slate-700 leading-relaxed">
              {t('instruction')}{' '}
              <span className="font-semibold text-orange-500">"{t('recordButton')}"</span>{' '}
              {t('andDescribe')}
            </p>
            <p className="text-slate-500 mt-4 text-sm">🔒 {t('privacyNote')}</p>
            <p className="text-orange-600 font-medium mt-4 text-sm">✨ {t('importantNote')}</p>
          </div>

          {/* Recording Button */}
          <div className="mb-8">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="group relative w-32 h-32 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 mx-auto flex items-center justify-center"
              >
                <Mic size={48} className="group-hover:scale-110 transition-transform" />
                <span className="absolute -bottom-8 text-sm font-medium text-slate-600">
                  {t('recordButton')}
                </span>
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="group relative w-32 h-32 rounded-full bg-red-500 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 mx-auto flex items-center justify-center animate-pulse"
              >
                <Square size={40} className="group-hover:scale-110 transition-transform" />
                <span className="absolute -bottom-8 text-sm font-medium text-red-600">
                  {t('stop')}
                </span>
                {/* Recording indicator */}
                <span className="absolute top-2 right-2 w-4 h-4 bg-white rounded-full animate-ping" />
              </button>
            )}
          </div>

          {isRecording && (
            <div className="flex items-center justify-center gap-2 text-red-500 mb-4">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">{t('recording')}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-6 border-t border-slate-100 text-center">
          <button
            onClick={onSkip}
            className="text-slate-400 hover:text-slate-600 text-sm transition-colors"
          >
            {t('skip')} →
          </button>
        </div>
      </div>
    </div>
  )
}
