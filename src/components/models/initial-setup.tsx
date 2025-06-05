import { useState } from 'react'
import { CheckCircle, AlertCircle, Volume2 } from 'lucide-react'

import useDownloadsStore from '@/store/download'
import useTTSStore from '@/store/tts'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

function InitialSetup() {
  const downloadTTSModel = useDownloadsStore((s) => s.downloadTTSModel)
  const downloadProgress = useDownloadsStore((s) => s.downloads.tts?.progress)

  const update = useTTSStore((s) => s.update)

  const [downloadStatus, setDownloadStatus] = useState('idle')

  const handleDownload = () => {
    setDownloadStatus('downloading')

    downloadTTSModel({
      onSuccess: () => {
        setTimeout(() => {
          update({
            isDownloaded: true,
            voice: 'af_heart',
          })
        }, 1000)
        setDownloadStatus('completed')
      },
    })
  }

  return (
    <Dialog open onOpenChange={() => {}}>
      <DialogContent className='sm:max-w-[450px] p-0 overflow-hidden bg-background border-border'>
        <div className='relative'>
          <div className='p-6 bg-muted/60'>
            <DialogHeader>
              <div className='flex items-center gap-3 mb-2'>
                <div className='p-2 bg-primary-foreground/20 rounded-lg'>
                  <Volume2 className='h-6 w-6' />
                </div>
                <div>
                  <DialogTitle className='text-xl font-semibold'>Setup Text-to-Speech</DialogTitle>
                  <DialogDescription className='mt-1'>Download the voice model to continue</DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>

          <div className='p-6 bg-background'>
            {downloadStatus === 'idle' && (
              <div className='space-y-6 my-8'>
                <div className='text-center space-y-4'>
                  <div className='p-4 bg-muted rounded-lg'>
                    <Volume2 className='h-12 w-12 text-muted-foreground mx-auto mb-3' />
                    <h3 className='font-semibold text-foreground mb-2'>Voice Model Required</h3>
                    <p className='text-muted-foreground text-sm'>
                      To use text-to-speech features, you need to download the default voice model first.
                    </p>
                  </div>

                  <div className='text-sm text-muted-foreground'>
                    This is required to proceed and cannot be skipped.
                  </div>
                </div>

                <button
                  onClick={handleDownload}
                  className='w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm'>
                  Download Model
                </button>
              </div>
            )}

            {downloadStatus === 'downloading' && (
              <div className='text-center space-y-6 my-8'>
                <div className='flex items-center justify-center mb-4'>
                  <div className='animate-spin rounded-full h-12 w-12 border-4 border-muted border-t-primary'></div>
                </div>

                <div className='space-y-2'>
                  <h3 className='text-lg font-medium text-foreground'>Downloading Voice Model</h3>
                  <p className='text-muted-foreground text-sm'>Please wait while we download the required files...</p>
                </div>

                <div className='space-y-3'>
                  <div className='w-full bg-secondary rounded-full h-3 overflow-hidden'>
                    <div
                      className='bg-primary h-full rounded-full transition-all duration-300 ease-out'
                      style={{ width: `${downloadProgress}%` }}></div>
                  </div>

                  <div className='flex justify-between text-sm text-muted-foreground'>
                    <span>{Math.round(downloadProgress)}% complete</span>
                  </div>
                </div>

                <div className='bg-muted/50 rounded-lg p-3'>
                  <p className='text-sm text-muted-foreground'>Keep this window open during download</p>
                </div>
              </div>
            )}

            {downloadStatus === 'completed' && (
              <div className='text-center space-y-6 my-8'>
                <div className='flex items-center justify-center mb-4'>
                  <div className='p-3 bg-accent/10 rounded-full'>
                    <CheckCircle className='h-12 w-12 text-accent' />
                  </div>
                </div>

                <div className='space-y-2'>
                  <h3 className='text-lg font-medium text-foreground'>Download Complete!</h3>
                  <p className='text-muted-foreground'>
                    The voice model has been successfully installed. You can now use all text-to-speech features.
                  </p>
                </div>

                <button className='w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm'>
                  Continue to App
                </button>
              </div>
            )}

            {downloadStatus === 'error' && (
              <div className='text-center space-y-6'>
                <div className='flex items-center justify-center mb-4'>
                  <div className='p-3 bg-destructive/10 rounded-full'>
                    <AlertCircle className='h-12 w-12 text-destructive' />
                  </div>
                </div>

                <div className='space-y-2'>
                  <h3 className='text-lg font-medium text-foreground'>Download Failed</h3>
                  <p className='text-muted-foreground'>
                    Unable to download the voice model. Please check your internet connection and try again.
                  </p>
                </div>

                <button
                  onClick={() => setDownloadStatus('idle')}
                  className='w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm'>
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default InitialSetup
