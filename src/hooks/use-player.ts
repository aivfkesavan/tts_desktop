import { useRef, useState } from "react";

export const emptyFrequencies = (numBars: number) => Array(numBars).fill(0).map(() => new Float32Array(1).fill(0))

export function useAgentPlayer() {
  const currentAudioRef = useRef<HTMLAudioElement | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyzerRef = useRef<AnalyserNode | null>(null)

  const numBars = 5
  const [frequencies, setFrequencies] = useState<Float32Array[]>(emptyFrequencies(numBars))

  function play(audioURL: string, onEnd?: () => void) {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause()
      currentAudioRef.current.currentTime = 0
      currentAudioRef.current = null
    }

    currentAudioRef.current = new Audio(audioURL);
    currentAudioRef.current.crossOrigin = "anonymous";

    if (!audioContextRef.current) {
      // @ts-ignore
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    const audioContext = audioContextRef.current;
    const audioSource = audioContext.createMediaElementSource(currentAudioRef.current);

    if (!analyzerRef.current) {
      analyzerRef.current = audioContext.createAnalyser();
      analyzerRef.current.fftSize = 64;
    }

    audioSource.connect(analyzerRef.current);
    analyzerRef.current.connect(audioContext.destination);

    const updateVisualization = () => {
      if (currentAudioRef.current && !currentAudioRef.current.paused) {
        const dataArray = new Float32Array(analyzerRef.current!.frequencyBinCount);
        analyzerRef.current!.getFloatFrequencyData(dataArray);

        const normalizedData = Array(numBars).fill(null).map((_, i) => {
          const start = Math.floor(i * dataArray.length / numBars);
          const end = Math.floor((i + 1) * dataArray.length / numBars);
          const slice = dataArray.slice(start, end);

          return slice.map((v, j) => (v + 100 + (i > 2 ? j * 15 : 0)) / 100);
        });

        setFrequencies(normalizedData);
        requestAnimationFrame(updateVisualization);
      }
    }

    currentAudioRef.current.play();
    updateVisualization();

    currentAudioRef.current.onended = () => {
      currentAudioRef.current = null;
      setFrequencies(emptyFrequencies(numBars))
      onEnd?.()
    }
  }

  function stop() {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
      setFrequencies(emptyFrequencies(numBars))
    }
  }

  return {
    frequencies,
    play,
    stop,
  }
}
