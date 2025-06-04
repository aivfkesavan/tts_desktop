import { Gauge, Waves, Volume2, Sparkles, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import useTTSStore from '@/store/tts'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

function SettingsPanel() {
  const [speakerBoost, setSpeakerBoost] = useState(true)
  const [similarity, setSimilarity] = useState(0.75)
  const [stability, setStability] = useState(0.5)

  const update = useTTSStore((s) => s.update)
  const models = useTTSStore((s) => s.addedModels)
  const voice = useTTSStore((s) => s.voice)
  const speed = useTTSStore((s) => s.speed)

  const navigate = useNavigate()

  const handleAddModel = () => {
    navigate('/models')
  }

  const resetValues = () => {
    setStability(0.5)
    setSimilarity(0.75)
    setSpeakerBoost(true)
    update({ voice: '', speed: 1 })
  }

  return (
    <TooltipProvider>
      <div className='w-80 min-w-[320px] border-l border-border bg-card p-6 flex flex-col justify-between'>
        <div>
          <h2 className='text-lg font-semibold mb-6 text-foreground'>Settings</h2>

          <div className='mb-6'>
            <Label className='text-sm font-medium text-foreground mb-2 flex items-center gap-2'>
              <Sparkles className='w-4 h-4 text-muted-foreground' />
              Model
            </Label>

            <div className='flex gap-2 items-center'>
              <Select value={voice} onValueChange={(value) => update({ voice: value })}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select model' />
                </SelectTrigger>

                <SelectContent>
                  {models.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                  <SelectItem
                    value='add-model'
                    onClick={(e) => {
                      e.preventDefault()
                      handleAddModel()
                    }}>
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
            <Label className='mb-2 text-sm flex items-center gap-2 text-foreground'>
              <Gauge className='w-4 h-4 text-muted-foreground' />
              Speed
            </Label>

            <Slider
              defaultValue={[speed]}
              min={0}
              max={1}
              step={0.1}
              onValueChange={([val]) => update({ speed: val })}
              className='h-2 [&_[data-slot=slider-track]]:bg-muted [&_[data-slot=slider-range]]:bg-primary [&_[data-slot=slider-thumb]]:bg-background [&_[data-slot=slider-thumb]]:border [&_[data-slot=slider-thumb]]:border-primary'
            />

            <div className='flex justify-between text-xs text-muted-foreground mt-1'>
              <span>Slower</span>
              <span>Faster</span>
            </div>
          </div>

          <div className='mb-6'>
            <Label className='mb-2 text-sm flex items-center gap-2 text-foreground'>
              <Waves className='w-4 h-4 text-muted-foreground' />
              Stability
            </Label>
            <Slider
              defaultValue={[stability]}
              min={0}
              max={1}
              step={0.05}
              onValueChange={([val]) => setStability(val)}
              className='h-2 [&_[data-slot=slider-track]]:bg-muted [&_[data-slot=slider-range]]:bg-primary [&_[data-slot=slider-thumb]]:bg-background [&_[data-slot=slider-thumb]]:border [&_[data-slot=slider-thumb]]:border-primary'
            />

            <div className='flex justify-between text-xs text-muted-foreground mt-1'>
              <span>More variable</span>
              <span>More stable</span>
            </div>
          </div>

          <div className='mb-6'>
            <Label className='mb-2 text-sm flex items-center gap-2 text-foreground'>
              <Volume2 className='w-4 h-4 text-muted-foreground' />
              Similarity
            </Label>
            <Slider
              defaultValue={[similarity]}
              min={0}
              max={1}
              step={0.05}
              onValueChange={([val]) => setSimilarity(val)}
              className='h-2 [&_[data-slot=slider-track]]:bg-muted [&_[data-slot=slider-range]]:bg-primary [&_[data-slot=slider-thumb]]:bg-background [&_[data-slot=slider-thumb]]:border [&_[data-slot=slider-thumb]]:border-primary'
            />

            <div className='flex justify-between text-xs text-muted-foreground mt-1'>
              <span>Low</span>
              <span>High</span>
            </div>
          </div>

          <div className='mb-6 flex items-center justify-between'>
            <Label className='text-sm text-foreground'>Speaker boost</Label>
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

export default SettingsPanel
