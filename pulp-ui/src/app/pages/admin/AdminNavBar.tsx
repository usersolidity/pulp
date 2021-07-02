import { Link } from 'app/components/Link';
import { PageWrapper } from 'app/components/PageWrapper';
import * as React from 'react';
import { useRouteMatch } from "react-router-dom";
import styled from 'styled-components/macro';
import { StyleConstants } from 'styles/StyleConstants';

export function AdminNavBar() {
  let { url } = useRouteMatch();

  return (
    <Wrapper>
      <PageWrapper>
        <TitleWrapper>
          <Title href="/">The New York Rhymes</Title>
        </TitleWrapper>
        <NavWrapper>
          <Item>
            <Link to={`${url}/write`}>
              Write
            </Link>
          </Item>
          <Item>
            <Link to={`${url}/history`}>
              History
            </Link>
          </Item>
          <Item>
            <Link to={`${url}/subscribers`}>
              Subscribers
            </Link>
          </Item>
          <Item>
            <Link to={`${url}/settings`}>
              Settings
            </Link>
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
    background-color: ${p =>
      p.theme.background.replace(
        /rgba?(\(\s*\d+\s*,\s*\d+\s*,\s*\d+)(?:\s*,.+?)?\)/,
        'rgba$1,0.75)',
      )};
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
  font-size: 1.25rem;
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
