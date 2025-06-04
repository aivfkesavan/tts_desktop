import { useNavigate } from 'react-router-dom'
import { Moon, Sun, Plus, User, LogOut, RefreshCw, Speaker, Volume2 } from 'lucide-react'

import { useLogoutMutate } from '@/hooks/use-user'
import { useTheme } from '@/components/common/theme-provider'

import logo from '@/assets/imgs/icon.png'
import logoV2 from '@/assets/imgs/icon_v2.png'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

function Nav() {
  const navigate = useNavigate()
  const { mutate } = useLogoutMutate()
  const { theme, toggleTheme } = useTheme()

  const handleResetModel = () => {
    localStorage.removeItem('selectedModel')
    window.location.reload()
  }

  return (
    <header className='bg-white dark:bg-background border-b border-border sticky top-0 z-10'>
      <div className='mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 items-center justify-between'>
          {/* Logo */}
          <div className='flex items-center gap-2'>
            {/* <img
              src={theme === 'dark' ? logoV2 : logo}
              alt='NativeNode Logo'
              className='h-8 w-8 object-contain transition-opacity duration-200 rounded-sm'
            /> */}
            <div className='p-1.5 rounded-sm text-muted bg-primary'>
              <Volume2 className='w-5 h-5' />
            </div>
            <span className='text-2xl font-bold text-black dark:text-white'>NativeNode</span>
          </div>

          {/* Right actions */}
          <div className='flex items-center gap-2 sm:gap-4'>
            {/* Reset model test button */}
            <Button
              variant='ghost'
              size='icon'
              onClick={handleResetModel}
              title='Reset model (show onboarding)'
              className='w-8 h-8 rounded-lg text-muted-foreground hover:bg-muted'>
              <RefreshCw className='w-4 h-4' />
            </Button>

            {/* Theme toggle */}
            <Button
              size='icon'
              variant='secondary'
              onClick={toggleTheme}
              className='w-8 h-8 rounded-lg text-muted-foreground hover:bg-muted transition-colors'
              aria-label='Toggle Theme'>
              {theme === 'dark' ? (
                <Sun className='h-5 w-5 text-white-400' />
              ) : (
                <Moon className='h-5 w-5 text-gray-700' />
              )}
            </Button>

            {/* User dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='outline'
                  size='icon'
                  className='w-8 h-8 rounded-lg text-muted-foreground hover:bg-muted transition-colors'>
                  <User className='w-4 h-4' />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align='end' className='bg-popover text-foreground border-border'>
                <DropdownMenuItem onClick={() => navigate('/profile')} className='flex items-center gap-2'>
                  <User className='w-4 h-4 text-muted-foreground' />
                  Profile
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => mutate()} className='flex items-center gap-2'>
                  <LogOut className='w-4 h-4 text-muted-foreground' />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Nav
