import useNotifications from 'hooks/useNotifications'
import ActivityLog from 'modules/ActivityLog'
import type { NextPage } from 'next'
import { useEffect } from 'react'
import * as bitbucket from 'services/bitbucket/auth'

const Home: NextPage = () => {
  const { send } = useNotifications();

  useEffect(() => {
    bitbucket.auth()
  }, [])

  return (
    <div>
      {/* <button onClick={() => send('asdfasdfasdf', {
        icon: "https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/618b99ff0faed3006bb7c315/55ea3d01-3fdb-4793-b670-c25588c43147/128",
        body: 'Esto es una prueba',
        data: { url: 'https://www.google.com' },
        actions: [{ action: "open_url", title: "Go to bitbucket" }]
      })}>displayNotification</button> */}
      <ActivityLog />
    </div>
  )
}

export default Home
