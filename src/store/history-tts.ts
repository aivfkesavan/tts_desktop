import { create } from 'zustand'

interface HistoryItem {
  id: string
  text: string
  url: string
  voice: string
  createdAt: number
}

interface TTSHistoryState {
  items: HistoryItem[]
  add: (item: Omit<HistoryItem, 'id' | 'createdAt'>) => void
  clear: () => void
}

export const useTTSHistory = create<TTSHistoryState>((set) => ({
  items: [],
  add: ({ text, url, voice }) =>
    set((state) => ({
      items: [
        {
          id: crypto.randomUUID(),
          text,
          url,
          voice,
          createdAt: Date.now(),
        },
        ...state.items,
      ],
    })),
  clear: () => set({ items: [] }),
}))
