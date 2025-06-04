import ModelGate from '../onboarding-model/model-gate'
import MainPanel from './main-component'
import Nav from './nav'

function Home() {
  return (
    <ModelGate>
      <div className='flex flex-col min-h-screen'>
        <Nav />

        <MainPanel />
      </div>
    </ModelGate>
  )
}

export default Home
