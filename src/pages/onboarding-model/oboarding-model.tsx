'use client'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { AudioLines } from 'lucide-react'
import { useState } from 'react'
import { voices } from '@/utils/tts-models'
import { VoiceCard } from '../models-list/voice-card'
import useTTSStore from '@/store/tts'
import useDownloadsStore from '@/store/download'

export default function OnboardingModal({ onComplete }: { onComplete: () => void }) {
  const [downloading, setDownloading] = useState<string | null>(null)

  const update = useTTSStore((s) => s.update)
  const isDownloaded = useTTSStore((s) => s.isDownloaded)
  const addedModels = useTTSStore((s) => s.addedModels)

  const downloadTTSModel = useDownloadsStore((s) => s.downloadTTSModel)

  const handleDownload = (modelName: string) => {
    setDownloading(modelName)
    if (isDownloaded) {
      let progress = 0
      const interval = setInterval(() => {
        progress += 20

        if (progress >= 100) {
          clearInterval(interval)

          const newSet = Array.from(new Set([...addedModels, modelName]))

          update({
            isDownloaded: true,
            voice: modelName,
            addedModels: newSet,
          })

          onComplete()

          setDownloading(null)
        }
      }, 400)
    } else {
      downloadTTSModel({
        onSuccess: () => {
          const newSet = Array.from(new Set([...addedModels, modelName]))

          update({
            isDownloaded: true,
            voice: modelName,
            addedModels: newSet,
          })

          onComplete()

          setDownloading(null)
        },
      })
    }
  }

  return (
    <Dialog open>
      <DialogContent
        hideClose
        className='sm:max-w-6xl w-full border-none bg-card/90 backdrop-blur-md shadow-2xl p-8 sm:p-10 rounded-2xl animate-fade-in'>
        <div className='text-center mb-10'>
          <div className='inline-flex items-center gap-2 justify-center mb-3 text-primary'>
            <AudioLines className='w-6 h-6 animate-pulse-slow' />
            <h2 className='text-2xl sm:text-4xl font-bold tracking-tight text-foreground'>Select a Voice Model</h2>
          </div>
          <p className='text-muted-foreground text-sm sm:text-base max-w-xl mx-auto'>
            Choose your preferred voice to activate NativeNode&apos;s text-to-speech. This step is required to get
            started.
          </p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-h-[65vh] overflow-y-auto pr-1 sm:pr-2'>
          {voices.slice(0, 6).map((model) => {
            const isDownloadingThis = downloading === model.name
            const isAnyDownloading = !!downloading
            const isDisabled = isAnyDownloading && !isDownloadingThis

            return (
              <VoiceCard
                key={model.name}
                model={model}
                isDisabled={isDisabled}
                isDownloading={isDownloadingThis}
                setDownloading={handleDownload}
                onDownloadComplete={onComplete}
              />
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
