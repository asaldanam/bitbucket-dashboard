import { PullRequestStore } from "stores/PullRequestStore";
import styled, { css } from "styled-components";

export interface ActivityLogProps {}

const ActivityLog = ({ }: ActivityLogProps) => {
  const { state, actions } = PullRequestStore.useContext();

  return (
    <Root>
      <div>{JSON.stringify(state)}</div>
      <button onClick={() => actions.fetch()}>Change state</button>
    </Root>
  );
};

export default (props: ActivityLogProps) => (
  <PullRequestStore.Provider>
    <ActivityLog {...props} />
  </PullRequestStore.Provider>
);

/** Styled components */

const Root = styled.div`
  ${({ theme }) => css``}
`;
