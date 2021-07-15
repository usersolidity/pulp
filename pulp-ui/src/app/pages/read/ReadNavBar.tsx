import { PageWrapper } from 'app/components/PageWrapper';
import { selectPublication } from 'app/pages/admin/admin-redux';
import * as React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { StyleConstants } from 'styles/StyleConstants';

export function AdminNavBar() {
  const publication = useSelector(selectPublication);

  return (
    <Wrapper>
      <PageWrapper>
        <TitleWrapper>
          <Title href="/">{publication?.entity?.properties?.title}</Title>
        </TitleWrapper>
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
