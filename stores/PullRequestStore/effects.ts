import BitbucketApi from "services/bitbucket/api";

export const PullRequestsEffects = { fetchPullRequests }

/** Fetches Pull Requests list with details */
async function fetchPullRequests(payload: {
  repos: string[];
  sortBy: string;
  state: string;
  pagelen: string;
  fields: string;
}) {
  const { repos, sortBy, ...params } = payload;

  // Queries the OPEN PRs list of provided repositories
  const list = (
    await Promise.all(payload.repos.map(repo => BitbucketApi.get(`/repositories/${repo}/pullrequests`, { params })))
  )
  .reduce((PRs, repo) => ([...PRs, ...repo.values]), []) // Merges all repos PRs

  // Queries all activity logs for listed PRs
  const details = (
    await Promise.all(list.map(pr => fetchPullRequestDetail(pr)))
  )
  .sort((a, b) => (a[sortBy] > b[sortBy]) ? -1 : 1); // Sort by a primary attribute

  return details;
};

/** Fetches Pull Request detail */
async function fetchPullRequestDetail(pr) {
  const path = `/repositories/${pr.source.repository.full_name}/pullrequests/${pr.id}`

  const [detail, comments] = await Promise.all([
    BitbucketApi.get(path),
    fetchPullRequestComments(pr),
  ])

  return {
    ...detail,
    comments
  }
}

async function fetchPullRequestComments(pr) {
  const path = `/repositories/${pr.source.repository.full_name}/pullrequests/${pr.id}/comments`
  const params = {
    fields: '+values.parent.*',
  }

  const comments = await BitbucketApi.get(path, { params });

  return comments;
}