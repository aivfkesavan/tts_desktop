import { useState } from 'react'
import { ChevronDown, Settings, Save } from "lucide-react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function GenerationParameters() {
  const [showParams, setShowParams] = useState(false)
  const [temperature, setTemperature] = useState([0.8])
  const [exaggeration, setExaggeration] = useState([0.5])
  const [cfgWeight, setCfgWeight] = useState([0.5])
  const [speedFactor, setSpeedFactor] = useState([1])
  const [generationSeed, setGenerationSeed] = useState("101")
  const [language, setLanguage] = useState("English")

  return (
    <Collapsible open={showParams} onOpenChange={setShowParams}>
      <CollapsibleTrigger asChild>
        <Card className="bg-gray-900 border-gray-800 cursor-pointer hover:bg-gray-800 transition-colors">
          <CardHeader className="pb-4">
            <CardTitle className="text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Generation Parameters</span>
              </div>
              <ChevronDown className={`w-5 h-5 transition-transform ${showParams ? 'rotate-180' : ''}`} />
            </CardTitle>
          </CardHeader>
        </Card>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <Card className="bg-gray-900 border-gray-800 mt-2">
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white mb-2 block">Temperature ({temperature[0]})</Label>
                <Slider
                  value={temperature}
                  onValueChange={setTemperature}
                  max={2}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
              </div>
              <div>
                <Label className="text-white mb-2 block">Exaggeration ({exaggeration[0]})</Label>
                <Slider
                  value={exaggeration}
                  onValueChange={setExaggeration}
                  max={1}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white mb-2 block">CFG Weight ({cfgWeight[0]})</Label>
                <Slider
                  value={cfgWeight}
                  onValueChange={setCfgWeight}
                  max={1}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
              </div>
              <div>
                <Label className="text-white mb-2 block">Speed Factor ({speedFactor[0]})</Label>
                <Slider
                  value={speedFactor}
                  onValueChange={setSpeedFactor}
                  max={2}
                  min={0.5}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="generation-seed" className="text-white mb-2 block">Generation Seed</Label>
                <Input
                  id="generation-seed"
                  value={generationSeed}
                  onChange={(e) => setGenerationSeed(e.target.value)}
                  className="bg-black border-gray-700 text-white"
                  placeholder="101"
                />
                <p className="text-gray-400 text-xs mt-1">Integer for reproducible results. Some engines use 0 or -1 for random.</p>
              </div>
              <div>
                <Label className="text-white mb-2 block">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="bg-black border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-gray-700">
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Spanish">Spanish</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                    <SelectItem value="German">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black">
              <Save className="w-4 h-4 mr-2" />
              Save Generation Parameters
            </Button>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  )
}

export default GenerationParameters
