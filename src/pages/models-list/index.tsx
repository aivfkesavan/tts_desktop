'use client'

import { ArrowLeft, AudioLines } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { voices } from '@/utils/tts-models'
import { VoiceCard } from './voice-card'
import useTTSStore from '@/store/tts'
import useDownloadsStore from '@/store/download'

export default function ModelsPage() {
  const navigate = useNavigate()
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

          setDownloading(null)
        },
      })
    }
  }

  return (
    <div className='p-8'>
      <Button variant='ghost' className='mb-6 flex items-center gap-2' onClick={() => navigate('/')}>
        <ArrowLeft className='h-4 w-4' />
        Back
      </Button>

      <div className='flex items-center gap-2 mb-8'>
        <AudioLines className='h-5 w-5 text-primary' />
        <h1 className='text-2xl font-semibold tracking-tight'>Available Voice Models</h1>
      </div>

      <div className='grid gap-6 grid-cols-3 '>
        {voices.map((model) => {
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
              onDownloadComplete={() => {}}
            />
          )
        })}
      </div>
    </div>
  )
}
