import { useNavigate } from 'react-router-dom'
import { Volume2 } from "lucide-react"

import { Moon, Sun, User, LogOut } from 'lucide-react'

import { useLogoutMutate } from '@/hooks/use-user'
import { useTheme } from '@/components/common/theme-provider'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from "@/components/ui/button"

function Header() {
  const navigate = useNavigate()
  const { mutate } = useLogoutMutate()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="df gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
              <Volume2 className="w-5 h-5 text-black" />
            </div>
            <h1 className="text-2xl font-bold">Chatterbox TTS Server</h1>
          </div>

          <Button
            variant="outline"
            className="ml-auto border-gray-700 hover:bg-yellow-400 hover:text-black transition-colors"
          >
            API Docs
          </Button>

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
  )
}

export default Header
