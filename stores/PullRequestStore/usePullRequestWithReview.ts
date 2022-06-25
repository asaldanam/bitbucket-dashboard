import { TEAM, USER } from "stores/ConfigStore";
import { PullRequestStore } from ".";

/** Exposes pull requests list with detailed information about reviewing process */
export default function usePullRequestWithReview() {
  const { state, actions } = PullRequestStore.useContext();

  const data = createPRListWithReview(state);

  console.log(data)

  return { state: { ...state, data }, actions }
}


// ---- Adapters


/** Adapts PR list data adding review calc info */
function createPRListWithReview(state) {
  return state.data
    .map(pr => {
      const isFromMyTeam = TEAM.includes(pr.author.nickname.toLowerCase());

      const isNotApprovedYet =
        pr.participants.filter(participant => participant.approved).length < 4 ||
        pr.participants.some(participant => participant.state === 'changes_requested');
      
      const itsMine = pr.author.nickname.toLowerCase() === USER
      
      const isAlreadyReviewedByMe = pr.participants
        .find(participant => participant.user.nickname.toLowerCase() === USER)
        ?.approved;

      const needsMyReview = isFromMyTeam
        && isNotApprovedYet
        && !isAlreadyReviewedByMe;
      
      return { ...pr, needsMyReview, isFromMyTeam, isNotApprovedYet, isAlreadyReviewedByMe, itsMine }
    });
}