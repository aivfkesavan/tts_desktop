import { useState } from 'react'
import { Upload, User, Copy, AudioLines } from 'lucide-react'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface props {
  voice: string
  setVoice: (voice: string) => void
  presets: string[]
}

function VoiceControls({ voice, setVoice, presets }: props) {
  const [activeTab, setActiveTab] = useState('predefined')

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center space-x-2 text-primary'>
          <AudioLines className='w-5 h-5 text-primary' />
          <span>Voice Mode</span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger
              value='predefined'
              className='data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'>
              Predefined Voices
            </TabsTrigger>
            <TabsTrigger
              value='cloning'
              className='data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'>
              Voice Cloning (Reference)
            </TabsTrigger>
          </TabsList>

          <TabsContent value='predefined' className='space-y-4 mt-6'>
            <div>
              <label className='block mb-2 text-sm font-medium text-foreground'>Select Predefined Voice:</label>
              <Select value={voice} onValueChange={setVoice}>
                <SelectTrigger>
                  <SelectValue placeholder='Choose a voice' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='Emily'>Emily</SelectItem>
                  <SelectItem value='David'>David</SelectItem>
                  <SelectItem value='Sarah'>Sarah</SelectItem>
                  <SelectItem value='Michael'>Michael</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='flex items-center space-x-2'>
              <Button variant='outline' size='sm'>
                <Upload className='w-4 h-4 mr-1' />
                Import
              </Button>
              <Button variant='outline' size='sm'>
                <Copy className='w-4 h-4' />
              </Button>
            </div>

            <div>
              <label className='block mb-2 text-sm font-medium text-foreground'>Load Example Preset:</label>
              <div className='flex flex-wrap gap-2'>
                {presets.map((preset) => (
                  <Badge
                    key={preset}
                    variant='outline'
                    className='cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground hover:border-primary'>
                    {preset}
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value='cloning' className='space-y-4 mt-6'>
            <div className='text-center py-8 border-2 border-dashed rounded-lg border-border'>
              <User className='w-12 h-12 mx-auto text-muted-foreground mb-4' />
              <p className='text-muted-foreground'>Voice cloning feature</p>
              <p className='text-sm text-muted-foreground'>Upload reference audio for voice cloning</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default VoiceControls
