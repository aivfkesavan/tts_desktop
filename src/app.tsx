import { useRoutes } from 'react-router-dom'

import DownloadProgressCard from './components/download-progress-card'
import Protected from './components/protected'

import ForgetPass from './pages/forgot-pass'
import ResetPass from './pages/reset-pass'
import Signup from './pages/signup'
import Login from './pages/login'

import Profile from './pages/profile'
import Home from './pages/home'
import ModelsPage from './pages/models-list'

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
    ],
  },
]

function App() {
  const routeList = useRoutes(routes)

  return (
    <>
      {routeList}
      <DownloadProgressCard />
    </>
  )
}

export default App
