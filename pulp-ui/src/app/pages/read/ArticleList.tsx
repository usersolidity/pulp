import * as React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { selectFounderFriendlyName, selectPublication } from 'store/app-state';
import styled from 'styled-components/macro';

export function ArticleList() {
  const publication = useSelector(selectPublication);
  const history = useHistory();
  const founder_friendly_name = useSelector(selectFounderFriendlyName);

  const onSelect = (publication_slug: string, article_slug: string) => {
    history.push(`/read/${publication_slug}/on/${article_slug}`);
  };

  return (
    <>
      <div className="small text-muted mt-3">/pnlp/read/{publication.entity.slug}</div>
      <div className="text-muted mt-1">{publication.entity.properties.tagline}</div>
      <div className="lead mt-1">By: {founder_friendly_name}</div>
      <List>
        {Object.entries(publication.entity.articles).map(([s, a], i) => (
          <Feature onClick={() => onSelect(publication.entity.slug, s)} key={i}>
            {/* <CSSIcon className="feature-icon" /> */}
            <Content>
              <div className="lead">{a.title}</div>
              <div className="lead text-muted">{a.subtitle}</div>
              <div className="text-muted small">By: {a.author}</div>
            </Content>
          </Feature>
        ))}
      </List>
    </>
  );
}

const Feature = styled.li`
  display: flex;
  margin: 6.25rem 0 6.25rem 2.25rem;

  .feature-icon {
    width: 6.25rem;
    height: 6.25rem;
    margin-right: 2.25rem;
    flex-shrink: 0;
  }

  &:hover {
    text-decoration: none;
    color: ${p => p.theme.primary};
    opacity: 0.8;
    cursor: pointer;
  }

  &:active {
    opacity: 0.4;
  }
`;
const Content = styled.div`
  flex: 1;
`;

const List = styled.ul`
  padding: 0;
  margin: 6.25rem 0 0 0;
`;
