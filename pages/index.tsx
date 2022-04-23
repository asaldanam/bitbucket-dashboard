import type { NextPage } from 'next'
import { useEffect } from 'react'
import useNotifications from '../hooks/useNotifications'
import * as bitbucket from '../services/bitbucket/bitbucketAuth'
import useBitbucketApi from '../services/bitbucket/useBitbucketApi'

const Home: NextPage = () => {
  const { send } = useNotifications();
  const { data } = useBitbucketApi({
    ep: '/repositories/iahorro/laravel-iahorro-2018/pullrequests',
    params: { state: 'OPEN', pagelen: '50' }
  });

  useEffect(() => {
    bitbucket.auth()
  }, [])

  return (
    <div>
      <button onClick={() => send('asdfasdfasdf')}>displayNotification</button>
      <div>
        <code>{JSON.stringify(data)}</code>
      </div>
    </div>
  )
}

export default Home
