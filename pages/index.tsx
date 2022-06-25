import PendingReviewsTable from 'modules/PendingReviewsTable'
import type { NextPage } from 'next'
import { useBitbucketAuth } from 'services/bitbucket/hooks'
import { usePendingReviewNotifications } from 'stores/PullRequestStore/usePendingReviewNotifications'
import { usePullRequestsPolling } from 'stores/PullRequestStore/usePullRequestsPolling'
import styled, { css } from 'styled-components'

const Home: NextPage = () => {
  useBitbucketAuth();
  usePullRequestsPolling();
  usePendingReviewNotifications();

  console.log('RELEASE V2')

  return (
    <Root>
      <PendingReviewsTable />
    </Root>
  )
}

export default Home;

const Root = styled.div`
  ${({ theme }) => css`
    max-width: 960px;
    margin: 0 auto;
    padding: 48px 16px;
  `}
`;
