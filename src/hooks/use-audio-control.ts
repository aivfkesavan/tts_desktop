import { useEffect, useRef, useState, useCallback } from 'react'

type AudioStatus = 'idle' | 'loading' | 'playing' | 'paused'

interface UseAudioPlayerConfig {
  audioUrl: string | null
  autoPlay?: boolean
}

interface UseAudioPlayerResult {
  status: AudioStatus
  currentTime: number
  duration: number
  isPaused: boolean
  play: () => Promise<void>
  pause: () => void
  stop: () => void
  replay: () => Promise<void>
  audioRef: React.MutableRefObject<HTMLAudioElement | null>
}

export function useAudioPlayer({ audioUrl, autoPlay = false }: UseAudioPlayerConfig): UseAudioPlayerResult {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [status, setStatus] = useState<AudioStatus>('idle')
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const cleanupAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
      audioRef.current = null
    }
    setStatus('idle')
    setCurrentTime(0)
    setDuration(0)
    setIsPaused(false)
  }, [])

  useEffect(() => {
    if (!audioUrl) {
      cleanupAudio()
      return
    }

    const audio = new Audio(audioUrl)
    audio.crossOrigin = 'anonymous'
    audioRef.current = audio
    setStatus('loading')

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
      setDuration(audio.duration || 0)
    }

    const handleEnded = () => {
      setStatus('idle')
      setCurrentTime(0)
      setIsPaused(false)
    }

    audio.ontimeupdate = handleTimeUpdate
    audio.onended = handleEnded

    if (autoPlay) {
      audio
        .play()
        .then(() => {
          setStatus('playing')
        })
        .catch(() => {
          setStatus('idle')
        })
    }

    return () => {
      audio.pause()
      audioRef.current = null
    }
  }, [audioUrl, autoPlay, cleanupAudio])

  const play = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return
    await audio.play()
    setIsPaused(false)
    setStatus('playing')
  }, [])

  const pause = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    setIsPaused(true)
    setStatus('paused')
  }, [])

  const stop = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    audio.currentTime = 0
    setCurrentTime(0)
    setIsPaused(false)
    setStatus('idle')
  }, [])

  const replay = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = 0
    await audio.play()
    setIsPaused(false)
    setStatus('playing')
  }, [])

  return {
    status,
    currentTime,
    duration,
    isPaused,
    play,
    pause,
    stop,
    replay,
    audioRef,
  }
}
