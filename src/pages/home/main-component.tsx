import { useEffect, useRef, useState } from 'react'
import { AudioLines, Play, Square, Sparkles, Gauge, RotateCcw, Pause } from 'lucide-react'

import useTTSStore from '@/store/tts'
import { voices } from '@/utils/tts-models'
import { root } from '@/services/end-points'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { chunkText } from '@/utils/text-chunker'
import AudioVisualizer from './audio-visualizer'
import { suggestions } from '@/utils/tts-suggestions'
import { mergeWavBlobs } from '@/utils/merge-wav'
import { useTTSHistory } from '@/store/history-tts'

function MainPanel() {
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [generatedText, setGeneratedText] = useState('')
  const [audioDuration, setAudioDuration] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const [audioTime, setAudioTime] = useState(0)
  const [status, setStatus] = useState('idle')
  const [text, setText] = useState('')

  const audioRef = useRef<HTMLAudioElement | null>(null)

  const { add: addToHistory } = useTTSHistory()

  const update = useTTSStore((s) => s.update)
  const voice = useTTSStore((s) => s.voice)
  const speed = useTTSStore((s) => s.speed)

  const trimmedText = text.trim()
  const hasChanged = trimmedText !== generatedText
  const hasAudio = !!audioUrl
  const canReplay = hasAudio && !hasChanged && status === 'idle'
  const canPausePlay = hasAudio && !hasChanged && (status === 'playing' || status === 'paused')

  useEffect(() => {
    if (!audioUrl) return

    const timeout = setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      URL.revokeObjectURL(audioUrl)
      setAudioUrl(null)
      setAudioTime(0)
      setAudioDuration(0)
      setStatus('idle')
      setIsPaused(false)
    }, 100)

    return () => clearTimeout(timeout)
  }, [text])

  async function getTTS(): Promise<void> {
    const trimmed = text.trim()
    if (!trimmed) return

    setStatus('loading')

    const chunks = chunkText(text)
    // console.log(`[TTS] Total Chunks: ${chunks.length}`)
    // console.table(chunks.map((t, i) => ({ Index: i + 1, Text: t.slice(0, 60) + '...' })))

    try {
      const responses = await Promise.allSettled(
        chunks.map(async (chunk, i) => {
          // console.log(`[TTS] Requesting chunk ${i + 1}`)

          const res = await fetch(`${root.localBackendUrl}/tts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: chunk, voice, speed }),
          })

          if (!res.ok) {
            const errorText = await res.text()
            throw new Error(`[TTS] POST failed: ${errorText}`)
          }

          const { fileName } = await res.json()
          const audioRes = await fetch(`${root.localBackendUrl}/tts/${fileName}`)

          if (!audioRes.ok || !audioRes.headers.get('Content-Type')?.includes('audio')) {
            const fallback = await audioRes.text()
            throw new Error(`[TTS] Invalid audio response: ${fallback}`)
          }

          const blob = await audioRes.blob()
          return { blob, type: audioRes.headers.get('Content-Type') || 'audio/wav' }
        })
      )

      const validBlobs = responses
        .filter((res): res is PromiseFulfilledResult<{ blob: Blob; type: string }> => res.status === 'fulfilled')
        .map((res) => res.value)

      if (validBlobs.length === 0) {
        throw new Error('[TTS] No valid audio data received.')
      }

      const blobs = validBlobs.map(({ blob }) => blob)
      const mergedBlob = await mergeWavBlobs(blobs) // Custom merging logic with logs
      const objectUrl = URL.createObjectURL(mergedBlob)

      setAudioUrl(objectUrl)
      setGeneratedText(trimmed)
      setStatus('playing')

      addToHistory({ text: trimmed, url: objectUrl })

      const audio = new Audio(objectUrl)
      audioRef.current = audio
      audio.crossOrigin = 'anonymous'

      audio.ontimeupdate = () => {
        setAudioTime(audio.currentTime)
        setAudioDuration(audio.duration)
      }

      audio.onended = () => {
        setStatus('idle')
        setAudioTime(0)
        setIsPaused(false)
      }

      await audio.play()
    } catch (err) {
      // console.error('[TTS] Error:', err)
      setStatus('idle')
    }
  }

  function handleStop() {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setAudioTime(0)
      setAudioDuration(0)
      setStatus('idle')
      setIsPaused(false)
    }
  }

  function togglePlayback() {
    if (!audioRef.current) return
    if (isPaused) {
      audioRef.current.play()
      setIsPaused(false)
      setStatus('playing')
    } else {
      audioRef.current.pause()
      setIsPaused(true)
      setStatus('paused')
    }
  }
  function handleReplay() {
    if (!audioRef.current) return
    audioRef.current.currentTime = 0
    audioRef.current.play()
    setIsPaused(false)
    setStatus('playing')
  }

  // console.log('voice', voice)

  return (
    <div className='h-full flex-1 max-w-7xl mx-auto grid grid-rows-[auto_1fr_auto] bg-background'>
      <div className='flex flex-row justify-between px-6 pt-6 pb-4'>
        <div className=''>
          <div className='flex items-center gap-2 mb-2'>
            <div className='p-1.5 rounded-md text-primary'>
              <AudioLines className='w-5 h-5' />
            </div>
            <h1 className='text-xl font-semibold text-foreground'>Text to Speech</h1>
          </div>
          <p className='text-sm text-muted-foreground'>
            Start typing here or paste any text you want to turn into lifelike speech...
          </p>
        </div>

        <div className=''>
          <div className='mb-6'>
            <Label className='text-sm font-medium text-foreground mb-2 flex items-center gap-2'>
              <Sparkles className='w-4 h-4 text-muted-foreground' />
              Voice
            </Label>

            <div className='flex gap-2 items-center'>
              <Select value={voice} onValueChange={(value) => update({ voice: value })}>
                <SelectTrigger className='w-[200px] capitalize'>
                  <SelectValue placeholder='Select model' />
                </SelectTrigger>

                <SelectContent className='max-h-80'>
                  {voices.map((m) => (
                    <SelectItem key={m.name} value={m.name} className='capitalize'>
                      {m.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className='overflow-auto px-6'>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='Start typing here...'
          className='w-full h-full resize-none border-none text-base shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-muted dar:bg-transparent text-foreground placeholder:text-muted-foreground'
        />
      </div>

      <div className='px-6 pb-4 flex flex-wrap items-end justify-between gap-6 mt-4'>
        <div className='w-56'>
          <Label className='mb-2 text-sm flex items-center justify-between text-foreground'>
            <span className='flex items-center gap-2'>
              <Gauge className='w-4 h-4 text-muted-foreground' />
              Speed
            </span>
            <RotateCcw
              className='w-4 h-4 cursor-pointer text-muted-foreground hover:text-primary transition-colors'
              onClick={() => update({ speed: 1 })}
            />
          </Label>

          <Slider
            value={[speed]}
            min={0.1}
            max={1.5}
            step={0.1}
            onValueChange={([val]) => update({ speed: val })}
            className='h-2 [&_[data-slot=slider-track]]:bg-muted [&_[data-slot=slider-range]]:bg-primary [&_[data-slot=slider-thumb]]:bg-background [&_[data-slot=slider-thumb]]:border [&_[data-slot=slider-thumb]]:border-primary'
          />

          <div className='flex justify-between text-xs text-muted-foreground mt-1'>
            <span>Slower</span>
            <span>Faster</span>
          </div>
        </div>
        {audioUrl && (
          <div className='flex-1 min-w-[200px] max-w-[600px] flex items-center justify-between '>
            <AudioVisualizer currentTime={audioTime} duration={audioDuration} audioRef={audioRef} />
          </div>
        )}

        <div className='flex items-center gap-4 mt-6'>
          {canPausePlay && (
            <Button onClick={togglePlayback} variant='outline' className='gap-2'>
              {isPaused ? <Play className='size-4' /> : <Pause className='size-4' />}
              <span>{isPaused ? 'Resume' : 'Pause'}</span>
            </Button>
          )}

          {canPausePlay && (
            <Button onClick={handleStop} variant='destructive' className='gap-2'>
              <Square className='size-4 fill-white' />
              <span>Stop</span>
            </Button>
          )}

          {canReplay && (
            <Button onClick={handleReplay} variant='outline' className='gap-2'>
              <Play className='size-4' />
              <span>Play Again</span>
            </Button>
          )}

          {(hasChanged || !audioUrl) && trimmedText && (
            <Button onClick={getTTS} variant='default' className='gap-2 text-black hover:bg-primary/90'>
              <Play className='size-4 fill-black' />
              <span>Generate</span>
            </Button>
          )}
        </div>
      </div>

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
