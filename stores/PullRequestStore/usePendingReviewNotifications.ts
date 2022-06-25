import { useEffect } from "react";
import useNotifications from "shared/hooks/useNotifications";
import { usePrevious } from "shared/hooks/usePrevious";
import usePullRequestWithReview from "./usePullRequestWithReview";

/** Sends a notification on new opened pull requests  */
export function usePendingReviewNotifications() {
  const { send } = useNotifications()
  const { state: { data: PRs } } = usePullRequestWithReview();
  
  const ids = PRs.filter(pr => pr.needsMyReview).map(pr => pr.id)
  const prevIds = usePrevious(ids);

  async function sendPRNotification(pr) {
    const { msg, ...options } = createPRNotification(pr);
    send(msg, options);
  }

  useEffect(() => {
    // Prevents notification on initial load
    if (!prevIds || prevIds.length === 0) return;
    
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


// ---- Adapters

function createPRNotification(pr) {
  return {
      msg: `${pr.author.display_name} has opened a new PR`,
      icon: pr.author.links.avatar.href,
      body: pr.title,
      data: { url: pr.links.html.href },
      actions: [{ action: "open_url", title: "Go to PR" }]
    }
}