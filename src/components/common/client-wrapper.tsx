import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { HashRouter } from 'react-router-dom'

import { ThemeProvider } from './theme-provider'
import { Toaster } from "@/components/ui/sonner"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    }
  }
})

function ClientWrapper({ children }: readOnlyChildren) {
  return (
    <HashRouter>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>

        <Toaster />
      </ThemeProvider>
    </HashRouter>
  )
}

export default ClientWrapper
