import { create } from 'zustand'

interface HistoryItem {
  id: string
  text: string
  url: string
  createdAt: number
}

interface TTSHistoryState {
  items: HistoryItem[]
  add: (item: Omit<HistoryItem, 'id' | 'createdAt'>) => void
  clear: () => void
}

export const useTTSHistory = create<TTSHistoryState>((set) => ({
  items: [],
  add: ({ text, url }) =>
    set((state) => ({
      items: [
        {
          id: crypto.randomUUID(),
          text,
          url,
          createdAt: Date.now(),
        },
        ...state.items,
      ],
    })),
  clear: () => set({ items: [] }),
}))
