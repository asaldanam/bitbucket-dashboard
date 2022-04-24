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
      send(``)
    })

    send(`New PR: ${JSON.stringify(newIds)}`, {
      icon: "https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/618b99ff0faed3006bb7c315/55ea3d01-3fdb-4793-b670-c25588c43147/128",
      body: 'Esto es una prueba',
      data: { url: 'https://www.google.com' },
      actions: [{ action: "open_url", title: "Go to bitbucket" }]
    });

  }, [JSON.stringify(ids)])
}