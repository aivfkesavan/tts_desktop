'use client'

import { useState } from 'react'
import { DownloadCloud, Loader2, Crown, ArrowLeft, Mars, Venus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardTitle, CardContent } from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'
import { voices } from '@/utils/tts-models'

export default function ModelsPage() {
  const [downloading, setDownloading] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleDownload = (name: string) => {
    setDownloading(name)
    setTimeout(() => setDownloading(null), 2000)
  }

  return (
    <div className='p-8'>
      <Button variant='ghost' className='mb-4 flex items-center gap-2' onClick={() => navigate('/')}>
        <ArrowLeft className='h-4 w-4' />
        Back
      </Button>

      <h1 className='text-2xl font-semibold mb-6'>Available Models</h1>

      <div className='grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-6'>
        {voices.map((model) => (
          <Card key={model.name} className='flex flex-col justify-between p-6 shadow-sm border rounded-2xl h-full'>
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

            <div className='flex justify-end '>
              <Button
                variant='ghost'
                size='sm'
                className='flex items-center gap-2'
                disabled={downloading === model.name}
                onClick={() => handleDownload(model.name)}>
                {downloading === model.name ? (
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
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
