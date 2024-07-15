'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { connect } from 'getstream'
import { useEffect } from 'react'

export default function () {
  useEffect(() => {
    fetch('/api/token?name=chris')
      .then((res) => res.json())
      .then((res) => {
        if (res.userToken) {
          if (process.env.NEXT_PUBLIC_STREAM_API_KEY) {
            const client = connect(process.env.NEXT_PUBLIC_STREAM_API_KEY, res.userToken, process.env.NEXT_PUBLIC_STREAM_APP_ID)
            const chris = client.feed('user', 'chris')
            chris
              .addActivity({
                actor: 'chris',
                verb: 'add',
                object: 'picture:10',
                foreign_id: 'picture:10',
                message: 'Beautiful bird!',
              })
              .then(() => {
                fetch('/api/token?name=jack')
                  .then((res_) => res_.json())
                  .then((res_) => {
                    if (process.env.NEXT_PUBLIC_STREAM_API_KEY) {
                      const client_ = connect(process.env.NEXT_PUBLIC_STREAM_API_KEY, res_.userToken, process.env.NEXT_PUBLIC_STREAM_APP_ID)
                      const jack = client_.feed('timeline', 'jack')
                      jack.follow('user', 'chris')
                      jack.get({ limit: 10 })
                    }
                  })
              })
          }
        }
      })
  }, [])
  return (
    <div className="flex flex-col gap-y-8 md:flex-row md:gap-x-8 md:gap-y-0">
      <div className="flex flex-col">
        <span className="font-semibold">Message</span>
        <Input className="mt-3" placeholder="Notification Message" />
        <Button variant="outline" className="mt-3 max-w-max">
          Send &rarr;
        </Button>
      </div>
      <div className="flex flex-col">
        <span className="font-semibold">Notifications</span>
      </div>
    </div>
  )
}
