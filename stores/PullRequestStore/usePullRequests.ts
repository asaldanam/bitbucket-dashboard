import { APPROVALS, TEAM, USER } from "stores/ConfigStore";
import { PullRequestStore } from ".";

/** Exposes pull requests list with detailed information about reviewing process */
export default function usePullRequests() {
  const { state, actions } = PullRequestStore.useContext();

  const data = createPRListWithReview(state);

  return { state: { ...state, data }, actions }
}


// ---- Adapters

/** Adapts PR list data adding review calc info */
function createPRListWithReview(state) {
  return state.data
    .map(pr => {
      const isFromMyTeam = TEAM.includes(pr.author.nickname.toLowerCase());

      const approves = pr.participants.filter(participant => participant.approved).length;
      const requestedChanges = pr.participants.filter(participant => participant.state === 'changes_requested').length

      const isApproved = approves >= APPROVALS && requestedChanges === 0;
      
      const itsMine = pr.author.nickname.toLowerCase() === USER
      
      const isAlreadyReviewedByMe = pr.participants
        .find(participant => participant.user.nickname.toLowerCase() === USER)
        ?.approved;

      const needsMyReview = isFromMyTeam
        && !isApproved
        && !isAlreadyReviewedByMe;
      
      return { ...pr, needsMyReview, isFromMyTeam, isApproved, isAlreadyReviewedByMe, itsMine, approves, requestedChanges }
    });
}