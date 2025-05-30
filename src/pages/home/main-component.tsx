import { BookOpenText, Laugh, Mic, Globe, Film, Gamepad2, Podcast, Flower } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

interface MainPanelProps {
  text: string
  setText: (text: string) => void
}

const suggestions = [
  { label: 'Narrate a story', icon: BookOpenText, prompt: 'Once upon a time, in a land far, far away...' },
  {
    label: 'Tell a silly joke',
    icon: Laugh,
    prompt: "Why don't scientists trust atoms? Because they make up everything!",
  },
  { label: 'Record an advertisement', icon: Mic, prompt: 'Discover the future of voice technology with VoiceForge...' },
  { label: 'Speak in different languages', icon: Globe, prompt: 'Hello! Bonjour! Hola! Guten Tag! Ciao!' },
  {
    label: 'Direct a dramatic movie scene',
    icon: Film,
    prompt: 'The tension in the room was palpable as she slowly turned the doorknob...',
  },
  {
    label: 'Hear from a video game character',
    icon: Gamepad2,
    prompt: 'Greetings, adventurer! Your quest awaits in the mystical realm ahead.',
  },
  {
    label: 'Introduce your podcast',
    icon: Podcast,
    prompt: 'Welcome to another episode of our podcast, where we explore...',
  },
  {
    label: 'Guide a meditation class',
    icon: Flower,
    prompt: 'Take a deep breath in... and slowly breathe out. Feel your body relax...',
  },
]

export const MainPanel = ({ text, setText }: MainPanelProps) => {
  return (
    <div className='h-full grid grid-rows-[auto_1fr_auto] bg-white'>
      {/* ① Header row */}
      <div className='px-6 pt-6 pb-4'>
        <h1 className='text-xl font-semibold text-gray-900'>Text to Speech</h1>
        <p className='text-sm text-gray-500'>
          Start typing here or paste any text you want to turn into lifelike speech...
        </p>
      </div>

      {/* ② Scrollable middle row */}
      <div className='overflow-auto px-6'>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='Start typing here...'
          className='w-full h-full resize-none border-none text-base shadow-none focus-visible:ring-0 focus-visible:ring-offset-0'
        />
      </div>

      {/* ③ Footer row (always at the bottom) */}
      <div className='px-6 py-8 pb-12 bg-white '>
        <p className='text-sm text-gray-500 mb-4'>Get started with</p>
        <div className='flex flex-wrap gap-2'>
          {suggestions.map((item, idx) => (
            <Button key={idx} variant='outline' className='text-sm' onClick={() => setText(item.prompt)}>
              <item.icon className='mr-2 h-4 w-4' />
              {item.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
