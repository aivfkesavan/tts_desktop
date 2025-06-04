import { Download, Play, Pause, Copy, FileText, ChevronRight, ScrollText } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useState, useRef, useEffect } from 'react'
import AudioVisualizer from '../home/audio-visualizer'
import { toast } from 'sonner'

interface AudioHistoryCardProps {
  text: string
  url: string
}

const AudioHistoryCard: React.FC<AudioHistoryCardProps> = ({ text, url }) => {
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

  return (
    <Card className='w-full h-28 md:h-32 vm-card'>
      <audio ref={audioRef} src={url} preload='metadata' />

      <div
        className='
          grid h-full w-full items-center px-6 gap-4
          grid-cols-[220px_1fr_180px]
        '>
        <Dialog>
          <DialogTrigger asChild>
            <div className='cursor-pointer group max-w-[220px]'>
              <span className='text-xs text-muted-foreground font-medium mb-3 flex items-center gap-1'>
                <ScrollText className='w-3.5 h-3.5 text-muted-foreground' />
                Transcript
              </span>
              <div className='flex items-center gap-1'>
                <span className='text-sm text-foreground truncate block max-w-[190px] group-hover:underline'>
                  {text}
                </span>
                <ChevronRight className='w-4 h-4 shrink-0 text-muted-foreground opacity-70 group-hover:opacity-100 transition' />
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className='sm:max-w-xl bg-popover text-popover-foreground animate-fade-in'>
            <DialogHeader>
              <DialogTitle className='text-base flex items-center font-semibold'>
                <ScrollText className='w-5 h-5 text-muted-foreground mr-2' />
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
                  <Copy />
                  Copy
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <div className='flex-1 min-w-[180px]'>
          <AudioVisualizer currentTime={currentTime} duration={duration} audioRef={audioRef} />
        </div>

        <div className='flex justify-end items-center gap-2'>
          <Button asChild variant='outline' size='icon' className='text-muted-foreground hover:text-primary transition'>
            <a href={url} download={`tts-history-${Date.now()}.wav`} aria-label='Download audio'>
              <Download className='w-8 h-8' />
            </a>
          </Button>

          <Button
            onClick={togglePlayPause}
            variant='default'
            className='text-sm font-medium bg-primary hover:bg-primary/90 text-black focus:ring-2 focus:ring-ring transition whitespace-nowrap'>
            {isPlaying ? (
              <Pause className='w-4 h-4 text-black fill-black' />
            ) : (
              <Play className='w-4 h-4 text-black fill-black' />
            )}
            <span className='text-black'>{isPlaying ? 'Pause' : 'Play'}</span>
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default AudioHistoryCard
