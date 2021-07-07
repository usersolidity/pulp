import { Link } from 'app/components/Link';
import * as React from 'react';
import styled from 'styled-components/macro';
import { StyleConstants } from 'styles/StyleConstants';
import { PageWrapper } from './PageWrapper';

export function Footer() {
  return (
    <Wrapper>
      <PageWrapper>
        <Link to={{ pathname: 'https://twitter.com/_pulp_network' }} target="_blank">
          Follow Pulp
        </Link>{' '}
        <Link to={{ pathname: 'https://github.com/pulp-network' }} target="_blank">
          Work with Us
        </Link>{' '}
        <Link to={{ pathname: 'https://gitcoin.co/grants/2776/pulp-network-2' }} target="_blank">
          Development Grants
        </Link>{' '}
        <Link to={{ pathname: 'https://gitcoin.co/grants/2776/pulp-network-2' }} target="_blank">
          Subscribe
        </Link>{' '}
      </PageWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.header`
  /* box-shadow: 0 1px 0 0 ${p => p.theme.borderLight}; */
  height: ${StyleConstants.FOOTER_HEIGHT};
  display: flex;
  /* position: fixed; */
  /* top: 0; */
  width: 100%;
  background-color: ${p => p.theme.background};
  /* z-index: 2; */

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
