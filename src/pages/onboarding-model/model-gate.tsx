'use client'

import OnboardingModal from './oboarding-model'
import useTTSStore from '@/store/tts'

export default function ModelGate({ children }: { children: React.ReactNode }) {
  const isDownloaded = useTTSStore((state) => state.isDownloaded)

  return (
    <div className='relative w-full h-full'>
      <div className={isDownloaded ? '' : 'blur-md pointer-events-none select-none'}>{children}</div>

      {!isDownloaded && (
        <div className='absolute inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-xs'>
          <OnboardingModal onComplete={() => {}} />
        </div>
      )}
    </div>
  )
}
