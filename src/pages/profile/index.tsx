import { ChevronLeft, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'

import Overview from './overview'

function Profile() {
  const navigate = useNavigate()

  return (
    <div className='p-8'>
      <div className='flex flex-col gap-2 mb-8'>
        <div className='flex items-center gap-2'>
          <Button
            variant='ghost'
            onClick={() => navigate('/')}
            className='p-0 hover:bg-transparent text-muted-foreground'>
            <ChevronLeft className='w-28 h-28' />
          </Button>
          <h1 className='text-2xl font-bold text-foreground flex items-center gap-2'>
            <UserRound className='w-6 h-6 text-muted-foreground' />
            User Profile
          </h1>
        </div>

        <p className='text-muted-foreground text-sm ml-4'>Manage your account and check resource usage</p>
      </div>

      <Overview />
    </div>
  )
}

export default Profile
