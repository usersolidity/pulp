import { PageWrapper } from 'app/components/PageWrapper';
import * as React from 'react';
import Button from 'react-bootstrap/Button';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { useParams, useRouteMatch } from 'react-router-dom';
import { selectIdentity, selectPublication, useAppSlice } from 'store/app-state';
import styled from 'styled-components/macro';
import { StyleConstants } from 'styles/StyleConstants';

export function ReadNavBar() {
  let { url } = useRouteMatch();
  let { publication_slug } = useParams<{ publication_slug?: string }>();
  const { actions } = useAppSlice();
  const publication = useSelector(selectPublication);
  const identity = useSelector(selectIdentity);
  const dispatch = useDispatch();

  return (
    <Wrapper>
      <PageWrapper>
        <TitleWrapper>
          <Title href="/">{publication?.entity?.properties?.title}</Title>
        </TitleWrapper>
        <NavWrapper>
          <Item>
            <LinkContainer to={`/read/${publication?.entity?.slug}/subscribe`}>
              <Button size="sm" variant="primary">
                Subscribe
              </Button>
            </LinkContainer>{' '}
          </Item>
        </NavWrapper>
      </PageWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.header`
  box-shadow: 0 1px 0 0 ${p => p.theme.borderLight};
  height: ${StyleConstants.NAV_BAR_HEIGHT};
  display: flex;
  position: fixed;
  top: 0;
  width: 100%;
  background-color: ${p => p.theme.background};
  z-index: 2;

  @supports (backdrop-filter: blur(10px)) {
    backdrop-filter: blur(10px);
    background-color: ${p => p.theme.background.replace(/rgba?(\(\s*\d+\s*,\s*\d+\s*,\s*\d+)(?:\s*,.+?)?\)/, 'rgba$1,0.75)')};
  }

  ${PageWrapper} {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Title = styled.a`
  font-size: 1.3rem;
  color: ${p => p.theme.primary};
  font-weight: bold;
  margin-right: 1rem;
  cursor: pointer;

  &:hover {
    text-decoration: none;
    color: ${p => p.theme.primary};
    opacity: 0.8;
  }

  &:active {
    opacity: 0.4;
  }
`;

const NavWrapper = styled.nav`
  display: flex;
  margin-right: -1rem;
`;

const Item = styled.div`
  color: ${p => p.theme.primary};
  cursor: pointer;
  margin: 0px;
  text-decoration: none;
  display: flex;
  margin: 0.25rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  align-items: center;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    opacity: 0.4;
  }

  .icon {
    margin-right: 0.25rem;
  }
`;
