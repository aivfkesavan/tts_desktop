import SettingsPanel from './settings-panel'
import ModelGate from '../onboarding-model/model-gate'
import MainPanel from './main-component'
import Nav from './nav'

function Home() {
  return (
    <ModelGate>
      <div className='flex flex-col min-h-screen'>
        <Nav />

        <div className='flex flex-1'>
          <div className='flex-1'>
            <MainPanel
            />
          </div>

          <SettingsPanel />
        </div>
      </div>
    </ModelGate>
  )
}

export default Home
