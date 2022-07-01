import PendingCommentsFeed from 'modules/PendingCommentsFeed'
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

  return (
    <Root>
      <PendingReviewsTable />
      <PendingCommentsFeed />
    </Root>
  )
}

export default Home;

const Root = styled.div`
  ${({ theme }) => css`
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 16px;
    
    display: grid;
    grid-template-columns: minmax(300px, 7fr) minmax(250px, 3fr);
    grid-gap: 24px;
  `}
`;
