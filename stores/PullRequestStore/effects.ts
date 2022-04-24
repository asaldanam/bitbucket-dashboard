import BitbucketApi from "services/bitbucket/api";

const USER = '618b99ff0faed3006bb7c315';
const TEAM = ['5cd97b979435c90fd6eff0cf']

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
    // Merges all repos PRs
    .reduce((PRs, repo) => ([...PRs, ...repo.values]), [])


    // Queries all activity logs for listed PRs
    const details = (
      await Promise.all(
        list
          .map(pr => {
            const detailUrl = `/repositories/${pr.source.repository.full_name}/pullrequests/${pr.id}`
            return Promise.all([
              BitbucketApi.get(detailUrl),
              BitbucketApi.get(`${detailUrl}/activity`).then(d => d.values),
            ])
            .then(([detail, activity]) => ({...detail, activity}));
          })
      )
    )
    .sort((a, b) => (a[sortBy] > b[sortBy]) ? -1 : 1);

    // const pendingReviewLogs = PRDetails
    //   .filter(({ activity, author }) => {
    //     const needsReview = activity.filter(log => log.approval).length < 4;
    //     const alreadyReviewed = activity.some(log => log.approval?.user.account_id === USER);
    //     const isFromMyTeam = TEAM.includes(author.account_id)
    //     return needsReview && isFromMyTeam && !alreadyReviewed;
    //   });

    console.log(details)
    return details;
  }
}