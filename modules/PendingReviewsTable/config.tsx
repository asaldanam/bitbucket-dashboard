import { HeadType, RowType } from "@atlaskit/dynamic-table/dist/types/types";
import styled, { css } from "styled-components";
import Avatar from '@atlaskit/avatar';
import AvatarGroup from '@atlaskit/avatar-group';
import Lozenge from '@atlaskit/lozenge';
import ArrowRightIcon from '@atlaskit/icon/glyph/arrow-right'

export const head: HeadType = {
  cells: [
    { key: 'title', content: ''},
    { key: 'reviews', content: ''}
  ]
}

export const createRowsFromPrs = (prs: any[]) => {
  const rows: RowType[] = prs?.map(pr => ({
    key: pr.id.toString(),
    cells: [
      {
        key: 'title',
        content: (
          <Container>
            <Avatar src={pr.author.links.avatar.href} size="medium" />
            <div>
              <Title onClick={() => window.open(pr.links.html.href, '_blank')}><a href={pr.links.html.ref}>#{pr.id}</a> {pr.title}</Title>
              <Branches>
                <SourceBranch>{pr.source.branch.name}</SourceBranch>
                <ArrowRightIcon size="small" label="" />
                <Lozenge>{pr.destination.branch.name}</Lozenge>
              </Branches>
              <small>
                <span>{new Date(pr.updated_on).toLocaleDateString('es-ES', { month: 'long', year: 'numeric', day: 'numeric' })} {new Date(pr.updated_on).toLocaleTimeString()}</span>
                <span> - </span>
                <span>{pr.author.display_name}</span>
              </small>
            </div>
          </Container>
        )
      },
      {
        key: 'reviews',
        // content: pr.participants.filter(participant => participant.approved).length
        content: (
          <AvatarGroup
            maxCount={4}
            data={pr.participants
              .filter(participant => participant.state)
              .map(participant => ({
                src: participant.user.links.avatar.href,
                status: (participant.state === 'changes_requested' && 'declined') || participant.state,
                borderColor: 'red',
                name: participant.user.display_name,

              }))
              .sort((a, b) => (a.status > b.status) ? -1 : 1)
            }
          />
        )
      }
    ]
  }))
  return rows;
}

/** Styled components */

const Container = styled.div`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    padding: 4px 0;
    & > *:not(:last-child) {
      margin-right: 8px;
    }
    & > *:first-of-type {
      margin-top: 2px;
    }
  `}
`;

const Title = styled.div`
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const Branches = styled.div`
  display: flex;
  align-items: center;
  /* margin-bottom: 2px; */
  transform: scale(0.8) translateY(1px);
  transform-origin: center left;
  opacity: 0.8;
  line-height: 1.2;
  position: relative;
  bottom: -1px;
`

const SourceBranch = styled.div`
  position: relative;
  bottom: 1px;
`