import useTTSStore from '@/store/tts'

import InitialSetup from '@/components/models/initial-setup'
import MainPanel from './main-component'
import Nav from './nav'

function Home() {
  const isDownloaded = useTTSStore(s => s.isDownloaded)

  return (
    <div className='flex flex-col min-h-screen'>
      <Nav />
      <MainPanel />

      {
        !isDownloaded &&
        <InitialSetup />
      }
    </div>
  )
}

export default Home
