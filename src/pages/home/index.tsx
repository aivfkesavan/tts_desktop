import MainPanel from './main-component'
import Nav from './nav'

function Home() {
  return (
    <div className='flex flex-col min-h-screen'>
      <Nav />
      <MainPanel />
    </div>
  )
}

export default Home
