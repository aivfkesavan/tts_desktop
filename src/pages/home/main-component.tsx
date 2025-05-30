import { useState } from 'react'
import { BookOpenText, Laugh, Mic, Globe, Film, Gamepad2, Podcast, Flower, Loader } from 'lucide-react'
import { toast } from 'sonner'

import { useAgentPlayer } from '@/hooks/use-player'
import useTTSStore from '@/store/tts'
import { root } from '@/services/end-points'

import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

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

function MainPanel() {
  const [status, setStatus] = useState("idle")
  const [text, setText] = useState("")

  const isDownloaded = useTTSStore(s => s.isDownloaded)
  const voice = useTTSStore(s => s.voice)
  const speed = useTTSStore(s => s.speed)

  const { play, stop } = useAgentPlayer()

  async function getTTS(): Promise<void> {
    try {
      // if (!isDownloaded) {
      //   toast("Please download the model first")
      //   return
      // }
      if (text.trim() === "") return;

      setStatus("loading")
      const response = await fetch(`${root.localBackendUrl}/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice: "bf_emma", speed }),
      })

      if (!response.ok) return;

      const data = await response.json()
      setStatus("playing")
      play(`${root.localBackendUrl}/tts/${data?.fileName}`, () => {
        setStatus("idle")
      })

    } catch (err) {
      setStatus("idle")
    }
  }

  function onStop() {
    stop()
    setStatus("idle")
  }

  return (
    <div className='h-full grid grid-rows-[auto_1fr_auto] bg-white'>
      <div className='px-6 pt-6 pb-4'>
        <h1 className='text-xl font-semibold text-gray-900'>Text to Speech</h1>
        <p className='text-sm text-gray-500'>
          Start typing here or paste any text you want to turn into lifelike speech...
        </p>
      </div>

      <div className='overflow-auto px-6'>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='Start typing here...'
          className='w-full h-full resize-none border-none text-base shadow-none focus-visible:ring-0 focus-visible:ring-offset-0'
        />
      </div>

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

      {
        !!text && status !== "playing" &&
        <Button
          onClick={getTTS}
          disabled={status === "loading"}
        >
          {status === "loading" && <Loader className="size-4 animate-spin" />}
          Generate
        </Button>
      }

      {
        status === "playing" &&
        <Button
          onClick={onStop}
        >
          Stop
        </Button>
      }
    </div>
  )
}

export default MainPanel
