import { ArrowLeft } from "lucide-react"
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'

import Overview from './overview'

function Profile() {
  const navigate = useNavigate()

  return (
    <div className="p-8">
      <Button
        size='sm'
        variant='ghost'
        onClick={() => navigate('/')}
        className='mb-4 hover:bg-white'
      >
        <ArrowLeft /> Back to dashboard
      </Button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">User Profile</h1>
          <p className="text-muted-foreground">Manage your account and check resource usage</p>
        </div>
      </div>

      <Overview />
    </div>
  )
}

export default Profile
