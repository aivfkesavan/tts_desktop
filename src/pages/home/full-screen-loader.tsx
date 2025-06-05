import { Loader } from 'lucide-react'

const FullScreenLoader = () => {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-background/70'>
      <div className='flex flex-col items-center gap-4 animate-fade-in'>
        <Loader className='w-8 h-8 animate-spin text-primary' />
        <p className='text-sm text-muted-foreground'>Generating your audio...</p>
      </div>
    </div>
  )
}

export default FullScreenLoader
