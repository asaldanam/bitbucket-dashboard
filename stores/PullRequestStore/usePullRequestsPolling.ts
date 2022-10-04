import { useEffect } from "react";
import { useInterval } from "shared/hooks/useInterval";
import { POLLING_INTERVAL_MINS } from "stores/ConfigStore";
import { PullRequestStore } from ".";

/** Starts polling of PRs table  */
export function usePullRequestsPolling() {
  const { actions } = PullRequestStore.useContext();
  const minutes = POLLING_INTERVAL_MINS;

  // First load
  useEffect(() => {
    setTimeout(() => {
      actions.fetch()
    }, 1000);
  }, []);

  // Polling
  useInterval(() => {
    actions.fetch();
  }, 1000 * 60 * minutes)
}