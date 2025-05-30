import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type ttsState = {
  isDownloaded: boolean
  voice: string
  speed: number
  addedModels: string[]
}

type actions = {
  update: (v: Partial<ttsState>) => void
  clear: () => void
}

const payload: ttsState = {
  isDownloaded: false,
  voice: '',
  speed: 1,
  addedModels: [],
}

const useTTSStore = create<ttsState & actions>()(
  persist(
    (set) => ({
      ...payload,

      update: (payload) => set({ ...payload }),

      clear: () => set({ ...payload }),
    }),
    {
      name: 'tts-storage',
    }
  )
)

export default useTTSStore
