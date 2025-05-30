import { useState } from 'react'
import Nav from './nav'
import { MainPanel } from './main-component'
import { SettingsPanel } from './settings-panel'
import ModelGate from '../onboarding-model/model-gate'

function Home() {
  const [text, setText] = useState('')
  const [speed, setSpeed] = useState(1)
  const [stability, setStability] = useState(0.5)
  const [similarity, setSimilarity] = useState(0.75)
  const [speakerBoost, setSpeakerBoost] = useState(true)
  const [model, setModel] = useState(localStorage.getItem('selectedModel') || 'Nidum Multilingual v2')

  const resetValues = () => {
    setSpeed(1)
    setStability(0.5)
    setSimilarity(0.75)
    setSpeakerBoost(true)
    setModel('Nidum Multilingual v2')
  }

  return (
    <ModelGate>
      <div className='flex flex-col min-h-screen'>
        <Nav />
        <div className='flex flex-1'>
          <div className='flex-1'>
            <MainPanel text={text} setText={setText} />
          </div>
          <SettingsPanel
            model={model}
            setModel={setModel}
            speed={speed}
            setSpeed={setSpeed}
            stability={stability}
            setStability={setStability}
            similarity={similarity}
            setSimilarity={setSimilarity}
            speakerBoost={speakerBoost}
            setSpeakerBoost={setSpeakerBoost}
            resetValues={resetValues}
          />
        </div>
      </div>
    </ModelGate>
  )
}

export default Home
