export async function mergeWavBlobs(blobs: Blob[]): Promise<Blob> {
  // console.log(`[WAV Merge] Total input blobs: ${blobs.length}`)

  const buffers = await Promise.all(
    blobs.map((blob, i) => {
      // console.log(`[WAV Merge] Blob ${i + 1}: size = ${blob.size} bytes`)
      return blob.arrayBuffer()
    })
  )

  const wavHeadersRemoved = buffers.map((buf, i) => {
    const stripped = new Uint8Array(buf).slice(44)
    // console.log(`[WAV Merge] Chunk ${i + 1}: stripped size = ${stripped.length} bytes`)
    return stripped
  })

  const combinedLength = wavHeadersRemoved.reduce((sum, chunk) => sum + chunk.length, 0)
  const combinedData = new Uint8Array(combinedLength)

  let offset = 0
  for (const chunk of wavHeadersRemoved) {
    combinedData.set(chunk, offset)
    offset += chunk.length
  }

  const headerBuffer = await blobs[0].arrayBuffer()
  const header = new Uint8Array(headerBuffer).slice(0, 44)

  const view = new DataView(header.buffer)
  view.setUint32(4, 36 + combinedData.length, true) // ChunkSize
  view.setUint32(40, combinedData.length, true) // Subchunk2Size

  const finalWav = new Uint8Array(header.length + combinedData.length)
  finalWav.set(header, 0)
  finalWav.set(combinedData, 44)

  const finalBlob = new Blob([finalWav], { type: 'audio/wav' })

  // console.log(`[WAV Merge] Final WAV size: ${finalBlob.size} bytes`)
  // console.log(`[WAV Merge] MIME type: ${finalBlob.type}`)
  // console.log(`[WAV Merge] Blob object:`, finalBlob)

  return finalBlob
}
