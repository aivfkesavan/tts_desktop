'use client'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DownloadCloud, Loader2, Crown } from 'lucide-react'
import { useState } from 'react'

const models = [
  { name: 'Aria', desc: 'English - Female - Conversational', tag: 'Natural', tier: 'Premium' },
  { name: 'Roger', desc: 'English - Male - Professional', tag: 'Business', tier: 'High' },
  { name: 'Sarah', desc: 'English - Female - Warm & Friendly', tag: 'Natural', tier: 'Premium' },
  { name: 'Laura', desc: 'English - Female - Narrative', tag: 'Storytelling', tier: 'High' },
  { name: 'Charlie', desc: 'English - Male - Casual & Young', tag: 'Casual', tier: 'Premium' },
  { name: 'George', desc: 'English - Male - Authoritative', tag: 'Professional', tier: 'High' },
  { name: 'Callum', desc: 'English - Male - Energetic', tag: 'Dynamic', tier: 'Premium' },
  { name: 'River', desc: 'English - Neutral - Calm', tag: 'Meditation' },
]

export default function OnboardingModal({ onComplete }: { onComplete: () => void }) {
  const [downloading, setDownloading] = useState<string | null>(null)

  const handleDownload = (model: string) => {
    setDownloading(model)
    setTimeout(() => {
      localStorage.setItem('selectedModel', model)
      onComplete()
    }, 2000)
  }

  return (
    <Dialog open>
      <DialogContent className='sm:max-w-6xl w-full border-none bg-white/80 backdrop-blur-md shadow-xl p-6 rounded-xl'>
        <h2 className='text-2xl font-semibold mb-6 text-center'>Select a voice model to get started</h2>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-h-[70vh] overflow-y-auto pr-2'>
          {models.map((model) => (
            <Card
              key={model.name}
              className='flex flex-col justify-between rounded-lg shadow-sm border border-border p-4'>
              <CardHeader className='pb-1'>
                <CardTitle className='text-lg flex items-center gap-2 font-medium'>
                  {model.name}
                  {model.tier === 'Premium' && <Crown className='w-4 h-4 text-yellow-500' />}
                </CardTitle>
                <p className='text-sm text-muted-foreground'>{model.desc}</p>
              </CardHeader>

              <CardContent className='flex justify-between items-center mt-4'>
                <div className='flex gap-2 flex-wrap'>
                  <Badge variant='outline'>{model.tag}</Badge>
                  {model.tier && (
                    <Badge variant={model.tier === 'Premium' ? 'default' : 'secondary'}>{model.tier}</Badge>
                  )}
                </div>

                <Button
                  size='icon'
                  variant='ghost'
                  disabled={!!downloading}
                  onClick={() => handleDownload(model.name)}
                  className='ml-2'>
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
      </DialogContent>
    </Dialog>
  )
}
