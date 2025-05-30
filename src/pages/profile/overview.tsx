import { useState } from 'react'
import { AlertCircle, ChevronRight, Mail, ShieldPlus, Trash2, } from 'lucide-react'
import useAuthStore from '@/store/auth'

import UpdatePass from './update-pass'
import Delete from '@/components/models/profile-delete'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

function Overview() {
  const email = useAuthStore((s) => s.email)

  const [showUpdatePass, setShowUpdatePass] = useState(false)

  return (
    <div className='grid gap-6 md:grid-cols-2  mx-auto'>
      {/* Email */}
      <Card className='col-span-full'>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <Mail className='w-5 h-5 text-muted-foreground' />
            <CardTitle>Email Address</CardTitle>
          </div>
          <CardDescription>Used to log in and receive updates.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
            <div className='flex-1 px-4 py-2 rounded-md bg-muted text-sm font-medium'>{email}</div>
          </div>
        </CardContent>
      </Card>

      {/* Password */}
      <Card>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <ShieldPlus className='w-5 h-5 text-muted-foreground' />
            <CardTitle>Password</CardTitle>
          </div>
          <CardDescription>Secure your account by changing your password.</CardDescription>
        </CardHeader>
        <CardContent>
          {!showUpdatePass ? (
            <Button
              onClick={() => setShowUpdatePass(true)}
              className='w-full justify-between bg-muted px-4 py-3 text-sm hover:bg-muted/80'
              variant='ghost'>
              <span className='font-medium'>Change Password</span>
              <ChevronRight className='w-4 h-4 text-muted-foreground' />
            </Button>
          ) : (
            <div className='bg-muted/50 p-4 rounded-lg border border-border'>
              <UpdatePass updateShowPass={() => setShowUpdatePass(false)} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className='col-span-full border border-red-200 dark:border dark:border-white/15 bg-red-50 dark:bg-muted transition-colors'>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <Trash2 className='w-5 h-5 text-red-600 dark:text-foreground' />
            <CardTitle className='text-red-700 dark:text-foreground'>Delete Account</CardTitle>
          </div>
          <CardDescription className='text-red-600 dark:text-muted-foreground text-sm'>
            This action will permanently delete your account and remove all data. It cannot be undone.
          </CardDescription>
        </CardHeader>

        <CardContent className='flex flex-col sm:flex-row items-center justify-between gap-4'>
          <div className='flex items-center gap-2 text-sm text-red-700 dark:text-muted-foreground'>
            <AlertCircle className='w-4 h-4' />
            This action is irreversible
          </div>
          <Delete />
        </CardContent>
      </Card>
    </div>
  )
}

export default Overview
