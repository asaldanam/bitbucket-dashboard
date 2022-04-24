import { useEffect } from "react";
import { TEAM, USER } from "stores/ConfigStore";
import { PullRequestStore } from "stores/PullRequestStore";
import useNotifications from "./useNotifications";
import { usePrevious } from "./usePrevious";

export function usePRsPendingReview() {
  const { state, actions } = PullRequestStore.useContext();

  const PRs = state.data
    .map(pr => {
      const isFromMyTeam = TEAM.includes(pr.author.nickname);

      const isNotApprovedYet =
        pr.participants.filter(participant => participant.approved).length < 4 ||
        pr.participants.some(participant => participant.state === 'changes_requested');
      
      const isAlreadyReviewedByMe = pr.participants
        .find(participant => participant.user.nickname === USER)
        ?.approved;

      const needsMyReview = isFromMyTeam
        && isNotApprovedYet
        && !isAlreadyReviewedByMe;
      
      return { ...pr, needsMyReview }
    });

  return { PRs, ...state }
}

export function usePRsPendingReviewNotifications() {
  const { send } = useNotifications()
  const { PRs } = usePRsPendingReview();
  
  const ids = PRs.filter(pr => pr.needsMyReview).map(pr => pr.id)
  const prevIds = usePrevious(ids);

  useEffect(() => {
    // Detect new IDs from last fetch
    const newIds = ids.filter(id => !prevIds?.includes(id));

    // Prevent send when 
    if (newIds.length === 0) return;

    newIds.forEach(id => {
      const pr = PRs.find(pr => pr.id === id);
      send(
        `${pr.author.display_name} has opened a new PR`,
        {
          icon: pr.author.links.avatar.href,
          body: pr.title,
          data: { url: pr.links.html.href },
          actions: [{ action: "open_url", title: "Go to PR" }]
        }
      )
    })

  }, [JSON.stringify(ids)])
}