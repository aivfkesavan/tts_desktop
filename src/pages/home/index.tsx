import { useState } from 'react'
import { Volume2, Settings, ChevronDown, Mic } from 'lucide-react'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

import GenerationParameters from './generation-parameters'
import ServerConfiguration from './server-configuration'
import VoiceControls from './voice-controls'
import Header from './header'

const presets = [
  'Standard Narration',
  'Expressive Monologue',
  'Technical Explanation',
  'Upbeat Advertisement',
  'Thoughtful Reflection (Chunking Test)',
  'Simple Punctuation Test',
  'Long Story Excerpt (Chunking Test)',
]

function Home() {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [splitText, setSplitText] = useState(true)
  const [chunkSize, setChunkSize] = useState([240])
  const [voice, setVoice] = useState('Emily')
  const [text, setText] = useState(
    "To be, or not to be, that is the question: whether 'tis nobler in the mind to suffer the slings and arrows of outrageous fortune, or to take arms against a sea of troubles and by opposing end them. (sighs) To die: to sleep no more and by a sleep to say we end the heart-ache and the thousand natural shocks that flesh is heir to, 'tis a consummation devoutly to be wish'd."
  )

  return (
    <div className='min-h-screen'>
      <Header />

      <div className='max-w-7xl mx-auto px-6 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2 space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center space-x-2 text-primary'>
                  <Mic className='w-5 h-5' />
                  <span>Generate Speech</span>
                </CardTitle>
              </CardHeader>

              <CardContent className='space-y-6'>
                <div>
                  <Label htmlFor='text-input' className='mb-2 block'>
                    Text to synthesize
                  </Label>
                  <p className='text-muted-foreground text-sm mb-3'>
                    Enter the text you want to convert to speech. Standard punctuation will be recognized.
                  </p>
                  <Textarea
                    id='text-input'
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className='min-h-32 resize-none'
                    placeholder='Enter your text here...'
                  />
                  <div className='flex justify-between items-center mt-2 text-sm text-muted-foreground'>
                    {text.length} / 8192
                  </div>
                </div>

                {/* Chunk Config */}
                <div className='flex items-center space-x-4'>
                  <div className='flex items-center space-x-2'>
                    <Switch id='split-text' checked={splitText} onCheckedChange={setSplitText} />
                    <Label htmlFor='split-text'>Split text into chunks</Label>
                  </div>

                  {splitText && (
                    <div className='flex items-center space-x-3'>
                      <Label className='text-muted-foreground'>Chunk Size:</Label>
                      <Slider
                        value={chunkSize}
                        onValueChange={setChunkSize}
                        max={500}
                        min={50}
                        step={10}
                        className='w-24'
                      />
                      <span className='font-mono text-primary'>{chunkSize[0]}</span>
                    </div>
                  )}
                </div>

                {splitText && (
                  <p className='text-muted-foreground text-sm'>
                    Splitting is useful for long texts. Recommended size: 100–300 chars.
                  </p>
                )}

                <Button className='w-full text-lg font-semibold py-6'>
                  <Volume2 className='w-5 h-5 mr-2' />
                  Generate Speech
                </Button>
              </CardContent>
            </Card>

            <VoiceControls voice={voice} setVoice={setVoice} presets={presets} />
          </div>

          <div className='space-y-6'>
            <GenerationParameters />

            <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
              <CollapsibleTrigger asChild>
                <Card className='cursor-pointer'>
                  <CardHeader className='gap-0'>
                    <CardTitle className='flex items-center justify-between'>
                      <div className='flex items-center space-x-2'>
                        <Settings className='w-5 h-5' />
                        <span>Server Configuration</span>
                      </div>
                      <ChevronDown className={`w-5 h-5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                    </CardTitle>
                  </CardHeader>
                </Card>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <ServerConfiguration />
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
