'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { connect, DefaultGenerics, StreamClient } from 'getstream'
import { useEffect, useState } from 'react'

interface User {
  name: string
  photo: string
  handle: string
  client?: StreamClient<DefaultGenerics>
}

export default function () {
  const [feedItems, setFeedItems] = useState<any[]>([])
  const [user1, setUser1] = useState<User>({ name: 'Rishi Raj Jain', photo: 'https://github.com/rishi-raj-jain.png', handle: 'rrj' })
  const [user2, setUser2] = useState<User>({ name: 'Stefan', photo: 'https://github.com/DaemonLoki.png', handle: 'stf' })
  const getStreamClient = (userToken: string) => {
    if (process.env.NEXT_PUBLIC_STREAM_API_KEY) {
      return connect(process.env.NEXT_PUBLIC_STREAM_API_KEY, userToken, process.env.NEXT_PUBLIC_STREAM_APP_ID)
    }
  }
  useEffect(() => {
    fetch(`/api/token?name=${user1.handle}`)
      .then((user1Res) => user1Res.json())
      .then((user1Res) => {
        if (user1Res.userToken) {
          const user1Client = getStreamClient(user1Res.userToken)
          if (user1Client) {
            setUser1({ ...user1, client: user1Client })
            user1Client.user(user1.handle).getOrCreate({ name: user1.name, photo: user1.photo })
          }
        }
      })
    fetch(`/api/token?name=${user2.handle}`)
      .then((user2Res) => user2Res.json())
      .then((user2Res) => {
        if (user2Res.userToken) {
          const user2Client = getStreamClient(user2Res.userToken)
          if (user2Client) {
            setUser2({ ...user2, client: user2Client })
            user2Client.user(user2.handle).getOrCreate({ name: user2.name, photo: user2.photo })
          }
        }
      })
  }, [])
  return (
    <div className="flex flex-col gap-y-8 md:flex-row md:gap-x-8 md:gap-y-0">
      <div className="flex min-w-[300px] flex-col">
        <span className="mb-3 font-semibold">Message</span>
        <Input autoComplete="off" id="notification-message" placeholder="Notification Message" />
        <Button
          onClick={() => {
            const message = document.getElementById('notification-message') as HTMLInputElement
            if (user1.client) {
              user1.client
                .feed('user', user1.handle)
                .addActivity({
                  actor: `SU:${user1.handle}`,
                  verb: 'tweet',
                  tweet: message.value,
                  object: 1,
                })
                .then(() => {
                  const user2Client = user2.client?.feed('timeline', user2.handle)
                  if (user2Client) {
                    user2Client.follow('user', user1.handle).then(() => {
                      user2Client.get({ limit: 1 }).then((feedResults) => {
                        setFeedItems((clonedFeedItems: any[]) => [...feedResults.results, ...clonedFeedItems])
                      })
                    })
                  }
                })
            }
          }}
          variant="outline"
          className="mt-3 max-w-max"
        >
          Send &rarr;
        </Button>
      </div>
      <div className="flex min-w-[300px] flex-col">
        <span className="mb-3 font-semibold">Notifications</span>
        {feedItems.map((i, _) => (
          <div key={_} className="flex flex-col border border-l-0 border-r-0 py-3">
            <img className="size-[40px] rounded-full" height="40px" width="40px" loading="lazy" src={i.actor.data.photo} alt={i.actor.data.name} />
            <span className="mt-2">
              <span className="font-semibold">
                {i.actor.data.name}({i.actor.id})
              </span>{' '}
              posted
            </span>
            <span className="mt-2 text-gray-600">{i.tweet}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
