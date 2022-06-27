import DynamicTable from '@atlaskit/dynamic-table';
import styled, { css } from "styled-components";
import { head } from './config';
import { usePendingReviewsTableData } from './hooks';

export interface PendingReviewsTableProps {}

const PendingReviewsTable = ({ }: PendingReviewsTableProps) => {
  const { tables, showSpinner } = usePendingReviewsTableData();

  return (
    <Root>
      {tables.map(table => (
        <div key={table.title}>
          <Title>{table.title}</Title>
          <DynamicTable
              head={head}
              rows={table.rows}
              rowsPerPage={table.rowsPerPage}
              defaultPage={1}
              loadingSpinnerSize="small"
              isLoading={showSpinner}
              emptyView={<div>Nothing to show here</div>}
          />
        </div>
      ))}
    </Root>
  )
};

export default PendingReviewsTable;

/** Styled components */

const Root = styled.div`
  ${({ theme }) => css`
    padding-top: 48px;
  `}
`;

const Title = styled.h4`
  margin-bottom: 0.5rem;
`
