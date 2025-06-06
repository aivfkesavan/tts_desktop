import { useRoutes } from 'react-router-dom'

import DownloadProgressCard from './components/download-progress-card'
import Protected from './components/protected'

import ForgetPass from './pages/forgot-pass'
import ResetPass from './pages/reset-pass'
import Signup from './pages/signup'
import Login from './pages/login'

import InitialSetup from './components/models/initial-setup'
import History from './pages/history/history'
import ModelsPage from './pages/models-list'
import useTTSStore from './store/tts'
import Profile from './pages/profile'
import Home from './pages/home'
import useAuthStore from './store/auth'

const routes = [
  {
    path: 'login',
    element: <Login />,
  },
  {
    path: 'signup',
    element: <Signup />,
  },
  {
    path: 'forgot-pass',
    element: <ForgetPass />,
  },
  {
    path: 'reset-pass',
    element: <ResetPass />,
  },
  {
    path: '/',
    element: <Protected />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'models',
        element: <ModelsPage />,
      },
      {
        path: 'history',
        element: <History />,
      },
    ],
  },
]

function App() {
  const routeList = useRoutes(routes)
  const isDownloaded = useTTSStore((s) => s.isDownloaded)
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)

  const shouldRunSetup = isLoggedIn && !isDownloaded

  return (
    <>
      {routeList}
      <DownloadProgressCard />

      {shouldRunSetup && <InitialSetup />}
    </>
  )
}

export default App
