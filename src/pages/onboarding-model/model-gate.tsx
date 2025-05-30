import { useEffect, useState } from 'react'
import OnboardingModal from './oboarding-model'

export default function ModelGate({ children }: { children: React.ReactNode }) {
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const hasModel = !!localStorage.getItem('selectedModel')
    setShowModal(!hasModel)
  }, [])

  const handleComplete = () => {
    setShowModal(false)
  }

  return (
    <div className='relative w-full h-full'>
      <div className={showModal ? 'blur-md pointer-events-none select-none' : ''}>{children}</div>

      {showModal && (
        <div className='absolute inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-xs'>
          <OnboardingModal onComplete={handleComplete} />
        </div>
      )}
    </div>
  )
}
