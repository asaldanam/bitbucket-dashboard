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
      <button onClick={() => send('asdfasdfasdf')}>displayNotification</button>
      <ActivityLog />
    </div>
  )
}

export default Home
