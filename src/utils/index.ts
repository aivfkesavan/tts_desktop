import { customAlphabet } from 'nanoid'
import { voices } from './tts-models'

export const delay = (ms: number = 1000) => new Promise((res) => setTimeout(res, ms))

export function generateNumberArray(n: number): number[] {
  if (n <= 0) throw new Error('Input must be a positive integer.')
  return Array.from({ length: n }, (_, i) => i + 1)
}

export function getRandNumber(min: number = 20, max: number = 70): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export type RetryOptions = {
  retriesLeft?: number
  interval?: number
  factor?: number
  signal?: AbortSignal
}

export const retry = <T>(
  fn: () => Promise<T>,
  { retriesLeft = 5, interval = 1000, factor = 1, signal }: RetryOptions = {}
): Promise<T> => {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      return reject(new DOMException('Aborted', 'AbortError'))
    }

    fn()
      .then(resolve)
      .catch((error) => {
        if (retriesLeft <= 1 || signal?.aborted) {
          return reject(error)
        }

        const timeout = setTimeout(() => {
          retry(fn, {
            retriesLeft: retriesLeft - 1,
            interval: interval * factor,
            factor,
            signal,
          })
            .then(resolve)
            .catch(reject)
        }, interval)

        signal?.addEventListener(
          'abort',
          () => {
            clearTimeout(timeout)
            reject(new DOMException('Aborted', 'AbortError'))
          },
          { once: true }
        )
      })
  })
}

export function generateURLSafeId(num = 20) {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const nanoid = customAlphabet(alphabet, num)
  return nanoid()
}

export function formatDate(timestamp?: number): string {
  if (!timestamp) return '--'

  const date = new Date(timestamp * 1000)
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatName(name: string): string {
  return name
    .replace(/_/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function capitalizeFirstSentence(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function getVoiceDetails(name: string) {
  const voice = voices.find((v) => v.name.toLowerCase().includes(name.toLowerCase()))
  return voice
    ? {
        formattedName: formatName(voice.name),
        enhancedDescription: capitalizeFirstSentence(voice.description),
        isPremium: voice.quality === 'A',
      }
    : {
        formattedName: name,
        enhancedDescription: '',
        isPremium: false,
      }
}
