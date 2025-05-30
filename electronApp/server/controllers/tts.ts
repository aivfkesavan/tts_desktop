import express from 'express'
import path from 'path'
import fs from 'fs'

import { checkIsDirExists, createPath, getRoot } from "../utils/path-helper"

const router = express.Router()

let tts: any

async function loadModel(progress_callback = () => { }) {
  try {
    let { env } = await import('@huggingface/transformers')
    env.cacheDir = getRoot()

    let { KokoroTTS } = await import("kokoro-js")

    tts = await KokoroTTS.from_pretrained("onnx-community/Kokoro-82M-v1.0-ONNX", {
      dtype: "q8",
      device: "cpu",
      progress_callback,
    })
    checkIsDirExists(createPath(["audio"]))

    console.log("✅ Kokoro TTS loaded!")
  } catch (error) {
    console.log(error)
  }
}

router.get('/status', async (req, res) => {
  try {
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    // @ts-ignore
    await loadModel(progress => {
      res.write(`data: ${JSON.stringify(progress)}\n\n`)
    })

    res.end()

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/:filename', async (req, res) => {
  try {
    if (!req.params.filename) {
      res.status(400).send('Filename is required')
      return
    }

    const filePath = createPath(["audio", req.params.filename])
    res.sendFile(filePath, {
      dotfiles: "allow"
    })

  } catch (error) {
    if (error.code === 'ENOENT') {
      res.status(404).send('File not found');
    }

    console.log(error)
    res.status(500).json({ error: error.message })
  }
})

router.post("/", async (req, res) => {
  try {
    const { text, voice, speed } = req.body
    if (!text) {
      res.status(400).send('Text is required')
      return
    }

    if (!tts) {
      await loadModel()
    }

    const audio = await tts.generate(text, { voice, speed })
    const root = createPath(["audio"])
    const fileName = `temp_chunk_${Date.now()}.wav`
    const tempFile = path.join(root, fileName)
    await audio.save(tempFile)
    res.json({ fileName })

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })
  }
})

router.post("/stream", async (req, res) => {
  try {
    const { text } = req.body
    if (!text) {
      res.status(400).send('Text is required')
      return
    }

    if (!tts) {
      await loadModel()
    }

    res.setHeader('Content-Type', 'application/octet-stream')
    res.setHeader('Transfer-Encoding', 'chunked')
    res.setHeader('Connection', 'keep-alive')
    res.setHeader('Cache-Control', 'no-cache')

    let { TextSplitterStream } = await import("kokoro-js")

    const splitter = new TextSplitterStream()
    const stream = tts.stream(splitter)

      (async () => {
        try {
          const root = createPath(["audio"])
          for await (const { audio } of stream) {
            const fileName = `temp_chunk_${Date.now()}.wav`
            const tempFile = path.join(root, fileName)
            await audio.save(tempFile)

            res.write(`data: ${fileName}`)

            if (res.socket && !res.socket.writable) {
              splitter.close()
              break
            }
          }

          res.end()

        } catch (error) {
          console.error("Error processing audio stream:", error)
          if (!res.headersSent) {
            res.status(500).json({ error: error.message })
          } else {
            res.end()
          }
        }
      })()

    const tokens = text.match(/\s*\S+/g) || []

    for (const token of tokens) {
      splitter.push(token)
      await new Promise((resolve) => setTimeout(resolve, 10))
    }

    splitter.close()

  } catch (error) {
    console.log(error)
    if (!res.headersSent) {
      res.status(500).json({ error: error.message })
    } else {
      res.end()
    }
  }
})

router.delete("/", async (req, res) => {
  try {
    const { folderPath } = req.body

    if (!folderPath) {
      res.status(400).send('Folder path is required')
      return
    }

    const path = createPath([folderPath])
    fs.rmdirSync(path, { recursive: true })
    res.json({ message: 'Folder deleted successfully' })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
