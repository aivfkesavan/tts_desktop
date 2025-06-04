import { useState } from 'react'
import {
  BookOpenText,
  Laugh,
  Mic,
  Globe,
  Film,
  Gamepad2,
  Podcast,
  Flower,
  Loader,
  AudioLines,
  Play,
  Square,
  Sparkles,
  Plus,
  Gauge,
} from 'lucide-react'
import { toast } from 'sonner'

import { useAgentPlayer } from '@/hooks/use-player'
import useTTSStore from '@/store/tts'
import { root } from '@/services/end-points'

import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useNavigate } from 'react-router-dom'
import { Slider } from '@/components/ui/slider'

const suggestions = [
  { label: 'Narrate a story', icon: BookOpenText, prompt: 'Once upon a time, in a land far, far away...' },
  {
    label: 'Tell a silly joke',
    icon: Laugh,
    prompt: "Why don't scientists trust atoms? Because they make up everything!",
  },
  { label: 'Record an advertisement', icon: Mic, prompt: 'Discover the future of voice technology with VoiceForge...' },
  { label: 'Speak in different languages', icon: Globe, prompt: 'Hello! Bonjour! Hola! Guten Tag! Ciao!' },
  {
    label: 'Direct a dramatic movie scene',
    icon: Film,
    prompt: 'The tension in the room was palpable as she slowly turned the doorknob...',
  },
  {
    label: 'Hear from a video game character',
    icon: Gamepad2,
    prompt: 'Greetings, adventurer! Your quest awaits in the mystical realm ahead.',
  },
  {
    label: 'Introduce your podcast',
    icon: Podcast,
    prompt: 'Welcome to another episode of our podcast, where we explore...',
  },
  {
    label: 'Guide a meditation class',
    icon: Flower,
    prompt: 'Take a deep breath in... and slowly breathe out. Feel your body relax...',
  },
]

function MainPanel() {
  const [status, setStatus] = useState('idle')
  const [text, setText] = useState('')
  const navigate = useNavigate()

  const handleAddModel = () => {
    navigate('/models')
  }

  const isDownloaded = useTTSStore((s) => s.isDownloaded)
  const update = useTTSStore((s) => s.update)
  const models = useTTSStore((s) => s.addedModels)
  const voice = useTTSStore((s) => s.voice)
  const speed = useTTSStore((s) => s.speed)

  const { play, stop } = useAgentPlayer()

  async function getTTS(): Promise<void> {
    try {
      // if (!isDownloaded) {
      //   toast("Please download the model first")
      //   return
      // }
      if (text.trim() === '') return

      setStatus('loading')
      const response = await fetch(`${root.localBackendUrl}/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice: 'bf_emma', speed }),
      })

      if (!response.ok) return

      const data = await response.json()
      setStatus('playing')
      play(`${root.localBackendUrl}/tts/${data?.fileName}`, () => {
        setStatus('idle')
      })
    } catch (err) {
      setStatus('idle')
    }
  }

  function onStop() {
    stop()
    setStatus('idle')
  }

  return (
    <div className='h-full grid grid-rows-[auto_1fr_auto] bg-background'>
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
              Model
            </Label>

            <div className='flex gap-2 items-center'>
              <Select value={voice} onValueChange={(value) => update({ voice: value })}>
                <SelectTrigger className='w-[200px]'>
                  <SelectValue placeholder='Select model' />
                </SelectTrigger>

                <SelectContent>
                  {models.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant='default' size='icon' onClick={handleAddModel}>
                    <Plus className='w-4 h-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side='top'>Add more models</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

      <div className='overflow-auto px-6'>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='Start typing here...'
          className='w-full h-full resize-none border-none text-base shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-foreground placeholder:text-muted-foreground'
        />
      </div>
      {status !== 'playing' && !!text && (
        <div className='px-6 pb-4 flex justify-between gap-4 items-end'>
          <div className='w-56 mt-6 ml-4'>
            <Label className='mb-2 text-sm flex items-center gap-2 text-foreground'>
              <Gauge className='w-4 h-4 text-muted-foreground' />
              Speed
            </Label>
            <Slider
              value={[speed]}
              min={0}
              max={1}
              step={0.1}
              onValueChange={([val]) => update({ speed: val })}
              className='h-2 [&_[data-slot=slider-track]]:bg-muted [&_[data-slot=slider-range]]:bg-primary [&_[data-slot=slider-thumb]]:bg-background [&_[data-slot=slider-thumb]]:border [&_[data-slot=slider-thumb]]:border-primary'
            />
            <div className='flex justify-between text-xs text-muted-foreground mt-1'>
              <span>Slower</span>
              <span>Faster</span>
            </div>
          </div>

          <Button
            onClick={getTTS}
            disabled={status === 'loading'}
            className={cn(
              'w-auto mt-4 px-6 py-2 text-black font-medium transition-all duration-300 ease-out flex items-center gap-2 rounded-md',
              'hover:shadow-lg hover:scale-[1.03] hover:bg-primary/90 active:scale-[0.98]',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}>
            {status === 'loading' ? (
              <>
                <span className='relative flex items-center justify-center'>
                  <span className='absolute inline-flex h-5 w-5 animate-ping rounded-full bg-black opacity-40' />
                  <Loader className='size-4 z-10 animate-spin fill-black' />
                </span>
                <span key='generating' className='fade-scale transition-all duration-300'>
                  Generating...
                </span>
              </>
            ) : (
              <>
                <Play className='size-4 fill-black' />
                <span key='generate' className='fade-scale transition-all duration-300'>
                  Generate
                </span>
              </>
            )}
          </Button>
        </div>
      )}

      {status === 'playing' && (
        <div className='px-6 pb-4 flex justify-end'>
          <Button
            onClick={onStop}
            variant='destructive'
            className={cn(
              'w-auto mt-4 px-6 py-2 text-white font-medium transition-all duration-300 ease-out flex items-center gap-2 rounded-md',
              'hover:shadow-lg hover:scale-[1.03] hover:bg-destructive/90 active:scale-[0.98]'
            )}>
            <Square className='size-4 fill-white animate-spin-slow' />
            <span key='stop' className='fade-scale transition-all duration-300'>
              Stop
            </span>
          </Button>
        </div>
      )}

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
