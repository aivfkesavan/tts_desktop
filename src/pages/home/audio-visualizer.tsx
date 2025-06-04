import { useMemo } from 'react'
import { cn } from '@/lib/utils'

interface Props {
  duration: number
  currentTime: number
  audioRef: React.RefObject<HTMLAudioElement>
}

const BAR_COUNT = 48

export default function AudioVisualizer({ duration, currentTime, audioRef }: Props) {
  const barHeights = useMemo(() => Array.from({ length: BAR_COUNT }, () => Math.floor(Math.random() * 80 + 20)), [])

  const progressFloat = useMemo(() => {
    if (duration <= 0) return 0
    const raw = (currentTime / duration) * BAR_COUNT
    return Math.min(Math.max(raw, 0), BAR_COUNT)
  }, [currentTime, duration])

  const formatTime = (t: number) => {
    const mins = String(Math.floor(t / 60)).padStart(2, '0')
    const secs = String(Math.floor(t % 60)).padStart(2, '0')
    return `${mins}:${secs}`
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || duration <= 0) return

    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const barWidth = rect.width / BAR_COUNT
    const clickedBarIndex = Math.floor(clickX / barWidth)
    const newTime = (clickedBarIndex / BAR_COUNT) * duration

    audioRef.current.currentTime = Math.min(Math.max(newTime, 0), duration)
  }

  return (
    <div className='flex flex-col items-center w-full'>
      <div className='text-xs text-muted-foreground mb-2'>
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
      <div
        className='flex items-center justify-center w-full max-w-[600px] h-6 overflow-hidden cursor-pointer'
        onClick={handleSeek}>
        {barHeights.map((barHeight, index) => {
          const rawFill = progressFloat - index
          const fill = Math.min(Math.max(rawFill, 0), 1)
          return (
            <div
              key={index}
              className={cn(
                'w-[2px] mx-[1px] rounded-sm',
                'transition-all duration-300 ease-linear',
                fill > 0 ? 'bg-primary' : 'bg-primary/80'
              )}
              style={{
                height: `${barHeight}%`,
                opacity: fill * 0.8 + 0.2,
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
