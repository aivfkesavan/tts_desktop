'use client'

import { DownloadCloud, Loader2, Crown, Mars, Venus, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardTitle, CardContent } from '@/components/ui/card'
import useTTSStore from '@/store/tts'

interface VoiceCardProps {
  model: {
    name: string
    title: string
    quality: string
    overallGrade: string
    description: string
    gender: string
    language: string
  }
  isDisabled: boolean
  isDownloading: boolean
  setDownloading: (name: string) => void
  onDownloadComplete: () => void
}

export function VoiceCard({ model, isDisabled, isDownloading, setDownloading, onDownloadComplete }: VoiceCardProps) {
  const addedModels = useTTSStore((state) => state.addedModels)
  const isAlreadyDownloaded = addedModels.includes(model.name)

  return (
    <Card className='flex flex-col justify-between p-6 shadow-sm border rounded-2xl h-full transition-opacity duration-300'>
      <div className='flex flex-col gap-2'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <CardTitle className='text-lg font-semibold capitalize'>{model.title}</CardTitle>

            <Badge variant='secondary' className='flex items-center font-semibold gap-1 text-xs'>
              {model.gender === 'female' ? (
                <Venus strokeWidth={2} className='h-3 w-3' />
              ) : (
                <Mars strokeWidth={2} className='h-3 w-3' />
              )}
              {model.gender}
            </Badge>
          </div>

          {model.quality === 'A' && (
            <Badge variant='default' className='text-xs px-2 py-0.5 flex items-center gap-1'>
              <Crown className='h-3 w-3' />
              Premium
            </Badge>
          )}
        </div>

        <CardContent className='p-0 mt-1 mb-2 text-sm text-muted-foreground'>{model.description}</CardContent>

        <div className='flex flex-wrap items-center gap-2 text-sm'>
          <Badge variant='outline'>{model.language}</Badge>
          <Badge variant='outline'>{model.overallGrade} Grade</Badge>
        </div>
      </div>

      <div className='flex justify-end mt-4'>
        {isAlreadyDownloaded ? (
          <Button
            variant='secondary'
            size='sm'
            className='flex items-center gap-2 bg-green-100 text-green-800 dark:bg-[#001F01] dark:text-[#59F3A6] cursor-default'>
            <CheckCircle className='h-4 w-4' />
            Downloaded
          </Button>
        ) : (
          <Button
            onClick={() => setDownloading(model.name)}
            disabled={isDisabled || isDownloading}
            className='flex items-center gap-2'
            variant='ghost'
            size='sm'>
            {isDownloading ? (
              <>
                <Loader2 className='animate-spin h-4 w-4' />
                Downloading...
              </>
            ) : (
              <>
                <DownloadCloud className='h-4 w-4' />
                Download
              </>
            )}
          </Button>
        )}
      </div>
    </Card>
  )
}
