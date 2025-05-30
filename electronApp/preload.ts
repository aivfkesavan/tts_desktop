import { IpcRendererEvent, contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('ipcRenderer', {
  on: (channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void) => {
    ipcRenderer.on(channel, listener)
    return () => ipcRenderer.removeListener(channel, listener)
  },
  off: (channel: string, listenerRemover: () => void) => {
    listenerRemover()
  },
  send: (channel: string, ...args: any[]) => {
    ipcRenderer.send(channel, ...args)
  },
  invoke: <T>(channel: string, ...args: any[]): Promise<T> => {
    return ipcRenderer.invoke(channel, ...args)
  },
})

contextBridge.exposeInMainWorld('electronAPI', {
  openExternal: (url: string) => ipcRenderer.send('open-external', url),
  selectFolder: () => ipcRenderer.invoke('dialog:select-folder'),
})

contextBridge.exposeInMainWorld('nodeRequire', require)
