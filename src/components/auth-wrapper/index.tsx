import { Moon, Sun, Volume2 } from 'lucide-react'

import { useTheme } from '@/components/common/theme-provider'

type props = {
  children: React.ReactNode
  title: string
  description: string
}

function AuthWrapper({ children, title, description }: props) {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className='relative min-h-screen flex items-center  justify-center bg-background text-foreground p-4 transition-colors duration-300'>
      <button
        onClick={toggleTheme}
        aria-label='Toggle theme'
        className='absolute top-4 right-4 p-2 rounded-full bg-muted text-foreground hover:bg-muted/80 transition'>
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <div className='w-full max-w-md space-y-6'>
        <div className='bg-card border border-border rounded-3xl p-10 shadow-md'>
          <div className='space-y-1.5'>
            <div className='w-fit mx-auto p-2 rounded-sm text-muted bg-primary'>
              <Volume2 className='w-9 h-9' />
            </div>

            <div>
              <h2 className='text-xl font-bold text-center mb-1'>{title}</h2>
              <p className='text-center text-sm text-muted-foreground mb-6'>{description}</p>
            </div>

            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthWrapper
