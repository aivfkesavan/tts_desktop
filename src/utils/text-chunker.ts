export function chunkText(text: string, maxChunkSize = 250): string[] {
  const sentences = text.match(/[^.!?]+[.!?]*\s*/g) || [text]
  const chunks: string[] = []
  let current = ''

  for (const sentence of sentences) {
    if ((current + sentence).length <= maxChunkSize) {
      current += sentence
    } else {
      if (current) chunks.push(current.trim())
      current = sentence
    }
  }

  if (current) chunks.push(current.trim())

  return chunks
}
