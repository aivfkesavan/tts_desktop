export { }

type vmStartT = {
  diskName: string
  cpuCore: number
  memory: number
  ports: {
    internal: number
    exposed: number
  }[]
}

declare global {
  interface Window {
    ipcRenderer: {
      on: (channel: string, listener: (event: any, ...args: any[]) => void) => () => void
      off: (channel: string, listenerRemover: () => void) => void
      send: (channel: string, ...args: any[]) => void
      invoke: <T>(channel: string, ...args: any[]) => Promise<T>
    }

    electronAPI: {
      vmStart(id: string, input: vmStartT): Promise<number>
      vmInput(id: string, input: string): void
      isVMReady(id: string): Promise<boolean>
      vmKill(id: string): Promise<boolean>
      killAllVms(): Promise<boolean>
      openExternal?: (url: string) => void
      selectFolder: () => Promise<string | null>
      googleAuth: () => Promise<{ token: string }>
    }
  }
}
