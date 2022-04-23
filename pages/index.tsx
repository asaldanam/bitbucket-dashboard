import type { NextPage } from 'next'
import { useEffect } from 'react'
import useSWR from 'swr'
import useNotifications from '../hooks/useNotifications'
import { query } from '../services/bitbucket/bitbucket.api'
import * as bitbucket from '../services/bitbucket/bitbucket.auth'

const Home: NextPage = () => {
  const { send } = useNotifications();
  const { data: user } = useSWR('/user', query);
  const { data: userPRs } = useSWR(() => [`pullrequests/${user.account_id}`], query);

  const reposEPs = [
    'iahorro/laravel-iahorro-2018',
    'samelan/iahorro-expertfront-ui'
  ]
  .map(repo => `/repositories/${repo}/pullrequests?state=OPEN&pagelen=50`);
  
  const { data: PRs } = useSWR(() => reposEPs, query);

  useEffect(() => {
    bitbucket.auth()
  }, [])

  return (
    <div>
      <button onClick={() => send('asdfasdfasdf')}>displayNotification</button>
      <div>
        <code>{JSON.stringify(userPRs)}</code>
      </div>
    </div>
  )
}

export default Home
