import { useState } from 'react'
import { Upload, User, Copy } from "lucide-react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface props {
  voice: string
  setVoice: (voice: string) => void
  presets: string[]
}

function VoiceControls({ voice, setVoice, presets }: props) {
  const [activeTab, setActiveTab] = useState("predefined")

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Voice Mode</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-black border border-gray-700">
            <TabsTrigger
              value="predefined"
              className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black"
            >
              Predefined Voices
            </TabsTrigger>
            <TabsTrigger
              value="cloning"
              className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black"
            >
              Voice Cloning (Reference)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="predefined" className="space-y-4 mt-6">
            <div>
              <label className="text-white mb-2 block">Select Predefined Voice:</label>
              <Select value={voice} onValueChange={setVoice}>
                <SelectTrigger className="bg-black border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black border-gray-700">
                  <SelectItem value="Emily">Emily</SelectItem>
                  <SelectItem value="David">David</SelectItem>
                  <SelectItem value="Sarah">Sarah</SelectItem>
                  <SelectItem value="Michael">Michael</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="border-gray-700 hover:bg-yellow-400 hover:text-black">
                <Upload className="w-4 h-4 mr-1" />
                Import
              </Button>
              <Button variant="outline" size="sm" className="border-gray-700 hover:bg-yellow-400 hover:text-black">
                <Copy className="w-4 h-4" />
              </Button>
            </div>

            <div>
              <label className="text-white mb-3 block">Load Example Preset:</label>
              <div className="flex flex-wrap gap-2">
                {presets.map((preset) => (
                  <Badge
                    key={preset}
                    variant="outline"
                    className="cursor-pointer border-gray-600 text-gray-300 hover:bg-yellow-400 hover:text-black hover:border-yellow-400 transition-colors"
                  >
                    {preset}
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="cloning" className="space-y-4 mt-6">
            <div className="text-center py-8 border-2 border-dashed border-gray-700 rounded-lg">
              <User className="w-12 h-12 mx-auto text-gray-500 mb-4" />
              <p className="text-gray-400">Voice cloning feature</p>
              <p className="text-gray-500 text-sm">Upload reference audio for voice cloning</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default VoiceControls
