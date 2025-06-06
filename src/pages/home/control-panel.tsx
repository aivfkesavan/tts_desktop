'use client'

import { Play, Pause, Square, Loader, RotateCcw, Gauge, Download } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'

import { cn } from '@/lib/utils'

import React from 'react'
import AudioVisualizer from './audio-visualizer'
import { Button } from '@/components/ui/button'
import FullScreenLoader from './full-screen-loader'

type AudioControlPanelProps = {
  speed: number
  update: (params: { speed?: number }) => void
  isPaused: boolean
  play: () => void
  pause: () => void
  stop: () => void
  replay: () => void
  getTTS: () => void
  status: 'idle' | 'loading'
  hasChanged: boolean
  trimmedText: string
  canPausePlay: boolean
  canReplay: boolean
  audioMeta?: {
    url: string
  }
  currentTime: number
  duration: number
  audioRef: React.RefObject<HTMLAudioElement>
  className?: string
}

export const AudioControlPanel: React.FC<AudioControlPanelProps> = ({
  speed,
  update,
  isPaused,
  play,
  pause,
  stop,
  replay,
  getTTS,
  status,
  hasChanged,
  trimmedText,
  canPausePlay,
  canReplay,
  audioMeta,
  currentTime,
  duration,
  audioRef,
  className,
}) => {
  return (
    <>
      {status === 'loading' && <FullScreenLoader />}
      <div className={cn('px-6 pb-4 flex flex-wrap items-end justify-between gap-6 mt-4', className)}>
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
        </div>

        {audioMeta?.url && !hasChanged && (
          <div className='flex-1 min-w-[200px] max-w-[600px] flex items-center justify-between'>
            <AudioVisualizer currentTime={currentTime} duration={duration} audioRef={audioRef} />
          </div>
        )}

        <div className='flex items-center justify-end gap-4 mt-6 w-[280px] min-w-[280px] animate-fade-in'>
          {audioMeta?.url && !hasChanged && (
            <Button asChild variant='secondary' size='icon' className='text-foreground hover:text-primary transition'>
              <a href={audioMeta.url} download={`tts-${Date.now()}.wav`}>
                <Download className='w-4 h-4' />
              </a>
            </Button>
          )}
          {canPausePlay && (
            <Button onClick={isPaused ? play : pause} variant='secondary' className='gap-2'>
              <div className='transition-transform duration-300 hover:rotate-3 hover:scale-110'>
                {isPaused ? (
                  <Play className='size-4 fill-black dark:fill-white' />
                ) : (
                  <Pause className='size-4 fill-black dark:fill-white' />
                )}
              </div>
              <span>{isPaused ? 'Resume' : 'Pause'}</span>
            </Button>
          )}

          {canPausePlay && (
            <Button onClick={stop} variant='destructive' className='gap-2'>
              <div className='transition-transform duration-300 hover:rotate-3 hover:scale-110'>
                <Square className='size-4 fill-white' />
              </div>
              <span>Stop</span>
            </Button>
          )}

          {canReplay && (
            <Button onClick={replay} variant='secondary' className='gap-2'>
              <div className='transition-transform duration-300 hover:rotate-3 hover:scale-110'>
                <Play className='size-4 fill-black dark:fill-white' />
              </div>
              <span>Play Again</span>
            </Button>
          )}

          {hasChanged && trimmedText && (
            <Button
              onClick={getTTS}
              variant='default'
              disabled={status === 'loading'}
              className='gap-2 text-black hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all'>
              {status === 'loading' ? (
                <>
                  <Loader className='h-4 w-4 animate-spin' />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Play className='size-4 fill-black transition-transform duration-300 hover:scale-110' />
                  <span>Generate</span>
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </>
  )
}
