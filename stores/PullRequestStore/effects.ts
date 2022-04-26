import BitbucketApi from "services/bitbucket/api";

export const PullRequestsEffects = {
  async getPrs(payload: {
    repos: string[];
    sortBy: string;
    state: string;
    pagelen: string;
    fields: string;
  }) {
    const { repos, sortBy, ...params } = payload;

    // Queries the OPEN PRs list of provided repositories
    const list = (
      await Promise.all(
        payload.repos
          .map(repo => BitbucketApi.get(`/repositories/${repo}/pullrequests`, { params }))
      )
    )
    .reduce((PRs, repo) => ([...PRs, ...repo.values]), []) // Merges all repos PRs

    // Queries all activity logs for listed PRs
    const details = (
      await Promise.all(
        list
          .map(pr => BitbucketApi.get(`/repositories/${pr.source.repository.full_name}/pullrequests/${pr.id}`))
      )
    )
    .sort((a, b) => (a[sortBy] > b[sortBy]) ? -1 : 1); // Sort by a primary attribute

    return details;
  }
}