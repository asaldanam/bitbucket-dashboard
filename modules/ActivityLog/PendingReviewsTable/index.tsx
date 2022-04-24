import DynamicTable from '@atlaskit/dynamic-table';
import { usePRsPendingReview, usePRsPendingReviewNotifications } from "hooks/usePRsPendingReview";
import { USER } from 'stores/ConfigStore';
import styled, { css } from "styled-components";
import { createRowsFromPrs, head } from './config';

export interface PendingReviewsTableProps {}

const PendingReviewsTable = ({ }: PendingReviewsTableProps) => {
  const { PRs, loading } = usePRsPendingReview();

  const showSpinner = PRs.length === 0 && loading;
  const emptyView = <div>Nothing to show here</div>
  
  usePRsPendingReviewNotifications();

  return (
    <Root>
      <Title>Needs my review</Title>
      <DynamicTable
          head={head}
          rows={createRowsFromPrs(PRs.filter(pr => pr.needsMyReview))}
          rowsPerPage={20}
          defaultPage={1}
          loadingSpinnerSize="small"
          isLoading={showSpinner}
          emptyView={emptyView}
      />
      <Title>My open pull requests</Title>
      <DynamicTable
          head={head}
          rows={createRowsFromPrs(PRs.filter(pr => pr.author.nickname === USER))}
          rowsPerPage={20}
          defaultPage={1}
          loadingSpinnerSize="small"
          isLoading={showSpinner}
          emptyView={emptyView}
      />
      <Title>Other pull request</Title>
      <DynamicTable
          head={head}
          rows={createRowsFromPrs(PRs.filter(pr => !pr.needsMyReview && pr.author.nickname !== USER))}
          rowsPerPage={20}
          defaultPage={1}
          loadingSpinnerSize="small"
          isLoading={showSpinner}
          emptyView={emptyView}
      />
    </Root>
  )
};

export default PendingReviewsTable;

/** Styled components */

const Root = styled.div`
  ${({ theme }) => css``}
`;

const Title = styled.h4`
  margin-bottom: 0.5rem;
`
