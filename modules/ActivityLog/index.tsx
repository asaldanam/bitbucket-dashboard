import styled, { css } from "styled-components";
import PendingReviewsTable from "./PendingReviewsTable";

export interface ActivityLogProps {}

const ActivityLog = ({ }: ActivityLogProps) => {

  return (
    <Root>
      <PendingReviewsTable />
    </Root>
  );
};

export default ActivityLog;

/** Styled components */

const Root = styled.div`
  ${({ theme }) => css`
    max-width: 960px;
    margin: 0 auto;
    padding: 48px 16px;
  `}
`;
