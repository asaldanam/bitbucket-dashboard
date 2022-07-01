import { USER } from "stores/ConfigStore";
import usePullRequests from "./usePullRequests";

export default function useComments() {
  const { state: { data, ...state }, actions } = usePullRequests();
  const comments = createCommentsList(data);

  return { state: { ...state, comments }, actions }  
}


// ---- Adapters

function createCommentsList(prs) {
  const comments = prs
    .reduce(reducePRsToComments, [])
  
  const commentsWithDerivedInfo = comments
    .map((comment) => mapWithDerivedInfo(comment, comments))
    .sort(sortByCommentUpdateDate)
  
  console.log(commentsWithDerivedInfo.filter(c => c.isForMe))
  
  // console.log(commentsWithDerivedInfo.filter(c => c.isForMe).map(c => c.content.raw))
  
  return commentsWithDerivedInfo
}

function reducePRsToComments(allComments, pr) {
  const newCommentsWithPRDetail = pr.comments?.values?.map(comment => ({ ...comment, pullrequest: pr })) || []
  return [
    ...allComments,
    ...newCommentsWithPRDetail
  ]  
}

function mapWithDerivedInfo(comment, comments) {
  const { pullrequest, user, parent } = comment;
  const children = comments.filter(c => c.parent?.id === comment.id)
  
  const isMyComment = user.nickname.toLowerCase() === USER;  
  const isAReplyToMe = parent?.user.nickname.toLowerCase() === USER;
  const isRepliedByMe = children?.some(c => c.user.nickname.toLowerCase() === USER);

  const isForMe = !isMyComment && (isAReplyToMe || pullrequest.itsMine)
  
  return {
    ...comment,
    children,
    isMyComment,
    isAReplyToMe,
    isForMe,
    isRepliedByMe
  }
}

function sortByCommentUpdateDate(a, b) {
  return (a.updated_on > b.updated_on) ? -1 : 1
}