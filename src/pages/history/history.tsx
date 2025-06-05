import { ChevronLeft, History as HistoryIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useTTSHistory } from '@/store/history-tts'
import { Link } from 'react-router-dom'
import AudioHistoryCard from './audio-history-card'

const History = () => {
  const { items } = useTTSHistory()

  return (
    <div className='min-h-screen px-6 py-8 bg-background text-foreground animate-fade-in'>
      <div className='w-full mb-8 flex flex-col gap-4'>
        <div className='flex items-center gap-2'>
          <Button asChild variant='ghost' size='sm' className='flex items-center gap-1 px-2 hover:bg-muted transition'>
            <Link to='/' aria-label='Go back'>
              <ChevronLeft className='w-5 h-5 text-muted-foreground' />
              <span className='sr-only'>Back</span>
            </Link>
          </Button>
          <h1 className='text-3xl font-semibold flex items-center gap-2'>
            <HistoryIcon className='w-6 h-6 text-muted-foreground' />
            TTS History
          </h1>
        </div>

        <p className='text-muted-foreground w-full max-w-prose text-sm ml-8'>
          Access your past Text-to-Speech recordings. Play them back, download the audio, or review details at a glance.
        </p>
      </div>

      <div className='mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3'>
        {items.length === 0 ? (
          <div className='col-span-full text-center py-12 text-muted-foreground text-lg border rounded-xl'>
            You haven&apos;t generated any speech yet. Start your first TTS conversion to see it here.
          </div>
        ) : (
          items.map((item) => (
            <AudioHistoryCard
              key={item.id}
              text={item.text}
              url={item.url}
              voice={item.voice}
              createdAt={item.createdAt}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default History
