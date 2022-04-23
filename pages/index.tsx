import type { NextPage } from 'next'
import { useEffect } from 'react'
import useNotifications from '../hooks/useNotifications'
import * as bitbucket from '../services/bitbucket/bitbucket.auth'
import useBitbucketApi from '../services/bitbucket/useBitbucketApi'

const Home: NextPage = () => {
  const { send } = useNotifications();
  const { data: user } = useBitbucketApi('/user');
  console.log(user)
  const { data: userPRs } = useBitbucketApi(() => [`pullrequests/${user.account_id}`]);

  const reposEPs = [
    'iahorro/laravel-iahorro-2018',
    'samelan/iahorro-expertfront-ui'
  ]
  .map(repo => `/repositories/${repo}/pullrequests?state=OPEN&pagelen=50`);
  
  const { data: PRs } = useBitbucketApi(
    [
    '/repositories/iahorro/laravel-iahorro-2018/pullrequests?state=OPEN&pagelen=50',
    '/repositories/samelan/iahorro-expertfront-ui/pullrequests?state=OPEN&pagelen=50',
    ]
  );

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
