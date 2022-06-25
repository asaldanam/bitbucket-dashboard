import usePullRequestWithReview from "stores/PullRequestStore/usePullRequestWithReview";
import { createRowsFromPrs } from "./config";

/** Exposes pull requests list with detailed information about reviewing process */
export function usePendingReviewsTableData() {
  const { state: { data, loading } } = usePullRequestWithReview();
  
  return {
    tables: [
      {
        title: 'Needs my review',
        rows: createRowsFromPrs(data.filter(pr => pr.needsMyReview)),
        rowsPerPage: 20,
      },
      {
        title: 'My open pull requests',
        rows: createRowsFromPrs(data.filter(pr => pr.itsMine)),
        rowsPerPage: 5
      },
      {
        title: 'Already reviewed',
        rows: createRowsFromPrs(data.filter(pr => pr.isFromMyTeam && pr.isAlreadyReviewedByMe)),
        rowsPerPage: 5
      },
      {
        title: 'Other pull request',
        rows: createRowsFromPrs(data.filter(pr => !pr.itsMine && !pr.isFromMyTeam)),
        rowsPerPage: 5
      },
    ],
    showSpinner: data.length === 0 && loading
  }
}