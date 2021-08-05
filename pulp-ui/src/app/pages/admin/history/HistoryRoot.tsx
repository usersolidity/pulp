import { Lead } from 'app/components/Lead';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { selectCatalogue, selectIdentity, selectPublication, selectUserFriendlyName, useAppSlice } from 'store/app-state';
import styled from 'styled-components/macro';

export function HistoryRoot() {
  const { t } = useTranslation();
  const { actions } = useAppSlice();
  const identity = useSelector(selectIdentity);
  const me = useSelector(selectUserFriendlyName);
  const catalogue = useSelector(selectCatalogue);
  const publication = useSelector(selectPublication);
  const dispatch = useDispatch();
  const history = useHistory();
  let { url } = useRouteMatch();

  const onSelect = (slug: string) => {
    history.push(`/admin/${slug}/write`);
  };

  return (
    <>
      <Lead className="mt-4 text-center"></Lead>
      <List>
        {Object.entries(publication.entity.articles).map(([s, a], i) => (
          <Feature>
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

const Wrapper = styled.main`
  height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 320px;
`;

const Feature = styled.li`
  display: flex;
  margin: 6.25rem 0 6.25rem 2.25rem;

  .feature-icon {
    width: 6.25rem;
    height: 6.25rem;
    margin-right: 2.25rem;
    flex-shrink: 0;
  }
`;
const Content = styled.div`
  flex: 1;
`;

const List = styled.ul`
  padding: 0;
  margin: 6.25rem 0 0 0;
`;
