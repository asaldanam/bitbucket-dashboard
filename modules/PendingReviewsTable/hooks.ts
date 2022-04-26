import { usePullRequestWithReview } from "stores/PullRequestStore/hooks";
import { createRowsFromPrs } from "./config";

/** Exposes pull requests list with detailed information about reviewing process */
export function usePendingReviewsTableData() {
  const { state: { data, loading } } = usePullRequestWithReview();
  
  return {
    tables: [
      {
        title: 'Needs my review',
        rows: createRowsFromPrs(data.filter(pr => pr.needsMyReview))
      },
      {
        title: 'My open pull requests',
        rows: createRowsFromPrs(data.filter(pr => pr.itsMine))
      },
      {
        title: 'Already reviewed',
        rows: createRowsFromPrs(data.filter(pr => pr.isFromMyTeam && pr.isAlreadyReviewedByMe ))
      },
      {
        title: 'Other pull request',
        rows: createRowsFromPrs(data.filter(pr => !pr.itsMine && !pr.isFromMyTeam ))
      },
    ],
    showSpinner: data.length === 0 && loading
  }
}