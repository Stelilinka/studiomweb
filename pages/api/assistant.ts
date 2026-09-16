import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

// Simple assistant endpoint with mock and Google Vertex AI scaffold
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const provider = process.env.AI_PROVIDER || 'mock'
  if (provider === 'mock') {
    // simple mock reply
    return res.status(200).json({ reply: 'This is a mock assistant response. Set AI_PROVIDER=google and add GOOGLE_SERVICE_ACCOUNT_KEY to enable live Vertex AI.' })
  }

  if (provider === 'google') {
    const b64 = process.env.GOOGLE_SERVICE_ACCOUNT_KEY
    if (!b64) return res.status(500).json({ error: 'GOOGLE_SERVICE_ACCOUNT_KEY not set' })

    try {
      // decode and write temporary key file for the Google client library
      const json = Buffer.from(b64, 'base64').toString('utf8')
      const tmpPath = path.join(process.cwd(), 'tmp-google-sa.json')
      fs.writeFileSync(tmpPath, json)
      process.env.GOOGLE_APPLICATION_CREDENTIALS = tmpPath

      // dynamic import to avoid loading heavy libs in mock mode
      const { PredictionServiceClient } = await import('@google-cloud/aiplatform')

      const client = new PredictionServiceClient()
      const project = process.env.GOOGLE_PROJECT_ID
      const location = process.env.GOOGLE_AI_LOCATION || 'us-central1'
      const model = process.env.GOOGLE_AI_MODEL || 'models/chat-bison-001'

      // Build a basic request depending on model type
      // For chat-style models you will need to use the appropriate Vertex API
      const instance = { content: req.body.prompt || 'Hello' }
      const endpoint = `projects/${project}/locations/${location}/publishers/google/models/${model}`

      // NOTE: This is a placeholder. Depending on model and API version, request shape differs.
      const [response] = await client.predict({ endpoint, instances: [instance] })
      // clean tmp file
      try { fs.unlinkSync(tmpPath) } catch (e) {}

      return res.status(200).json({ response })
    } catch (err: any) {
      return res.status(500).json({ error: err.message || String(err) })
    }
  }

  res.status(400).json({ error: 'Unsupported AI_PROVIDER' })
}
