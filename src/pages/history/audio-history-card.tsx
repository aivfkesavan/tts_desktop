'use client'

import { Download, Play, Pause, Copy, ScrollText, MicVocal, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useState, useRef, useEffect } from 'react'
import AudioVisualizer from '../home/audio-visualizer'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { voices } from '@/utils/tts-models'
import { formatRelativeTime } from '@/utils'

interface AudioHistoryCardProps {
  text: string
  url: string
  voice: string
  createdAt: number
}

const AudioHistoryCard: React.FC<AudioHistoryCardProps> = ({ text, url, voice, createdAt }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const togglePlayPause = () => {
    if (!audioRef.current) return
    isPlaying ? audioRef.current.pause() : audioRef.current.play()
    setIsPlaying(!isPlaying)
  }

  useEffect(() => {
    const audioEl = audioRef.current
    if (!audioEl) return

    const handleLoadedMetadata = () => setDuration(audioEl.duration || 0)
    const handleTimeUpdate = () => setCurrentTime(audioEl.currentTime)
    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    audioEl.addEventListener('loadedmetadata', handleLoadedMetadata)
    audioEl.addEventListener('timeupdate', handleTimeUpdate)
    audioEl.addEventListener('ended', handleEnded)

    return () => {
      audioEl.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audioEl.removeEventListener('timeupdate', handleTimeUpdate)
      audioEl.removeEventListener('ended', handleEnded)
    }
  }, [])

  const voiceMeta = voices.find((v) => v.name === voice)
  const relativeTime = formatRelativeTime(createdAt)

  return (
    <div className='w-full rounded-xl border border-border bg-background shadow-sm p-6 grid gap-5'>
      <audio ref={audioRef} src={url} preload='metadata' />

      <div className='grid grid-cols-2 gap-3 items-start'>
        <Badge variant='secondary' className='text-xs px-2 py-0.5 flex items-center gap-1 rounded-sm w-fit'>
          <MicVocal className='h-3.5 w-3.5' />
          {voiceMeta?.title ?? voice}
        </Badge>
        <div className='text-xs text-muted-foreground justify-self-end flex items-center gap-1'>
          <Clock className='w-3.5 h-3.5' />
          {relativeTime}
        </div>
      </div>

      <AudioVisualizer currentTime={currentTime} duration={duration} audioRef={audioRef} />

      <div className='space-y-4'>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant='ghost'
              className='text-muted-foreground justify-end text-xs px-0 hover:underline flex items-end gap-2'>
              <ScrollText className='w-4 h-4' />
              View Full Transcript
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-xl bg-popover text-popover-foreground animate-fade-in'>
            <DialogHeader>
              <DialogTitle className='text-base flex items-center gap-2 font-semibold'>
                <ScrollText className='w-5 h-5 text-muted-foreground' />
                Full Transcript
              </DialogTitle>
            </DialogHeader>
            <div className='flex flex-col h-full max-h-[60vh]'>
              <div className='flex-1 overflow-y-auto whitespace-pre-line text-sm text-foreground'>{text}</div>
              <div className='flex justify-end mt-4'>
                <Button
                  variant='default'
                  onClick={() => {
                    navigator.clipboard.writeText(text)
                    toast('Copied to clipboard.')
                  }}
                  className='text-sm'>
                  <Copy className='w-4 h-4 mr-2' />
                  Copy
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <p className='text-sm text-muted-foreground line-clamp-3'>{text}</p>
      </div>

      <div className='flex justify-between items-center flex-wrap gap-3 mt-4'>
        <Button asChild variant='outline' size='icon' className='text-muted-foreground hover:text-primary transition'>
          <a href={url} download={`tts-history-${Date.now()}.wav`}>
            <Download className='w-5 h-5' />
          </a>
        </Button>
        <Button
          onClick={togglePlayPause}
          variant='default'
          className='bg-primary text-black hover:bg-primary/90 text-sm font-medium flex gap-2'>
          {isPlaying ? <Pause className='w-4 h-4' /> : <Play className='w-4 h-4' />}
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
      </div>
    </div>
  )
}

export default AudioHistoryCard
