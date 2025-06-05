'use client'

import { Play, Pause, Square, Loader, RotateCcw, Gauge } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'

import { cn } from '@/lib/utils'

import React from 'react'
import AudioVisualizer from './audio-visualizer'

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

      {audioMeta?.url && (
        <div className='flex-1 min-w-[200px] max-w-[600px] flex items-center justify-between'>
          <AudioVisualizer currentTime={currentTime} duration={duration} audioRef={audioRef} />
        </div>
      )}

      <div className='flex items-center justify-end gap-4 mt-6 w-[280px] min-w-[280px] animate-fade-in'>
        {canPausePlay && (
          <button
            onClick={isPaused ? play : pause}
            className='gap-2 flex items-center px-4 py-2 rounded-md bg-secondary text-white hover:scale-105 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg'>
            <div className='transform transition-transform duration-300 hover:rotate-3 hover:scale-110'>
              {isPaused ? <Play className='size-4 fill-white' /> : <Pause className='size-4 fill-white' />}
            </div>
            <span className='text-sm font-medium'>{isPaused ? 'Resume' : 'Pause'}</span>
          </button>
        )}

        {canPausePlay && (
          <button
            onClick={stop}
            className='gap-2 flex items-center px-4 py-2 rounded-md bg-destructive text-white hover:scale-105 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg'>
            <div className='transform transition-transform duration-300 hover:rotate-3 hover:scale-110'>
              <Square className='size-4 fill-white' />
            </div>
            <span className='text-sm font-medium'>Stop</span>
          </button>
        )}

        {canReplay && (
          <button
            onClick={replay}
            className='gap-2 flex items-center px-4 py-2 rounded-md bg-secondary text-white hover:scale-105 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg'>
            <div className='transform transition-transform duration-300 hover:rotate-3 hover:scale-110'>
              <Play className='size-4 fill-white' />
            </div>
            <span className='text-sm font-medium'>Play Again</span>
          </button>
        )}

        {hasChanged && trimmedText && (
          <button
            onClick={getTTS}
            disabled={status === 'loading'}
            className='gap-2 flex items-center px-4 py-2 rounded-md bg-primary text-black hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg'>
            {status === 'loading' ? (
              <>
                <Loader className='h-4 w-4 animate-spin' />
                <span className='text-sm font-medium'>Generating...</span>
              </>
            ) : (
              <>
                <Play className='size-4 fill-black transition-transform duration-300 hover:scale-110' />
                <span className='text-sm font-medium'>Generate</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
