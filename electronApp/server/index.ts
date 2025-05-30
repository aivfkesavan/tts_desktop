import express from 'express'
import cors from 'cors'

import { checkPathsSetup } from './utils/path-helper'

import tts from "./controllers/tts";

checkPathsSetup()

const app = express()

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use('/tts', tts)

app.get('/health', (_, res) => {
  res.json({ status: 'ok' })
})

export default app
