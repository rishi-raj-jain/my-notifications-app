export const dynamic = 'force-dynamic'

export const fetchCache = 'force-no-store'

import { connect } from 'getstream'
import { NextResponse } from 'next/server'

if (!process.env.NEXT_PUBLIC_STREAM_API_KEY) throw new Error(`NEXT_PUBLIC_STREAM_API_KEY environment variable is not defined.`)
if (!process.env.STREAM_API_SECRET) throw new Error(`STREAM_API_SECRET environment variable is not defined.`)

const client = connect(process.env.NEXT_PUBLIC_STREAM_API_KEY, process.env.STREAM_API_SECRET)

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams
  const name = searchParams.get('name')
  if (!name) return new Response(null, { status: 400 })
  const userToken = client.createUserToken(name)
  return NextResponse.json({ userToken })
}
