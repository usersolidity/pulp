import { selectIdentity } from 'app/pages/admin/admin-redux';
import * as React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { StyleConstants } from 'styles/StyleConstants';
import { AccountDropdown } from '../AccountDropdown';
import { PageWrapper } from '../PageWrapper';
import { Logo } from './Logo';
import { Nav } from './Nav';

export function NavBar() {
  const identity = useSelector(selectIdentity);

  return (
    <Wrapper>
      <PageWrapper>
        <Logo />
        {identity?.state ? <AccountDropdown /> : <Nav />}
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
    background-color: ${p => p?.theme?.background?.replace(/rgba?(\(\s*\d+\s*,\s*\d+\s*,\s*\d+)(?:\s*,.+?)?\)/, 'rgba$1,0.75)') || p.theme.background};
  }

  ${PageWrapper} {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;
