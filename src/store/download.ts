import { create } from 'zustand'
import { root } from '@/services/end-points'
import { toast } from 'sonner'

type Downloads = {
  [id: string]: {
    title?: string
    progress: number
  }
}

type DownloadStore = {
  downloads: Downloads
  downloadTTSModel: (params: {
    onSuccess?: () => void
    onError?: () => void
  }) => Promise<void>
}

const duration = 3000

const useDownloadsStore = create<DownloadStore>((set) => ({
  downloads: {},

  downloadTTSModel: async ({ onSuccess, onError }) => {
    try {
      const response = await fetch(`${root.localBackendUrl}/tts/status`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let comps: any = {}

      while (true) {
        const { value, done } = await reader?.read() || {}
        if (done) {
          toast.success("TTS setup finished", {
            className: "py-2",
            richColors: true,
            closeButton: true,
            position: "top-center",
            duration,
            id: "tts",
          })
          set({ downloads: {} })
          onSuccess?.()
          break
        }

        const chunk = decoder?.decode(value)
        const lines = chunk?.split('\n\n')

        lines?.forEach(line => {
          if (line?.startsWith('data: ')) {
            let data = null
            try {
              data = JSON?.parse(line?.slice(6))
            } catch (error) {
            }
            if (data) {
              let perc = data?.progress ? Math.ceil(data?.progress) : 0
              if (!comps[data?.file]) {
                comps[data?.file] = `component ${Object.keys(comps).length + 1}`
              }
              let res = `${comps[data?.file]}: ${perc}`

              toast.loading("TTS setup", {
                className: "py-2",
                description: `Progress: Models ${res}%`,
                descriptionClassName: "text-xs",
                richColors: false,
                closeButton: false,
                position: "top-center",
                duration,
                id: "tts",
              })
              set({
                downloads: {
                  tts: {
                    progress: perc,
                  }
                }
              })
            }
          }
        })
      }
    } catch (error) {
      onError?.()
    }
  },
}))

export default useDownloadsStore
