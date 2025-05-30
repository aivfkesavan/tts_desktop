'use client'

import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import { Gauge, Waves, Volume2, Sparkles, ChevronDown, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface SettingsPanelProps {
  model: string
  setModel: (val: string) => void
  speed: number
  setSpeed: (v: number) => void
  stability: number
  setStability: (v: number) => void
  similarity: number
  setSimilarity: (v: number) => void
  speakerBoost: boolean
  setSpeakerBoost: (v: boolean) => void
  resetValues: () => void
}

const models = ['Eleven Multilingual v2', 'Eleven English v1', 'Legacy v1']

export const SettingsPanel = ({
  model,
  setModel,
  speed,
  setSpeed,
  stability,
  setStability,
  similarity,
  setSimilarity,
  speakerBoost,
  setSpeakerBoost,
  resetValues,
}: SettingsPanelProps) => {
  const navigate = useNavigate()

  const handleAddModel = () => {
    navigate('/models')
  }

  return (
    <TooltipProvider>
      <div className='w-80 min-w-[320px] border-l border-gray-200 bg-white p-6 flex flex-col justify-between'>
        <div>
          <h2 className='text-lg font-semibold mb-6'>Settings</h2>

          <div className='mb-6'>
            <Label className='block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2'>
              <Sparkles className='w-4 h-4 text-gray-500' />
              Model
            </Label>
            <div className='flex gap-2 items-center'>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select model' />
                </SelectTrigger>
                <SelectContent>
                  {models.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                  <SelectItem value='add-model' onClick={handleAddModel}>
                    + Add more models
                  </SelectItem>
                </SelectContent>
              </Select>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant='default' size='icon' onClick={handleAddModel}>
                    <Plus className='w-4 h-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side='top'>Add more models</TooltipContent>
              </Tooltip>
            </div>
          </div>

          <div className='mb-6'>
            <Label className='mb-2 block text-sm flex items-center gap-2'>
              <Gauge className='w-4 h-4 text-gray-500' />
              Speed
            </Label>
            <Slider defaultValue={[speed]} min={0.25} max={4} step={0.25} onValueChange={([val]) => setSpeed(val)} />
            <div className='flex justify-between text-xs text-muted-foreground mt-1'>
              <span>Slower</span>
              <span>Faster</span>
            </div>
          </div>

          <div className='mb-6'>
            <Label className='mb-2 block text-sm flex items-center gap-2'>
              <Waves className='w-4 h-4 text-gray-500' />
              Stability
            </Label>
            <Slider
              defaultValue={[stability]}
              min={0}
              max={1}
              step={0.05}
              onValueChange={([val]) => setStability(val)}
            />
            <div className='flex justify-between text-xs text-muted-foreground mt-1'>
              <span>More variable</span>
              <span>More stable</span>
            </div>
          </div>

          <div className='mb-6'>
            <Label className='mb-2 block text-sm flex items-center gap-2'>
              <Volume2 className='w-4 h-4 text-gray-500' />
              Similarity
            </Label>
            <Slider
              defaultValue={[similarity]}
              min={0}
              max={1}
              step={0.05}
              onValueChange={([val]) => setSimilarity(val)}
            />
            <div className='flex justify-between text-xs text-muted-foreground mt-1'>
              <span>Low</span>
              <span>High</span>
            </div>
          </div>

          <div className='mb-6 flex items-center justify-between'>
            <Label className='text-sm'>Speaker boost</Label>
            <Switch checked={speakerBoost} onCheckedChange={setSpeakerBoost} />
          </div>
        </div>

        <Button variant='outline' onClick={resetValues}>
          Reset values
        </Button>
      </div>
    </TooltipProvider>
  )
}
