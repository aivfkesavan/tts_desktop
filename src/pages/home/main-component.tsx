import { Play, Square, Gauge, RotateCcw, Pause, Loader } from 'lucide-react'
import { useState, useEffect } from 'react'

import { root } from '@/services/end-points'
import useTTSStore from '@/store/tts'

import { useAudioPlayer } from '@/hooks/use-audio-control'
import { suggestions } from '@/utils/tts-suggestions'
import { useTTSHistory } from '@/store/history-tts'
import { Textarea } from '@/components/ui/textarea'
import { mergeWavBlobs } from '@/utils/merge-wav'
import { chunkText } from '@/utils/text-chunker'
import AudioVisualizer from './audio-visualizer'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import TTSHeader from './header'
import { AudioControlPanel } from './control-panel'

function MainPanel() {
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [text, setText] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading'>('idle')
  const [audioMeta, setAudioMeta] = useState<null | { url: string; voice: string; speed: number; text: string }>(null)

  const { add: addToHistory } = useTTSHistory()
  const update = useTTSStore((s) => s.update)
  const voice = useTTSStore((s) => s.voice)
  const speed = useTTSStore((s) => s.speed)

  const {
    play,
    pause,
    stop,
    replay,
    audioRef,
    currentTime,
    duration,
    isPaused,
    status: playerStatus,
  } = useAudioPlayer({ audioUrl, autoPlay: true })

  const trimmedText = text.trim()
  const hasAudio = !!audioMeta?.url
  const hasChanged =
    !audioMeta || audioMeta.text !== trimmedText || audioMeta.voice !== voice || audioMeta.speed !== speed

  const canReplay = hasAudio && !hasChanged && playerStatus === 'idle'
  const canPausePlay = hasAudio && !hasChanged && (playerStatus === 'playing' || playerStatus === 'paused')

  useEffect(() => {
    if (!audioMeta?.url) return
    const timeout = setTimeout(() => {
      setAudioMeta(null)
      setAudioUrl(null)
    }, 100)
    return () => clearTimeout(timeout)
  }, [text])

  useEffect(() => {
    if (!audioMeta) return

    const isVoiceChanged = audioMeta.voice !== voice
    const isSpeedChanged = audioMeta.speed !== speed
    const isTextChanged = audioMeta.text !== trimmedText

    if ((isVoiceChanged || isSpeedChanged || isTextChanged) && playerStatus === 'playing') {
      pause()
    }
  }, [voice, speed, trimmedText, audioMeta, playerStatus, pause])

  useEffect(() => {
    if (!audioMeta?.url || !hasChanged) return

    pause()

    if (audioRef.current) {
      audioRef.current.src = ''
    }

    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = null
    }
  }, [hasChanged, audioMeta?.url, pause, audioRef])

  async function getTTS() {
    const trimmed = text.trim()
    if (!trimmed) return

    setStatus('loading')

    const chunks = chunkText(text)

    try {
      const responses = await Promise.allSettled(
        chunks.map(async (chunk) => {
          const res = await fetch(`${root.localBackendUrl}/tts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: chunk, voice, speed }),
          })

          if (!res.ok) throw new Error(await res.text())

          const { fileName } = await res.json()
          const audioRes = await fetch(`${root.localBackendUrl}/tts/${fileName}`)

          if (!audioRes.ok || !audioRes.headers.get('Content-Type')?.includes('audio')) {
            throw new Error(await audioRes.text())
          }

          const blob = await audioRes.blob()
          return { blob }
        })
      )

      const validBlobs = responses
        .filter((res): res is PromiseFulfilledResult<{ blob: Blob }> => res.status === 'fulfilled')
        .map((res) => res.value.blob)

      if (!validBlobs.length) throw new Error()

      const mergedBlob = await mergeWavBlobs(validBlobs)
      const objectUrl = URL.createObjectURL(mergedBlob)

      setAudioMeta({ url: objectUrl, text: trimmed, voice, speed })
      setAudioUrl(objectUrl)
      addToHistory({ text: trimmed, url: objectUrl })
      play()
    } catch {
      setStatus('idle')
    } finally {
      setStatus('idle')
    }
  }

  return (
    <div className='h-full flex-1 max-w-7xl mx-auto grid grid-rows-[auto_1fr_auto] bg-background'>
      <TTSHeader voice={voice} update={update} />

      <div className='overflow-auto px-6'>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='Start typing here...'
          className='w-full h-full resize-none border-none text-base shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-muted dar:bg-transparent text-foreground placeholder:text-muted-foreground'
        />
      </div>

      <AudioControlPanel
        speed={speed}
        update={update}
        isPaused={isPaused}
        play={play}
        pause={pause}
        stop={stop}
        replay={replay}
        getTTS={getTTS}
        status={status}
        hasChanged={hasChanged}
        trimmedText={trimmedText}
        canPausePlay={canPausePlay}
        canReplay={canReplay}
        audioMeta={audioMeta}
        currentTime={currentTime}
        duration={duration}
        audioRef={audioRef}
      />

      <div className='px-6 py-8 pb-12 bg-background'>
        <p className='text-sm text-muted-foreground mb-4'>Get started with</p>
        <div className='flex flex-wrap gap-2'>
          {suggestions.map((item, idx) => (
            <Button key={idx} variant='outline' className='text-sm' onClick={() => setText(item.prompt)}>
              <item.icon className='mr-2 h-4 w-4' />
              {item.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MainPanel
