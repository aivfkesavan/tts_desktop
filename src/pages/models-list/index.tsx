'use client'

import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { voices } from '@/utils/tts-models'
import { VoiceCard } from './voice-card'

export default function ModelsPage() {
  const navigate = useNavigate()

  return (
    <div className='p-8'>
      <Button variant='ghost' className='mb-4 flex items-center gap-2' onClick={() => navigate('/')}>
        <ArrowLeft className='h-4 w-4' />
        Back
      </Button>

      <h1 className='text-2xl font-semibold mb-6'>Available Models</h1>

      <div className='grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-6'>
        {voices.map((model) => (
          <VoiceCard key={model.name} model={model} />
        ))}
      </div>
    </div>
  )
}
