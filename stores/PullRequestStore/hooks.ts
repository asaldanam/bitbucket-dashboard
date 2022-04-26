import { useEffect } from "react";
import { useInterval } from "shared/hooks/useInterval";
import useNotifications from "shared/hooks/useNotifications";
import { usePrevious } from "shared/hooks/usePrevious";
import { POLLING_INTERVAL_MINS, TEAM, USER } from "stores/ConfigStore";
import { PullRequestStore } from ".";

/** Exposes pull requests list with detailed information about reviewing process */
export function usePullRequestWithReview() {
  const { state, actions } = PullRequestStore.useContext();

  const dataWithReview = state.data
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
  
  const newState = { ...state, data: dataWithReview };
  
  console.log(newState)

  return { state: newState, actions }
}

/** Starts polling of PRs table  */
export function usePullRequestsPolling() {
  const { actions } = PullRequestStore.useContext();
  const minutes = POLLING_INTERVAL_MINS;

  // First load
  useEffect(() => {
    actions.fetch()
  }, []);

  // Polling
  useInterval(() => {
    actions.fetch();
  }, 1000 * 60 * minutes)
}

/** Sends a notification on new opened pull requests  */
export function usePendingReviewNotifications() {
  const { send } = useNotifications()
  const { state: { data: PRs } } = usePullRequestWithReview();
  
  const ids = PRs.filter(pr => pr.needsMyReview).map(pr => pr.id)
  const prevIds = usePrevious(ids);

  async function sendPRNotification(pr) {
    const { msg, ...options } = {
      msg: `${pr.author.display_name} has opened a new PR`,
      icon: pr.author.links.avatar.href,
      body: pr.title,
      data: { url: pr.links.html.href },
      actions: [{ action: "open_url", title: "Go to PR" }]
    }
    send(msg, options);
  }

  useEffect(() => {
    // // Prevents notification on initial load
    // if (!prevIds || prevIds.length === 0) return;
    
    // Detect new IDs from last fetch
    const newIds = ids.filter(id => !prevIds?.includes(id));

    // Prevent send when 
    if (newIds.length === 0) return;

    newIds.forEach((id, index) => {
      // Applies a delay between nots
      setTimeout(() => {
        const pr = PRs.find(pr => pr.id === id);
        sendPRNotification(pr)
      }, 3000 * index)
    })

  }, [JSON.stringify(ids)])
}