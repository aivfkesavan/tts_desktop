import { useState } from 'react'
import { RotateCcw, Save } from "lucide-react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

function ServerConfiguration() {
  const [serverHost, setServerHost] = useState("0.0.0.0")
  const [serverPort, setServerPort] = useState("8004")
  const [ttsDevice, setTtsDevice] = useState("cuda")
  const [defaultVoiceId, setDefaultVoiceId] = useState("Emily.wav")
  const [modelCachePath, setModelCachePath] = useState("model_cache")
  const [predefinedVoicesPath, setPredefinedVoicesPath] = useState("voices")
  const [referenceAudioPath, setReferenceAudioPath] = useState("reference_audio")
  const [outputPath, setOutputPath] = useState("outputs")
  const [audioOutputFormat, setAudioOutputFormat] = useState("wav")
  const [audioSampleRate, setAudioSampleRate] = useState("24000")

  return (
    <Card className="mt-2">
      <CardContent className="py-4 space-y-6">
        <div className="mb-4">
          <Badge variant="outline" className="border-primary text-primary mb-2">
            config.yaml
          </Badge>
          <p className="text-muted-foreground text-sm">
            These settings are loaded from <code className="px-1 rounded">config.yaml</code> via an API call.
            Restart the server to apply changes to Host, Port, Model, or Path settings if modified here or directly in the file.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="server-host" className=" mb-2 block">Server Host</Label>
            <Input
              id="server-host"
              value={serverHost}
              onChange={(e) => setServerHost(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="server-port" className=" mb-2 block">Server Port</Label>
            <Input
              id="server-port"
              value={serverPort}
              onChange={(e) => setServerPort(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="tts-device" className=" mb-2 block">TTS Device</Label>
            <Input
              id="tts-device"
              value={ttsDevice}
              onChange={(e) => setTtsDevice(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="default-voice" className=" mb-2 block">Default Voice ID</Label>
            <Input
              id="default-voice"
              value={defaultVoiceId}
              onChange={(e) => setDefaultVoiceId(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="model-cache" className=" mb-2 block">Model Cache Path</Label>
            <Input
              id="model-cache"
              value={modelCachePath}
              onChange={(e) => setModelCachePath(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="predefined-voices" className=" mb-2 block">Predefined Voices Path</Label>
            <Input
              id="predefined-voices"
              value={predefinedVoicesPath}
              onChange={(e) => setPredefinedVoicesPath(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="reference-audio" className=" mb-2 block">Reference Audio Path</Label>
            <Input
              id="reference-audio"
              value={referenceAudioPath}
              onChange={(e) => setReferenceAudioPath(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="output-path" className=" mb-2 block">Output Path</Label>
            <Input
              id="output-path"
              value={outputPath}
              onChange={(e) => setOutputPath(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className=" mb-2 block">Audio Output Format</Label>
            <Select value={audioOutputFormat} onValueChange={setAudioOutputFormat}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wav">wav</SelectItem>
                <SelectItem value="mp3">mp3</SelectItem>
                <SelectItem value="flac">flac</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="sample-rate" className=" mb-2 block">Audio Sample Rate</Label>
            <Input
              id="sample-rate"
              value={audioSampleRate}
              onChange={(e) => setAudioSampleRate(e.target.value)}
            />
          </div>
        </div>

        <div className="df flex-wrap">
          <Button className="flex-1">
            <Save className="w-4 h-4" />
            Save
          </Button>

          <Button variant="outline" className='flex-1'>
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ServerConfiguration
