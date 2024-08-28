export const dynamic = 'force-dynamic'

export const fetchCache = 'force-no-store'

import { connect, type StreamClient } from 'getstream'
import { NextResponse } from 'next/server'

let client: StreamClient | null = null

if (process.env.STREAM_API_KEY && process.env.STREAM_API_SECRET && !client) {
  client = connect(process.env.STREAM_API_KEY, process.env.STREAM_API_SECRET)
}

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams
  const name = searchParams.get('name')
  if (!name) return new Response(null, { status: 400 })
  if (!client) return new Response(null, { status: 500 })
  const userToken = client.createUserToken(name)
  return NextResponse.json({ userToken })
}
