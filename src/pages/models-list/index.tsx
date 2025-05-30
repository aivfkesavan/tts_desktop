'use client'

import { useState } from 'react'
import { DownloadCloud, Loader2, Crown, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'

interface Model {
  name: string
  description: string
  tag: string
  tier?: 'Premium' | 'High'
}

const models: Model[] = [
  { name: 'Aria', description: 'English - Female - Conversational', tag: 'Natural', tier: 'Premium' },
  { name: 'Roger', description: 'English - Male - Professional', tag: 'Business', tier: 'High' },
  { name: 'Sarah', description: 'English - Female - Warm & Friendly', tag: 'Natural', tier: 'Premium' },
  { name: 'Laura', description: 'English - Female - Narrative', tag: 'Storytelling', tier: 'High' },
  { name: 'Charlie', description: 'English - Male - Casual & Young', tag: 'Casual', tier: 'Premium' },
  { name: 'George', description: 'English - Male - Authoritative', tag: 'Professional', tier: 'High' },
  { name: 'Callum', description: 'English - Male - Energetic', tag: 'Dynamic', tier: 'Premium' },
  { name: 'River', description: 'English - Neutral - Calm', tag: 'Meditation' },
]

export default function ModelsPage() {
  const [downloading, setDownloading] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleDownload = (name: string) => {
    setDownloading(name)
    // Simulate download delay
    setTimeout(() => setDownloading(null), 2000)
  }

  return (
    <div className='p-8'>
      <Button variant='ghost' className='mb-4' onClick={() => navigate('/')}>
        <ArrowLeft />
        Back
      </Button>
      <h1 className='text-2xl font-semibold mb-6'>Available Models</h1>

      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
        {models.map((model) => (
          <Card key={model.name} className='flex flex-col justify-between'>
            <CardHeader className='pb-2'>
              <CardTitle className='flex items-center gap-2'>
                {model.name}
                {model.tier === 'Premium' && <Crown className='w-4 h-4 text-yellow-500' />}
              </CardTitle>
              <p className='text-sm text-muted-foreground'>{model.description}</p>
            </CardHeader>

            <CardContent className='flex items-center justify-between'>
              <div className='flex gap-2 flex-wrap'>
                <Badge variant='outline'>{model.tag}</Badge>
                {model.tier && <Badge variant={model.tier === 'Premium' ? 'default' : 'secondary'}>{model.tier}</Badge>}
              </div>

              <Button
                variant='ghost'
                size='icon'
                disabled={downloading === model.name}
                onClick={() => handleDownload(model.name)}>
                {downloading === model.name ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : (
                  <DownloadCloud className='w-5 h-5' />
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
