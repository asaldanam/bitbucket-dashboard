import useComments from "stores/PullRequestStore/useComments";
import styled, { css } from "styled-components";

import Avatar from '@atlaskit/avatar';

import Comment, {
  CommentAction,
  CommentAuthor,
  CommentTime,
} from '@atlaskit/comment';
import { USER } from "stores/ConfigStore";
import { FC } from "react";

export interface PendingCommentsFeedProps {}

const PendingCommentsFeed = ({ }: PendingCommentsFeedProps) => {
  const { state: { comments } } = useComments();
  
  return (
    <Root>
      <Title>My Comments</Title>
      {comments
        .filter(comment => comment.isForMe && !replyOf(comment))
        .map(comment => (
          <StyledComment key={comment.id} disabled={comment.pullrequest.isApproved}>
            <CommentItem comment={comment}>
              {replyOf(comment) && <CommentItem comment={replyOf(comment)} />}
            </CommentItem>
          </StyledComment>
        ))}
      {comments
        .filter(comment => comment.isForMe && replyOf(comment))
        .map(comment => (
          <StyledComment key={comment.id} disabled>
            <CommentItem comment={comment}>
              {replyOf(comment) && <CommentItem comment={replyOf(comment)} />}
            </CommentItem>
          </StyledComment>
        ))}
    </Root>
  );
};

export default PendingCommentsFeed;

const CommentItem: FC<any> = ({ comment, children }) => {
  if (!comment) return null;
  return (
      <Comment
        key={comment.id}
        avatar={
          <Avatar
            size="small"
            name={comment.user.display_name}
            src={comment.user.links.avatar.href}
        />}
        author={<CommentAuthor>{comment.user.display_name}</CommentAuthor>}
        // time={<CommentTime>Mar 14, 2022</CommentTime>}
        content={<Content>{comment.content.raw}</Content>}
      actions={[
          <CommentAction key="show-more" onClick={() => window.open(comment.links.html.href, '_blank')}>
            Show more
          </CommentAction>,
        ]}
      >
        {children}
      </Comment>
  );
};

const replyOf = (comment) => comment.children.find(c => c.user.nickname.toLowerCase() === USER);

/** Styled components */

const Root = styled.div`
  ${({ theme }) => css`
    background-color: rgb(250, 251, 252);
    padding: 48px 24px;
    height: 100%;
  `}
`;

const Content = styled.div`
  ${({ theme }) => css`
    /* max-height: 100px; */
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  `}
`;

const StyledComment = styled.div<{ disabled?: boolean }>`
  ${({ disabled }) => css`
    background: white;
    border-radius: 4px;
    box-shadow: rgb(9 30 66 / 25%) 0px 1px 1px, rgb(9 30 66 / 31%) 0px 0px 1px;
    margin-bottom: 12px;
    padding: 16px;
    opacity: ${disabled ? '0.5' : '1'};
  `}
`;

const Title = styled.h4`
  margin-bottom: 1rem;
`;