import { FC } from 'react'
import { AudioLines, Sparkles } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { voices } from '@/utils/tts-models'

interface TTSHeaderProps {
  voice: string
  update: (payload: Partial<{ voice: string }>) => void
}

const TTSHeader: FC<TTSHeaderProps> = ({ voice, update }) => {
  return (
    <div className='flex flex-row justify-between px-6 pt-6 pb-4'>
      <div>
        <div className='flex items-center gap-2 mb-2'>
          <div className='p-1.5 rounded-md text-primary'>
            <AudioLines className='w-5 h-5' />
          </div>
          <h1 className='text-xl font-semibold text-foreground'>Text to Speech</h1>
        </div>
        <p className='text-sm text-muted-foreground'>
          Start typing here or paste any text you want to turn into lifelike speech...
        </p>
      </div>

      <div>
        <Label className='text-sm font-medium text-foreground mb-2 flex items-center gap-2'>
          <Sparkles className='w-4 h-4 text-muted-foreground' />
          Voice
        </Label>
        <Select value={voice} onValueChange={(value) => update({ voice: value })}>
          <SelectTrigger className='w-[200px] capitalize'>
            <SelectValue placeholder='Select model' />
          </SelectTrigger>
          <SelectContent className='max-h-80'>
            {voices.map((m) => (
              <SelectItem key={m.name} value={m.name} className='capitalize'>
                {m.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export default TTSHeader
